import { HttpMethod, HttpRequest, InvocationContext } from "@azure/functions";
import { BaseController } from "../base-controller";
import { STATUS_CODES } from "../status-codes";
import { MetadataStore } from "./metadatastore";
import { verifyToken } from "../utils/VerifyToken";
import { AuthLevel, mapAzureTokenToAuthPayload } from "../zod/user.schema";

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

export function auth(levels: AuthLevel[]) {
  return (target: any, handlerKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = async (req: HttpRequest, ctx: InvocationContext) => {
      try {
        // 1. Validate Authorization header
        const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          console.error("Missing or invalid authorization header");
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            jsonBody: { message: "No se proporcionó token de autorización" },
          };
        }

        // 2. Validate Graph token header
        const graphToken = req.headers.get("x-graph-token") || req.headers.get("X-Graph-Token");
        if (!graphToken) {
          console.error("Missing graph token header");
          return {
            status: STATUS_CODES.BAD_REQUEST,
            jsonBody: { message: "No se proporcionó token de Graph en el header" },
          };
        }

        console.log("Headers validated successfully");

        // 3. Verify the main authorization token
        let decoded;
        try {
          const token = authHeader.substring(7);
          decoded = await verifyToken(token);
          console.log("API token decoded successfully:", decoded);
        } catch (tokenError) {
          console.error("Error verifying API token:", tokenError);
          return {
            status: STATUS_CODES.UNAUTHORIZED,
            jsonBody: { message: "Token de autorización inválido" },
          };
        }

        // 4. Map token to user
        const user = mapAzureTokenToAuthPayload(decoded);
        console.log("User mapped from token:", user);

        // 5. Call Microsoft Graph API
        let response;
        try {
          response = await fetch(`https://graph.microsoft.com/v1.0/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${graphToken}`,
              'Content-Type': 'application/json',
            },
          });
        } catch (fetchError) {
          console.error("Network error calling Graph API:", fetchError);
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            jsonBody: { message: "Error de red al contactar Microsoft Graph" },
          };
        }

        // 6. Handle Graph API response
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Graph API error (${response.status}):`, errorText);
          
          // More specific error messages based on status
          if (response.status === 401) {
            return {
              status: STATUS_CODES.UNAUTHORIZED,
              jsonBody: { message: "Token de Graph inválido o expirado" },
            };
          } else if (response.status === 403) {
            return {
              status: STATUS_CODES.FORBIDDEN,
              jsonBody: { message: "Sin permisos para acceder a Microsoft Graph" },
            };
          } else {
            return {
              status: STATUS_CODES.BAD_REQUEST,
              jsonBody: { message: "Error al obtener información del usuario de Graph" },
            };
          }
        }

        // 7. Parse Graph response
        let profile;
        try {
          profile = await response.json();
          console.log("Graph profile obtained:", profile);
        } catch (parseError) {
          console.error("Error parsing Graph response:", parseError);
          return {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            jsonBody: { message: "Error al procesar respuesta de Microsoft Graph" },
          };
        }

        // 8. Enhance user object with Graph data
        user.name = profile.displayName;
        user.role = profile.jobTitle || "SinRol";
        
        console.log("Final user object:", user);
        console.log("Required levels:", levels);
        console.log("User role:", user.role);

        // 9. Check authorization levels
        if (!levels.includes(user.role)) {
          console.log(`Access denied. User role '${user.role}' not in allowed levels:`, levels);
          return {
            status: STATUS_CODES.FORBIDDEN,
            jsonBody: {
              message: `No tienes permiso para acceder a esta funcionalidad. Rol requerido: ${levels.join(', ')}`,
            },
          };
        }

        console.log("Authorization successful, proceeding to original method");
        
        // 10. Call original method
        return await originalMethod(req, ctx);

      } catch (err) {
        // Enhanced error logging
        console.error("Unexpected error in auth decorator:");
        if (err instanceof Error) {
          console.error("Error name:", err.name);
          console.error("Error message:", err.message);
          console.error("Error stack:", err.stack);
        } else {
          console.error("Error value:", err);
        }
        
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          jsonBody: { 
            message: "Error interno de autenticación",
            // In development, you might want to include more details:
            // error: err instanceof Error ? err.message : String(err)
          },
        };
      }
    };
  };
}

