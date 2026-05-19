export async function getLastCommit(): Promise<{
  when: string;
  sha: string;
} | null> {
  try {
    const res = await fetch(
      "https://api.github.com/users/umutsatir/events/public",
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return null;
    const events = await res.json();
    const pushEvent = events.find((e: any) => e.type === "PushEvent");
    if (!pushEvent) return null;
    return {
      when: pushEvent.created_at,
      sha: pushEvent.payload.commits?.[0]?.sha?.slice(0, 7) ?? "",
    };
  } catch {
    return null;
  }
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return "just now";
  if (diffHours === 1) return "1h ago";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}
