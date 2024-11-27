import * as D from "../types.js";

export const getProjectionAndAttributeNames = (
  attrs: D.AttrsToGet
) => {

  const expr: string[] = [];

  const attributeNames = D.AttributeNames({});

  attrs.forEach((attr, index) => {
    const placeholder = `#A${index + 1}`;
    attributeNames[placeholder] = attr;
    expr.push(placeholder);
  })

  return {
    ExpressionAttributeNames: attributeNames,
    ProjectionExpression: D.ProjectionExpression(expr.join(", "))
  }
}