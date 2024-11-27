import { CommonErrorFields, createTypeGuard } from "../../internal/error.js"

export type InvalidAutomationStatusUpdateException = {
  $fault: "client"
} & CommonErrorFields;

export const isInvalidAutomationStatusUpdateException = 
  createTypeGuard<InvalidAutomationStatusUpdateException>("InvalidAutomationStatusUpdateException");
