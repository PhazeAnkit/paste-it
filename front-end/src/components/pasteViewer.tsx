type PasteViewerProps = {
  content: string;
  remainingViews: number | null;
  expiresAt: string | null;
};

export default function PasteViewer({
  content,
  remainingViews,
  expiresAt,
}: PasteViewerProps) {
  return (
    <div className="paste-viewer">
      <pre className="paste-content">{content}</pre>

      <div className="meta">
        <div>
          <strong>Remaining views:</strong>{" "}
          {remainingViews === null ? "Unlimited" : remainingViews}
        </div>

        <div>
          <strong>Expires at:</strong>{" "}
          {expiresAt ? new Date(expiresAt).toLocaleString() : "Never"}
        </div>
      </div>
    </div>
  );
}
