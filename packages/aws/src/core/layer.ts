import { Layer, ManagedRuntime } from "effect";
import { makeLambdaClientService } from "#clients2/lambda.js";

const clientConfig = {
  region: "eu-west-3"
}



export const CliensLive = 
  Layer.mergeAll(
    makeLambdaClientService(clientConfig),
  );
