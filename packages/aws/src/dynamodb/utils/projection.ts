import * as D from "../types";

export const getProjectionAndAttributeNames = (attrs: D.AttrsToGet): {
  attributeNames: D.AttributeNames,
  projectionExpression: D.ProjectionExpression
} => {

  const expr: string[] = [];

  const attributeNames = D.AttributeNames({});

  attrs.forEach((attr, index) => {
    const placeholder = `#A${index + 1}`;
    attributeNames[placeholder] = attr;
    expr.push(placeholder);
  })

  return {
    attributeNames,
    projectionExpression: D.ProjectionExpression(expr.join(", "))
  }
}