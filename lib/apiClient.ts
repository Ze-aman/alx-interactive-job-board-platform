export async function apiClient(
  url: string,
  options: RequestInit = {}
) {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const finalUrl =
    url.startsWith('http://') || url.startsWith('https://')
      ? url
      : base
        ? new URL(url, base).toString()
        : url;

  const res = await fetch(finalUrl, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw error;
  }

  return res.json();
}
