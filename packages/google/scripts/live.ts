import { Console, Layer } from "effect"
import { OAuth2ClientCredentialsProvider, OAuth2Service } from "../src/api"
import { NodeContext } from "@effect/platform-node"
import { AccessTokenFromFile } from "../src/misc"

const credentialsProvider =
  Layer.effect(
    OAuth2ClientCredentialsProvider,
    OAuth2ClientCredentialsProvider.fromLocalFile(
      path => path.join(__dirname, "..", "artifacts", "oauth-credentials.json")
    )
  ).pipe(
    Layer.provide(NodeContext.layer),
    Layer.tapError(Console.error)
  )

const oauthService =
  OAuth2Service.Default.pipe(
    Layer.provide(credentialsProvider)
  )

const accessTokenFromFile =
  AccessTokenFromFile.Default.pipe(
    Layer.provide([ credentialsProvider, NodeContext.layer ])
  )

export const live =
  Layer.mergeAll(
    credentialsProvider,
    oauthService,
    accessTokenFromFile,
    NodeContext.layer
  )
