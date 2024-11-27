import * as Sdk from "@aws-sdk/client-kms";
import { Effect, Data, pipe } from "effect";
import { AwsRegionConfig } from "../../internal/index.js";

// *****  GENERATED CODE *****
export class KmsClientService extends
  Effect.Service<KmsClientService>()("KmsClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client (kms) =>");

      const client = new Sdk.KMSClient({ region });

      const execute = <M extends keyof KmsClientApi>(
        name: M,
        input: Parameters<KmsClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(KmsCommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, "command not found in factory"),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<KmsClientApi[M]>>)
          ),
          Effect.catchAll(error => {
            if (error.cause instanceof Sdk.KMSServiceException) {
              return new KmsClientException({
                name: error.name as KmsExceptionName,
                cause: error.cause,
              });
            }
            return Effect.die(error);
          })
        );

      return { execute };
    }),
  })
{
}

interface KmsClientApi {
  cancelKeyDeletion(_: Sdk.CancelKeyDeletionCommandInput): Sdk.CancelKeyDeletionCommandOutput;
  connectCustomKeyStore(_: Sdk.ConnectCustomKeyStoreCommandInput): Sdk.ConnectCustomKeyStoreCommandOutput;
  createAlias(_: Sdk.CreateAliasCommandInput): Sdk.CreateAliasCommandOutput;
  createCustomKeyStore(_: Sdk.CreateCustomKeyStoreCommandInput): Sdk.CreateCustomKeyStoreCommandOutput;
  createGrant(_: Sdk.CreateGrantCommandInput): Sdk.CreateGrantCommandOutput;
  createKey(_: Sdk.CreateKeyCommandInput): Sdk.CreateKeyCommandOutput;
  decrypt(_: Sdk.DecryptCommandInput): Sdk.DecryptCommandOutput;
  deleteAlias(_: Sdk.DeleteAliasCommandInput): Sdk.DeleteAliasCommandOutput;
  deleteCustomKeyStore(_: Sdk.DeleteCustomKeyStoreCommandInput): Sdk.DeleteCustomKeyStoreCommandOutput;
  deleteImportedKeyMaterial(_: Sdk.DeleteImportedKeyMaterialCommandInput): Sdk.DeleteImportedKeyMaterialCommandOutput;
  deriveSharedSecret(_: Sdk.DeriveSharedSecretCommandInput): Sdk.DeriveSharedSecretCommandOutput;
  describeCustomKeyStores(_: Sdk.DescribeCustomKeyStoresCommandInput): Sdk.DescribeCustomKeyStoresCommandOutput;
  describeKey(_: Sdk.DescribeKeyCommandInput): Sdk.DescribeKeyCommandOutput;
  disableKey(_: Sdk.DisableKeyCommandInput): Sdk.DisableKeyCommandOutput;
  disableKeyRotation(_: Sdk.DisableKeyRotationCommandInput): Sdk.DisableKeyRotationCommandOutput;
  disconnectCustomKeyStore(_: Sdk.DisconnectCustomKeyStoreCommandInput): Sdk.DisconnectCustomKeyStoreCommandOutput;
  enableKey(_: Sdk.EnableKeyCommandInput): Sdk.EnableKeyCommandOutput;
  enableKeyRotation(_: Sdk.EnableKeyRotationCommandInput): Sdk.EnableKeyRotationCommandOutput;
  encrypt(_: Sdk.EncryptCommandInput): Sdk.EncryptCommandOutput;
  generateDataKey(_: Sdk.GenerateDataKeyCommandInput): Sdk.GenerateDataKeyCommandOutput;
  generateDataKeyPair(_: Sdk.GenerateDataKeyPairCommandInput): Sdk.GenerateDataKeyPairCommandOutput;
  generateDataKeyPairWithoutPlaintext(_: Sdk.GenerateDataKeyPairWithoutPlaintextCommandInput): Sdk.GenerateDataKeyPairWithoutPlaintextCommandOutput;
  generateDataKeyWithoutPlaintext(_: Sdk.GenerateDataKeyWithoutPlaintextCommandInput): Sdk.GenerateDataKeyWithoutPlaintextCommandOutput;
  generateMac(_: Sdk.GenerateMacCommandInput): Sdk.GenerateMacCommandOutput;
  generateRandom(_: Sdk.GenerateRandomCommandInput): Sdk.GenerateRandomCommandOutput;
  getKeyPolicy(_: Sdk.GetKeyPolicyCommandInput): Sdk.GetKeyPolicyCommandOutput;
  getKeyRotationStatus(_: Sdk.GetKeyRotationStatusCommandInput): Sdk.GetKeyRotationStatusCommandOutput;
  getParametersForImport(_: Sdk.GetParametersForImportCommandInput): Sdk.GetParametersForImportCommandOutput;
  getPublicKey(_: Sdk.GetPublicKeyCommandInput): Sdk.GetPublicKeyCommandOutput;
  importKeyMaterial(_: Sdk.ImportKeyMaterialCommandInput): Sdk.ImportKeyMaterialCommandOutput;
  listAliases(_: Sdk.ListAliasesCommandInput): Sdk.ListAliasesCommandOutput;
  listGrants(_: Sdk.ListGrantsCommandInput): Sdk.ListGrantsCommandOutput;
  listKeyPolicies(_: Sdk.ListKeyPoliciesCommandInput): Sdk.ListKeyPoliciesCommandOutput;
  listKeyRotations(_: Sdk.ListKeyRotationsCommandInput): Sdk.ListKeyRotationsCommandOutput;
  listKeys(_: Sdk.ListKeysCommandInput): Sdk.ListKeysCommandOutput;
  listResourceTags(_: Sdk.ListResourceTagsCommandInput): Sdk.ListResourceTagsCommandOutput;
  listRetirableGrants(_: Sdk.ListRetirableGrantsCommandInput): Sdk.ListRetirableGrantsCommandOutput;
  putKeyPolicy(_: Sdk.PutKeyPolicyCommandInput): Sdk.PutKeyPolicyCommandOutput;
  reEncrypt(_: Sdk.ReEncryptCommandInput): Sdk.ReEncryptCommandOutput;
  replicateKey(_: Sdk.ReplicateKeyCommandInput): Sdk.ReplicateKeyCommandOutput;
  retireGrant(_: Sdk.RetireGrantCommandInput): Sdk.RetireGrantCommandOutput;
  revokeGrant(_: Sdk.RevokeGrantCommandInput): Sdk.RevokeGrantCommandOutput;
  rotateKeyOnDemand(_: Sdk.RotateKeyOnDemandCommandInput): Sdk.RotateKeyOnDemandCommandOutput;
  scheduleKeyDeletion(_: Sdk.ScheduleKeyDeletionCommandInput): Sdk.ScheduleKeyDeletionCommandOutput;
  sign(_: Sdk.SignCommandInput): Sdk.SignCommandOutput;
  tagResource(_: Sdk.TagResourceCommandInput): Sdk.TagResourceCommandOutput;
  untagResource(_: Sdk.UntagResourceCommandInput): Sdk.UntagResourceCommandOutput;
  updateAlias(_: Sdk.UpdateAliasCommandInput): Sdk.UpdateAliasCommandOutput;
  updateCustomKeyStore(_: Sdk.UpdateCustomKeyStoreCommandInput): Sdk.UpdateCustomKeyStoreCommandOutput;
  updateKeyDescription(_: Sdk.UpdateKeyDescriptionCommandInput): Sdk.UpdateKeyDescriptionCommandOutput;
  updatePrimaryRegion(_: Sdk.UpdatePrimaryRegionCommandInput): Sdk.UpdatePrimaryRegionCommandOutput;
  verify(_: Sdk.VerifyCommandInput): Sdk.VerifyCommandOutput;
  verifyMac(_: Sdk.VerifyMacCommandInput): Sdk.VerifyMacCommandOutput;
}


