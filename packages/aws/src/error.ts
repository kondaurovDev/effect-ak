import { Schema as S } from "@effect/schema"
import { trySafePromise } from "@efkit/shared"

export type ServiceError = 
  typeof ServiceError.Type

export const ServiceError = 
  S.Struct({
    name: S.String,
    $fault: S.Literal("client", "server"),
    message: S.String
  })

export const tryAwsServiceMethod = <O>(
  actionName: string,
  action: () => Promise<O>
) =>
  trySafePromise(
    actionName,
    action,
    ServiceError
  )
