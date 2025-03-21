import { z } from "zod";
import { componentDefinitionPath, componentPath } from "./paths.js";
import { nodeDependency, sourcePackage } from "./modules.js";
import { checkedComponent } from "./checkedComponent.js";
import { evaluatedComponentDefinition } from "./componentDefinition.js";
import {
  appDefinitionConfig,
  componentDefinitionConfig,
} from "./definitionConfig.js";
import { authInfo } from "./types.js";

export const startPushRequest = z.object({
  adminKey: z.string(),
  dryRun: z.boolean(),

  functions: z.string(),

  appDefinition: appDefinitionConfig,
  componentDefinitions: z.array(componentDefinitionConfig),

  nodeDependencies: z.array(nodeDependency),
});
export type StartPushRequest = z.infer<typeof startPushRequest>;

export const schemaChange = z.object({
  allocatedComponentIds: z.any(),
  schemaIds: z.any(),
});
export type SchemaChange = z.infer<typeof schemaChange>;

export const startPushResponse = z.object({
  externalDepsId: z.nullable(z.string()),
  componentDefinitionPackages: z.record(componentDefinitionPath, sourcePackage),

  appAuth: z.array(authInfo),
  analysis: z.record(componentDefinitionPath, evaluatedComponentDefinition),

  app: checkedComponent,

  schemaChange,
});
export type StartPushResponse = z.infer<typeof startPushResponse>;

export const componentSchemaStatus = z.object({
  schemaValidationComplete: z.boolean(),
  indexesComplete: z.number(),
  indexesTotal: z.number(),
});
export type ComponentSchemaStatus = z.infer<typeof componentSchemaStatus>;

export const schemaStatus = z.union([
  z.object({
    type: z.literal("inProgress"),
    components: z.record(componentPath, componentSchemaStatus),
  }),
  z.object({
    type: z.literal("failed"),
    error: z.string(),
    componentPath,
    tableName: z.nullable(z.string()),
  }),
  z.object({
    type: z.literal("raceDetected"),
  }),
  z.object({
    type: z.literal("complete"),
  }),
]);
export type SchemaStatus = z.infer<typeof schemaStatus>;
