export const methodPath =
  (methodName: string) =>
    methodName
      .split("_")
      .reduce((result, word, step) => {
        if (step == 0) {
          return word
        } else {
          return result + word.at(0)?.toUpperCase() + word.slice(1);
        }
      }, "")

type FileProps = {
  fileContent: Uint8Array,
  fileName?: string
}

const hasFileContent =
  (input: unknown): input is FileProps =>
    typeof input == "object" &&
    input != null &&
    "fileContent" in input &&
    input.fileContent instanceof Uint8Array

export const makePayload = (
  body: Record<string, unknown>
) => {

  const entries = Object.entries(body);

  if (entries.length == 0) return undefined;

  const result = new FormData();

  for (const [key, value] of entries) {
    if (!value) continue;

    // file
    // if (true) {
    //   result.append(key, new Blob([value.content]), value.fileName);
    //   continue;
    // }

    if (typeof value != "object") {
      result.append(key, `${value}`)
    } else {
      result.append(key, JSON.stringify(value))  
    }

    // if () {

    // } else {
    //   if (key == "message_effect_id" && isMessageEffect(value)) {
    //     result.append(key, messageEffectIdCodesMap[value]);
    //     continue;
    //   }

    // }
  }

  return result;
}
