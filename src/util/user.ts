import { Request } from "express";

export function getUserId(req: Request) {
    return parseFloat(req.headers.authorization);
}