// src/pages/contact/Contact.jsx
import React, { useState } from "react";

const STYLES = `
  .con-input {
    width:100%; padding:.65rem .9rem; font-size:.875rem;
    border:1.5px solid #e5e7eb; border-radius:.5rem;
    outline:none; transition:border-color .2s ease, box-shadow .2s ease;
    background:white; color:#111827; font-family:inherit;
  }
  .con-input:focus { border-color:var(--royal-blue); box-shadow:0 0 0 3px rgba(14,7,221,.07); }
  .con-input.err { border-color:var(--accent-red); }
  .con-send {
    width:100%; padding:.8rem; font-size:.9rem; font-weight:700;
    background:var(--accent-red); color:white; border:none;
    border-radius:.5rem; cursor:pointer;
    transition:background .2s ease, transform .15s ease;
  }
  .con-send:hover { background:var(--accent-red-dark); transform:translateY(-1px); }
  .con-send:disabled { background:#9ca3af; cursor:not-allowed; transform:none; }
  @keyframes spin { to{transform:rotate(360deg)} }
  .con-spin { animation:spin .8s linear infinite; display:inline-block; }
`;

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.subject.trim()) e.subject = "Required";
    if (!form.message.trim()) e.message = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1600);
  };

  const INFO = [
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z" />
        </svg>
      ),
      label: "Phone Number",
      value: "+233 54 562 2044",
      href: "tel:+233545622044",
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: "Email Address",
      value: "admin@afshts.edu.gh",
      href: "mailto:admin@afshts.edu.gh",
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: "Our Location",
      value: "Uaddara Barracks, Kumasi, Ashanti Region, Ghana",
      href: "https://maps.google.com/?q=Uaddara+Barracks+Kumasi+Ghana",
    },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="bgColor">
        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section
          className="relative w-full overflow-hidden py-20 flex items-center justify-center text-center"
          style={{
            background:
              "linear-gradient(150deg,var(--royal-blue-dark) 0%,var(--royal-blue) 55%,#1e3a8a 100%)",
            minHeight: "40vh",
          }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          {/* Red top stripe */}

          {/* Ghost text */}
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
            style={{
              fontSize: "12rem",
              lineHeight: 1,
              color: "rgba(255,255,255,.04)",
              fontWeight: "800",
              letterSpacing: "-.04em",
            }}
          >
            CONTACT
          </div>

          {/* Content */}
          <div className="relative px-6">
            <span
              className="inline-flex items-center text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5"
              style={{
                backgroundColor: "rgba(255,255,255,.12)",
                color: "rgba(255,255,255,.9)",
                border: "1px solid rgba(255,255,255,.15)",
              }}
            >
              🛠️ &nbsp; System Support · AFSHTS
            </span>
            <h1
              className="text-white mb-3"
              style={{
                fontWeight: "800",
                fontSize: "3rem",
                lineHeight: 1.08,
                letterSpacing: "-.02em",
              }}
            >
              Contact <span style={{ color: "#fbbf24" }}>Us</span>
            </h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,.55)" }}>
              Home &nbsp;›&nbsp; Contact Us
            </p>
          </div>
        </section>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* ── LEFT — form ──────────────────────────────────────────── */}
            <div>
              <h2
                className="text-2xl font-black mb-2"
                style={{ color: "var(--dark-gray)" }}
              >
                Get In Touch
              </h2>
              <p className="text-sm mb-7" style={{ color: "#6b7280" }}>
                Fill out the form below and the AFSHTS system administrator will
                respond to your issue as soon as possible.
              </p>

              {sent ? (
                <div className="text-center py-12">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: "#f0fdf4" }}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--success-dark)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3
                    className="font-black text-lg mb-2"
                    style={{ color: "var(--dark-gray)" }}
                  >
                    Message Sent!
                  </h3>
                  <p className="text-sm mb-6" style={{ color: "#6b7280" }}>
                    Thank you, <strong>{form.name}</strong>. We'll respond to{" "}
                    <strong>{form.email}</strong> as soon as possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSent(false);
                      setForm({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="con-send"
                    style={{
                      maxWidth: "200px",
                      margin: "0 auto",
                      display: "block",
                    }}
                  >
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      Name
                    </label>
                    <input
                      className={`con-input ${errors.name ? "err" : ""}`}
                      placeholder="Full name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                    />
                    {errors.name && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--accent-red)" }}
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className={`con-input ${errors.email ? "err" : ""}`}
                      placeholder="example@email.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                    {errors.email && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--accent-red)" }}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      Subject
                    </label>
                    <input
                      className={`con-input ${errors.subject ? "err" : ""}`}
                      placeholder="e.g. Login issue, Result problem…"
                      value={form.subject}
                      onChange={(e) => set("subject", e.target.value)}
                    />
                    {errors.subject && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--accent-red)" }}
                      >
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className="block text-xs font-semibold mb-1.5"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      Message
                    </label>
                    <textarea
                      rows={5}
                      className={`con-input ${errors.message ? "err" : ""}`}
                      placeholder="Type here…"
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      style={{ resize: "vertical", minHeight: "120px" }}
                    />
                    {errors.message && (
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--accent-red)" }}
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <button type="submit" className="con-send" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="con-spin"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path d="M21 12a9 9 0 11-6.219-8.56" />
                        </svg>
                        Sending…
                      </span>
                    ) : (
                      "Send Now"
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ── RIGHT — info cards ────────────────────────────────────── */}
            <div className="space-y-5">
              {INFO.map(({ icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-5 p-6 rounded-xl border text-left transition-all hover:shadow-md"
                  style={{ borderColor: "#e5e7eb", textDecoration: "none" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--royal-blue)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "#e5e7eb")
                  }
                >
                  {/* Icon circle */}
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--accent-red)" }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p
                      className="font-black text-sm mb-1"
                      style={{ color: "var(--dark-gray)" }}
                    >
                      {label}
                    </p>
                    <p className="text-sm" style={{ color: "#6b7280" }}>
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── FOOTER STRIP ──────────────────────────────────────────────── */}
        <div
          className="border-t py-5 px-6 text-center"
          style={{
            borderColor: "#e5e7eb",
            backgroundColor: "var(--light-gray)",
          }}
        >
          <p className="text-xs" style={{ color: "#9ca3af" }}>
            AFSHTS Terminal Report Management System · Developed by{" "}
            <a
              href="https://amfexnetwork.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:underline"
              style={{ color: "var(--royal-blue)" }}
            >
              AMFEX NETWORK
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
