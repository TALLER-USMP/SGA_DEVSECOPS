import { HttpMethod, HttpRequest, InvocationContext } from "@azure/functions";
import { BaseController } from "../base-controller";
import { STATUS_CODES } from "../status-codes";
import { MetadataStore } from "./metadatastore";



export type RouteDefinition = {
 path: string;
 method: HttpMethod;
 handlerKey: string;
}

type AuthLevel = "alumno" | "profesor" | "director";


/**
 * This registers a normal class as a controller class to get started, and also registers the route prefix.
 * @param path Prefix of API route
 * @returns Class constructor
 */
export function controller<T extends { new(...args: any[]): BaseController }>(prefix: string) {
 return (constructor: T) => {
  Reflect.defineMetadata("controller:prefix", prefix, constructor);

  const classes = Reflect.getMetadata("controller:class", MetadataStore) || []; // 2
  // [SylabussController, ReportController] // 2

  classes.push(constructor); // [RerportController, SyllabusContrller, TestController] 3

  Reflect.defineMetadata("controller:class", classes, MetadataStore); // actualizo // 3

  return constructor;
 };
}



/**
 * Define an api route and a handler based on the class method
 * @param path Route path for API
 * @param method Http method for APi
 * @returns 
 */
export function route(path: string, method: HttpMethod = "GET") {
 return (target: any, handlerKey: string) => {
  const routes: RouteDefinition[] = Reflect.getMetadata("controller:routes", target.constructor) || [];
  routes.push({
   handlerKey,
   method,
   path
  });
  Reflect.defineMetadata("controller:routes", routes, target.constructor);
 }
}


export function auth(levels: AuthLevel[]) {
 return (target: any, handlerKey: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  descriptor.value = async (req: HttpRequest, ctx: InvocationContext) => {
   const token = req.headers.get("Authorization");
   // some logic to extract the payload from the JWT...
   const mockUser = {
    role: "profesor"
   }
   if (!levels.includes(mockUser.role as AuthLevel)) {
    return {
     ok: STATUS_CODES.UNAUTHORIZED,
     message: "No puedes usar esta funcionaliad."
    }
   }
   // ya no llega
   originalMethod(req, ctx);
  }
 }
}