import { HttpMethod, HttpRequest, InvocationContext } from "@azure/functions";
import { BaseController } from "../base-controller";
import { STATUS_CODES } from "../status-codes";
import { MetadataStore } from "./metadatastore";
import { verifyToken } from "../utils/VerifyToken";
import { AuthLevel, mapAzureTokenToAuthPayload } from "../zod/user.schema";
import { UserRepository } from "../repositories/user.repository";

export type RouteDefinition = {
  path: string;
  method: HttpMethod;
  handlerKey: string;
};

/**
 * This registers a normal class as a controller class to get started, and also registers the route prefix.
 * @param path Prefix of API route
 * @returns Class constructor
 */
export function controller<T extends { new (...args: any[]): BaseController }>(
  prefix: string,
) {
  return (constructor: T) => {
    Reflect.defineMetadata("controller:prefix", prefix, constructor);

    const classes =
      Reflect.getMetadata("controller:class", MetadataStore) || []; // 2
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
    const routes: RouteDefinition[] =
      Reflect.getMetadata("controller:routes", target.constructor) || [];
    routes.push({
      handlerKey,
      method,
      path,
    });
    Reflect.defineMetadata("controller:routes", routes, target.constructor);
  };
}

const userRepo = new UserRepository();

export function auth(levels: string[]) {
  return (target: any, handlerKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (req: HttpRequest, ctx: InvocationContext) => {
      try {
        // Validate token
        const authHeader =
          req.headers.get("authorization") || req.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            jsonBody: { message: "Token no proporcionado o inválido" },
          };
        }

        const token = authHeader.substring(7);
        let decoded: any;
        try {
          decoded = await verifyToken(token);
        } catch (err) {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            jsonBody: { message: "Token inválido o expirado" },
          };
        }

        // Buscar usuario en BD
        const azureOid = decoded.oid;
        const tenantId = decoded.tid;

        const user = await userRepo.findWithCategory(azureOid, tenantId);
        if (!user) {
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            jsonBody: { message: "Usuario no registrado o no autorizado" },
          };
        }

        // Validar estado activo
        if (!user.activo) {
          return {
            status: STATUS_CODES.FORBIDDEN,
            jsonBody: { message: "Usuario inactivo" },
          };
        }

        // Validar rol desde categoria_usuario
        const role = user.categoria?.nombre_categoria;
        if (!role || !levels.includes(role)) {
          return {
            status: STATUS_CODES.FORBIDDEN,
            jsonBody: {
              message: `No tienes permiso para acceder. Rol requerido: ${levels.join(", ")}`,
            },
          };
        }

        ((ctx as any).extra ??= {}).user = user;

        return await originalMethod(req, ctx);
      } catch (err) {
        console.error("Error en decorador auth:", err);
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          jsonBody: { message: "Error interno de autenticación" },
        };
      }
    };
  };
}
