import {
  HttpRequest,
  InvocationContext,
  HttpResponseInit,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { controller, route } from "../../lib/decorators";

@controller("login")
export class LoginController implements BaseController {
  @route("/", "POST")
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
