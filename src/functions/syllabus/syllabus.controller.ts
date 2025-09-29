import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { SyllabusService } from "../../service/syllabus.service";
import { route, controller } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";

@controller("syllabus")
export class SyllabusController implements BaseController {
  private syllabusService = new SyllabusService();
  @route("/")
  async list(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        message: "acceso permitido",
      },
    };
  }

  @route("/{id}")
  async getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit> {
    // try {
    const id = req.params.id;
    const response = await this.syllabusService.getOne(id);
    return {
      status: STATUS_CODES.OK,
      jsonBody: {
        response,
      },
    };
    // } catch (e) {
    //   return {
    //     status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    //     jsonBody: {
    //       code: "INTERAL_SERVER_ERROR",
    //       message: "Un error desconocido ha ocurrido",
    //     },
    //   };
    // }
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
