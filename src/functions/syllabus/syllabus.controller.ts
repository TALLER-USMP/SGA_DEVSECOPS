import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { controller, route } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";

@controller("syllabus")
export class SyllabusController implements BaseController {
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

  async getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  async delete(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
}
