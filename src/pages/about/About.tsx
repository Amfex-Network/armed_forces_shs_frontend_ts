// src/pages/about/About.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDesktop,
  FaMobileAlt,
  FaLock,
  FaChartBar,
  FaLink,
  FaTools,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaStar,
  FaShieldAlt,
  FaHandshake,
  FaBullseye,
  FaLightbulb,
  FaFlag,
} from "react-icons/fa";

const STYLES = `
  .ab-fade { opacity:0; transform:translateY(24px); transition:opacity .6s ease,transform .6s ease; }
  .ab-fade.in { opacity:1; transform:translateY(0); }
  .ab-hover { transition:transform .25s ease,box-shadow .25s ease; }
  .ab-hover:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(14,7,221,.1); }
  .ab-btn { transition:opacity .18s ease,transform .18s ease; }
  .ab-btn:hover { opacity:.88; transform:translateY(-2px); }
  .ab-tag { display:inline-flex;align-items:center;gap:.35rem;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:.28rem .85rem;border-radius:999px; }
  .ab-divider { width:3rem;height:3px;border-radius:999px;margin-bottom:1.25rem; }
  @media(max-width:640px){ .ab-hero-title{ font-size:2.2rem!important; } }
  @media(max-width:480px){ .ab-values-grid{ grid-template-columns:1fr!important; } }
`;

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add("in");
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
const Rev = ({ children, delay = 0 }) => {
  const r = useReveal();
  return (
    <div ref={r} className="ab-fade" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const DEVELOPER = {
  name: "AMFEX NETWORK",
  tagline: "Building Digital Solutions for Education and Beyond",
  desc: "AMFEX NETWORK is a Ghanaian software development company specialising in building custom digital systems for schools, businesses and organisations. We design, develop and deploy modern web-based platforms that simplify operations, improve communication and bring institutions into the digital age.",
  desc2:
    "From school management systems to business portals and custom web applications, AMFEX NETWORK delivers reliable, scalable and user-friendly software - built specifically for the Ghanaian context.",
  website: "www.amfexnetwork.com",
  email: "info@amfexnetwork.com",
  phone: "+233 54 562 2044",
  location: "Sunyani, Ghana",
  socials: [
    {
      label: "Website",
      icon: FaGlobe,
      url: "https://www.amfexnetwork.com",
      color: "var(--royal-blue)",
      bg: "#eef2ff",
    },
    {
      label: "Email",
      icon: FaEnvelope,
      url: "mailto:info@amfexnetwork.com",
      color: "var(--accent-red)",
      bg: "#fff1f2",
    },
  ],
  contacts: [
    {
      icon: FaGlobe,
      label: "Website",
      value: "www.amfexnetwork.com",
      href: "https://www.amfexnetwork.com",
    },
    {
      icon: FaEnvelope,
      label: "Email",
      value: "info@amfexnetwork.com",
      href: "mailto:info@amfexnetwork.com",
    },
    {
      icon: FaPhone,
      label: "Phone",
      value: "+233 54 562 2044",
      href: "tel:+233545622044",
    },
    {
      icon: FaMapMarkerAlt,
      label: "Location",
      value: "Sunyani, Ghana",
      href: null,
    },
  ],
  services: [
    {
      icon: FaDesktop,
      color: "var(--royal-blue)",
      bg: "#eef2ff",
      title: "School Management Systems",
      desc: "End-to-end digital platforms for SHS, JHS and tertiary institutions - reports, results, attendance and more.",
    },
    {
      icon: FaMobileAlt,
      color: "#7c3aed",
      bg: "#f5f3ff",
      title: "Web & Mobile Applications",
      desc: "Responsive web apps and mobile-first platforms built for real users in the Ghanaian environment.",
    },
    {
      icon: FaLock,
      color: "var(--accent-red)",
      bg: "#fff1f2",
      title: "Secure Portal Development",
      desc: "Role-based multi-portal systems with authentication, audit trails and data protection.",
    },
    {
      icon: FaChartBar,
      color: "var(--success-dark)",
      bg: "#f0fdf4",
      title: "Data & Analytics Dashboards",
      desc: "Custom reporting dashboards that turn raw school or business data into clear, actionable insights.",
    },
    {
      icon: FaLink,
      color: "#b45309",
      bg: "#fefce8",
      title: "System Integration",
      desc: "Connecting existing platforms - SMS gateways, payment systems, government databases and more.",
    },
    {
      icon: FaTools,
      color: "#0369a1",
      bg: "#f0f9ff",
      title: "Support & Maintenance",
      desc: "Ongoing technical support, system updates and training for staff after deployment.",
    },
  ],
};

const CLIENT = {
  name: "Armed Forces Senior High Technical School",
  shortName: "AFSHTS",
  location: "Uaddara Barracks, Kumasi, Ashanti Region",
  founded: "1998",
  ownership: "Ghana Armed Forces",
  waecCode: "GH0042",
  desc: "Armed Forces Senior High Technical School (AFSHTS) is a prestigious senior high technical school located at Uaddara Barracks in Kumasi, Ghana. Established under the Ghana Armed Forces, the school combines rigorous academic standards with the discipline and values of military tradition to produce well-rounded, disciplined and technically skilled graduates.",
  desc2:
    "AFSHTS operates under Ghana's transitional system, serving students across Form 1 to Form 3. The school is fully accredited by the Ghana Education Service (GES) and is a registered WAEC examination centre.",
  values: [
    {
      icon: FaStar,
      color: "#f59e0b",
      bg: "#fefce8",
      title: "Excellence",
      desc: "We pursue the highest standards in academic performance and personal conduct.",
    },
    {
      icon: FaShieldAlt,
      color: "var(--royal-blue)",
      bg: "#eef2ff",
      title: "Discipline",
      desc: "Order, respect and self-control are the foundation of everything we do.",
    },
    {
      icon: FaHandshake,
      color: "var(--success-dark)",
      bg: "#f0fdf4",
      title: "Integrity",
      desc: "Honesty and accountability guide our actions in and out of the classroom.",
    },
    {
      icon: FaBullseye,
      color: "var(--accent-red)",
      bg: "#fff1f2",
      title: "Service",
      desc: "We train students to contribute meaningfully to Ghana and the wider world.",
    },
    {
      icon: FaLightbulb,
      color: "#7c3aed",
      bg: "#f5f3ff",
      title: "Innovation",
      desc: "We embrace new ideas, technology and methods to improve learning outcomes.",
    },
    {
      icon: FaFlag,
      color: "#0369a1",
      bg: "#f0f9ff",
      title: "Patriotism",
      desc: "We instil pride in Ghana and a commitment to national development.",
    },
  ],
};

export default function About() {
  const navigate = useNavigate();

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ backgroundColor: "#fff", overflowX: "hidden" }}>
        {/* ══ HERO ════════════════════════════════════════════════════════ */}
        <section
          className="relative w-full overflow-hidden"
          style={{
            background:
              "linear-gradient(150deg,var(--royal-blue-dark) 0%,var(--royal-blue) 55%,#1e3a8a 100%)",
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
          <div
            className="absolute inset-x-0 top-0 h-1"
            style={{ background: "var(--accent-red)" }}
          />
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
            ABOUT
          </div>
          <div
            className="relative max-w-4xl mx-auto w-full px-6 flex flex-col items-center justify-center text-center"
            style={{ minHeight: "70vh" }}
          >
            <Rev>
              <span
                className="ab-tag mb-6"
                style={{
                  backgroundColor: "rgba(255,255,255,.12)",
                  color: "rgba(255,255,255,.9)",
                  border: "1px solid rgba(255,255,255,.15)",
                }}
              >
                About This System
              </span>
            </Rev>
            <Rev delay={80}>
              <h1
                className="ab-hero-title text-white mb-4"
                style={{
                  fontWeight: "800",
                  fontSize: "3rem",
                  lineHeight: 1.08,
                  letterSpacing: "-.02em",
                }}
              >
                Built in Ghana.
                <br />
                <span style={{ color: "#fbbf24" }}>Built for Ghana.</span>
              </h1>
            </Rev>
            <Rev delay={160}>
              <p
                className="text-base leading-relaxed mb-8 mx-auto"
                style={{ color: "rgba(255,255,255,.7)", maxWidth: "600px" }}
              >
                The AFSHTS Terminal Report System is a product of AMFEX NETWORK
                - developed to serve the digital needs of Ghanaian Senior High
                Schools.
              </p>
            </Rev>
            <Rev delay={220}>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate("/features")}
                  className="ab-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--accent-red)" }}
                >
                  Explore Features
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/contact")}
                  className="ab-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "rgba(255,255,255,.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,.2)",
                  }}
                >
                  Contact Us
                </button>
              </div>
            </Rev>
          </div>
        </section>

        {/* ══ STICKY TABS ═════════════════════════════════════════════════ */}
        <div
          className="border-b sticky top-0 z-10"
          style={{
            backgroundColor: "white",
            borderColor: "var(--medium-gray)",
            boxShadow: "0 1px 8px rgba(0,0,0,.05)",
          }}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex overflow-x-auto">
            {[
              { label: "The Developer", anchor: "developer" },
              { label: "The Client", anchor: "client" },
            ].map(({ label, anchor }) => (
              <button
                key={anchor}
                type="button"
                onClick={() =>
                  document
                    .getElementById(anchor)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 border-transparent transition-colors flex-shrink-0"
                style={{ color: "var(--dark-gray)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--royal-blue)";
                  e.currentTarget.style.borderColor = "var(--royal-blue)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--dark-gray)";
                  e.currentTarget.style.borderColor = "transparent";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══ 01 - THE DEVELOPER ══════════════════════════════════════════ */}
        <section id="developer">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <Rev>
              <span
                className="ab-tag mb-3"
                style={{
                  backgroundColor: "#eef2ff",
                  color: "var(--royal-blue)",
                }}
              >
                01 · The Developer
              </span>
              <div
                className="ab-divider mt-4"
                style={{ backgroundColor: "var(--royal-blue)" }}
              />
            </Rev>

            {/* Brand card */}
            <Rev delay={80}>
              <div
                className="ab-hover rounded-2xl overflow-hidden border mb-10"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <div
                  className="p-6 sm:p-10"
                  style={{
                    background:
                      "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
                  }}
                >
                  <div className="flex items-center gap-4 sm:gap-5 mb-6">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-black text-lg shadow-lg"
                      style={{ backgroundColor: "var(--accent-red)" }}
                    >
                      AN
                    </div>
                    <div>
                      <h2
                        className="text-xl sm:text-3xl font-black text-white"
                        style={{ letterSpacing: "-.02em" }}
                      >
                        {DEVELOPER.name}
                      </h2>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{ color: "rgba(255,255,255,.65)" }}
                      >
                        {DEVELOPER.tagline}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: "rgba(255,255,255,.75)" }}
                  >
                    {DEVELOPER.desc}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(255,255,255,.65)" }}
                  >
                    {DEVELOPER.desc2}
                  </p>
                </div>

                {/* Contact strip - react-icons */}
                <div
                  className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0"
                  style={{ borderTop: "1px solid var(--medium-gray)" }}
                >
                  {DEVELOPER.contacts.map(
                    ({ icon: Icon, label, value, href }) => (
                      <div key={label} className="px-4 py-3 sm:px-5 sm:py-4">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon size={11} color="#9ca3af" />
                          <p
                            className="text-xs font-semibold"
                            style={{ color: "#9ca3af" }}
                          >
                            {label}
                          </p>
                        </div>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm font-semibold hover:underline break-all"
                            style={{ color: "var(--royal-blue)" }}
                          >
                            {value}
                          </a>
                        ) : (
                          <p
                            className="text-xs sm:text-sm font-semibold"
                            style={{ color: "var(--dark-gray)" }}
                          >
                            {value}
                          </p>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </Rev>

            {/* Services - react-icons */}
            <Rev delay={100}>
              <h3
                className="font-black text-base mb-5"
                style={{ color: "var(--dark-gray)" }}
              >
                What We Build
              </h3>
            </Rev>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {DEVELOPER.services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Rev key={s.title} delay={i * 60}>
                    <div
                      className="ab-hover bg-white rounded-2xl border p-5 h-full"
                      style={{ borderColor: "var(--medium-gray)" }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 flex-shrink-0"
                        style={{ backgroundColor: s.bg }}
                      >
                        <Icon size={20} color={s.color} />
                      </div>
                      <p
                        className="font-bold text-sm mb-1.5"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.title}
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "#6b7280" }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </Rev>
                );
              })}
            </div>

            {/* Social links - react-icons */}
            <Rev delay={180}>
              <div className="flex flex-wrap gap-3">
                {DEVELOPER.socials.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ab-btn inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border"
                      style={{
                        borderColor: "var(--medium-gray)",
                        color: "var(--dark-gray)",
                        backgroundColor: "white",
                      }}
                    >
                      <Icon size={14} color={s.color} /> {s.label}
                    </a>
                  );
                })}
              </div>
            </Rev>
          </div>
        </section>

        {/*  02 - THE CLIENT  */}
        <section id="client" style={{ backgroundColor: "var(--light-gray)" }}>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <Rev>
              <span
                className="ab-tag mb-3"
                style={{
                  backgroundColor: "#fff1f2",
                  color: "var(--accent-red)",
                }}
              >
                02 · The Client
              </span>
              <div
                className="ab-divider mt-4"
                style={{ backgroundColor: "var(--accent-red)" }}
              />
            </Rev>

            {/* School card */}
            <Rev delay={80}>
              <div
                className="ab-hover rounded-2xl overflow-hidden border mb-10"
                style={{ borderColor: "var(--medium-gray)" }}
              >
                <div
                  className="h-28 sm:h-32 relative"
                  style={{
                    background:
                      "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                </div>
                <div className="bg-white px-6 sm:px-8 pb-6 sm:pb-8 pt-4">
                  <div className="flex items-center gap-4 sm:gap-5 mb-5">
                    <div
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                      style={{ backgroundColor: "var(--accent-red)" }}
                    >
                      {CLIENT.shortName}
                    </div>
                    <div className="pb-1">
                      <h2
                        className="text-lg sm:text-xl font-black"
                        style={{
                          color: "var(--dark-gray)",
                          letterSpacing: "-.01em",
                        }}
                      >
                        {CLIENT.name}
                      </h2>
                      <p className="text-xs" style={{ color: "#9ca3af" }}>
                        {CLIENT.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {[
                      {
                        label: `Est. ${CLIENT.founded}`,
                        bg: "#eef2ff",
                        color: "var(--royal-blue)",
                      },
                      {
                        label: CLIENT.ownership,
                        bg: "#fff1f2",
                        color: "var(--accent-red)",
                      },
                      {
                        label: `WAEC Code: ${CLIENT.waecCode}`,
                        bg: "#f0fdf4",
                        color: "var(--success-dark)",
                      },
                      {
                        label: "GES Accredited",
                        bg: "#fefce8",
                        color: "#b45309",
                      },
                    ].map((b) => (
                      <span
                        key={b.label}
                        className="ab-tag"
                        style={{ backgroundColor: b.bg, color: b.color }}
                      >
                        {b.label}
                      </span>
                    ))}
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-3"
                    style={{ color: "#374151" }}
                  >
                    {CLIENT.desc}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#6b7280" }}
                  >
                    {CLIENT.desc2}
                  </p>
                </div>
              </div>
            </Rev>

            {/* Core Values - react-icons */}
            <Rev delay={100}>
              <h3
                className="font-black text-base mb-5"
                style={{ color: "var(--dark-gray)" }}
              >
                Core Values
              </h3>
            </Rev>
            <div className="ab-values-grid grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {CLIENT.values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <Rev key={v.title} delay={i * 60}>
                    <div
                      className="ab-hover bg-white rounded-2xl border p-4 sm:p-5 text-center"
                      style={{ borderColor: "var(--medium-gray)" }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                        style={{ backgroundColor: v.bg }}
                      >
                        <Icon size={22} color={v.color} />
                      </div>
                      <p
                        className="font-black text-xs sm:text-sm mb-1.5"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {v.title}
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "#6b7280" }}
                      >
                        {v.desc}
                      </p>
                    </div>
                  </Rev>
                );
              })}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section
          className="py-12 sm:py-16 px-4 sm:px-6 text-center"
          style={{
            background:
              "linear-gradient(150deg,var(--dark-gray) 0%,#111827 100%)",
          }}
        >
          <Rev>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: "rgba(255,255,255,.35)" }}
            >
              Ready to get started?
            </p>
            <h2
              className="text-xl sm:text-3xl font-black text-white mb-6"
              style={{ letterSpacing: "-.02em" }}
            >
              Access Your Portal
            </h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {[
                { l: "Admin", p: "/adminLogin", c: "var(--accent-red)" },
                { l: "Teacher", p: "/teacherLogin", c: "var(--royal-blue)" },
                { l: "Student", p: "/studentLogin", c: "#7c3aed" },
                { l: "Parent", p: "/parentLogin", c: "#b45309" },
              ].map(({ l, p, c }) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => navigate(p)}
                  className="ab-btn px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: c }}
                >
                  {l} Portal
                </button>
              ))}
            </div>
            <p
              className="text-xs mt-6"
              style={{ color: "rgba(255,255,255,.25)" }}
            >
              Developed by {DEVELOPER.name} · {DEVELOPER.website}
            </p>
          </Rev>
        </section>
      </div>
    </>
  );
}
