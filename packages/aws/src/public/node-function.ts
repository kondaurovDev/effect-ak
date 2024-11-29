import * as Effect from "effect/Effect";
import * as S from "effect/Schema";
import { LambdaFunction } from "../module/lambda/index.js";

import { LambdaFunctionManageService } from "../module/lambda/function/service/manage.js";
import { Lambda, Iam } from "../module/index.js";
import { NodeCodeBundlerService } from "packages/misc/dist/node/index.js";

const deployFunction =
  (input: {
    fn: LambdaFunction,
    role: Iam.IamRoleArn
  }) =>
    Effect.gen(function* () {

      const validate = S.validateEither(LambdaFunction)(input.fn);

      if (validate._tag == "Left") {
        yield* Effect.logWarning(`Skipping function ${input.fn.functionName}`, { error: validate.left.issue });
        return false;
      }

      const manage = yield* Lambda.LambdaFunctionManageService;
      const codeBundler = yield* NodeCodeBundlerService;

      const functionName = `${}-${fn.functionName}`;

      manage.upsertFunction(
        "createFunction",
        {
          FunctionName: functionName,
          Runtime: "nodejs20.x",
          Handler: "index.handler",
          Description: input.fn.description,
          Role: input.role,
          Timeout: input.fn.timeout,
          MemorySize: input.fn.memory,
          Architectures: ["arm64"],
          Tags: bootstrap.defaultResourceTags,
          Code: codeProps,
          Layers: [],
          Environment: {
            Variables: {
              ...functionConfig.env,
              projectId: bootstrap.contextConfig[0],
              ...bootstrap.defaultEnv
            }
          },
        }
      )
    })


export const deployNodeFunctions = (
  ...functions: LambdaFunction[]
) =>
  Effect.gen(function* () {

    const iam = yield* Iam.IamRoleManageService;

    const lambdaRole = 
      yield* iam.upsertRole()

    yield* Effect.forEach(functions, fn =>
      Effect.gen(function* () {



      })
    );

  }).pipe(
    Effect.provide(LambdaClientService.Default),
    Effect.runPromise
  )

deployFunctions(
  {
    description: "",
    functionName: "as-sd",
    memory: 128,
    sourceCode: {
      type: "file",
      path: "src/a.json"
    },
    eventSource: {

    },
    timeout: 15,
    env: {
      asd: "asdf"
    }
  }
)