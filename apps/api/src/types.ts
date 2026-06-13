import {
  type CookieOptions,
  type NextFunction,
  type Request,
  type Response,
} from "express";
export type Handler = (req: Request, res: Response, next: NextFunction) => any;

export enum StatusCode {
  Success = 200,
  InputError = 411,
  DocumentExists = 403,
  ServerError = 500,
  NotFound = 404,
  Unauthorized = 401,
}
export type CookieType = {
  name: string;
  value: string;
  options: CookieOptions;
};
