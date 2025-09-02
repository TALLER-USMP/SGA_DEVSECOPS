import "reflect-metadata";

import { app } from "@azure/functions";
// import { AppError } from "../error";
import { STATUS_CODES } from "../status-codes";

// health api
app.http("health", {
  methods: ["GET"],
  handler: async () => {
    try {
      // const db = getDb();
      // const response = await db!.execute(sql`SELECT version()`);
      return {
        status: STATUS_CODES.OK,
        jsonBody: {
          message: `Api healthy`,
          response: "LOL",
        },
      };
    } catch (error) {
      console.log(error);
      // if (error instanceof AppError) {
      //   return error.toHttpResponse();
      // } else {
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        jsonBody: {
          code: "INTERAL_SERVER_ERROR",
          message: "Un error desconocido ha ocurrido",
        },
        // };
      };
    }
  },
});
