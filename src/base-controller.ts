import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";

export interface BaseController {
  list(req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit>;
  getOne(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit>;
  create(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit>;
  update(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit>;
  delete(
    req: HttpRequest,
    context: InvocationContext,
  ): Promise<HttpResponseInit>;
}
