"use client";

import { useState } from "react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement)?.value?.trim();
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value?.trim();
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)?.value?.trim();
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }
    const mailto = `mailto:info@successchemistry.com?subject=Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    window.location.href = mailto;
    setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-sc-blue focus:outline-none focus:ring-1 focus:ring-sc-blue"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-sc-blue focus:outline-none focus:ring-1 focus:ring-sc-blue"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-sc-blue focus:outline-none focus:ring-1 focus:ring-sc-blue resize-y"
          placeholder="Your message"
        />
      </div>
      {status === "error" && (
        <p className="text-sm text-red-600">Please fill in all fields.</p>
      )}
      {status === "success" && (
        <p className="text-sm text-green-600">Your email client will open to send the message.</p>
      )}
      <button
        type="submit"
        className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 rounded-lg font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors"
      >
        Send message
      </button>
    </form>
  );
}
