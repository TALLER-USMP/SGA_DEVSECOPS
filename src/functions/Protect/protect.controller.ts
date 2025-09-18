import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { STATUS_CODES } from "http";
import { auth, controller, route } from "../../lib/decorators";

@controller("protect")
export class ProtectController implements BaseController {
  @route("/protected", "POST")
  @auth(["Alumno", "Docente Contratado"])
  protected(
    req: HttpRequest,
    ctx: InvocationContext,
  ): Promise<HttpResponseInit> {
    return Promise.resolve({
      status: 200,
      jsonBody: { message: "acceso permitido" },
    });
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
