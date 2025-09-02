import { HttpResponseInit } from "@azure/functions";
import { STATUS_CODES } from "./status-codes";




export class AppError extends Error {
 code: keyof typeof STATUS_CODES;
 statusCode: number = 500;
 details: unknown;

 constructor(name: string, code: keyof typeof STATUS_CODES, message?: string, details?: unknown) {
  super();
  this.name = name;
  this.message = message || "";
  this.code = code;
  this.statusCode = STATUS_CODES[code];
  this.details = details
 }

 toJSON() {
  return {
   name: this.name,
   message: this.message,
   code: this.code,
   statusCode: this.statusCode
  }
 }

 toHttpResponse(): HttpResponseInit {
  return {
   status: this.statusCode,
   jsonBody: {
    code: this.code,
    name: this.name,
    message: this.message,
    details: this.details
   }
  }
 }

}