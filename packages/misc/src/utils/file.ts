export const base64ToFile = (
  input: string,
  fileName: string,
  type: string
) => {
  const buffer = Buffer.from(input, 'base64');
  return new File([buffer], fileName, { type})
}