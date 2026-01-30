import { useState } from "react";

type PasteFormProps = {
  onSubmit: (data: {
    content: string;
    ttl_seconds?: number;
    max_views?: number;
  }) => Promise<void>;
};

export default function PasteForm({ onSubmit }: PasteFormProps) {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<number | "">("");
  const [maxViews, setMaxViews] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Content cannot be empty");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        content,
        ttl_seconds: ttl === "" ? undefined : Number(ttl),
        max_views: maxViews === "" ? undefined : Number(maxViews),
      });

      setContent("");
      setTtl("");
      setMaxViews("");
    } catch (err) {
      setError("Failed to create paste");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="paste-form" onSubmit={handleSubmit}>
      <textarea
        placeholder="Paste your text here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={12}
      />

      <div className="row">
        <label>
          Expires in (seconds)
          <input
            type="number"
            min={0}
            value={ttl}
            onChange={(e) =>
              setTtl(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </label>

        <label>
          Max views
          <input
            type="number"
            min={0}
            value={maxViews}
            onChange={(e) =>
              setMaxViews(e.target.value === "" ? "" : Number(e.target.value))
            }
          />
        </label>
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Paste"}
      </button>
    </form>
  );
}
