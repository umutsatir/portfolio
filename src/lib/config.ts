/**
 * Site vs blog origins.
 *
 * Production: umutsatir.dev (site) and blog.umutsatir.dev (blog), served by the
 * same Vercel project. Local dev: one origin, the blog lives under /blog.
 */
export const ROOT_DOMAIN = "umutsatir.dev";

const host = typeof location === "undefined" ? "" : location.hostname;

export const IS_BLOG_HOST = host.startsWith("blog.");
export const IS_DEV_BLOG = import.meta.env.DEV && typeof location !== "undefined" && location.pathname.startsWith("/blog");
export const IS_BLOG = IS_BLOG_HOST || IS_DEV_BLOG;

/** Router basename for the blog app (empty on the subdomain, /blog in dev). */
export const BLOG_BASENAME = IS_BLOG_HOST ? "" : "/blog";

const prod = import.meta.env.PROD;
export const SITE_URL = prod ? `https://${ROOT_DOMAIN}` : "/";
export const BLOG_URL = prod ? `https://blog.${ROOT_DOMAIN}` : "/blog";
