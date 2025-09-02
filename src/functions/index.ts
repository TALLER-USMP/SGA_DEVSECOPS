import "reflect-metadata";
import * as fs from "fs";
import * as path from "path";
import { bootstrapApp } from "../lib/bootstrap";
import { app } from "@azure/functions";
import { AppError } from "../error";
import { getDb } from "../db";
import { sql } from "drizzle-orm";
import { STATUS_CODES } from "../status-codes";
import { SyllabusController } from "./syllabus/syllabus.controller";
import { RouteDefinition } from "../lib/decorators";

const controllers = [SyllabusController];

for (const currentClass of controllers) {
  const prefix = Reflect.getMetadata("controller:prefix", currentClass);
  const instance = new currentClass();
  const routes: RouteDefinition[] =
    Reflect.getMetadata("controller:routes", currentClass) || [];

  for (const route of routes) {
    app.http(`${prefix}_${route.handlerKey}`, {
      methods: [route.method],
      route: `${prefix}${route.path}`,
      handler:
        instance[route.handlerKey as keyof typeof instance].bind(instance),
    });
  }
}

// health api
app.http("health", {
  methods: ["GET"],
  handler: async () => {
    try {
      const db = getDb();
      const response = await db!.execute(sql`SELECT version()`);
      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          message: `Api healthy`,
          response,
        },
      };
    } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
        return error.toHttpResponse();
      } else {
        return {
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          jsonBody: {
            code: "INTERAL_SERVER_ERROR",
            message: "Un error desconocido ha ocurrido",
          },
        };
      }
    }
  },
});
