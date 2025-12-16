import { useState } from "react";

function GeminiModal({ onClose, summaryData }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askAI = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/ai/ask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            summaryData,
            question,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setAnswer(data.answer || "No response from AI");
    } catch (err) {
      setError(err.message || "AI failed to respond.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-overlay">
      <div className="ai-modal">
        {/* HEADER */}
        <div className="ai-header">
          <h3>Ask MGNREGA AI</h3>
          <button onClick={onClose}>✖</button>
        </div>

        {/* BODY */}
        <div className="ai-body">
          <textarea
            placeholder="Ask anything about the current MGNREGA data..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />

          <button onClick={askAI} disabled={loading}>
            {loading ? "Analyzing..." : "Ask AI"}
          </button>

          {error && <div className="ai-error">{error}</div>}

          {answer && (
            <div className="ai-response">
              <strong>AI Insight:</strong>
              <p>{answer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GeminiModal;
