import { 
  ConditionalCheckFailedException,
  ExportNotFoundException
} from "@aws-sdk/client-dynamodb"

import { AwsServiceError, isError } from "../../internal/client-wrapper.js"
import { number } from "effect/Equivalence";

// export const isConditionalCheckFailedException = (_: AwsServiceError<DynamoDBServiceException>) => isError(_, ConditionalCheckFailedException)

const allErrors = {
  ConditionalCheckFailedException,
  ExportNotFoundException
}

type A =  keyof typeof allErrors
