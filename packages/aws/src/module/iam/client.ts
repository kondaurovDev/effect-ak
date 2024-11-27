import * as Sdk from "@aws-sdk/client-iam";
import { Effect, Data, pipe, Cause } from "effect";
import { AwsRegionConfig } from "../../internal/index.js";

// *****  GENERATED CODE *****
export class IamClientService extends
  Effect.Service<IamClientService>()("IamClientService", {
    scoped: Effect.gen(function*() {
      const region = yield* AwsRegionConfig;

      yield* Effect.logDebug("Creating aws client", { client: "Iam" });

      const client = new Sdk.IAMClient({ region });

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "Iam" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof IamClientApi>(
        name: M,
        input: Parameters<IamClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(IamCommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<IamClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.IAMServiceException ?
              new IamClientException({
                name: error.cause.name as IamExceptionName,
                cause: error.cause,
              }) : new Cause.UnknownException(error)
          ),
          Effect.catchTag("UnknownException", Effect.die)
        );

      return { execute };
    }),
  })
{
}

export type IamMethodInput<M extends keyof IamClientApi> = Parameters<IamClientApi[M]>[0];

export interface IamClientApi {
  addClientIDToOpenIDConnectProvider(_: Sdk.AddClientIDToOpenIDConnectProviderCommandInput): Sdk.AddClientIDToOpenIDConnectProviderCommandOutput;
  addRoleToInstanceProfile(_: Sdk.AddRoleToInstanceProfileCommandInput): Sdk.AddRoleToInstanceProfileCommandOutput;
  addUserToGroup(_: Sdk.AddUserToGroupCommandInput): Sdk.AddUserToGroupCommandOutput;
  attachGroupPolicy(_: Sdk.AttachGroupPolicyCommandInput): Sdk.AttachGroupPolicyCommandOutput;
  attachRolePolicy(_: Sdk.AttachRolePolicyCommandInput): Sdk.AttachRolePolicyCommandOutput;
  attachUserPolicy(_: Sdk.AttachUserPolicyCommandInput): Sdk.AttachUserPolicyCommandOutput;
  changePassword(_: Sdk.ChangePasswordCommandInput): Sdk.ChangePasswordCommandOutput;
  createAccessKey(_: Sdk.CreateAccessKeyCommandInput): Sdk.CreateAccessKeyCommandOutput;
  createAccountAlias(_: Sdk.CreateAccountAliasCommandInput): Sdk.CreateAccountAliasCommandOutput;
  createGroup(_: Sdk.CreateGroupCommandInput): Sdk.CreateGroupCommandOutput;
  createInstanceProfile(_: Sdk.CreateInstanceProfileCommandInput): Sdk.CreateInstanceProfileCommandOutput;
  createLoginProfile(_: Sdk.CreateLoginProfileCommandInput): Sdk.CreateLoginProfileCommandOutput;
  createOpenIDConnectProvider(_: Sdk.CreateOpenIDConnectProviderCommandInput): Sdk.CreateOpenIDConnectProviderCommandOutput;
  createPolicy(_: Sdk.CreatePolicyCommandInput): Sdk.CreatePolicyCommandOutput;
  createPolicyVersion(_: Sdk.CreatePolicyVersionCommandInput): Sdk.CreatePolicyVersionCommandOutput;
  createRole(_: Sdk.CreateRoleCommandInput): Sdk.CreateRoleCommandOutput;
  createSAMLProvider(_: Sdk.CreateSAMLProviderCommandInput): Sdk.CreateSAMLProviderCommandOutput;
  createServiceLinkedRole(_: Sdk.CreateServiceLinkedRoleCommandInput): Sdk.CreateServiceLinkedRoleCommandOutput;
  createServiceSpecificCredential(_: Sdk.CreateServiceSpecificCredentialCommandInput): Sdk.CreateServiceSpecificCredentialCommandOutput;
  createUser(_: Sdk.CreateUserCommandInput): Sdk.CreateUserCommandOutput;
  createVirtualMFADevice(_: Sdk.CreateVirtualMFADeviceCommandInput): Sdk.CreateVirtualMFADeviceCommandOutput;
  deactivateMFADevice(_: Sdk.DeactivateMFADeviceCommandInput): Sdk.DeactivateMFADeviceCommandOutput;
  deleteAccessKey(_: Sdk.DeleteAccessKeyCommandInput): Sdk.DeleteAccessKeyCommandOutput;
  deleteAccountAlias(_: Sdk.DeleteAccountAliasCommandInput): Sdk.DeleteAccountAliasCommandOutput;
  deleteAccountPasswordPolicy(_: Sdk.DeleteAccountPasswordPolicyCommandInput): Sdk.DeleteAccountPasswordPolicyCommandOutput;
  deleteGroup(_: Sdk.DeleteGroupCommandInput): Sdk.DeleteGroupCommandOutput;
  deleteGroupPolicy(_: Sdk.DeleteGroupPolicyCommandInput): Sdk.DeleteGroupPolicyCommandOutput;
  deleteInstanceProfile(_: Sdk.DeleteInstanceProfileCommandInput): Sdk.DeleteInstanceProfileCommandOutput;
  deleteLoginProfile(_: Sdk.DeleteLoginProfileCommandInput): Sdk.DeleteLoginProfileCommandOutput;
  deleteOpenIDConnectProvider(_: Sdk.DeleteOpenIDConnectProviderCommandInput): Sdk.DeleteOpenIDConnectProviderCommandOutput;
  deletePolicy(_: Sdk.DeletePolicyCommandInput): Sdk.DeletePolicyCommandOutput;
  deletePolicyVersion(_: Sdk.DeletePolicyVersionCommandInput): Sdk.DeletePolicyVersionCommandOutput;
  deleteRole(_: Sdk.DeleteRoleCommandInput): Sdk.DeleteRoleCommandOutput;
  deleteRolePermissionsBoundary(_: Sdk.DeleteRolePermissionsBoundaryCommandInput): Sdk.DeleteRolePermissionsBoundaryCommandOutput;
  deleteRolePolicy(_: Sdk.DeleteRolePolicyCommandInput): Sdk.DeleteRolePolicyCommandOutput;
  deleteSAMLProvider(_: Sdk.DeleteSAMLProviderCommandInput): Sdk.DeleteSAMLProviderCommandOutput;
  deleteServerCertificate(_: Sdk.DeleteServerCertificateCommandInput): Sdk.DeleteServerCertificateCommandOutput;
  deleteServiceLinkedRole(_: Sdk.DeleteServiceLinkedRoleCommandInput): Sdk.DeleteServiceLinkedRoleCommandOutput;
  deleteServiceSpecificCredential(_: Sdk.DeleteServiceSpecificCredentialCommandInput): Sdk.DeleteServiceSpecificCredentialCommandOutput;
  deleteSigningCertificate(_: Sdk.DeleteSigningCertificateCommandInput): Sdk.DeleteSigningCertificateCommandOutput;
  deleteSSHPublicKey(_: Sdk.DeleteSSHPublicKeyCommandInput): Sdk.DeleteSSHPublicKeyCommandOutput;
  deleteUser(_: Sdk.DeleteUserCommandInput): Sdk.DeleteUserCommandOutput;
  deleteUserPermissionsBoundary(_: Sdk.DeleteUserPermissionsBoundaryCommandInput): Sdk.DeleteUserPermissionsBoundaryCommandOutput;
  deleteUserPolicy(_: Sdk.DeleteUserPolicyCommandInput): Sdk.DeleteUserPolicyCommandOutput;
  deleteVirtualMFADevice(_: Sdk.DeleteVirtualMFADeviceCommandInput): Sdk.DeleteVirtualMFADeviceCommandOutput;
  detachGroupPolicy(_: Sdk.DetachGroupPolicyCommandInput): Sdk.DetachGroupPolicyCommandOutput;
  detachRolePolicy(_: Sdk.DetachRolePolicyCommandInput): Sdk.DetachRolePolicyCommandOutput;
  detachUserPolicy(_: Sdk.DetachUserPolicyCommandInput): Sdk.DetachUserPolicyCommandOutput;
  disableOrganizationsRootCredentialsManagement(_: Sdk.DisableOrganizationsRootCredentialsManagementCommandInput): Sdk.DisableOrganizationsRootCredentialsManagementCommandOutput;
  disableOrganizationsRootSessions(_: Sdk.DisableOrganizationsRootSessionsCommandInput): Sdk.DisableOrganizationsRootSessionsCommandOutput;
  enableMFADevice(_: Sdk.EnableMFADeviceCommandInput): Sdk.EnableMFADeviceCommandOutput;
  enableOrganizationsRootCredentialsManagement(_: Sdk.EnableOrganizationsRootCredentialsManagementCommandInput): Sdk.EnableOrganizationsRootCredentialsManagementCommandOutput;
  enableOrganizationsRootSessions(_: Sdk.EnableOrganizationsRootSessionsCommandInput): Sdk.EnableOrganizationsRootSessionsCommandOutput;
  generateCredentialReport(_: Sdk.GenerateCredentialReportCommandInput): Sdk.GenerateCredentialReportCommandOutput;
  generateOrganizationsAccessReport(_: Sdk.GenerateOrganizationsAccessReportCommandInput): Sdk.GenerateOrganizationsAccessReportCommandOutput;
  generateServiceLastAccessedDetails(_: Sdk.GenerateServiceLastAccessedDetailsCommandInput): Sdk.GenerateServiceLastAccessedDetailsCommandOutput;
  getAccessKeyLastUsed(_: Sdk.GetAccessKeyLastUsedCommandInput): Sdk.GetAccessKeyLastUsedCommandOutput;
  getAccountAuthorizationDetails(_: Sdk.GetAccountAuthorizationDetailsCommandInput): Sdk.GetAccountAuthorizationDetailsCommandOutput;
  getAccountPasswordPolicy(_: Sdk.GetAccountPasswordPolicyCommandInput): Sdk.GetAccountPasswordPolicyCommandOutput;
  getAccountSummary(_: Sdk.GetAccountSummaryCommandInput): Sdk.GetAccountSummaryCommandOutput;
  getContextKeysForCustomPolicy(_: Sdk.GetContextKeysForCustomPolicyCommandInput): Sdk.GetContextKeysForCustomPolicyCommandOutput;
  getContextKeysForPrincipalPolicy(_: Sdk.GetContextKeysForPrincipalPolicyCommandInput): Sdk.GetContextKeysForPrincipalPolicyCommandOutput;
  getCredentialReport(_: Sdk.GetCredentialReportCommandInput): Sdk.GetCredentialReportCommandOutput;
  getGroup(_: Sdk.GetGroupCommandInput): Sdk.GetGroupCommandOutput;
  getGroupPolicy(_: Sdk.GetGroupPolicyCommandInput): Sdk.GetGroupPolicyCommandOutput;
  getInstanceProfile(_: Sdk.GetInstanceProfileCommandInput): Sdk.GetInstanceProfileCommandOutput;
  getLoginProfile(_: Sdk.GetLoginProfileCommandInput): Sdk.GetLoginProfileCommandOutput;
  getMFADevice(_: Sdk.GetMFADeviceCommandInput): Sdk.GetMFADeviceCommandOutput;
  getOpenIDConnectProvider(_: Sdk.GetOpenIDConnectProviderCommandInput): Sdk.GetOpenIDConnectProviderCommandOutput;
  getOrganizationsAccessReport(_: Sdk.GetOrganizationsAccessReportCommandInput): Sdk.GetOrganizationsAccessReportCommandOutput;
  getPolicy(_: Sdk.GetPolicyCommandInput): Sdk.GetPolicyCommandOutput;
  getPolicyVersion(_: Sdk.GetPolicyVersionCommandInput): Sdk.GetPolicyVersionCommandOutput;
  getRole(_: Sdk.GetRoleCommandInput): Sdk.GetRoleCommandOutput;
  getRolePolicy(_: Sdk.GetRolePolicyCommandInput): Sdk.GetRolePolicyCommandOutput;
  getSAMLProvider(_: Sdk.GetSAMLProviderCommandInput): Sdk.GetSAMLProviderCommandOutput;
  getServerCertificate(_: Sdk.GetServerCertificateCommandInput): Sdk.GetServerCertificateCommandOutput;
  getServiceLastAccessedDetails(_: Sdk.GetServiceLastAccessedDetailsCommandInput): Sdk.GetServiceLastAccessedDetailsCommandOutput;
  getServiceLastAccessedDetailsWithEntities(_: Sdk.GetServiceLastAccessedDetailsWithEntitiesCommandInput): Sdk.GetServiceLastAccessedDetailsWithEntitiesCommandOutput;
  getServiceLinkedRoleDeletionStatus(_: Sdk.GetServiceLinkedRoleDeletionStatusCommandInput): Sdk.GetServiceLinkedRoleDeletionStatusCommandOutput;
  getSSHPublicKey(_: Sdk.GetSSHPublicKeyCommandInput): Sdk.GetSSHPublicKeyCommandOutput;
  getUser(_: Sdk.GetUserCommandInput): Sdk.GetUserCommandOutput;
  getUserPolicy(_: Sdk.GetUserPolicyCommandInput): Sdk.GetUserPolicyCommandOutput;
  listAccessKeys(_: Sdk.ListAccessKeysCommandInput): Sdk.ListAccessKeysCommandOutput;
  listAccountAliases(_: Sdk.ListAccountAliasesCommandInput): Sdk.ListAccountAliasesCommandOutput;
  listAttachedGroupPolicies(_: Sdk.ListAttachedGroupPoliciesCommandInput): Sdk.ListAttachedGroupPoliciesCommandOutput;
  listAttachedRolePolicies(_: Sdk.ListAttachedRolePoliciesCommandInput): Sdk.ListAttachedRolePoliciesCommandOutput;
  listAttachedUserPolicies(_: Sdk.ListAttachedUserPoliciesCommandInput): Sdk.ListAttachedUserPoliciesCommandOutput;
  listEntitiesForPolicy(_: Sdk.ListEntitiesForPolicyCommandInput): Sdk.ListEntitiesForPolicyCommandOutput;
  listGroupPolicies(_: Sdk.ListGroupPoliciesCommandInput): Sdk.ListGroupPoliciesCommandOutput;
  listGroups(_: Sdk.ListGroupsCommandInput): Sdk.ListGroupsCommandOutput;
  listGroupsForUser(_: Sdk.ListGroupsForUserCommandInput): Sdk.ListGroupsForUserCommandOutput;
  listInstanceProfiles(_: Sdk.ListInstanceProfilesCommandInput): Sdk.ListInstanceProfilesCommandOutput;
  listInstanceProfilesForRole(_: Sdk.ListInstanceProfilesForRoleCommandInput): Sdk.ListInstanceProfilesForRoleCommandOutput;
  listInstanceProfileTags(_: Sdk.ListInstanceProfileTagsCommandInput): Sdk.ListInstanceProfileTagsCommandOutput;
  listMFADevices(_: Sdk.ListMFADevicesCommandInput): Sdk.ListMFADevicesCommandOutput;
  listMFADeviceTags(_: Sdk.ListMFADeviceTagsCommandInput): Sdk.ListMFADeviceTagsCommandOutput;
  listOpenIDConnectProviders(_: Sdk.ListOpenIDConnectProvidersCommandInput): Sdk.ListOpenIDConnectProvidersCommandOutput;
  listOpenIDConnectProviderTags(_: Sdk.ListOpenIDConnectProviderTagsCommandInput): Sdk.ListOpenIDConnectProviderTagsCommandOutput;
  listOrganizationsFeatures(_: Sdk.ListOrganizationsFeaturesCommandInput): Sdk.ListOrganizationsFeaturesCommandOutput;
  listPolicies(_: Sdk.ListPoliciesCommandInput): Sdk.ListPoliciesCommandOutput;
  listPoliciesGrantingServiceAccess(_: Sdk.ListPoliciesGrantingServiceAccessCommandInput): Sdk.ListPoliciesGrantingServiceAccessCommandOutput;
  listPolicyTags(_: Sdk.ListPolicyTagsCommandInput): Sdk.ListPolicyTagsCommandOutput;
  listPolicyVersions(_: Sdk.ListPolicyVersionsCommandInput): Sdk.ListPolicyVersionsCommandOutput;
  listRolePolicies(_: Sdk.ListRolePoliciesCommandInput): Sdk.ListRolePoliciesCommandOutput;
  listRoles(_: Sdk.ListRolesCommandInput): Sdk.ListRolesCommandOutput;
  listRoleTags(_: Sdk.ListRoleTagsCommandInput): Sdk.ListRoleTagsCommandOutput;
  listSAMLProviders(_: Sdk.ListSAMLProvidersCommandInput): Sdk.ListSAMLProvidersCommandOutput;
  listSAMLProviderTags(_: Sdk.ListSAMLProviderTagsCommandInput): Sdk.ListSAMLProviderTagsCommandOutput;
  listServerCertificates(_: Sdk.ListServerCertificatesCommandInput): Sdk.ListServerCertificatesCommandOutput;
  listServerCertificateTags(_: Sdk.ListServerCertificateTagsCommandInput): Sdk.ListServerCertificateTagsCommandOutput;
  listServiceSpecificCredentials(_: Sdk.ListServiceSpecificCredentialsCommandInput): Sdk.ListServiceSpecificCredentialsCommandOutput;
  listSigningCertificates(_: Sdk.ListSigningCertificatesCommandInput): Sdk.ListSigningCertificatesCommandOutput;
  listSSHPublicKeys(_: Sdk.ListSSHPublicKeysCommandInput): Sdk.ListSSHPublicKeysCommandOutput;
  listUserPolicies(_: Sdk.ListUserPoliciesCommandInput): Sdk.ListUserPoliciesCommandOutput;
  listUsers(_: Sdk.ListUsersCommandInput): Sdk.ListUsersCommandOutput;
  listUserTags(_: Sdk.ListUserTagsCommandInput): Sdk.ListUserTagsCommandOutput;
  listVirtualMFADevices(_: Sdk.ListVirtualMFADevicesCommandInput): Sdk.ListVirtualMFADevicesCommandOutput;
  putGroupPolicy(_: Sdk.PutGroupPolicyCommandInput): Sdk.PutGroupPolicyCommandOutput;
  putRolePermissionsBoundary(_: Sdk.PutRolePermissionsBoundaryCommandInput): Sdk.PutRolePermissionsBoundaryCommandOutput;
  putRolePolicy(_: Sdk.PutRolePolicyCommandInput): Sdk.PutRolePolicyCommandOutput;
  putUserPermissionsBoundary(_: Sdk.PutUserPermissionsBoundaryCommandInput): Sdk.PutUserPermissionsBoundaryCommandOutput;
  putUserPolicy(_: Sdk.PutUserPolicyCommandInput): Sdk.PutUserPolicyCommandOutput;
  removeClientIDFromOpenIDConnectProvider(_: Sdk.RemoveClientIDFromOpenIDConnectProviderCommandInput): Sdk.RemoveClientIDFromOpenIDConnectProviderCommandOutput;
  removeRoleFromInstanceProfile(_: Sdk.RemoveRoleFromInstanceProfileCommandInput): Sdk.RemoveRoleFromInstanceProfileCommandOutput;
  removeUserFromGroup(_: Sdk.RemoveUserFromGroupCommandInput): Sdk.RemoveUserFromGroupCommandOutput;
  resetServiceSpecificCredential(_: Sdk.ResetServiceSpecificCredentialCommandInput): Sdk.ResetServiceSpecificCredentialCommandOutput;
  resyncMFADevice(_: Sdk.ResyncMFADeviceCommandInput): Sdk.ResyncMFADeviceCommandOutput;
  setDefaultPolicyVersion(_: Sdk.SetDefaultPolicyVersionCommandInput): Sdk.SetDefaultPolicyVersionCommandOutput;
  setSecurityTokenServicePreferences(_: Sdk.SetSecurityTokenServicePreferencesCommandInput): Sdk.SetSecurityTokenServicePreferencesCommandOutput;
  simulateCustomPolicy(_: Sdk.SimulateCustomPolicyCommandInput): Sdk.SimulateCustomPolicyCommandOutput;
  simulatePrincipalPolicy(_: Sdk.SimulatePrincipalPolicyCommandInput): Sdk.SimulatePrincipalPolicyCommandOutput;
  tagInstanceProfile(_: Sdk.TagInstanceProfileCommandInput): Sdk.TagInstanceProfileCommandOutput;
  tagMFADevice(_: Sdk.TagMFADeviceCommandInput): Sdk.TagMFADeviceCommandOutput;
  tagOpenIDConnectProvider(_: Sdk.TagOpenIDConnectProviderCommandInput): Sdk.TagOpenIDConnectProviderCommandOutput;
  tagPolicy(_: Sdk.TagPolicyCommandInput): Sdk.TagPolicyCommandOutput;
  tagRole(_: Sdk.TagRoleCommandInput): Sdk.TagRoleCommandOutput;
  tagSAMLProvider(_: Sdk.TagSAMLProviderCommandInput): Sdk.TagSAMLProviderCommandOutput;
  tagServerCertificate(_: Sdk.TagServerCertificateCommandInput): Sdk.TagServerCertificateCommandOutput;
  tagUser(_: Sdk.TagUserCommandInput): Sdk.TagUserCommandOutput;
  untagInstanceProfile(_: Sdk.UntagInstanceProfileCommandInput): Sdk.UntagInstanceProfileCommandOutput;
  untagMFADevice(_: Sdk.UntagMFADeviceCommandInput): Sdk.UntagMFADeviceCommandOutput;
  untagOpenIDConnectProvider(_: Sdk.UntagOpenIDConnectProviderCommandInput): Sdk.UntagOpenIDConnectProviderCommandOutput;
  untagPolicy(_: Sdk.UntagPolicyCommandInput): Sdk.UntagPolicyCommandOutput;
  untagRole(_: Sdk.UntagRoleCommandInput): Sdk.UntagRoleCommandOutput;
  untagSAMLProvider(_: Sdk.UntagSAMLProviderCommandInput): Sdk.UntagSAMLProviderCommandOutput;
  untagServerCertificate(_: Sdk.UntagServerCertificateCommandInput): Sdk.UntagServerCertificateCommandOutput;
  untagUser(_: Sdk.UntagUserCommandInput): Sdk.UntagUserCommandOutput;
  updateAccessKey(_: Sdk.UpdateAccessKeyCommandInput): Sdk.UpdateAccessKeyCommandOutput;
  updateAccountPasswordPolicy(_: Sdk.UpdateAccountPasswordPolicyCommandInput): Sdk.UpdateAccountPasswordPolicyCommandOutput;
  updateAssumeRolePolicy(_: Sdk.UpdateAssumeRolePolicyCommandInput): Sdk.UpdateAssumeRolePolicyCommandOutput;
  updateGroup(_: Sdk.UpdateGroupCommandInput): Sdk.UpdateGroupCommandOutput;
  updateLoginProfile(_: Sdk.UpdateLoginProfileCommandInput): Sdk.UpdateLoginProfileCommandOutput;
  updateOpenIDConnectProviderThumbprint(_: Sdk.UpdateOpenIDConnectProviderThumbprintCommandInput): Sdk.UpdateOpenIDConnectProviderThumbprintCommandOutput;
  updateRole(_: Sdk.UpdateRoleCommandInput): Sdk.UpdateRoleCommandOutput;
  updateRoleDescription(_: Sdk.UpdateRoleDescriptionCommandInput): Sdk.UpdateRoleDescriptionCommandOutput;
  updateSAMLProvider(_: Sdk.UpdateSAMLProviderCommandInput): Sdk.UpdateSAMLProviderCommandOutput;
  updateServerCertificate(_: Sdk.UpdateServerCertificateCommandInput): Sdk.UpdateServerCertificateCommandOutput;
  updateServiceSpecificCredential(_: Sdk.UpdateServiceSpecificCredentialCommandInput): Sdk.UpdateServiceSpecificCredentialCommandOutput;
  updateSigningCertificate(_: Sdk.UpdateSigningCertificateCommandInput): Sdk.UpdateSigningCertificateCommandOutput;
  updateSSHPublicKey(_: Sdk.UpdateSSHPublicKeyCommandInput): Sdk.UpdateSSHPublicKeyCommandOutput;
  updateUser(_: Sdk.UpdateUserCommandInput): Sdk.UpdateUserCommandOutput;
  uploadServerCertificate(_: Sdk.UploadServerCertificateCommandInput): Sdk.UploadServerCertificateCommandOutput;
  uploadSigningCertificate(_: Sdk.UploadSigningCertificateCommandInput): Sdk.UploadSigningCertificateCommandOutput;
  uploadSSHPublicKey(_: Sdk.UploadSSHPublicKeyCommandInput): Sdk.UploadSSHPublicKeyCommandOutput;
}


