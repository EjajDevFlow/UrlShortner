import { useState } from "react";

export default function Shortener() {
  const [url, setUrl] = useState("");
  const [shortId, setShortId] = useState("");
  const [analytics, setAnalytics] = useState(null);

  const API = import.meta.env.VITE_API_URL;
  async function createShort() {
    try {
      const res = await fetch(`${API}/url`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setShortId(data.id);
      setAnalytics(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  async function getAnalytics() {
    try {
      if (!shortId) return alert("No shortId yet");
      const res = await fetch(`${API}/url/analytics/${shortId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch analytics");
      setAnalytics(data);
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  return (
    <div className="w-full max-w-lg bg-gray-800 p-6 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">URL Shortener</h1>

      {/* Input + Button */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Enter URL (https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={createShort}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
        >
          Shorten
        </button>
      </div>

      {/* Short URL  */}
      {shortId && (
        <div className="mt-4 text-center">
          <p className="text-lg">Short URL:</p>
          <a
            href={`${API}/${shortId}`}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:underline break-all"
          >
            {API}/{shortId}
          </a>
          <div className="mt-3">
            <button
              onClick={getAnalytics}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
            >
              Get Analytics
            </button>
          </div>
        </div>
      )}

      {/* Analytics */}
      {analytics && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-blue-400 ">Analytics</h2>
          <p className="mt-1  text-white focus:outline-none ">Total clicks: {analytics.totalClicks}</p>
          <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto text-sm text-white focus:outline-none ">
            {analytics.analytics.map((item, i) => (
              <li key={i}>{new Date(item.timestamp).toLocaleString()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
