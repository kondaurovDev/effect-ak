import { convertToAttr } from "@aws-sdk/util-dynamodb";
import { Effect, pipe } from "effect";

import * as D from "../types.js";
import { DynamoDbError } from "../errors.js"

export const getUpdateExpression = (
  item: D.AnyItem
): Effect.Effect<D.UpdateExpressionWithAttrs, DynamoDbError> =>
  pipe(
    Effect.succeed(D.UpdateExpressionWithAttrs({
      expressionParts: [],
      attributeNames: D.AttributeNames({}),
      attributeValues: D.AttributeValues({})
    })),
    Effect.andThen(updateExpr =>
      pipe(
        processObject(updateExpr, item, "", ""),
        Effect.andThen(() => {
          for (const key of Object.keys(updateExpr.attributeNames)) {
            const attributeIsUsed = updateExpr.expressionParts.find(pair => pair.includes(key));
            if (!attributeIsUsed) {
              delete updateExpr.attributeNames[key]
            }
          }
          return updateExpr
        })
      ))
  );

//recursive traverse
function processObject(
  updateExpression: D.UpdateExpressionWithAttrs,
  inputObj: Record<string, any>,
  prefix: string, level: string
): Effect.Effect<void, DynamoDbError> {
  let index = 1;
  for (const [currParam, currValue] of Object.entries(inputObj)) {

    if (currValue == null) continue;

    const isArray = Array.isArray(currValue);

    const attrPlaceholder = `${prefix}P${index}`;

    if (typeof currValue === 'object' && !isArray) {
      const attr = updateExpression.attributeNames[`#${attrPlaceholder}`];
      if (attr) { return new DynamoDbError({ message: `Attribute name '${attr}' shouldn't exist` }); }
      updateExpression.attributeNames[`#${attrPlaceholder}`] = currParam;
      const nextLevel = level.length == 0 ?
        `#${attrPlaceholder}` :
        `${level}.#${attrPlaceholder}`;
      processObject(updateExpression, currValue, attrPlaceholder, nextLevel);
      index++;
      continue;
    }

    const paramName = `#${prefix}P${index}`;
    const valueName = `:${prefix}P${index}`;
    const expr = level.length == 0 ?
      `#${attrPlaceholder} = ${valueName}` :
      `${level}.#${attrPlaceholder} = ${valueName}`;
    updateExpression.expressionParts.push(expr);
    updateExpression.attributeNames[paramName] = currParam;
    updateExpression.attributeValues[valueName] = convertToAttr(currValue);
    index++;
  }
  return Effect.void

}
