export async function apiClient(
  url: string,
  options: RequestInit = {}
) {
  const res = await fetch(url, {
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