const KmsCommandFactory = {
  cancelKeyDeletion: (_: Sdk.CancelKeyDeletionCommandInput) => new Sdk.CancelKeyDeletionCommand(_),
  connectCustomKeyStore: (_: Sdk.ConnectCustomKeyStoreCommandInput) => new Sdk.ConnectCustomKeyStoreCommand(_),
  createAlias: (_: Sdk.CreateAliasCommandInput) => new Sdk.CreateAliasCommand(_),
  createCustomKeyStore: (_: Sdk.CreateCustomKeyStoreCommandInput) => new Sdk.CreateCustomKeyStoreCommand(_),
  createGrant: (_: Sdk.CreateGrantCommandInput) => new Sdk.CreateGrantCommand(_),
  createKey: (_: Sdk.CreateKeyCommandInput) => new Sdk.CreateKeyCommand(_),
  decrypt: (_: Sdk.DecryptCommandInput) => new Sdk.DecryptCommand(_),
  deleteAlias: (_: Sdk.DeleteAliasCommandInput) => new Sdk.DeleteAliasCommand(_),
  deleteCustomKeyStore: (_: Sdk.DeleteCustomKeyStoreCommandInput) => new Sdk.DeleteCustomKeyStoreCommand(_),
  deleteImportedKeyMaterial: (_: Sdk.DeleteImportedKeyMaterialCommandInput) => new Sdk.DeleteImportedKeyMaterialCommand(_),
  deriveSharedSecret: (_: Sdk.DeriveSharedSecretCommandInput) => new Sdk.DeriveSharedSecretCommand(_),
  describeCustomKeyStores: (_: Sdk.DescribeCustomKeyStoresCommandInput) => new Sdk.DescribeCustomKeyStoresCommand(_),
  describeKey: (_: Sdk.DescribeKeyCommandInput) => new Sdk.DescribeKeyCommand(_),
  disableKey: (_: Sdk.DisableKeyCommandInput) => new Sdk.DisableKeyCommand(_),
  disableKeyRotation: (_: Sdk.DisableKeyRotationCommandInput) => new Sdk.DisableKeyRotationCommand(_),
  disconnectCustomKeyStore: (_: Sdk.DisconnectCustomKeyStoreCommandInput) => new Sdk.DisconnectCustomKeyStoreCommand(_),
  enableKey: (_: Sdk.EnableKeyCommandInput) => new Sdk.EnableKeyCommand(_),
  enableKeyRotation: (_: Sdk.EnableKeyRotationCommandInput) => new Sdk.EnableKeyRotationCommand(_),
  encrypt: (_: Sdk.EncryptCommandInput) => new Sdk.EncryptCommand(_),
  generateDataKey: (_: Sdk.GenerateDataKeyCommandInput) => new Sdk.GenerateDataKeyCommand(_),
  generateDataKeyPair: (_: Sdk.GenerateDataKeyPairCommandInput) => new Sdk.GenerateDataKeyPairCommand(_),
  generateDataKeyPairWithoutPlaintext: (_: Sdk.GenerateDataKeyPairWithoutPlaintextCommandInput) => new Sdk.GenerateDataKeyPairWithoutPlaintextCommand(_),
  generateDataKeyWithoutPlaintext: (_: Sdk.GenerateDataKeyWithoutPlaintextCommandInput) => new Sdk.GenerateDataKeyWithoutPlaintextCommand(_),
  generateMac: (_: Sdk.GenerateMacCommandInput) => new Sdk.GenerateMacCommand(_),
  generateRandom: (_: Sdk.GenerateRandomCommandInput) => new Sdk.GenerateRandomCommand(_),
  getKeyPolicy: (_: Sdk.GetKeyPolicyCommandInput) => new Sdk.GetKeyPolicyCommand(_),
  getKeyRotationStatus: (_: Sdk.GetKeyRotationStatusCommandInput) => new Sdk.GetKeyRotationStatusCommand(_),
  getParametersForImport: (_: Sdk.GetParametersForImportCommandInput) => new Sdk.GetParametersForImportCommand(_),
  getPublicKey: (_: Sdk.GetPublicKeyCommandInput) => new Sdk.GetPublicKeyCommand(_),
  importKeyMaterial: (_: Sdk.ImportKeyMaterialCommandInput) => new Sdk.ImportKeyMaterialCommand(_),
  listAliases: (_: Sdk.ListAliasesCommandInput) => new Sdk.ListAliasesCommand(_),
  listGrants: (_: Sdk.ListGrantsCommandInput) => new Sdk.ListGrantsCommand(_),
  listKeyPolicies: (_: Sdk.ListKeyPoliciesCommandInput) => new Sdk.ListKeyPoliciesCommand(_),
  listKeyRotations: (_: Sdk.ListKeyRotationsCommandInput) => new Sdk.ListKeyRotationsCommand(_),
  listKeys: (_: Sdk.ListKeysCommandInput) => new Sdk.ListKeysCommand(_),
  listResourceTags: (_: Sdk.ListResourceTagsCommandInput) => new Sdk.ListResourceTagsCommand(_),
  listRetirableGrants: (_: Sdk.ListRetirableGrantsCommandInput) => new Sdk.ListRetirableGrantsCommand(_),
  putKeyPolicy: (_: Sdk.PutKeyPolicyCommandInput) => new Sdk.PutKeyPolicyCommand(_),
  reEncrypt: (_: Sdk.ReEncryptCommandInput) => new Sdk.ReEncryptCommand(_),
  replicateKey: (_: Sdk.ReplicateKeyCommandInput) => new Sdk.ReplicateKeyCommand(_),
  retireGrant: (_: Sdk.RetireGrantCommandInput) => new Sdk.RetireGrantCommand(_),
  revokeGrant: (_: Sdk.RevokeGrantCommandInput) => new Sdk.RevokeGrantCommand(_),
  rotateKeyOnDemand: (_: Sdk.RotateKeyOnDemandCommandInput) => new Sdk.RotateKeyOnDemandCommand(_),
  scheduleKeyDeletion: (_: Sdk.ScheduleKeyDeletionCommandInput) => new Sdk.ScheduleKeyDeletionCommand(_),
  sign: (_: Sdk.SignCommandInput) => new Sdk.SignCommand(_),
  tagResource: (_: Sdk.TagResourceCommandInput) => new Sdk.TagResourceCommand(_),
  untagResource: (_: Sdk.UntagResourceCommandInput) => new Sdk.UntagResourceCommand(_),
  updateAlias: (_: Sdk.UpdateAliasCommandInput) => new Sdk.UpdateAliasCommand(_),
  updateCustomKeyStore: (_: Sdk.UpdateCustomKeyStoreCommandInput) => new Sdk.UpdateCustomKeyStoreCommand(_),
  updateKeyDescription: (_: Sdk.UpdateKeyDescriptionCommandInput) => new Sdk.UpdateKeyDescriptionCommand(_),
  updatePrimaryRegion: (_: Sdk.UpdatePrimaryRegionCommandInput) => new Sdk.UpdatePrimaryRegionCommand(_),
  verify: (_: Sdk.VerifyCommandInput) => new Sdk.VerifyCommand(_),
  verifyMac: (_: Sdk.VerifyMacCommandInput) => new Sdk.VerifyMacCommand(_),
} as Record<keyof KmsClientApi, (_: unknown) => unknown>


