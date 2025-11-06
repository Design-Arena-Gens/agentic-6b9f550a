"use client";

import { useState } from "react";

type Language = "english" | "hinglish" | "punjabi";

export default function Home() {
  const [mood, setMood] = useState("reflective");
  const [tempo, setTempo] = useState("mid");
  const [language, setLanguage] = useState<Language>("hinglish");
  const [title, setTitle] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setLyrics("");
    setTitle("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, tempo, language }),
      });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = await res.json();
      setTitle(data.title);
      setLyrics(data.lyrics);
    } catch (e: any) {
      setError(e.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      maxWidth: 920,
      margin: '0 auto',
      padding: '48px 20px',
    }}>
      <header style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 36, margin: 0 }}>Soch Song Generator</h1>
        <p style={{ opacity: 0.8, marginTop: 8 }}>Create an original song that weaves the word "soch" into verses and hooks.</p>
      </header>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
        gap: 16,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}>
        <div>
          <label style={{ display: 'block', fontSize: 14, opacity: 0.9 }}>Mood</label>
          <select value={mood} onChange={(e) => setMood(e.target.value)} style={selectStyle}>
            <option value="reflective">Reflective</option>
            <option value="romantic">Romantic</option>
            <option value="ambitious">Ambitious</option>
            <option value="melancholic">Melancholic</option>
            <option value="uplifting">Uplifting</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 14, opacity: 0.9 }}>Tempo</label>
          <select value={tempo} onChange={(e) => setTempo(e.target.value)} style={selectStyle}>
            <option value="slow">Slow</option>
            <option value="mid">Mid</option>
            <option value="fast">Fast</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 14, opacity: 0.9 }}>Language</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} style={selectStyle}>
            <option value="english">English</option>
            <option value="hinglish">Hinglish</option>
            <option value="punjabi">Punjabi</option>
          </select>
        </div>
        <div style={{ alignSelf: 'end' }}>
          <button onClick={generate} disabled={loading} style={buttonStyle}>
            {loading ? "Generating?" : "Generate song with 'soch'"}
          </button>
        </div>
      </section>

      {error && (
        <div style={{ color: '#ff6b6b', marginBottom: 16 }}>Error: {error}</div>
      )}

      {(title || lyrics) && (
        <section style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12,
          padding: 20,
        }}>
          {title && <h2 style={{ marginTop: 0 }}>{title}</h2>}
          <pre style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: 16, margin: 0 }}>{lyrics}</pre>
        </section>
      )}

      <footer style={{ textAlign: 'center', opacity: 0.6, marginTop: 24, fontSize: 13 }}>
        Built for the web. All lyrics are newly generated.
      </footer>
    </main>
  );
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  color: '#e6e8f0',
  borderRadius: 10,
  padding: '10px 12px',
  marginTop: 6,
};

const buttonStyle: React.CSSProperties = {
  width: '100%',
  background: 'linear-gradient(90deg,#635bff,#7b61ff)',
  border: 'none',
  color: 'white',
  borderRadius: 10,
  padding: '12px 16px',
  cursor: 'pointer',
  fontWeight: 600,
};
