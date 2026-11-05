import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { IS_BLOG } from "./lib/config";
import { initClickFx } from "./lib/clickFx";
import "./styles.css";

initClickFx();

// Two apps, one bundle graph: the blog (blog.<domain>, or /blog in dev) and the site.
// Each is its own lazy chunk so the site never ships the blog's posts.
const App = lazy(() => (IS_BLOG ? import("./blog/BlogApp") : import("./pages/Home")));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </StrictMode>,
);
