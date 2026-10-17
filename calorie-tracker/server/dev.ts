// Local API server. Vite proxies /api here; production uses api/[...route].ts on Vercel.
import { createServer } from "node:http";
import { handle } from "../api/_lib/router.js";

const port = Number(process.env.PORT ?? 3001);
createServer((req, res) => void handle(req, res)).listen(port, () => console.log(`API on http://localhost:${port}`));