const IamCommandFactory = {
  addClientIDToOpenIDConnectProvider: (_: Sdk.AddClientIDToOpenIDConnectProviderCommandInput) => new Sdk.AddClientIDToOpenIDConnectProviderCommand(_),
  addRoleToInstanceProfile: (_: Sdk.AddRoleToInstanceProfileCommandInput) => new Sdk.AddRoleToInstanceProfileCommand(_),
  addUserToGroup: (_: Sdk.AddUserToGroupCommandInput) => new Sdk.AddUserToGroupCommand(_),
  attachGroupPolicy: (_: Sdk.AttachGroupPolicyCommandInput) => new Sdk.AttachGroupPolicyCommand(_),
  attachRolePolicy: (_: Sdk.AttachRolePolicyCommandInput) => new Sdk.AttachRolePolicyCommand(_),
  attachUserPolicy: (_: Sdk.AttachUserPolicyCommandInput) => new Sdk.AttachUserPolicyCommand(_),
  changePassword: (_: Sdk.ChangePasswordCommandInput) => new Sdk.ChangePasswordCommand(_),
  createAccessKey: (_: Sdk.CreateAccessKeyCommandInput) => new Sdk.CreateAccessKeyCommand(_),
  createAccountAlias: (_: Sdk.CreateAccountAliasCommandInput) => new Sdk.CreateAccountAliasCommand(_),
  createGroup: (_: Sdk.CreateGroupCommandInput) => new Sdk.CreateGroupCommand(_),
  createInstanceProfile: (_: Sdk.CreateInstanceProfileCommandInput) => new Sdk.CreateInstanceProfileCommand(_),
  createLoginProfile: (_: Sdk.CreateLoginProfileCommandInput) => new Sdk.CreateLoginProfileCommand(_),
  createOpenIDConnectProvider: (_: Sdk.CreateOpenIDConnectProviderCommandInput) => new Sdk.CreateOpenIDConnectProviderCommand(_),
  createPolicy: (_: Sdk.CreatePolicyCommandInput) => new Sdk.CreatePolicyCommand(_),
  createPolicyVersion: (_: Sdk.CreatePolicyVersionCommandInput) => new Sdk.CreatePolicyVersionCommand(_),
  createRole: (_: Sdk.CreateRoleCommandInput) => new Sdk.CreateRoleCommand(_),
  createSAMLProvider: (_: Sdk.CreateSAMLProviderCommandInput) => new Sdk.CreateSAMLProviderCommand(_),
  createServiceLinkedRole: (_: Sdk.CreateServiceLinkedRoleCommandInput) => new Sdk.CreateServiceLinkedRoleCommand(_),
  createServiceSpecificCredential: (_: Sdk.CreateServiceSpecificCredentialCommandInput) => new Sdk.CreateServiceSpecificCredentialCommand(_),
  createUser: (_: Sdk.CreateUserCommandInput) => new Sdk.CreateUserCommand(_),
  createVirtualMFADevice: (_: Sdk.CreateVirtualMFADeviceCommandInput) => new Sdk.CreateVirtualMFADeviceCommand(_),
  deactivateMFADevice: (_: Sdk.DeactivateMFADeviceCommandInput) => new Sdk.DeactivateMFADeviceCommand(_),
  deleteAccessKey: (_: Sdk.DeleteAccessKeyCommandInput) => new Sdk.DeleteAccessKeyCommand(_),
  deleteAccountAlias: (_: Sdk.DeleteAccountAliasCommandInput) => new Sdk.DeleteAccountAliasCommand(_),
  deleteAccountPasswordPolicy: (_: Sdk.DeleteAccountPasswordPolicyCommandInput) => new Sdk.DeleteAccountPasswordPolicyCommand(_),
  deleteGroup: (_: Sdk.DeleteGroupCommandInput) => new Sdk.DeleteGroupCommand(_),
  deleteGroupPolicy: (_: Sdk.DeleteGroupPolicyCommandInput) => new Sdk.DeleteGroupPolicyCommand(_),
  deleteInstanceProfile: (_: Sdk.DeleteInstanceProfileCommandInput) => new Sdk.DeleteInstanceProfileCommand(_),
  deleteLoginProfile: (_: Sdk.DeleteLoginProfileCommandInput) => new Sdk.DeleteLoginProfileCommand(_),
  deleteOpenIDConnectProvider: (_: Sdk.DeleteOpenIDConnectProviderCommandInput) => new Sdk.DeleteOpenIDConnectProviderCommand(_),
  deletePolicy: (_: Sdk.DeletePolicyCommandInput) => new Sdk.DeletePolicyCommand(_),
  deletePolicyVersion: (_: Sdk.DeletePolicyVersionCommandInput) => new Sdk.DeletePolicyVersionCommand(_),
  deleteRole: (_: Sdk.DeleteRoleCommandInput) => new Sdk.DeleteRoleCommand(_),
  deleteRolePermissionsBoundary: (_: Sdk.DeleteRolePermissionsBoundaryCommandInput) => new Sdk.DeleteRolePermissionsBoundaryCommand(_),
  deleteRolePolicy: (_: Sdk.DeleteRolePolicyCommandInput) => new Sdk.DeleteRolePolicyCommand(_),
  deleteSAMLProvider: (_: Sdk.DeleteSAMLProviderCommandInput) => new Sdk.DeleteSAMLProviderCommand(_),
  deleteServerCertificate: (_: Sdk.DeleteServerCertificateCommandInput) => new Sdk.DeleteServerCertificateCommand(_),
  deleteServiceLinkedRole: (_: Sdk.DeleteServiceLinkedRoleCommandInput) => new Sdk.DeleteServiceLinkedRoleCommand(_),
  deleteServiceSpecificCredential: (_: Sdk.DeleteServiceSpecificCredentialCommandInput) => new Sdk.DeleteServiceSpecificCredentialCommand(_),
  deleteSigningCertificate: (_: Sdk.DeleteSigningCertificateCommandInput) => new Sdk.DeleteSigningCertificateCommand(_),
  deleteSSHPublicKey: (_: Sdk.DeleteSSHPublicKeyCommandInput) => new Sdk.DeleteSSHPublicKeyCommand(_),
  deleteUser: (_: Sdk.DeleteUserCommandInput) => new Sdk.DeleteUserCommand(_),
  deleteUserPermissionsBoundary: (_: Sdk.DeleteUserPermissionsBoundaryCommandInput) => new Sdk.DeleteUserPermissionsBoundaryCommand(_),
  deleteUserPolicy: (_: Sdk.DeleteUserPolicyCommandInput) => new Sdk.DeleteUserPolicyCommand(_),
  deleteVirtualMFADevice: (_: Sdk.DeleteVirtualMFADeviceCommandInput) => new Sdk.DeleteVirtualMFADeviceCommand(_),
  detachGroupPolicy: (_: Sdk.DetachGroupPolicyCommandInput) => new Sdk.DetachGroupPolicyCommand(_),
  detachRolePolicy: (_: Sdk.DetachRolePolicyCommandInput) => new Sdk.DetachRolePolicyCommand(_),
  detachUserPolicy: (_: Sdk.DetachUserPolicyCommandInput) => new Sdk.DetachUserPolicyCommand(_),
  disableOrganizationsRootCredentialsManagement: (_: Sdk.DisableOrganizationsRootCredentialsManagementCommandInput) => new Sdk.DisableOrganizationsRootCredentialsManagementCommand(_),
  disableOrganizationsRootSessions: (_: Sdk.DisableOrganizationsRootSessionsCommandInput) => new Sdk.DisableOrganizationsRootSessionsCommand(_),
  enableMFADevice: (_: Sdk.EnableMFADeviceCommandInput) => new Sdk.EnableMFADeviceCommand(_),
  enableOrganizationsRootCredentialsManagement: (_: Sdk.EnableOrganizationsRootCredentialsManagementCommandInput) => new Sdk.EnableOrganizationsRootCredentialsManagementCommand(_),
  enableOrganizationsRootSessions: (_: Sdk.EnableOrganizationsRootSessionsCommandInput) => new Sdk.EnableOrganizationsRootSessionsCommand(_),
  generateCredentialReport: (_: Sdk.GenerateCredentialReportCommandInput) => new Sdk.GenerateCredentialReportCommand(_),
  generateOrganizationsAccessReport: (_: Sdk.GenerateOrganizationsAccessReportCommandInput) => new Sdk.GenerateOrganizationsAccessReportCommand(_),
  generateServiceLastAccessedDetails: (_: Sdk.GenerateServiceLastAccessedDetailsCommandInput) => new Sdk.GenerateServiceLastAccessedDetailsCommand(_),
  getAccessKeyLastUsed: (_: Sdk.GetAccessKeyLastUsedCommandInput) => new Sdk.GetAccessKeyLastUsedCommand(_),
  getAccountAuthorizationDetails: (_: Sdk.GetAccountAuthorizationDetailsCommandInput) => new Sdk.GetAccountAuthorizationDetailsCommand(_),
  getAccountPasswordPolicy: (_: Sdk.GetAccountPasswordPolicyCommandInput) => new Sdk.GetAccountPasswordPolicyCommand(_),
  getAccountSummary: (_: Sdk.GetAccountSummaryCommandInput) => new Sdk.GetAccountSummaryCommand(_),
  getContextKeysForCustomPolicy: (_: Sdk.GetContextKeysForCustomPolicyCommandInput) => new Sdk.GetContextKeysForCustomPolicyCommand(_),
  getContextKeysForPrincipalPolicy: (_: Sdk.GetContextKeysForPrincipalPolicyCommandInput) => new Sdk.GetContextKeysForPrincipalPolicyCommand(_),
  getCredentialReport: (_: Sdk.GetCredentialReportCommandInput) => new Sdk.GetCredentialReportCommand(_),
  getGroup: (_: Sdk.GetGroupCommandInput) => new Sdk.GetGroupCommand(_),
  getGroupPolicy: (_: Sdk.GetGroupPolicyCommandInput) => new Sdk.GetGroupPolicyCommand(_),
  getInstanceProfile: (_: Sdk.GetInstanceProfileCommandInput) => new Sdk.GetInstanceProfileCommand(_),
  getLoginProfile: (_: Sdk.GetLoginProfileCommandInput) => new Sdk.GetLoginProfileCommand(_),
  getMFADevice: (_: Sdk.GetMFADeviceCommandInput) => new Sdk.GetMFADeviceCommand(_),
  getOpenIDConnectProvider: (_: Sdk.GetOpenIDConnectProviderCommandInput) => new Sdk.GetOpenIDConnectProviderCommand(_),
  getOrganizationsAccessReport: (_: Sdk.GetOrganizationsAccessReportCommandInput) => new Sdk.GetOrganizationsAccessReportCommand(_),
  getPolicy: (_: Sdk.GetPolicyCommandInput) => new Sdk.GetPolicyCommand(_),
  getPolicyVersion: (_: Sdk.GetPolicyVersionCommandInput) => new Sdk.GetPolicyVersionCommand(_),
  getRole: (_: Sdk.GetRoleCommandInput) => new Sdk.GetRoleCommand(_),
  getRolePolicy: (_: Sdk.GetRolePolicyCommandInput) => new Sdk.GetRolePolicyCommand(_),
  getSAMLProvider: (_: Sdk.GetSAMLProviderCommandInput) => new Sdk.GetSAMLProviderCommand(_),
  getServerCertificate: (_: Sdk.GetServerCertificateCommandInput) => new Sdk.GetServerCertificateCommand(_),
  getServiceLastAccessedDetails: (_: Sdk.GetServiceLastAccessedDetailsCommandInput) => new Sdk.GetServiceLastAccessedDetailsCommand(_),
  getServiceLastAccessedDetailsWithEntities: (_: Sdk.GetServiceLastAccessedDetailsWithEntitiesCommandInput) => new Sdk.GetServiceLastAccessedDetailsWithEntitiesCommand(_),
  getServiceLinkedRoleDeletionStatus: (_: Sdk.GetServiceLinkedRoleDeletionStatusCommandInput) => new Sdk.GetServiceLinkedRoleDeletionStatusCommand(_),
  getSSHPublicKey: (_: Sdk.GetSSHPublicKeyCommandInput) => new Sdk.GetSSHPublicKeyCommand(_),
  getUser: (_: Sdk.GetUserCommandInput) => new Sdk.GetUserCommand(_),
  getUserPolicy: (_: Sdk.GetUserPolicyCommandInput) => new Sdk.GetUserPolicyCommand(_),
  listAccessKeys: (_: Sdk.ListAccessKeysCommandInput) => new Sdk.ListAccessKeysCommand(_),
  listAccountAliases: (_: Sdk.ListAccountAliasesCommandInput) => new Sdk.ListAccountAliasesCommand(_),
  listAttachedGroupPolicies: (_: Sdk.ListAttachedGroupPoliciesCommandInput) => new Sdk.ListAttachedGroupPoliciesCommand(_),
  listAttachedRolePolicies: (_: Sdk.ListAttachedRolePoliciesCommandInput) => new Sdk.ListAttachedRolePoliciesCommand(_),
  listAttachedUserPolicies: (_: Sdk.ListAttachedUserPoliciesCommandInput) => new Sdk.ListAttachedUserPoliciesCommand(_),
  listEntitiesForPolicy: (_: Sdk.ListEntitiesForPolicyCommandInput) => new Sdk.ListEntitiesForPolicyCommand(_),
  listGroupPolicies: (_: Sdk.ListGroupPoliciesCommandInput) => new Sdk.ListGroupPoliciesCommand(_),
  listGroups: (_: Sdk.ListGroupsCommandInput) => new Sdk.ListGroupsCommand(_),
  listGroupsForUser: (_: Sdk.ListGroupsForUserCommandInput) => new Sdk.ListGroupsForUserCommand(_),
  listInstanceProfiles: (_: Sdk.ListInstanceProfilesCommandInput) => new Sdk.ListInstanceProfilesCommand(_),
  listInstanceProfilesForRole: (_: Sdk.ListInstanceProfilesForRoleCommandInput) => new Sdk.ListInstanceProfilesForRoleCommand(_),
  listInstanceProfileTags: (_: Sdk.ListInstanceProfileTagsCommandInput) => new Sdk.ListInstanceProfileTagsCommand(_),
  listMFADevices: (_: Sdk.ListMFADevicesCommandInput) => new Sdk.ListMFADevicesCommand(_),
  listMFADeviceTags: (_: Sdk.ListMFADeviceTagsCommandInput) => new Sdk.ListMFADeviceTagsCommand(_),
  listOpenIDConnectProviders: (_: Sdk.ListOpenIDConnectProvidersCommandInput) => new Sdk.ListOpenIDConnectProvidersCommand(_),
  listOpenIDConnectProviderTags: (_: Sdk.ListOpenIDConnectProviderTagsCommandInput) => new Sdk.ListOpenIDConnectProviderTagsCommand(_),
  listOrganizationsFeatures: (_: Sdk.ListOrganizationsFeaturesCommandInput) => new Sdk.ListOrganizationsFeaturesCommand(_),
  listPolicies: (_: Sdk.ListPoliciesCommandInput) => new Sdk.ListPoliciesCommand(_),
  listPoliciesGrantingServiceAccess: (_: Sdk.ListPoliciesGrantingServiceAccessCommandInput) => new Sdk.ListPoliciesGrantingServiceAccessCommand(_),
  listPolicyTags: (_: Sdk.ListPolicyTagsCommandInput) => new Sdk.ListPolicyTagsCommand(_),
  listPolicyVersions: (_: Sdk.ListPolicyVersionsCommandInput) => new Sdk.ListPolicyVersionsCommand(_),
  listRolePolicies: (_: Sdk.ListRolePoliciesCommandInput) => new Sdk.ListRolePoliciesCommand(_),
  listRoles: (_: Sdk.ListRolesCommandInput) => new Sdk.ListRolesCommand(_),
  listRoleTags: (_: Sdk.ListRoleTagsCommandInput) => new Sdk.ListRoleTagsCommand(_),
  listSAMLProviders: (_: Sdk.ListSAMLProvidersCommandInput) => new Sdk.ListSAMLProvidersCommand(_),
  listSAMLProviderTags: (_: Sdk.ListSAMLProviderTagsCommandInput) => new Sdk.ListSAMLProviderTagsCommand(_),
  listServerCertificates: (_: Sdk.ListServerCertificatesCommandInput) => new Sdk.ListServerCertificatesCommand(_),
  listServerCertificateTags: (_: Sdk.ListServerCertificateTagsCommandInput) => new Sdk.ListServerCertificateTagsCommand(_),
  listServiceSpecificCredentials: (_: Sdk.ListServiceSpecificCredentialsCommandInput) => new Sdk.ListServiceSpecificCredentialsCommand(_),
  listSigningCertificates: (_: Sdk.ListSigningCertificatesCommandInput) => new Sdk.ListSigningCertificatesCommand(_),
  listSSHPublicKeys: (_: Sdk.ListSSHPublicKeysCommandInput) => new Sdk.ListSSHPublicKeysCommand(_),
  listUserPolicies: (_: Sdk.ListUserPoliciesCommandInput) => new Sdk.ListUserPoliciesCommand(_),
  listUsers: (_: Sdk.ListUsersCommandInput) => new Sdk.ListUsersCommand(_),
  listUserTags: (_: Sdk.ListUserTagsCommandInput) => new Sdk.ListUserTagsCommand(_),
  listVirtualMFADevices: (_: Sdk.ListVirtualMFADevicesCommandInput) => new Sdk.ListVirtualMFADevicesCommand(_),
  putGroupPolicy: (_: Sdk.PutGroupPolicyCommandInput) => new Sdk.PutGroupPolicyCommand(_),
  putRolePermissionsBoundary: (_: Sdk.PutRolePermissionsBoundaryCommandInput) => new Sdk.PutRolePermissionsBoundaryCommand(_),
  putRolePolicy: (_: Sdk.PutRolePolicyCommandInput) => new Sdk.PutRolePolicyCommand(_),
  putUserPermissionsBoundary: (_: Sdk.PutUserPermissionsBoundaryCommandInput) => new Sdk.PutUserPermissionsBoundaryCommand(_),
  putUserPolicy: (_: Sdk.PutUserPolicyCommandInput) => new Sdk.PutUserPolicyCommand(_),
  removeClientIDFromOpenIDConnectProvider: (_: Sdk.RemoveClientIDFromOpenIDConnectProviderCommandInput) => new Sdk.RemoveClientIDFromOpenIDConnectProviderCommand(_),
  removeRoleFromInstanceProfile: (_: Sdk.RemoveRoleFromInstanceProfileCommandInput) => new Sdk.RemoveRoleFromInstanceProfileCommand(_),
  removeUserFromGroup: (_: Sdk.RemoveUserFromGroupCommandInput) => new Sdk.RemoveUserFromGroupCommand(_),
  resetServiceSpecificCredential: (_: Sdk.ResetServiceSpecificCredentialCommandInput) => new Sdk.ResetServiceSpecificCredentialCommand(_),
  resyncMFADevice: (_: Sdk.ResyncMFADeviceCommandInput) => new Sdk.ResyncMFADeviceCommand(_),
  setDefaultPolicyVersion: (_: Sdk.SetDefaultPolicyVersionCommandInput) => new Sdk.SetDefaultPolicyVersionCommand(_),
  setSecurityTokenServicePreferences: (_: Sdk.SetSecurityTokenServicePreferencesCommandInput) => new Sdk.SetSecurityTokenServicePreferencesCommand(_),
  simulateCustomPolicy: (_: Sdk.SimulateCustomPolicyCommandInput) => new Sdk.SimulateCustomPolicyCommand(_),
  simulatePrincipalPolicy: (_: Sdk.SimulatePrincipalPolicyCommandInput) => new Sdk.SimulatePrincipalPolicyCommand(_),
  tagInstanceProfile: (_: Sdk.TagInstanceProfileCommandInput) => new Sdk.TagInstanceProfileCommand(_),
  tagMFADevice: (_: Sdk.TagMFADeviceCommandInput) => new Sdk.TagMFADeviceCommand(_),
  tagOpenIDConnectProvider: (_: Sdk.TagOpenIDConnectProviderCommandInput) => new Sdk.TagOpenIDConnectProviderCommand(_),
  tagPolicy: (_: Sdk.TagPolicyCommandInput) => new Sdk.TagPolicyCommand(_),
  tagRole: (_: Sdk.TagRoleCommandInput) => new Sdk.TagRoleCommand(_),
  tagSAMLProvider: (_: Sdk.TagSAMLProviderCommandInput) => new Sdk.TagSAMLProviderCommand(_),
  tagServerCertificate: (_: Sdk.TagServerCertificateCommandInput) => new Sdk.TagServerCertificateCommand(_),
  tagUser: (_: Sdk.TagUserCommandInput) => new Sdk.TagUserCommand(_),
  untagInstanceProfile: (_: Sdk.UntagInstanceProfileCommandInput) => new Sdk.UntagInstanceProfileCommand(_),
  untagMFADevice: (_: Sdk.UntagMFADeviceCommandInput) => new Sdk.UntagMFADeviceCommand(_),
  untagOpenIDConnectProvider: (_: Sdk.UntagOpenIDConnectProviderCommandInput) => new Sdk.UntagOpenIDConnectProviderCommand(_),
  untagPolicy: (_: Sdk.UntagPolicyCommandInput) => new Sdk.UntagPolicyCommand(_),
  untagRole: (_: Sdk.UntagRoleCommandInput) => new Sdk.UntagRoleCommand(_),
  untagSAMLProvider: (_: Sdk.UntagSAMLProviderCommandInput) => new Sdk.UntagSAMLProviderCommand(_),
  untagServerCertificate: (_: Sdk.UntagServerCertificateCommandInput) => new Sdk.UntagServerCertificateCommand(_),
  untagUser: (_: Sdk.UntagUserCommandInput) => new Sdk.UntagUserCommand(_),
  updateAccessKey: (_: Sdk.UpdateAccessKeyCommandInput) => new Sdk.UpdateAccessKeyCommand(_),
  updateAccountPasswordPolicy: (_: Sdk.UpdateAccountPasswordPolicyCommandInput) => new Sdk.UpdateAccountPasswordPolicyCommand(_),
  updateAssumeRolePolicy: (_: Sdk.UpdateAssumeRolePolicyCommandInput) => new Sdk.UpdateAssumeRolePolicyCommand(_),
  updateGroup: (_: Sdk.UpdateGroupCommandInput) => new Sdk.UpdateGroupCommand(_),
  updateLoginProfile: (_: Sdk.UpdateLoginProfileCommandInput) => new Sdk.UpdateLoginProfileCommand(_),
  updateOpenIDConnectProviderThumbprint: (_: Sdk.UpdateOpenIDConnectProviderThumbprintCommandInput) => new Sdk.UpdateOpenIDConnectProviderThumbprintCommand(_),
  updateRole: (_: Sdk.UpdateRoleCommandInput) => new Sdk.UpdateRoleCommand(_),
  updateRoleDescription: (_: Sdk.UpdateRoleDescriptionCommandInput) => new Sdk.UpdateRoleDescriptionCommand(_),
  updateSAMLProvider: (_: Sdk.UpdateSAMLProviderCommandInput) => new Sdk.UpdateSAMLProviderCommand(_),
  updateServerCertificate: (_: Sdk.UpdateServerCertificateCommandInput) => new Sdk.UpdateServerCertificateCommand(_),
  updateServiceSpecificCredential: (_: Sdk.UpdateServiceSpecificCredentialCommandInput) => new Sdk.UpdateServiceSpecificCredentialCommand(_),
  updateSigningCertificate: (_: Sdk.UpdateSigningCertificateCommandInput) => new Sdk.UpdateSigningCertificateCommand(_),
  updateSSHPublicKey: (_: Sdk.UpdateSSHPublicKeyCommandInput) => new Sdk.UpdateSSHPublicKeyCommand(_),
  updateUser: (_: Sdk.UpdateUserCommandInput) => new Sdk.UpdateUserCommand(_),
  uploadServerCertificate: (_: Sdk.UploadServerCertificateCommandInput) => new Sdk.UploadServerCertificateCommand(_),
  uploadSigningCertificate: (_: Sdk.UploadSigningCertificateCommandInput) => new Sdk.UploadSigningCertificateCommand(_),
  uploadSSHPublicKey: (_: Sdk.UploadSSHPublicKeyCommandInput) => new Sdk.UploadSSHPublicKeyCommand(_),
} as Record<keyof IamClientApi, (_: unknown) => unknown>


