import { pipe } from 'effect/Function';
import * as Effect from 'effect/Effect';
import * as Data from 'effect/Data';
import internal, { Writable } from 'node:stream';
import { Buffer } from "node:buffer"

export type ItemToArchive = {
  type: "file",
  name: string,
  content: string | Buffer | internal.Readable
} | {
  type: "dir",
  path: string,
  destination: string
};

export class NodeZipError
  extends Data.TaggedError("NodeZipError")<{
    cause: import("archiver").ArchiverError
  }> { }

export class NodeZipService
  extends Effect.Service<NodeZipService>()("NodeZipService", {
    effect:
      Effect.gen(function* () {

        const archiver = 
          yield* Effect.tryPromise(() => import("archiver"))

        yield* Effect.logDebug("NodeZipService is ready")

        const createZipArchive =
          (items: ItemToArchive[]) => {

            const archive =
              archiver.create('zip', {
                zlib: { level: 9 }, // Compression level
              });

            const zipEffect =
              Effect.async<Buffer, NodeZipError>(resume => {

                const chunks = [] as Uint8Array[];

                const converter =
                  new Writable({
                    write(chunk, encoding, callback) {
                      chunks.push(new Uint8Array(chunk as Buffer));
                      process.nextTick(callback);
                    },
                  });

                converter.on('finish', () => {
                  resume(Effect.succeed(Buffer.concat(chunks)));
                });

                archive.on('error', error => {
                  resume(Effect.fail(new NodeZipError({ cause: error })));
                });

                archive.pipe(converter);

                items.forEach(item => {
                  if (item.type == "dir") {
                    archive.directory(item.path, item.destination);
                  } else {
                    archive.append(item.content, { name: item.name });
                  }
                });

                archive.finalize()

              });

            return pipe(
              zipEffect,
              Effect.tapBoth({
                onSuccess: () =>
                  Effect.logDebug("Zip archive has been created"),
                onFailure: error =>
                  Effect.logError("Cannot create zip archive", error),
              })
            )

          }

        return {
          createZipArchive
        } as const;

      })
  }) {}