// src/functions/controllers/docente/docente.controller.ts
import {
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { BaseController } from "../../base-controller";
import { route, controller } from "../../lib/decorators";
import { STATUS_CODES } from "../../status-codes";
import { DocenteRepository } from "../../repositories/docente.repository";

function getPathParam(
  req: HttpRequest,
  context: InvocationContext,
  key: string
) {
  // si tu wrapper inyecta params como objeto o Map
  // @ts-ignore
  const fromReq = req.params && (req.params[key] ?? req.params.get?.(key));
  const fromBinding = (context as any).bindingData?.[key];
  return fromReq ?? fromBinding;
}

@controller("docente")
export class DocenteController implements BaseController {
  private repo: DocenteRepository;

  constructor() {
    // si prefieres inyección, cambia a recibir el repo por constructor
    this.repo = new DocenteRepository();
  }

  // GET /api/docente/{id}/asignaturas
  @route("/{id}/asignaturas")
  async listAsignaturas(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    try {
      const idParam = getPathParam(req, context, "id");
      const docenteId = Number(idParam);

      if (!idParam || Number.isNaN(docenteId)) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          jsonBody: { error: "id inválido" },
        };
      }

      const asignaturas = await this.repo.findAsignaturasByDocenteId(docenteId);

      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          data: asignaturas,
          meta: { docenteId, count: asignaturas.length },
        },
      };
    } catch (err: any) {
      // Si getDb() no está inicializado, el repo lanzará un error.
      // Respondemos 500 con un mensaje controlado.
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: {
          error: "No se pudieron obtener las asignaturas",
          details:
            process.env.NODE_ENV === "development"
              ? String(err?.message ?? err)
              : undefined,
        },
      };
    }
  }

  // --- otros endpoints aún no implementados (stubs) ---
  @route("/")
  async list(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/{id}")
  async getOne(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/", "POST")
  async create(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/", "PUT")
  async update(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }

  @route("/", "DELETE")
  async delete(
    req: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> {
    throw new Error("Method not implemented.");
  }
}
