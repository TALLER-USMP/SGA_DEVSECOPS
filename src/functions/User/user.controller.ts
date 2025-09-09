import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { auth, route, controller } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";

@controller("user")
export class SyllabusController implements BaseController {
  @auth(["Alumno", "Docente Contratado"])
  @route("/")
  list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    // At this point, your auth decorator has already:
    // 1. Verified the API token
    // 2. Called Microsoft Graph with the graph token
    // 3. Enhanced the user object with Graph data
    // 4. Checked role authorization

    // The user object should be available in the request context
    // (you may need to add this to your auth decorator)

    return Promise.resolve({
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // 👈 permite cualquier origen
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
      jsonBody: {
        message: "User data retrieved successfully",
        timestamp: new Date().toISOString(),
      },
    });
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
