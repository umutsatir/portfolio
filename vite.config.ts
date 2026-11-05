import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

/** Serves the Vercel-style functions in /api during `vite dev` (production uses Vercel Functions). */
function apiDev(): Plugin {
  return {
    name: "api-dev",
    configureServer(server) {
      Object.assign(process.env, loadEnv("development", process.cwd(), ""));
      server.middlewares.use(async (req, res, next) => {
        const m = /^\/api\/([a-z0-9-]+)(?:\?.*)?$/.exec(req.url ?? "");
        if (!m) return next();
        try {
          const mod = await server.ssrLoadModule(`/api/${m[1]}.ts`);
          const handler = mod[req.method ?? "GET"] as ((r: Request) => Promise<Response>) | undefined;
          if (!handler) {
            res.statusCode = 405;
            return res.end();
          }
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const body = chunks.length ? Buffer.concat(chunks) : undefined;
          const request = new Request(`http://${req.headers.host}${req.url}`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
          });
          const response = await handler(request);
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (e) {
          server.config.logger.error(String(e));
          res.statusCode = 500;
          res.end("api error");
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [
    apiDev(),
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkFrontmatter, [remarkMdxFrontmatter, { name: "frontmatter" }]],
        providerImportSource: undefined,
      }),
    },
    react({ include: /\.(jsx|js|mdx|tsx|ts)$/ }),
  ],
});
