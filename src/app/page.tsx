
"use client";
import React, { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleExpand(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMeta(null);
    try {
      const res = await fetch("/api/expand-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMeta(data);
      // Save to dashboard
      await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: input, meta: data }),
      });
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-2 py-8 w-full">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-extrabold mb-2 text-center text-blue-800 tracking-tight drop-shadow-sm">Revealify</h1>
        <p className="mb-6 text-center text-gray-600 max-w-md">Paste a short link to instantly expand and preview its destination. Stay safe and informed!</p>
        <div className="w-full max-w-md mb-8">
          <form onSubmit={handleExpand} className="bg-white shadow-lg rounded-xl px-4 py-3 flex items-center gap-2">
            <input
              className="border border-gray-200 rounded-lg px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-base"
              placeholder="Paste a short link (bit.ly, t.co, etc.)"
              value={input}
              onChange={e => setInput(e.target.value)}
              required
              aria-label="Short link input"
              style={{ minWidth: 0 }}
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow disabled:opacity-50 transition whitespace-nowrap"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Expanding..." : "Expand"}
            </button>
          </form>
        </div>
        {error && <div className="text-red-600 mb-4 w-full text-center">{error}</div>}
        {meta && (
          <div className="bg-white shadow-2xl rounded-2xl p-7 w-full max-w-md mb-10 flex flex-col items-center animate-fade-in border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <img src={meta.favicon} alt="favicon" className="w-8 h-8 rounded shadow" />
              <span className="font-bold text-xl text-gray-900 tracking-tight">{meta.title}</span>
            </div>
            <div className="text-gray-600 text-base mb-3 text-center max-w-xs">{meta.description}</div>
            <a href={meta.finalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-mono text-xs break-all underline hover:text-blue-900 transition text-center">
              {meta.finalUrl}
            </a>
          </div>
        )}
        <Dashboard />
      </div>
    </main>
  );
}

function Dashboard() {
  const [links, setLinks] = React.useState<any[]>([]);
  React.useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(data => setLinks(data.links || []));
  }, []);
  if (!links.length) return null;
  return (
    <div className="w-full max-w-lg mt-2">
      <h2 className="font-bold mb-3 text-blue-700 text-lg text-center">Your Expanded Links (this session)</h2>
      <ul className="space-y-3">
        {links.map((item, i) => (
          <li key={i} className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <img src={item.meta.favicon} alt="favicon" className="w-5 h-5 rounded" />
              <span className="font-semibold text-sm text-gray-800">{item.meta.title}</span>
            </div>
            <a href={item.meta.finalUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 break-all underline hover:text-blue-900 transition text-center">
              {item.meta.finalUrl}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
