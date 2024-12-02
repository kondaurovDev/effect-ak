import * as Effect from "effect/Effect"
import * as Data from "effect/Data"

import { AwsServiceName } from "#/module/const.js";
import * as S from "../schema.js";

export class IamRolePolicyFactoryService
  extends Effect.Service<IamRolePolicyFactoryService>()("IamRolePolicyFactoryService", {
    succeed: {
      makeAssumeDocument:
        (input: {
          serviceName: AwsServiceName
        }) =>
          S.IamRolePolicyDocument.make({
            Version: "2012-10-17",
            Statement:
              Data.array([
                S.IamRolePolicyDocumentStatement.make({
                  Effect: "Allow",
                  Action: "sts:AssumeRole",
                  Principal:
                    S.IamRolePolicyDocumentPrincipal.make({
                      Service: `${input.serviceName}.amazonaws.com`
                    })
                })
              ])
          }),
      makeAllowResourceDocument:
        (input: {
          resources: S.IamRolePolicyDocumentResource,
          actions: S.IamRolePolicyDocumentAction
        }) =>
          S.IamRolePolicyDocument.make({
            Version: "2012-10-17",
            Statement: Data.array([
              S.IamRolePolicyDocumentStatement.make({
                Effect: "Allow",
                Resource: input.resources,
                Action: input.actions
              })
            ])
          })
    }
  }) { }