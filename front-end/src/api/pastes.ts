type CreatePasteRequest = {
  content: string;
  ttl_seconds?: number;
  max_views?: number;
};

export async function createPaste(data: CreatePasteRequest) {
  const res = await fetch("/api/pastes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create paste");
  }

  return res.json();
}

export async function getPaste(id: string) {
  const res = await fetch(`/api/pastes/${id}`);

  if (!res.ok) {
    throw new Error("Paste unavailable");
  }

  return res.json();
}
