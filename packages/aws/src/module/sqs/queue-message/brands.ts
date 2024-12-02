import { Brand } from "effect";
import type * as Sdk from "@aws-sdk/client-sqs"

export type SdkMessage = Brand.Branded<Sdk.Message, "SdkMessage">;
export const SdkMessage = Brand.nominal<SdkMessage>();

export type SdkSendMessage =
  Brand.Branded<Partial<Sdk.SendMessageCommandInput>, "SdkSendMessage">;
export const SdkSendMessage = Brand.nominal<SdkSendMessage>();

export type ReceiptHandle =
  Brand.Branded<string, "ReceiptHandle">;
export const ReceiptHandle = Brand.nominal<ReceiptHandle>();