const kmsExceptionNames = [
  "KMSServiceException", "AlreadyExistsException", "DependencyTimeoutException",
  "InvalidArnException", "KMSInternalException", "KMSInvalidStateException",
  "NotFoundException", "CloudHsmClusterInUseException", "CloudHsmClusterInvalidConfigurationException",
  "CloudHsmClusterNotActiveException", "CloudHsmClusterNotFoundException", "CloudHsmClusterNotRelatedException",
  "ConflictException", "CustomKeyStoreInvalidStateException", "CustomKeyStoreNotFoundException",
  "InvalidAliasNameException", "LimitExceededException", "CustomKeyStoreNameInUseException",
  "IncorrectTrustAnchorException", "XksProxyIncorrectAuthenticationCredentialException", "XksProxyInvalidConfigurationException",
  "XksProxyInvalidResponseException", "XksProxyUriEndpointInUseException", "XksProxyUriInUseException",
  "XksProxyUriUnreachableException", "XksProxyVpcEndpointServiceInUseException", "XksProxyVpcEndpointServiceInvalidConfigurationException",
  "XksProxyVpcEndpointServiceNotFoundException", "DisabledException", "DryRunOperationException",
  "InvalidGrantTokenException", "MalformedPolicyDocumentException", "TagException",
  "UnsupportedOperationException", "XksKeyAlreadyInUseException", "XksKeyInvalidConfigurationException",
  "XksKeyNotFoundException", "CustomKeyStoreHasCMKsException", "IncorrectKeyException",
  "InvalidCiphertextException", "InvalidKeyUsageException", "KeyUnavailableException",
  "InvalidMarkerException", "ExpiredImportTokenException", "IncorrectKeyMaterialException",
  "InvalidImportTokenException", "InvalidGrantIdException", "KMSInvalidMacException",
  "KMSInvalidSignatureException",
] as const;

export type KmsExceptionName = typeof kmsExceptionNames[number];

export class KmsClientException extends Data.TaggedError("KmsClientException")<
  {
    name: KmsExceptionName;
    cause: Sdk.KMSServiceException
  }
> { } {
}