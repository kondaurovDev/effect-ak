import { Data } from "effect"

export class ExtractedTypeOrMethodOneOfType 
  extends Data.TaggedClass("ExtractedTypeOrMethodOneOfType")<{
    typeOrMethodName: string,
    typeOrMethodDescription: string,
    type: NormalType
  }> {}

export class ExtractedTypeOrMethodFields 
  extends Data.TaggedClass("ExtractedTypeOrMethodFields")<{
    typeOrMethodName: string,
    typeOrMethodDescription: string,
    fields: FieldTypeMetadata[]
  }> {}

export class FieldTypeMetadata
  extends Data.TaggedClass("FieldTypeMetadata")<{
    name: string,
    type: NormalType,
    description: string,
    required: boolean
  }> { }

export type TypeMetadata = TypeMetadataFields | TypeMetadataOneOf

export class TypeMetadataFields
  extends Data.TaggedClass("TypeMetadataFields")<{
    typeName: string,
    description: string
    fields: FieldTypeMetadata[]
  }> { }

export class TypeMetadataOneOf
  extends Data.TaggedClass("TypeMetadataOneOf")<{
    typeName: string,
    description: string
    type: NormalType
  }> { }

export class MethodMetadata
  extends Data.TaggedClass("MethodMetadata")<{
    methodName: string,
    returnType: NormalType,
    description: string
    fields: FieldTypeMetadata[]
  }> { }

export class NormalType
  extends Data.TaggedClass("NormalType")<{
    typeNames: [string, ...string[]]
  }> {

    get tsType() {
     return this.typeNames.join(" | "); 
    }

    toString() {
      return this.tsType;
    }

  }
