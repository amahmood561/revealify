
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4">Revealify</h1>
      <form onSubmit={handleExpand} className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 w-80"
          placeholder="Paste a short link (bit.ly, t.co, etc.)"
          value={input}
          onChange={e => setInput(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Expanding..." : "Expand"}
        </button>
      </form>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {meta && (
        <div className="bg-white shadow rounded p-4 w-full max-w-md mb-8">
          <div className="flex items-center gap-2 mb-2">
            <img src={meta.favicon} alt="favicon" className="w-5 h-5" />
            <span className="font-semibold">{meta.title}</span>
          </div>
          <div className="text-gray-600 text-sm mb-1">{meta.description}</div>
          <a href={meta.finalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-700 break-all">
            {meta.finalUrl}
          </a>
        </div>
      )}
      <Dashboard />
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
    <div className="w-full max-w-md">
      <h2 className="font-bold mb-2">Your Expanded Links (this session)</h2>
      <ul className="space-y-2">
        {links.map((item, i) => (
          <li key={i} className="bg-white rounded shadow p-2">
            <div className="flex items-center gap-2">
              <img src={item.meta.favicon} alt="favicon" className="w-4 h-4" />
              <span className="font-semibold text-sm">{item.meta.title}</span>
            </div>
            <a href={item.meta.finalUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 break-all">
              {item.meta.finalUrl}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
