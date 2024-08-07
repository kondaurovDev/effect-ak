// import { HttpClient } from "@effect/platform";
// import { Effect, pipe, Cache } from "effect";
// import { Schema as S } from "@effect/schema";

// import { SSM } from "~integrations-aws";

// import { ClientCredentialsLive, RefreshAccessToken } from "./auth";

// export const UserAccessTokenCache =
//   await pipe(
//     Cache.make({
//       capacity: 100,
//       timeToLive: "3500 seconds",
//       lookup: (userId: string) => 
//         FetchUserAccessToken(userId)
//     }),
//     Effect.runPromise
//   );

// const FetchUserAccessToken = (
//   userId: string
// ) =>
//   Effect.Do.pipe(
//     Effect.bind("userCredentials", () =>
//       UserCredentialsFromParamStore(userId)
//     ),
//     Effect.andThen(({ userCredentials }) =>
//       pipe(
//         RefreshAccessToken(userCredentials.refreshToken),
//         Effect.andThen(_ => _.access_token)
//       )
//     ),
//     Effect.tap(
//       Effect.logDebug("******** Fetched an access token ********")
//     ),
//     Effect.provide(HttpClient.layer),
//     Effect.provide(ClientCredentialsLive),
//     Effect.provide(SSM.ServiceLive)
//   );

// export const UserCredentialsFromParamStore = (
//   userId: string
// ) =>
//   pipe(
//     SSM.getJsonParamValue(
//       SSM.ParameterName(`/google/credentials/${userId}`)
//     ),
//     Effect.andThen(
//       S.validate(
//         S.Struct({
//           refreshToken: S.String
//         })
//       )
//     )
//   )