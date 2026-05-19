import { MDXRemote as NextMDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";

interface MDXRemoteProps {
  source: string;
}

const components = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      {...props}
      style={{ color: "var(--color-text)", marginTop: "2rem", marginBottom: "0.75rem" }}
      className="text-h3"
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      {...props}
      style={{ color: "var(--color-text)", marginTop: "1.5rem", marginBottom: "0.5rem" }}
      className="text-small"
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p
      {...props}
      style={{ color: "var(--color-text-dim)", marginBottom: "1rem" }}
      className="text-body"
    />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      style={{ color: "var(--color-accent-2)" }}
      className="hover:underline transition-colors"
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      {...props}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.8125rem",
        backgroundColor: "var(--color-bg-elevated)",
        padding: "0.1em 0.3em",
        borderRadius: "3px",
        color: "var(--color-text)",
      }}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      {...props}
      style={{
        backgroundColor: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "6px",
        padding: "1rem",
        overflow: "auto",
        marginBottom: "1.5rem",
        fontSize: "0.8125rem",
        fontFamily: "var(--font-mono)",
        lineHeight: 1.6,
      }}
    />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul
      {...props}
      style={{
        color: "var(--color-text-dim)",
        paddingLeft: "1.5rem",
        marginBottom: "1rem",
        lineHeight: 1.6,
      }}
    />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol
      {...props}
      style={{
        color: "var(--color-text-dim)",
        paddingLeft: "1.5rem",
        marginBottom: "1rem",
        lineHeight: 1.6,
      }}
    />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li {...props} style={{ marginBottom: "0.25rem" }} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      {...props}
      style={{
        borderLeft: "2px solid var(--color-border)",
        paddingLeft: "1rem",
        color: "var(--color-text-faint)",
        marginBottom: "1rem",
        fontStyle: "italic",
      }}
    />
  ),
  hr: () => (
    <hr style={{ borderColor: "var(--color-border)", marginBlock: "2rem" }} />
  ),
};

export function MDXRemote({ source }: MDXRemoteProps) {
  return (
    <NextMDXRemote
      source={source}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            [
              rehypePrettyCode,
              {
                theme: "github-dark",
                onVisitLine(node: any) {
                  if (node.children.length === 0) {
                    node.children = [{ type: "text", value: " " }];
                  }
                },
              },
            ],
          ],
        },
      }}
      components={components}
    />
  );
}
