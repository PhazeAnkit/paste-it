import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPaste } from "../api/pastes";
import PasteViewer from "../components/pasteViewer";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

export default function ViewPaste() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<PasteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Invalid paste ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    getPaste(id)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch(() => {
        setError("Paste unavailable");
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="page">
      <div className="card">
        <h1>View Paste</h1>

        {loading && <p>Loading paste...</p>}

        {!loading && error && !data && (
          <>
            <p className="error">{error}</p>
            <Link to="/">← Create a new paste</Link>
          </>
        )}

        {!loading && data && (
          <PasteViewer
            content={data.content}
            remainingViews={data.remaining_views}
            expiresAt={data.expires_at}
          />
        )}
      </div>
    </div>
  );
}
