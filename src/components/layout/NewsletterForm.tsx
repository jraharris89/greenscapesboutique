"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Something went wrong");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to subscribe"
      );
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 text-moss-400">
        <div className="w-10 h-10 rounded-full bg-moss-500/20 flex items-center justify-center">
          <Check className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium">You&apos;re in!</p>
          <p className="text-sm text-sage-400">
            Watch your inbox for plant goodness.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="flex-1 px-4 py-3 bg-sage-800 border border-sage-700 rounded-lg text-white placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <span className="hidden sm:inline">Subscribe</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm text-terracotta-400">{errorMessage}</p>
      )}
    </form>
  );
}