const IamExceptionNames = [
  "IAMServiceException", "AccountNotManagementOrDelegatedAdministratorException", "InvalidInputException",
  "LimitExceededException", "NoSuchEntityException", "ServiceFailureException",
  "EntityAlreadyExistsException", "UnmodifiableEntityException", "PolicyNotAttachableException",
  "EntityTemporarilyUnmodifiableException", "InvalidUserTypeException", "PasswordPolicyViolationException",
  "ConcurrentModificationException", "OpenIdIdpCommunicationErrorException", "MalformedPolicyDocumentException",
  "ServiceNotSupportedException", "DeleteConflictException", "OrganizationNotFoundException",
  "OrganizationNotInAllFeaturesModeException", "ServiceAccessNotEnabledException", "InvalidAuthenticationCodeException",
  "CallerIsNotManagementAccountException", "ReportGenerationLimitExceededException", "CredentialReportExpiredException",
  "CredentialReportNotPresentException", "CredentialReportNotReadyException", "UnrecognizedPublicKeyEncodingException",
  "PolicyEvaluationException", "KeyPairMismatchException", "MalformedCertificateException",
  "DuplicateCertificateException", "InvalidCertificateException", "DuplicateSSHPublicKeyException",
  "InvalidPublicKeyException",
] as const;

export type IamExceptionName = typeof IamExceptionNames[number];

export class IamClientException extends Data.TaggedError("IamClientException")<
  {
    name: IamExceptionName;
    cause: Sdk.IAMServiceException
  }
> { } {
}

export function recoverFromIamException<A, A2, E>(name: IamExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, IamClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "IamClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
