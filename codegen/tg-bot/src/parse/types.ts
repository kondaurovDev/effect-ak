import { Brand, Data } from "effect"

export class FieldTypeMetadata
  extends Data.Class<{
    name: string,
    type: NormalType,
    description: string,
    required: boolean
  }> { }

export class TypeMetadata
  extends Data.Class<{
    typeName: string,
    description: string
    fields: FieldTypeMetadata[]
  }> { }

export class MethodMetadata
  extends Data.Class<{
    methodName: string,
    returnType: NormalType,
    description: string
    fields: FieldTypeMetadata[]
  }> { }

export type NormalType = Brand.Branded<string, "NormalType">;
export const NormalType = Brand.nominal<NormalType>();
