"use client";

import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

interface Subscriber {
  email: string;
  subscribedAt: string;
  lastUpdated: string;
  source?: string;
  path?: string;
  [key: string]: any;
}

export default function SubscribersAdmin() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscribers();
    }
  }, [isAuthenticated]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setAuthError("");
        setPassword("");
      } else {
        setAuthError("Invalid password");
        setPassword("");
      }
    } catch {
      setAuthError("Authentication failed");
    }
  };

  const fetchSubscribers = async () => {
    try {
      const response = await fetch("/api/subscribers");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setSubscribers(data.subscribers || []);
    } catch (err) {
      setError("Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  };

  const filteredSubscribers = subscribers.filter(
    (sub) =>
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.source || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sub.path || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    if (subscribers.length === 0) return;

    const headers = ["Email", "Subscribed At", "Source", "Path"];
    const rows = subscribers.map((sub) => [
      sub.email,
      new Date(sub.subscribedAt).toLocaleString(),
      sub.source || "",
      sub.path || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Admin Access</h1>
              <p className="text-slate-400 text-sm">
                Enter password to continue
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-300">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError("");
                }}
                placeholder="Enter admin password"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                autoFocus
              />
              {authError && (
                <p className="mt-2 text-sm text-red-400">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Access Dashboard
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500 text-center">
            Set ADMIN_PASSWORD in environment variables
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading subscribers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-xl text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Email Subscribers</h1>
            <p className="text-slate-400">
              Total: {subscribers.length} subscriber
              {subscribers.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={exportCSV}
            className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Export CSV
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by email, source, or path..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {filteredSubscribers.length === 0 ? (
          <div className="bg-slate-800 rounded-lg p-12 text-center text-slate-400">
            {searchTerm
              ? "No subscribers found matching your search"
              : "No subscribers yet"}
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Subscribed
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Source
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Page
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredSubscribers.map((subscriber, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-sm">
                        {subscriber.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {new Date(subscriber.subscribedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {subscriber.source || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {subscriber.path || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
