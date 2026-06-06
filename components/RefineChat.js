"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

/**
 * RefineChat — Conversational AI sidebar for refining presentations.
 */
export default function RefineChat({
  slides,
  onSlidesUpdate,
  isVisible,
}) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "I can help you refine your presentation! Try things like:\n• \"Make the tone more casual\"\n• \"Add a slide about pricing\"\n• \"Simplify slide 3\"\n• \"Make it more visual\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !slides?.length) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slides,
          instruction: userMessage,
          chatHistory: messages.slice(-6),
        }),
      });

      if (!res.ok) throw new Error("Refinement failed");

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.message },
      ]);

      if (data.slides) {
        onSlidesUpdate(data.slides, `Refined: "${userMessage}"`);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that request. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <Sparkles size={16} />
        AI Refine
      </div>

      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role === "user" ? "user" : "assistant"}`}>
            {msg.content.split("\n").map((line, j) => (
              <span key={j}>
                {line}
                {j < msg.content.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>
        ))}

        {isLoading && (
          <div className="chat-message assistant">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="spinner" style={{ width: "14px", height: "14px" }} />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          className="chat-input"
          type="text"
          placeholder={
            slides?.length
              ? "Ask me to refine your slides..."
              : "Generate slides first..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading || !slides?.length}
        />
        <button
          type="submit"
          className="chat-send-btn"
          disabled={!input.trim() || isLoading || !slides?.length}
          style={{
            opacity: !input.trim() || isLoading ? 0.4 : 1,
            cursor: !input.trim() || isLoading ? "not-allowed" : "pointer",
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
