import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
  HttpResponse,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { BaseController } from "../../base-controller";
import { STATUS_CODES } from "http";
import { stat } from "fs";
import { verifyToken } from "../../utils/VerifyToken";

@controller("login")
export class LoginController implements BaseController {
  @route("/hookLogin", "POST")
  async login(
    request: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      context.log("No authorization header");
      return {
        status: 401,
        jsonBody: { message: "No se proporcionó token de autorización" },
      };
    }

    try {
      const decoded = await verifyToken(authHeader.substring(7));
      console.log(
        "Mi auth header:",
        decoded.name + decoded.oid + decoded.upn + decoded.tid + decoded.sid,
      );
      return {
        status: 200,
        jsonBody: {
          message: "Login successful",
        },
      };
    } catch (err) {
      {
        context.log("Error verifying token:", err);
        return {
          status: 401,
          jsonBody: { message: "Token de autorización inválido" },
        };
      }
    }
  }

  list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
  delete(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
}
