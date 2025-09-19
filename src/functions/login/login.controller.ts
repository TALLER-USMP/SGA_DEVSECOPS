import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
  HttpResponse,
} from "@azure/functions";
import { controller, route } from "../../lib/decorators";
import { BaseController } from "../../base-controller";
import { STATUS_CODES } from "../../status-codes";
import { stat } from "fs";
import { verifyToken } from "../../utils/VerifyToken";
import { AuthService } from "../../service/auth.service";

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
        status: STATUS_CODES.UNAUTHORIZED,
        jsonBody: { message: "No se proporcionó token de autorización" },
      };
    }

    try {
      const token = authHeader.substring(7);
      const AuthServiceS = new AuthService();
      const session = await AuthServiceS.login(token);

      return {
        status: 200,
        jsonBody: {
          message: "Login successful",
          user: session,
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
