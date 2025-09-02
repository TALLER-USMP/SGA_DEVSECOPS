import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { auth, controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";

@controller("test")
export class TestController implements BaseController {
  @route("/")
  async list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        message: "Hello world",
      },
    };
  }

  @route("/{id}")
  @auth(["alumno", "director"])
  async getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/", "POST")
  async create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/", "PUT")
  async update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/", "DELETE")
  async delete(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
}
