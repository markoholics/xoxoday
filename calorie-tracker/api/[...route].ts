import type { IncomingMessage, ServerResponse } from "node:http";
import { handle } from "./_lib/router.js";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  return handle(req, res);
}
