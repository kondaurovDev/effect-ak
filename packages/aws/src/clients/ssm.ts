import * as Sdk from "@aws-sdk/client-ssm";
import { Effect, Data, pipe, Cause, Context, Option } from "effect";

// *****  GENERATED CODE *****
export class SsmClientServiceConfig extends Context.Tag("SsmClientServiceConfig")<SsmClientServiceConfig, Sdk.SSMClientConfig>() {
}

export class SsmClientService extends
  Effect.Service<SsmClientService>()("SsmClientService", {
    scoped: Effect.gen(function*() {

      const config =
        yield* pipe(
          Effect.serviceOption(SsmClientServiceConfig),
          Effect.tap(config =>
            Effect.logDebug("Creating aws client", {
              "name": "Ssm",
              "isDefaultConfig": Option.isNone(config)
            })
          ),
          Effect.andThen(
            Option.getOrUndefined
          )
        );

      const client = new Sdk.SSMClient(config ?? {});

      yield* Effect.addFinalizer(() =>
        pipe(
          Effect.try(() => client.destroy()),
          Effect.tapBoth({
            onFailure: Effect.logWarning,
            onSuccess: () => Effect.logDebug("aws client has been closed", { client: "Ssm" })
          }),
          Effect.merge
        )
      );

      const execute = <M extends keyof SsmClientApi>(
        name: M,
        input: Parameters<SsmClientApi[M]>[0]
      ) =>
        pipe(
          Effect.succeed(SsmCommandFactory[name](input)),
          Effect.filterOrDieMessage(_ => _ != null, `Command "${name}" is unknown`),
          Effect.tap(Effect.logDebug(`executing '${name}'`, input)),
          Effect.andThen(input =>
            Effect.tryPromise(() => client.send(input as any) as Promise<ReturnType<SsmClientApi[M]>>)
          ),
          Effect.mapError(error =>
            error.cause instanceof Sdk.SSMServiceException ?
              new SsmClientException({
                name: error.cause.name as SsmExceptionName,
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

export type SsmMethodInput<M extends keyof SsmClientApi> = Parameters<SsmClientApi[M]>[0];

export interface SsmClientApi {
  addTagsToResource(_: Sdk.AddTagsToResourceCommandInput): Sdk.AddTagsToResourceCommandOutput;
  associateOpsItemRelatedItem(_: Sdk.AssociateOpsItemRelatedItemCommandInput): Sdk.AssociateOpsItemRelatedItemCommandOutput;
  cancelCommand(_: Sdk.CancelCommandCommandInput): Sdk.CancelCommandCommandOutput;
  cancelMaintenanceWindowExecution(_: Sdk.CancelMaintenanceWindowExecutionCommandInput): Sdk.CancelMaintenanceWindowExecutionCommandOutput;
  createActivation(_: Sdk.CreateActivationCommandInput): Sdk.CreateActivationCommandOutput;
  createAssociationBatch(_: Sdk.CreateAssociationBatchCommandInput): Sdk.CreateAssociationBatchCommandOutput;
  createAssociation(_: Sdk.CreateAssociationCommandInput): Sdk.CreateAssociationCommandOutput;
  createDocument(_: Sdk.CreateDocumentCommandInput): Sdk.CreateDocumentCommandOutput;
  createMaintenanceWindow(_: Sdk.CreateMaintenanceWindowCommandInput): Sdk.CreateMaintenanceWindowCommandOutput;
  createOpsItem(_: Sdk.CreateOpsItemCommandInput): Sdk.CreateOpsItemCommandOutput;
  createOpsMetadata(_: Sdk.CreateOpsMetadataCommandInput): Sdk.CreateOpsMetadataCommandOutput;
  createPatchBaseline(_: Sdk.CreatePatchBaselineCommandInput): Sdk.CreatePatchBaselineCommandOutput;
  createResourceDataSync(_: Sdk.CreateResourceDataSyncCommandInput): Sdk.CreateResourceDataSyncCommandOutput;
  deleteActivation(_: Sdk.DeleteActivationCommandInput): Sdk.DeleteActivationCommandOutput;
  deleteAssociation(_: Sdk.DeleteAssociationCommandInput): Sdk.DeleteAssociationCommandOutput;
  deleteDocument(_: Sdk.DeleteDocumentCommandInput): Sdk.DeleteDocumentCommandOutput;
  deleteInventory(_: Sdk.DeleteInventoryCommandInput): Sdk.DeleteInventoryCommandOutput;
  deleteMaintenanceWindow(_: Sdk.DeleteMaintenanceWindowCommandInput): Sdk.DeleteMaintenanceWindowCommandOutput;
  deleteOpsItem(_: Sdk.DeleteOpsItemCommandInput): Sdk.DeleteOpsItemCommandOutput;
  deleteOpsMetadata(_: Sdk.DeleteOpsMetadataCommandInput): Sdk.DeleteOpsMetadataCommandOutput;
  deleteParameter(_: Sdk.DeleteParameterCommandInput): Sdk.DeleteParameterCommandOutput;
  deleteParameters(_: Sdk.DeleteParametersCommandInput): Sdk.DeleteParametersCommandOutput;
  deletePatchBaseline(_: Sdk.DeletePatchBaselineCommandInput): Sdk.DeletePatchBaselineCommandOutput;
  deleteResourceDataSync(_: Sdk.DeleteResourceDataSyncCommandInput): Sdk.DeleteResourceDataSyncCommandOutput;
  deleteResourcePolicy(_: Sdk.DeleteResourcePolicyCommandInput): Sdk.DeleteResourcePolicyCommandOutput;
  deregisterManagedInstance(_: Sdk.DeregisterManagedInstanceCommandInput): Sdk.DeregisterManagedInstanceCommandOutput;
  deregisterPatchBaselineForPatchGroup(_: Sdk.DeregisterPatchBaselineForPatchGroupCommandInput): Sdk.DeregisterPatchBaselineForPatchGroupCommandOutput;
  deregisterTargetFromMaintenanceWindow(_: Sdk.DeregisterTargetFromMaintenanceWindowCommandInput): Sdk.DeregisterTargetFromMaintenanceWindowCommandOutput;
  deregisterTaskFromMaintenanceWindow(_: Sdk.DeregisterTaskFromMaintenanceWindowCommandInput): Sdk.DeregisterTaskFromMaintenanceWindowCommandOutput;
  describeActivations(_: Sdk.DescribeActivationsCommandInput): Sdk.DescribeActivationsCommandOutput;
  describeAssociation(_: Sdk.DescribeAssociationCommandInput): Sdk.DescribeAssociationCommandOutput;
  describeAssociationExecutions(_: Sdk.DescribeAssociationExecutionsCommandInput): Sdk.DescribeAssociationExecutionsCommandOutput;
  describeAssociationExecutionTargets(_: Sdk.DescribeAssociationExecutionTargetsCommandInput): Sdk.DescribeAssociationExecutionTargetsCommandOutput;
  describeAutomationExecutions(_: Sdk.DescribeAutomationExecutionsCommandInput): Sdk.DescribeAutomationExecutionsCommandOutput;
  describeAutomationStepExecutions(_: Sdk.DescribeAutomationStepExecutionsCommandInput): Sdk.DescribeAutomationStepExecutionsCommandOutput;
  describeAvailablePatches(_: Sdk.DescribeAvailablePatchesCommandInput): Sdk.DescribeAvailablePatchesCommandOutput;
  describeDocument(_: Sdk.DescribeDocumentCommandInput): Sdk.DescribeDocumentCommandOutput;
  describeDocumentPermission(_: Sdk.DescribeDocumentPermissionCommandInput): Sdk.DescribeDocumentPermissionCommandOutput;
  describeEffectiveInstanceAssociations(_: Sdk.DescribeEffectiveInstanceAssociationsCommandInput): Sdk.DescribeEffectiveInstanceAssociationsCommandOutput;
  describeEffectivePatchesForPatchBaseline(_: Sdk.DescribeEffectivePatchesForPatchBaselineCommandInput): Sdk.DescribeEffectivePatchesForPatchBaselineCommandOutput;
  describeInstanceAssociationsStatus(_: Sdk.DescribeInstanceAssociationsStatusCommandInput): Sdk.DescribeInstanceAssociationsStatusCommandOutput;
  describeInstanceInformation(_: Sdk.DescribeInstanceInformationCommandInput): Sdk.DescribeInstanceInformationCommandOutput;
  describeInstancePatches(_: Sdk.DescribeInstancePatchesCommandInput): Sdk.DescribeInstancePatchesCommandOutput;
  describeInstancePatchStates(_: Sdk.DescribeInstancePatchStatesCommandInput): Sdk.DescribeInstancePatchStatesCommandOutput;
  describeInstancePatchStatesForPatchGroup(_: Sdk.DescribeInstancePatchStatesForPatchGroupCommandInput): Sdk.DescribeInstancePatchStatesForPatchGroupCommandOutput;
  describeInstanceProperties(_: Sdk.DescribeInstancePropertiesCommandInput): Sdk.DescribeInstancePropertiesCommandOutput;
  describeInventoryDeletions(_: Sdk.DescribeInventoryDeletionsCommandInput): Sdk.DescribeInventoryDeletionsCommandOutput;
  describeMaintenanceWindowExecutions(_: Sdk.DescribeMaintenanceWindowExecutionsCommandInput): Sdk.DescribeMaintenanceWindowExecutionsCommandOutput;
  describeMaintenanceWindowExecutionTaskInvocations(_: Sdk.DescribeMaintenanceWindowExecutionTaskInvocationsCommandInput): Sdk.DescribeMaintenanceWindowExecutionTaskInvocationsCommandOutput;
  describeMaintenanceWindowExecutionTasks(_: Sdk.DescribeMaintenanceWindowExecutionTasksCommandInput): Sdk.DescribeMaintenanceWindowExecutionTasksCommandOutput;
  describeMaintenanceWindowSchedule(_: Sdk.DescribeMaintenanceWindowScheduleCommandInput): Sdk.DescribeMaintenanceWindowScheduleCommandOutput;
  describeMaintenanceWindows(_: Sdk.DescribeMaintenanceWindowsCommandInput): Sdk.DescribeMaintenanceWindowsCommandOutput;
  describeMaintenanceWindowsForTarget(_: Sdk.DescribeMaintenanceWindowsForTargetCommandInput): Sdk.DescribeMaintenanceWindowsForTargetCommandOutput;
  describeMaintenanceWindowTargets(_: Sdk.DescribeMaintenanceWindowTargetsCommandInput): Sdk.DescribeMaintenanceWindowTargetsCommandOutput;
  describeMaintenanceWindowTasks(_: Sdk.DescribeMaintenanceWindowTasksCommandInput): Sdk.DescribeMaintenanceWindowTasksCommandOutput;
  describeOpsItems(_: Sdk.DescribeOpsItemsCommandInput): Sdk.DescribeOpsItemsCommandOutput;
  describeParameters(_: Sdk.DescribeParametersCommandInput): Sdk.DescribeParametersCommandOutput;
  describePatchBaselines(_: Sdk.DescribePatchBaselinesCommandInput): Sdk.DescribePatchBaselinesCommandOutput;
  describePatchGroups(_: Sdk.DescribePatchGroupsCommandInput): Sdk.DescribePatchGroupsCommandOutput;
  describePatchGroupState(_: Sdk.DescribePatchGroupStateCommandInput): Sdk.DescribePatchGroupStateCommandOutput;
  describePatchProperties(_: Sdk.DescribePatchPropertiesCommandInput): Sdk.DescribePatchPropertiesCommandOutput;
  describeSessions(_: Sdk.DescribeSessionsCommandInput): Sdk.DescribeSessionsCommandOutput;
  disassociateOpsItemRelatedItem(_: Sdk.DisassociateOpsItemRelatedItemCommandInput): Sdk.DisassociateOpsItemRelatedItemCommandOutput;
  getAutomationExecution(_: Sdk.GetAutomationExecutionCommandInput): Sdk.GetAutomationExecutionCommandOutput;
  getCalendarState(_: Sdk.GetCalendarStateCommandInput): Sdk.GetCalendarStateCommandOutput;
  getCommandInvocation(_: Sdk.GetCommandInvocationCommandInput): Sdk.GetCommandInvocationCommandOutput;
  getConnectionStatus(_: Sdk.GetConnectionStatusCommandInput): Sdk.GetConnectionStatusCommandOutput;
  getDefaultPatchBaseline(_: Sdk.GetDefaultPatchBaselineCommandInput): Sdk.GetDefaultPatchBaselineCommandOutput;
  getDeployablePatchSnapshotForInstance(_: Sdk.GetDeployablePatchSnapshotForInstanceCommandInput): Sdk.GetDeployablePatchSnapshotForInstanceCommandOutput;
  getDocument(_: Sdk.GetDocumentCommandInput): Sdk.GetDocumentCommandOutput;
  getExecutionPreview(_: Sdk.GetExecutionPreviewCommandInput): Sdk.GetExecutionPreviewCommandOutput;
  getInventory(_: Sdk.GetInventoryCommandInput): Sdk.GetInventoryCommandOutput;
  getInventorySchema(_: Sdk.GetInventorySchemaCommandInput): Sdk.GetInventorySchemaCommandOutput;
  getMaintenanceWindow(_: Sdk.GetMaintenanceWindowCommandInput): Sdk.GetMaintenanceWindowCommandOutput;
  getMaintenanceWindowExecution(_: Sdk.GetMaintenanceWindowExecutionCommandInput): Sdk.GetMaintenanceWindowExecutionCommandOutput;
  getMaintenanceWindowExecutionTask(_: Sdk.GetMaintenanceWindowExecutionTaskCommandInput): Sdk.GetMaintenanceWindowExecutionTaskCommandOutput;
  getMaintenanceWindowExecutionTaskInvocation(_: Sdk.GetMaintenanceWindowExecutionTaskInvocationCommandInput): Sdk.GetMaintenanceWindowExecutionTaskInvocationCommandOutput;
  getMaintenanceWindowTask(_: Sdk.GetMaintenanceWindowTaskCommandInput): Sdk.GetMaintenanceWindowTaskCommandOutput;
  getOpsItem(_: Sdk.GetOpsItemCommandInput): Sdk.GetOpsItemCommandOutput;
  getOpsMetadata(_: Sdk.GetOpsMetadataCommandInput): Sdk.GetOpsMetadataCommandOutput;
  getOpsSummary(_: Sdk.GetOpsSummaryCommandInput): Sdk.GetOpsSummaryCommandOutput;
  getParameter(_: Sdk.GetParameterCommandInput): Sdk.GetParameterCommandOutput;
  getParameterHistory(_: Sdk.GetParameterHistoryCommandInput): Sdk.GetParameterHistoryCommandOutput;
  getParametersByPath(_: Sdk.GetParametersByPathCommandInput): Sdk.GetParametersByPathCommandOutput;
  getParameters(_: Sdk.GetParametersCommandInput): Sdk.GetParametersCommandOutput;
  getPatchBaseline(_: Sdk.GetPatchBaselineCommandInput): Sdk.GetPatchBaselineCommandOutput;
  getPatchBaselineForPatchGroup(_: Sdk.GetPatchBaselineForPatchGroupCommandInput): Sdk.GetPatchBaselineForPatchGroupCommandOutput;
  getResourcePolicies(_: Sdk.GetResourcePoliciesCommandInput): Sdk.GetResourcePoliciesCommandOutput;
  getServiceSetting(_: Sdk.GetServiceSettingCommandInput): Sdk.GetServiceSettingCommandOutput;
  labelParameterVersion(_: Sdk.LabelParameterVersionCommandInput): Sdk.LabelParameterVersionCommandOutput;
  listAssociations(_: Sdk.ListAssociationsCommandInput): Sdk.ListAssociationsCommandOutput;
  listAssociationVersions(_: Sdk.ListAssociationVersionsCommandInput): Sdk.ListAssociationVersionsCommandOutput;
  listCommandInvocations(_: Sdk.ListCommandInvocationsCommandInput): Sdk.ListCommandInvocationsCommandOutput;
  listCommands(_: Sdk.ListCommandsCommandInput): Sdk.ListCommandsCommandOutput;
  listComplianceItems(_: Sdk.ListComplianceItemsCommandInput): Sdk.ListComplianceItemsCommandOutput;
  listComplianceSummaries(_: Sdk.ListComplianceSummariesCommandInput): Sdk.ListComplianceSummariesCommandOutput;
  listDocumentMetadataHistory(_: Sdk.ListDocumentMetadataHistoryCommandInput): Sdk.ListDocumentMetadataHistoryCommandOutput;
  listDocuments(_: Sdk.ListDocumentsCommandInput): Sdk.ListDocumentsCommandOutput;
  listDocumentVersions(_: Sdk.ListDocumentVersionsCommandInput): Sdk.ListDocumentVersionsCommandOutput;
  listInventoryEntries(_: Sdk.ListInventoryEntriesCommandInput): Sdk.ListInventoryEntriesCommandOutput;
  listNodes(_: Sdk.ListNodesCommandInput): Sdk.ListNodesCommandOutput;
  listNodesSummary(_: Sdk.ListNodesSummaryCommandInput): Sdk.ListNodesSummaryCommandOutput;
  listOpsItemEvents(_: Sdk.ListOpsItemEventsCommandInput): Sdk.ListOpsItemEventsCommandOutput;
  listOpsItemRelatedItems(_: Sdk.ListOpsItemRelatedItemsCommandInput): Sdk.ListOpsItemRelatedItemsCommandOutput;
  listOpsMetadata(_: Sdk.ListOpsMetadataCommandInput): Sdk.ListOpsMetadataCommandOutput;
  listResourceComplianceSummaries(_: Sdk.ListResourceComplianceSummariesCommandInput): Sdk.ListResourceComplianceSummariesCommandOutput;
  listResourceDataSync(_: Sdk.ListResourceDataSyncCommandInput): Sdk.ListResourceDataSyncCommandOutput;
  listTagsForResource(_: Sdk.ListTagsForResourceCommandInput): Sdk.ListTagsForResourceCommandOutput;
  modifyDocumentPermission(_: Sdk.ModifyDocumentPermissionCommandInput): Sdk.ModifyDocumentPermissionCommandOutput;
  putComplianceItems(_: Sdk.PutComplianceItemsCommandInput): Sdk.PutComplianceItemsCommandOutput;
  putInventory(_: Sdk.PutInventoryCommandInput): Sdk.PutInventoryCommandOutput;
  putParameter(_: Sdk.PutParameterCommandInput): Sdk.PutParameterCommandOutput;
  putResourcePolicy(_: Sdk.PutResourcePolicyCommandInput): Sdk.PutResourcePolicyCommandOutput;
  registerDefaultPatchBaseline(_: Sdk.RegisterDefaultPatchBaselineCommandInput): Sdk.RegisterDefaultPatchBaselineCommandOutput;
  registerPatchBaselineForPatchGroup(_: Sdk.RegisterPatchBaselineForPatchGroupCommandInput): Sdk.RegisterPatchBaselineForPatchGroupCommandOutput;
  registerTargetWithMaintenanceWindow(_: Sdk.RegisterTargetWithMaintenanceWindowCommandInput): Sdk.RegisterTargetWithMaintenanceWindowCommandOutput;
  registerTaskWithMaintenanceWindow(_: Sdk.RegisterTaskWithMaintenanceWindowCommandInput): Sdk.RegisterTaskWithMaintenanceWindowCommandOutput;
  removeTagsFromResource(_: Sdk.RemoveTagsFromResourceCommandInput): Sdk.RemoveTagsFromResourceCommandOutput;
  resetServiceSetting(_: Sdk.ResetServiceSettingCommandInput): Sdk.ResetServiceSettingCommandOutput;
  resumeSession(_: Sdk.ResumeSessionCommandInput): Sdk.ResumeSessionCommandOutput;
  sendAutomationSignal(_: Sdk.SendAutomationSignalCommandInput): Sdk.SendAutomationSignalCommandOutput;
  sendCommand(_: Sdk.SendCommandCommandInput): Sdk.SendCommandCommandOutput;
  startAssociationsOnce(_: Sdk.StartAssociationsOnceCommandInput): Sdk.StartAssociationsOnceCommandOutput;
  startAutomationExecution(_: Sdk.StartAutomationExecutionCommandInput): Sdk.StartAutomationExecutionCommandOutput;
  startChangeRequestExecution(_: Sdk.StartChangeRequestExecutionCommandInput): Sdk.StartChangeRequestExecutionCommandOutput;
  startExecutionPreview(_: Sdk.StartExecutionPreviewCommandInput): Sdk.StartExecutionPreviewCommandOutput;
  startSession(_: Sdk.StartSessionCommandInput): Sdk.StartSessionCommandOutput;
  stopAutomationExecution(_: Sdk.StopAutomationExecutionCommandInput): Sdk.StopAutomationExecutionCommandOutput;
  terminateSession(_: Sdk.TerminateSessionCommandInput): Sdk.TerminateSessionCommandOutput;
  unlabelParameterVersion(_: Sdk.UnlabelParameterVersionCommandInput): Sdk.UnlabelParameterVersionCommandOutput;
  updateAssociation(_: Sdk.UpdateAssociationCommandInput): Sdk.UpdateAssociationCommandOutput;
  updateAssociationStatus(_: Sdk.UpdateAssociationStatusCommandInput): Sdk.UpdateAssociationStatusCommandOutput;
  updateDocument(_: Sdk.UpdateDocumentCommandInput): Sdk.UpdateDocumentCommandOutput;
  updateDocumentDefaultVersion(_: Sdk.UpdateDocumentDefaultVersionCommandInput): Sdk.UpdateDocumentDefaultVersionCommandOutput;
  updateDocumentMetadata(_: Sdk.UpdateDocumentMetadataCommandInput): Sdk.UpdateDocumentMetadataCommandOutput;
  updateMaintenanceWindow(_: Sdk.UpdateMaintenanceWindowCommandInput): Sdk.UpdateMaintenanceWindowCommandOutput;
  updateMaintenanceWindowTarget(_: Sdk.UpdateMaintenanceWindowTargetCommandInput): Sdk.UpdateMaintenanceWindowTargetCommandOutput;
  updateMaintenanceWindowTask(_: Sdk.UpdateMaintenanceWindowTaskCommandInput): Sdk.UpdateMaintenanceWindowTaskCommandOutput;
  updateManagedInstanceRole(_: Sdk.UpdateManagedInstanceRoleCommandInput): Sdk.UpdateManagedInstanceRoleCommandOutput;
  updateOpsItem(_: Sdk.UpdateOpsItemCommandInput): Sdk.UpdateOpsItemCommandOutput;
  updateOpsMetadata(_: Sdk.UpdateOpsMetadataCommandInput): Sdk.UpdateOpsMetadataCommandOutput;
  updatePatchBaseline(_: Sdk.UpdatePatchBaselineCommandInput): Sdk.UpdatePatchBaselineCommandOutput;
  updateResourceDataSync(_: Sdk.UpdateResourceDataSyncCommandInput): Sdk.UpdateResourceDataSyncCommandOutput;
  updateServiceSetting(_: Sdk.UpdateServiceSettingCommandInput): Sdk.UpdateServiceSettingCommandOutput;
}


const SsmCommandFactory = {
  addTagsToResource: (_: Sdk.AddTagsToResourceCommandInput) => new Sdk.AddTagsToResourceCommand(_),
  associateOpsItemRelatedItem: (_: Sdk.AssociateOpsItemRelatedItemCommandInput) => new Sdk.AssociateOpsItemRelatedItemCommand(_),
  cancelCommand: (_: Sdk.CancelCommandCommandInput) => new Sdk.CancelCommandCommand(_),
  cancelMaintenanceWindowExecution: (_: Sdk.CancelMaintenanceWindowExecutionCommandInput) => new Sdk.CancelMaintenanceWindowExecutionCommand(_),
  createActivation: (_: Sdk.CreateActivationCommandInput) => new Sdk.CreateActivationCommand(_),
  createAssociationBatch: (_: Sdk.CreateAssociationBatchCommandInput) => new Sdk.CreateAssociationBatchCommand(_),
  createAssociation: (_: Sdk.CreateAssociationCommandInput) => new Sdk.CreateAssociationCommand(_),
  createDocument: (_: Sdk.CreateDocumentCommandInput) => new Sdk.CreateDocumentCommand(_),
  createMaintenanceWindow: (_: Sdk.CreateMaintenanceWindowCommandInput) => new Sdk.CreateMaintenanceWindowCommand(_),
  createOpsItem: (_: Sdk.CreateOpsItemCommandInput) => new Sdk.CreateOpsItemCommand(_),
  createOpsMetadata: (_: Sdk.CreateOpsMetadataCommandInput) => new Sdk.CreateOpsMetadataCommand(_),
  createPatchBaseline: (_: Sdk.CreatePatchBaselineCommandInput) => new Sdk.CreatePatchBaselineCommand(_),
  createResourceDataSync: (_: Sdk.CreateResourceDataSyncCommandInput) => new Sdk.CreateResourceDataSyncCommand(_),
  deleteActivation: (_: Sdk.DeleteActivationCommandInput) => new Sdk.DeleteActivationCommand(_),
  deleteAssociation: (_: Sdk.DeleteAssociationCommandInput) => new Sdk.DeleteAssociationCommand(_),
  deleteDocument: (_: Sdk.DeleteDocumentCommandInput) => new Sdk.DeleteDocumentCommand(_),
  deleteInventory: (_: Sdk.DeleteInventoryCommandInput) => new Sdk.DeleteInventoryCommand(_),
  deleteMaintenanceWindow: (_: Sdk.DeleteMaintenanceWindowCommandInput) => new Sdk.DeleteMaintenanceWindowCommand(_),
  deleteOpsItem: (_: Sdk.DeleteOpsItemCommandInput) => new Sdk.DeleteOpsItemCommand(_),
  deleteOpsMetadata: (_: Sdk.DeleteOpsMetadataCommandInput) => new Sdk.DeleteOpsMetadataCommand(_),
  deleteParameter: (_: Sdk.DeleteParameterCommandInput) => new Sdk.DeleteParameterCommand(_),
  deleteParameters: (_: Sdk.DeleteParametersCommandInput) => new Sdk.DeleteParametersCommand(_),
  deletePatchBaseline: (_: Sdk.DeletePatchBaselineCommandInput) => new Sdk.DeletePatchBaselineCommand(_),
  deleteResourceDataSync: (_: Sdk.DeleteResourceDataSyncCommandInput) => new Sdk.DeleteResourceDataSyncCommand(_),
  deleteResourcePolicy: (_: Sdk.DeleteResourcePolicyCommandInput) => new Sdk.DeleteResourcePolicyCommand(_),
  deregisterManagedInstance: (_: Sdk.DeregisterManagedInstanceCommandInput) => new Sdk.DeregisterManagedInstanceCommand(_),
  deregisterPatchBaselineForPatchGroup: (_: Sdk.DeregisterPatchBaselineForPatchGroupCommandInput) => new Sdk.DeregisterPatchBaselineForPatchGroupCommand(_),
  deregisterTargetFromMaintenanceWindow: (_: Sdk.DeregisterTargetFromMaintenanceWindowCommandInput) => new Sdk.DeregisterTargetFromMaintenanceWindowCommand(_),
  deregisterTaskFromMaintenanceWindow: (_: Sdk.DeregisterTaskFromMaintenanceWindowCommandInput) => new Sdk.DeregisterTaskFromMaintenanceWindowCommand(_),
  describeActivations: (_: Sdk.DescribeActivationsCommandInput) => new Sdk.DescribeActivationsCommand(_),
  describeAssociation: (_: Sdk.DescribeAssociationCommandInput) => new Sdk.DescribeAssociationCommand(_),
  describeAssociationExecutions: (_: Sdk.DescribeAssociationExecutionsCommandInput) => new Sdk.DescribeAssociationExecutionsCommand(_),
  describeAssociationExecutionTargets: (_: Sdk.DescribeAssociationExecutionTargetsCommandInput) => new Sdk.DescribeAssociationExecutionTargetsCommand(_),
  describeAutomationExecutions: (_: Sdk.DescribeAutomationExecutionsCommandInput) => new Sdk.DescribeAutomationExecutionsCommand(_),
  describeAutomationStepExecutions: (_: Sdk.DescribeAutomationStepExecutionsCommandInput) => new Sdk.DescribeAutomationStepExecutionsCommand(_),
  describeAvailablePatches: (_: Sdk.DescribeAvailablePatchesCommandInput) => new Sdk.DescribeAvailablePatchesCommand(_),
  describeDocument: (_: Sdk.DescribeDocumentCommandInput) => new Sdk.DescribeDocumentCommand(_),
  describeDocumentPermission: (_: Sdk.DescribeDocumentPermissionCommandInput) => new Sdk.DescribeDocumentPermissionCommand(_),
  describeEffectiveInstanceAssociations: (_: Sdk.DescribeEffectiveInstanceAssociationsCommandInput) => new Sdk.DescribeEffectiveInstanceAssociationsCommand(_),
  describeEffectivePatchesForPatchBaseline: (_: Sdk.DescribeEffectivePatchesForPatchBaselineCommandInput) => new Sdk.DescribeEffectivePatchesForPatchBaselineCommand(_),
  describeInstanceAssociationsStatus: (_: Sdk.DescribeInstanceAssociationsStatusCommandInput) => new Sdk.DescribeInstanceAssociationsStatusCommand(_),
  describeInstanceInformation: (_: Sdk.DescribeInstanceInformationCommandInput) => new Sdk.DescribeInstanceInformationCommand(_),
  describeInstancePatches: (_: Sdk.DescribeInstancePatchesCommandInput) => new Sdk.DescribeInstancePatchesCommand(_),
  describeInstancePatchStates: (_: Sdk.DescribeInstancePatchStatesCommandInput) => new Sdk.DescribeInstancePatchStatesCommand(_),
  describeInstancePatchStatesForPatchGroup: (_: Sdk.DescribeInstancePatchStatesForPatchGroupCommandInput) => new Sdk.DescribeInstancePatchStatesForPatchGroupCommand(_),
  describeInstanceProperties: (_: Sdk.DescribeInstancePropertiesCommandInput) => new Sdk.DescribeInstancePropertiesCommand(_),
  describeInventoryDeletions: (_: Sdk.DescribeInventoryDeletionsCommandInput) => new Sdk.DescribeInventoryDeletionsCommand(_),
  describeMaintenanceWindowExecutions: (_: Sdk.DescribeMaintenanceWindowExecutionsCommandInput) => new Sdk.DescribeMaintenanceWindowExecutionsCommand(_),
  describeMaintenanceWindowExecutionTaskInvocations: (_: Sdk.DescribeMaintenanceWindowExecutionTaskInvocationsCommandInput) => new Sdk.DescribeMaintenanceWindowExecutionTaskInvocationsCommand(_),
  describeMaintenanceWindowExecutionTasks: (_: Sdk.DescribeMaintenanceWindowExecutionTasksCommandInput) => new Sdk.DescribeMaintenanceWindowExecutionTasksCommand(_),
  describeMaintenanceWindowSchedule: (_: Sdk.DescribeMaintenanceWindowScheduleCommandInput) => new Sdk.DescribeMaintenanceWindowScheduleCommand(_),
  describeMaintenanceWindows: (_: Sdk.DescribeMaintenanceWindowsCommandInput) => new Sdk.DescribeMaintenanceWindowsCommand(_),
  describeMaintenanceWindowsForTarget: (_: Sdk.DescribeMaintenanceWindowsForTargetCommandInput) => new Sdk.DescribeMaintenanceWindowsForTargetCommand(_),
  describeMaintenanceWindowTargets: (_: Sdk.DescribeMaintenanceWindowTargetsCommandInput) => new Sdk.DescribeMaintenanceWindowTargetsCommand(_),
  describeMaintenanceWindowTasks: (_: Sdk.DescribeMaintenanceWindowTasksCommandInput) => new Sdk.DescribeMaintenanceWindowTasksCommand(_),
  describeOpsItems: (_: Sdk.DescribeOpsItemsCommandInput) => new Sdk.DescribeOpsItemsCommand(_),
  describeParameters: (_: Sdk.DescribeParametersCommandInput) => new Sdk.DescribeParametersCommand(_),
  describePatchBaselines: (_: Sdk.DescribePatchBaselinesCommandInput) => new Sdk.DescribePatchBaselinesCommand(_),
  describePatchGroups: (_: Sdk.DescribePatchGroupsCommandInput) => new Sdk.DescribePatchGroupsCommand(_),
  describePatchGroupState: (_: Sdk.DescribePatchGroupStateCommandInput) => new Sdk.DescribePatchGroupStateCommand(_),
  describePatchProperties: (_: Sdk.DescribePatchPropertiesCommandInput) => new Sdk.DescribePatchPropertiesCommand(_),
  describeSessions: (_: Sdk.DescribeSessionsCommandInput) => new Sdk.DescribeSessionsCommand(_),
  disassociateOpsItemRelatedItem: (_: Sdk.DisassociateOpsItemRelatedItemCommandInput) => new Sdk.DisassociateOpsItemRelatedItemCommand(_),
  getAutomationExecution: (_: Sdk.GetAutomationExecutionCommandInput) => new Sdk.GetAutomationExecutionCommand(_),
  getCalendarState: (_: Sdk.GetCalendarStateCommandInput) => new Sdk.GetCalendarStateCommand(_),
  getCommandInvocation: (_: Sdk.GetCommandInvocationCommandInput) => new Sdk.GetCommandInvocationCommand(_),
  getConnectionStatus: (_: Sdk.GetConnectionStatusCommandInput) => new Sdk.GetConnectionStatusCommand(_),
  getDefaultPatchBaseline: (_: Sdk.GetDefaultPatchBaselineCommandInput) => new Sdk.GetDefaultPatchBaselineCommand(_),
  getDeployablePatchSnapshotForInstance: (_: Sdk.GetDeployablePatchSnapshotForInstanceCommandInput) => new Sdk.GetDeployablePatchSnapshotForInstanceCommand(_),
  getDocument: (_: Sdk.GetDocumentCommandInput) => new Sdk.GetDocumentCommand(_),
  getExecutionPreview: (_: Sdk.GetExecutionPreviewCommandInput) => new Sdk.GetExecutionPreviewCommand(_),
  getInventory: (_: Sdk.GetInventoryCommandInput) => new Sdk.GetInventoryCommand(_),
  getInventorySchema: (_: Sdk.GetInventorySchemaCommandInput) => new Sdk.GetInventorySchemaCommand(_),
  getMaintenanceWindow: (_: Sdk.GetMaintenanceWindowCommandInput) => new Sdk.GetMaintenanceWindowCommand(_),
  getMaintenanceWindowExecution: (_: Sdk.GetMaintenanceWindowExecutionCommandInput) => new Sdk.GetMaintenanceWindowExecutionCommand(_),
  getMaintenanceWindowExecutionTask: (_: Sdk.GetMaintenanceWindowExecutionTaskCommandInput) => new Sdk.GetMaintenanceWindowExecutionTaskCommand(_),
  getMaintenanceWindowExecutionTaskInvocation: (_: Sdk.GetMaintenanceWindowExecutionTaskInvocationCommandInput) => new Sdk.GetMaintenanceWindowExecutionTaskInvocationCommand(_),
  getMaintenanceWindowTask: (_: Sdk.GetMaintenanceWindowTaskCommandInput) => new Sdk.GetMaintenanceWindowTaskCommand(_),
  getOpsItem: (_: Sdk.GetOpsItemCommandInput) => new Sdk.GetOpsItemCommand(_),
  getOpsMetadata: (_: Sdk.GetOpsMetadataCommandInput) => new Sdk.GetOpsMetadataCommand(_),
  getOpsSummary: (_: Sdk.GetOpsSummaryCommandInput) => new Sdk.GetOpsSummaryCommand(_),
  getParameter: (_: Sdk.GetParameterCommandInput) => new Sdk.GetParameterCommand(_),
  getParameterHistory: (_: Sdk.GetParameterHistoryCommandInput) => new Sdk.GetParameterHistoryCommand(_),
  getParametersByPath: (_: Sdk.GetParametersByPathCommandInput) => new Sdk.GetParametersByPathCommand(_),
  getParameters: (_: Sdk.GetParametersCommandInput) => new Sdk.GetParametersCommand(_),
  getPatchBaseline: (_: Sdk.GetPatchBaselineCommandInput) => new Sdk.GetPatchBaselineCommand(_),
  getPatchBaselineForPatchGroup: (_: Sdk.GetPatchBaselineForPatchGroupCommandInput) => new Sdk.GetPatchBaselineForPatchGroupCommand(_),
  getResourcePolicies: (_: Sdk.GetResourcePoliciesCommandInput) => new Sdk.GetResourcePoliciesCommand(_),
  getServiceSetting: (_: Sdk.GetServiceSettingCommandInput) => new Sdk.GetServiceSettingCommand(_),
  labelParameterVersion: (_: Sdk.LabelParameterVersionCommandInput) => new Sdk.LabelParameterVersionCommand(_),
  listAssociations: (_: Sdk.ListAssociationsCommandInput) => new Sdk.ListAssociationsCommand(_),
  listAssociationVersions: (_: Sdk.ListAssociationVersionsCommandInput) => new Sdk.ListAssociationVersionsCommand(_),
  listCommandInvocations: (_: Sdk.ListCommandInvocationsCommandInput) => new Sdk.ListCommandInvocationsCommand(_),
  listCommands: (_: Sdk.ListCommandsCommandInput) => new Sdk.ListCommandsCommand(_),
  listComplianceItems: (_: Sdk.ListComplianceItemsCommandInput) => new Sdk.ListComplianceItemsCommand(_),
  listComplianceSummaries: (_: Sdk.ListComplianceSummariesCommandInput) => new Sdk.ListComplianceSummariesCommand(_),
  listDocumentMetadataHistory: (_: Sdk.ListDocumentMetadataHistoryCommandInput) => new Sdk.ListDocumentMetadataHistoryCommand(_),
  listDocuments: (_: Sdk.ListDocumentsCommandInput) => new Sdk.ListDocumentsCommand(_),
  listDocumentVersions: (_: Sdk.ListDocumentVersionsCommandInput) => new Sdk.ListDocumentVersionsCommand(_),
  listInventoryEntries: (_: Sdk.ListInventoryEntriesCommandInput) => new Sdk.ListInventoryEntriesCommand(_),
  listNodes: (_: Sdk.ListNodesCommandInput) => new Sdk.ListNodesCommand(_),
  listNodesSummary: (_: Sdk.ListNodesSummaryCommandInput) => new Sdk.ListNodesSummaryCommand(_),
  listOpsItemEvents: (_: Sdk.ListOpsItemEventsCommandInput) => new Sdk.ListOpsItemEventsCommand(_),
  listOpsItemRelatedItems: (_: Sdk.ListOpsItemRelatedItemsCommandInput) => new Sdk.ListOpsItemRelatedItemsCommand(_),
  listOpsMetadata: (_: Sdk.ListOpsMetadataCommandInput) => new Sdk.ListOpsMetadataCommand(_),
  listResourceComplianceSummaries: (_: Sdk.ListResourceComplianceSummariesCommandInput) => new Sdk.ListResourceComplianceSummariesCommand(_),
  listResourceDataSync: (_: Sdk.ListResourceDataSyncCommandInput) => new Sdk.ListResourceDataSyncCommand(_),
  listTagsForResource: (_: Sdk.ListTagsForResourceCommandInput) => new Sdk.ListTagsForResourceCommand(_),
  modifyDocumentPermission: (_: Sdk.ModifyDocumentPermissionCommandInput) => new Sdk.ModifyDocumentPermissionCommand(_),
  putComplianceItems: (_: Sdk.PutComplianceItemsCommandInput) => new Sdk.PutComplianceItemsCommand(_),
  putInventory: (_: Sdk.PutInventoryCommandInput) => new Sdk.PutInventoryCommand(_),
  putParameter: (_: Sdk.PutParameterCommandInput) => new Sdk.PutParameterCommand(_),
  putResourcePolicy: (_: Sdk.PutResourcePolicyCommandInput) => new Sdk.PutResourcePolicyCommand(_),
  registerDefaultPatchBaseline: (_: Sdk.RegisterDefaultPatchBaselineCommandInput) => new Sdk.RegisterDefaultPatchBaselineCommand(_),
  registerPatchBaselineForPatchGroup: (_: Sdk.RegisterPatchBaselineForPatchGroupCommandInput) => new Sdk.RegisterPatchBaselineForPatchGroupCommand(_),
  registerTargetWithMaintenanceWindow: (_: Sdk.RegisterTargetWithMaintenanceWindowCommandInput) => new Sdk.RegisterTargetWithMaintenanceWindowCommand(_),
  registerTaskWithMaintenanceWindow: (_: Sdk.RegisterTaskWithMaintenanceWindowCommandInput) => new Sdk.RegisterTaskWithMaintenanceWindowCommand(_),
  removeTagsFromResource: (_: Sdk.RemoveTagsFromResourceCommandInput) => new Sdk.RemoveTagsFromResourceCommand(_),
  resetServiceSetting: (_: Sdk.ResetServiceSettingCommandInput) => new Sdk.ResetServiceSettingCommand(_),
  resumeSession: (_: Sdk.ResumeSessionCommandInput) => new Sdk.ResumeSessionCommand(_),
  sendAutomationSignal: (_: Sdk.SendAutomationSignalCommandInput) => new Sdk.SendAutomationSignalCommand(_),
  sendCommand: (_: Sdk.SendCommandCommandInput) => new Sdk.SendCommandCommand(_),
  startAssociationsOnce: (_: Sdk.StartAssociationsOnceCommandInput) => new Sdk.StartAssociationsOnceCommand(_),
  startAutomationExecution: (_: Sdk.StartAutomationExecutionCommandInput) => new Sdk.StartAutomationExecutionCommand(_),
  startChangeRequestExecution: (_: Sdk.StartChangeRequestExecutionCommandInput) => new Sdk.StartChangeRequestExecutionCommand(_),
  startExecutionPreview: (_: Sdk.StartExecutionPreviewCommandInput) => new Sdk.StartExecutionPreviewCommand(_),
  startSession: (_: Sdk.StartSessionCommandInput) => new Sdk.StartSessionCommand(_),
  stopAutomationExecution: (_: Sdk.StopAutomationExecutionCommandInput) => new Sdk.StopAutomationExecutionCommand(_),
  terminateSession: (_: Sdk.TerminateSessionCommandInput) => new Sdk.TerminateSessionCommand(_),
  unlabelParameterVersion: (_: Sdk.UnlabelParameterVersionCommandInput) => new Sdk.UnlabelParameterVersionCommand(_),
  updateAssociation: (_: Sdk.UpdateAssociationCommandInput) => new Sdk.UpdateAssociationCommand(_),
  updateAssociationStatus: (_: Sdk.UpdateAssociationStatusCommandInput) => new Sdk.UpdateAssociationStatusCommand(_),
  updateDocument: (_: Sdk.UpdateDocumentCommandInput) => new Sdk.UpdateDocumentCommand(_),
  updateDocumentDefaultVersion: (_: Sdk.UpdateDocumentDefaultVersionCommandInput) => new Sdk.UpdateDocumentDefaultVersionCommand(_),
  updateDocumentMetadata: (_: Sdk.UpdateDocumentMetadataCommandInput) => new Sdk.UpdateDocumentMetadataCommand(_),
  updateMaintenanceWindow: (_: Sdk.UpdateMaintenanceWindowCommandInput) => new Sdk.UpdateMaintenanceWindowCommand(_),
  updateMaintenanceWindowTarget: (_: Sdk.UpdateMaintenanceWindowTargetCommandInput) => new Sdk.UpdateMaintenanceWindowTargetCommand(_),
  updateMaintenanceWindowTask: (_: Sdk.UpdateMaintenanceWindowTaskCommandInput) => new Sdk.UpdateMaintenanceWindowTaskCommand(_),
  updateManagedInstanceRole: (_: Sdk.UpdateManagedInstanceRoleCommandInput) => new Sdk.UpdateManagedInstanceRoleCommand(_),
  updateOpsItem: (_: Sdk.UpdateOpsItemCommandInput) => new Sdk.UpdateOpsItemCommand(_),
  updateOpsMetadata: (_: Sdk.UpdateOpsMetadataCommandInput) => new Sdk.UpdateOpsMetadataCommand(_),
  updatePatchBaseline: (_: Sdk.UpdatePatchBaselineCommandInput) => new Sdk.UpdatePatchBaselineCommand(_),
  updateResourceDataSync: (_: Sdk.UpdateResourceDataSyncCommandInput) => new Sdk.UpdateResourceDataSyncCommand(_),
  updateServiceSetting: (_: Sdk.UpdateServiceSettingCommandInput) => new Sdk.UpdateServiceSettingCommand(_),
} as Record<keyof SsmClientApi, (_: unknown) => unknown>


const SsmExceptionNames = [
  "InternalServerError", "InvalidResourceId", "InvalidResourceType",
  "TooManyTagsError", "TooManyUpdates", "AlreadyExistsException",
  "OpsItemConflictException", "OpsItemInvalidParameterException", "OpsItemLimitExceededException",
  "OpsItemNotFoundException", "OpsItemRelatedItemAlreadyExistsException", "DuplicateInstanceId",
  "InvalidCommandId", "InvalidInstanceId", "DoesNotExistException",
  "InvalidParameters", "AssociationAlreadyExists", "AssociationLimitExceeded",
  "InvalidDocument", "InvalidDocumentVersion", "InvalidOutputLocation",
  "InvalidSchedule", "InvalidTag", "InvalidTarget",
  "InvalidTargetMaps", "UnsupportedPlatformType", "DocumentAlreadyExists",
  "DocumentLimitExceeded", "InvalidDocumentContent", "InvalidDocumentSchemaVersion",
  "MaxDocumentSizeExceeded", "IdempotentParameterMismatch", "ResourceLimitExceededException",
  "OpsItemAccessDeniedException", "OpsItemAlreadyExistsException", "OpsMetadataAlreadyExistsException",
  "OpsMetadataInvalidArgumentException", "OpsMetadataLimitExceededException", "OpsMetadataTooManyUpdatesException",
  "ResourceDataSyncAlreadyExistsException", "ResourceDataSyncCountExceededException", "ResourceDataSyncInvalidConfigurationException",
  "InvalidActivation", "InvalidActivationId", "AssociationDoesNotExist",
  "AssociatedInstances", "InvalidDocumentOperation", "InvalidDeleteInventoryParametersException",
  "InvalidInventoryRequestException", "InvalidOptionException", "InvalidTypeNameException",
  "OpsMetadataNotFoundException", "ParameterNotFound", "ResourceInUseException",
  "ResourceDataSyncNotFoundException", "MalformedResourcePolicyDocumentException", "ResourceNotFoundException",
  "ResourcePolicyConflictException", "ResourcePolicyInvalidParameterException", "ResourcePolicyNotFoundException",
  "TargetInUseException", "InvalidFilter", "InvalidNextToken",
  "InvalidAssociationVersion", "AssociationExecutionDoesNotExist", "InvalidFilterKey",
  "InvalidFilterValue", "AutomationExecutionNotFoundException", "InvalidPermissionType",
  "UnsupportedOperatingSystem", "InvalidInstanceInformationFilterValue", "InvalidInstancePropertyFilterValue",
  "InvalidDeletionIdException", "InvalidFilterOption", "OpsItemRelatedItemAssociationNotFoundException",
  "InvalidDocumentType", "UnsupportedCalendarException", "InvalidPluginName",
  "InvocationDoesNotExist", "UnsupportedFeatureRequiredException", "InvalidAggregatorException",
  "InvalidInventoryGroupException", "InvalidResultAttributeException", "InvalidKeyId",
  "ParameterVersionNotFound", "ServiceSettingNotFound", "ParameterVersionLabelLimitExceeded",
  "UnsupportedOperationException", "DocumentPermissionLimit", "ComplianceTypeCountLimitExceededException",
  "InvalidItemContentException", "ItemSizeLimitExceededException", "TotalSizeLimitExceededException",
  "CustomSchemaCountLimitExceededException", "InvalidInventoryItemContextException", "ItemContentMismatchException",
  "SubTypeCountLimitExceededException", "UnsupportedInventoryItemContextException", "UnsupportedInventorySchemaVersionException",
  "HierarchyLevelLimitExceededException", "HierarchyTypeMismatchException", "IncompatiblePolicyException",
  "InvalidAllowedPatternException", "InvalidPolicyAttributeException", "InvalidPolicyTypeException",
  "ParameterAlreadyExists", "ParameterLimitExceeded", "ParameterMaxVersionLimitExceeded",
  "ParameterPatternMismatchException", "PoliciesLimitExceededException", "UnsupportedParameterType",
  "ResourcePolicyLimitExceededException", "FeatureNotAvailableException", "AutomationStepNotFoundException",
  "InvalidAutomationSignalException", "InvalidNotificationConfig", "InvalidOutputFolder",
  "InvalidRole", "InvalidAssociation", "AutomationDefinitionNotFoundException",
  "AutomationDefinitionVersionNotFoundException", "AutomationExecutionLimitExceededException", "InvalidAutomationExecutionParametersException",
  "AutomationDefinitionNotApprovedException", "ValidationException", "TargetNotConnected",
  "InvalidAutomationStatusUpdateException", "AssociationVersionLimitExceeded", "InvalidUpdate",
  "StatusUnchanged", "DocumentVersionLimitExceeded", "DuplicateDocumentContent",
  "DuplicateDocumentVersionName", "OpsMetadataKeyLimitExceededException", "ResourceDataSyncConflictException",
  "SSMServiceException",
] as const;

export type SsmExceptionName = typeof SsmExceptionNames[number];

export class SsmClientException extends Data.TaggedError("SsmClientException")<
  {
    name: SsmExceptionName;
    cause: Sdk.SSMServiceException
  }
> { } {
}

export function recoverFromSsmException<A, A2, E>(name: SsmExceptionName, recover: A2) {

  return (effect: Effect.Effect<A, SsmClientException>) =>
    Effect.catchIf(
      effect,
      error => error._tag == "SsmClientException" && error.name == name,
      error =>
        pipe(
          Effect.logDebug("Recovering from error", { errorName: name, details: { message: error.cause.message, ...error.cause.$metadata } }),
          Effect.andThen(() => Effect.succeed(recover))
        )
    )

}
