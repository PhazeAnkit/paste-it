import { useState } from "react";
import PasteForm from "../components/pasteForm";
import { createPaste } from "../api/pastes";

export default function CreatePaste() {
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  async function handleCreatePaste(data: {
    content: string;
    ttl_seconds?: number;
    max_views?: number;
  }) {
    const res = await createPaste(data);
    setResultUrl(res.url);
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Create a Paste</h1>

        <PasteForm onSubmit={handleCreatePaste} />

        {resultUrl && (
          <div className="result">
            <p>Paste created!</p>
            <a href={resultUrl}>{resultUrl}</a>
          </div>
        )}
      </div>
    </div>
  );
}
