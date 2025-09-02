import { MetadataStore } from "./metadatastore";
import { RouteDefinition } from "./decorators";
import { app } from "@azure/functions";



export function bootstrapApp(application: typeof app) {
 const controllers = Reflect.getMetadata("controller:class", MetadataStore) || [];
 for (const currentClass of controllers) {
  const prefix = Reflect.getMetadata("controller:prefix", currentClass);
  const instance = new currentClass();
  const routes: RouteDefinition[] = Reflect.getMetadata("controller:routes", currentClass) || [];

  for (const route of routes) {
   application.http(`${prefix}_${route.handlerKey}`, {
    methods: [route.method],
    route: `${prefix}${route.path}`,
    handler: instance[route.handlerKey].bind(instance),
   });
  }
 }
}
