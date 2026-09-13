// src/pages/features/Features.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaChalkboardTeacher,
  FaUserTie,
  FaStar,
  FaClipboardList,
  FaFileAlt,
} from "react-icons/fa";

const STYLES = `
  .fp-fade { opacity:0; transform:translateY(28px); transition:opacity .6s ease,transform .6s ease; }
  .fp-fade.in { opacity:1; transform:translateY(0); }
  .fp-hover { transition:transform .25s ease,box-shadow .25s ease; }
  .fp-hover:hover { transform:translateY(-5px); box-shadow:0 20px 48px rgba(14,7,221,.13); }
  .fp-btn { transition:opacity .18s ease,transform .18s ease; }
  .fp-btn:hover { opacity:.88; transform:translateY(-2px); }
  .fp-tab { transition:all .2s ease; cursor:pointer; border:2px solid transparent; }
  .fp-marquee { display:flex; gap:3rem; animation:mq 28s linear infinite; width:max-content; }
  @keyframes mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .fp-faq-body { max-height:0; overflow:hidden; transition:max-height .35s ease; }
  .fp-faq-body.open { max-height:400px; }
  .fp-tag { display:inline-flex;align-items:center;gap:.35rem;font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;padding:.3rem .85rem;border-radius:999px; }
  @media(max-width:640px){ .fp-h1{ font-size:2.5rem!important; } }
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

const Rev = ({ children, delay = 0, className = "" }) => {
  const r = useReveal();
  return (
    <div
      ref={r}
      className={`fp-fade ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const Tick = ({ text, color }) => (
  <div className="flex items-start gap-2.5">
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="flex-shrink-0 mt-0.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    <span className="text-sm" style={{ color: "#374151" }}>
      {text}
    </span>
  </div>
);

const PORTALS = [
  {
    id: "admin",
    label: "Admin",
    hex: "#E63946",
    bg: "#fff1f2",
    loginPath: "/adminLogin",
    headline: "Total Control of the School",
    audience: "System Administrators",
    desc: "The administrative brain of the entire system. Manage every user, configure the academic structure, publish report cards and monitor school-wide performance - from one powerful dashboard.",
    features: [
      "Manage all users - teachers, students, parents",
      "Configure programmes, classes and subjects",
      "Set up grading scale and CA/exam weightings",
      "Manage academic years, terms and double-track dates",
      "View school-wide analytics and performance charts",
      "Send bulk messages to parents and staff",
      "Manage school calendar and key events",
      "Full audit log - every action is tracked",
      "Comment bank management for report cards",
      "Approve and publish terminal report cards",
    ],
  },
  {
    id: "teacher",
    label: "Teacher",
    hex: "#0e07dd",
    bg: "#eef2ff",
    loginPath: "/teacherLogin",
    headline: "Role-Adapted Academic Workspace",
    audience: "Subject Teachers · Form Teachers · HODs · Examiners",
    desc: "A smart portal that adapts to each teacher's assigned role. Subject teachers enter scores; form teachers manage their class; HODs oversee departments. Every teacher sees exactly what they need.",
    features: [
      "Enter CA and exam scores by subject and class",
      "Mark and view daily attendance records",
      "Generate and approve student report cards",
      "Form teachers manage and monitor their class",
      "HODs view department performance and staff workload",
      "View personal weekly timetable",
      "Submit WASSCE internal assessment marks",
      "Receive school announcements and notifications",
      "Add termly comments to student reports",
      "Track class average and performance distribution",
    ],
  },
  {
    id: "student",
    label: "Student",
    hex: "#7c3aed",
    bg: "#f5f3ff",
    loginPath: "/studentLogin",
    headline: "Your Academic Life, All in One Place",
    audience: "All enrolled Form 1, Form 2 and Form 3 students",
    desc: "Students can check results, download report cards, view their timetable and track attendance - from any device, at any time. Clean, fast and built for young people.",
    features: [
      "View current and previous term subject results",
      "Download and print personal report card",
      "See class position, aggregate and grade band",
      "Track daily and term attendance records",
      "View personal class timetable",
      "Compare performance across terms",
      "Receive important school announcements",
      "Update personal profile and contact details",
      "View teacher and headmaster comments",
      "See WASSCE predicted grades based on CA",
    ],
  },
  {
    id: "parent",
    label: "Parent",
    hex: "#b45309",
    bg: "#fefce8",
    loginPath: "/parentLogin",
    headline: "Stay Connected to Your Child's Progress",
    audience: "Parents and Guardians of enrolled students",
    desc: "Parents get real-time visibility into their child's academic journey without visiting the school. Results, report cards, attendance and school notices - accessible from any phone or computer.",
    features: [
      "View child's results and grades per subject",
      "View and download child's report card",
      "Monitor child's attendance percentage and history",
      "Switch between multiple enrolled children",
      "Receive school notices and urgent alerts",
      "Track academic improvement across terms",
      "View class position and aggregate scores",
      "See teacher and headmaster comments",
      "View child's timetable and class details",
      "Update personal contact information",
    ],
  },
];

// Professional icons for each teacher role
const TEACHER_ROLES = [
  {
    icon: FaBook,
    color: "#60a5fa",
    r: "Subject Teacher",
    d: "Enters scores for every subject they are assigned to teach.",
  },
  {
    icon: FaChalkboardTeacher,
    color: "#34d399",
    r: "Subject Teacher + Form Teacher",
    d: "Teaches subjects and manages the welfare of their form class.",
  },
  {
    icon: FaUserTie,
    color: "#f472b6",
    r: "Subject Teacher + HOD",
    d: "Teaches subjects and oversees their academic department.",
  },
  {
    icon: FaStar,
    color: "#fbbf24",
    r: "Subject Teacher + Form Teacher + HOD",
    d: "Combines teaching, class management and departmental leadership.",
  },
  {
    icon: FaClipboardList,
    color: "#a78bfa",
    r: "Form Teacher + HOD",
    d: "Class welfare and department leadership - no direct score entry.",
  },
  {
    icon: FaFileAlt,
    color: "#fb923c",
    r: "Examiner",
    d: "Manages examinations and WASSCE internal assessment oversight.",
  },
];

const STEPS = [
  {
    n: "01",
    c: "#E63946",
    t: "Admin Configures the School",
    d: "Admin sets up the school profile, academic year, double-track dates, programmes, classes, subjects and the WASSCE A1–F9 grading scale.",
    ticks: [
      "Create academic year and 3 term dates",
      "Set Track A and Track B calendars",
      "Configure programmes, classes and subjects",
      "Set CA/exam weighting and grading scale",
    ],
  },
  {
    n: "02",
    c: "#0e07dd",
    t: "Users Are Added and Enrolled",
    d: "Teachers are added with their specific roles. Students are enrolled into form classes, programmes and tracks. Parents are linked to their children.",
    ticks: [
      "Add teachers and assign their roles",
      "Enrol students into classes and tracks",
      "Link parents to student accounts",
      "Assign form teachers to classes",
    ],
  },
  {
    n: "03",
    c: "#7c3aed",
    t: "Teachers Enter Scores",
    d: "Subject teachers enter CA marks and end-of-term exam scores. The system instantly calculates totals, WASSCE grades (A1–F9) and class positions.",
    ticks: [
      "Enter Class Assessment (CA) marks",
      "Enter end-of-term exam scores",
      "System computes totals and WASSCE grades",
      "Form teacher adds class comment",
    ],
  },
  {
    n: "04",
    c: "#166534",
    t: "Report Cards Are Published",
    d: "Once all scores and comments are complete, Admin or Examiner approves and publishes report cards. Students and parents can view and download them instantly.",
    ticks: [
      "Admin reviews all scores and comments",
      "Report cards approved and published",
      "Students download their report card",
      "Parents view results from their portal",
    ],
  },
];

const FAQS = [
  {
    q: "Who uses the system and how do they log in?",
    a: "There are 4 user types - Admin, Teacher, Student and Parent - each with their own separate login page and portal. Credentials are created by the admin and distributed to users.",
  },
  {
    q: "How are teacher roles assigned?",
    a: "Admin assigns each teacher one of 6 roles when creating their account. The teacher's sidebar, dashboard and available tools automatically match their role - no further setup needed.",
  },
  {
    q: "How does the double track system work?",
    a: "Track A and Track B students attend school at different times. Admin sets separate term calendars for each track. Students are assigned a track at enrolment and all their records reflect it.",
  },
  {
    q: "Can a parent have more than one child in the system?",
    a: "Yes. Parents with multiple enrolled children can switch between them using a child switcher in their portal - without logging out and back in.",
  },
  {
    q: "How are WASSCE grades calculated?",
    a: "The system uses the standard Ghana WASSCE scale: A1 (80–100), B2 (70–79), B3 (65–69), C4 (60–64), C5 (55–59), C6 (50–54), D7 (45–49), E8 (40–44), F9 (0–39). Admins can customise the scale from Grading Configuration.",
  },
  {
    q: "Can report cards be printed?",
    a: "Yes. Both students and parents can open the report card and print it to A4 directly from the browser. The layout is formatted specifically for A4 printing.",
  },
  {
    q: "Is the system secure?",
    a: "Every portal has its own authentication. Role-based access means users only see what they are permitted to. Every action taken in the system is recorded in the admin audit log.",
  },
];

const FaqItem = ({ q, a, i }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border rounded-2xl overflow-hidden bg-white"
      style={{ borderColor: "var(--medium-gray)" }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span
            className="text-sm flex-shrink-0"
            style={{
              color: "var(--royal-blue)",
              minWidth: "2rem",
              fontWeight: "800",
            }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <p
            className="font-semibold text-sm"
            style={{ color: "var(--dark-gray)" }}
          >
            {q}
          </p>
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9ca3af"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="flex-shrink-0"
          style={{
            transform: open ? "rotate(180deg)" : undefined,
            transition: "transform .3s",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div className={`fp-faq-body ${open ? "open" : ""}`}>
        <p
          className="px-6 pb-5 pt-3 text-sm leading-relaxed border-t"
          style={{ color: "#6b7280", borderColor: "var(--medium-gray)" }}
        >
          {a}
        </p>
      </div>
    </div>
  );
};

const Counter = ({ end, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end]);
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

export default function Features() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("admin");
  const portal = PORTALS.find((p) => p.id === tab);

  const MARQUEE_ITEMS = Array(2)
    .fill([
      "Report Cards",
      "Double Track",
      "WASSCE Grading",
      "Score Entry",
      "Attendance Tracking",
      "Bulk Communication",
      "Audit Logs",
      "6 Teacher Roles",
      "4 Portals",
      "Class Positions",
      "Academic Calendar",
      "Analytics",
      "Term Management",
      "Comment Bank",
      "Parent Access",
      "Form Teacher Tools",
    ])
    .flat();

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ backgroundColor: "#fff", overflowX: "hidden" }}>
        {/* HERO */}
        <section
          className="relative w-full overflow-hidden py-8"
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
              fontSize: "14rem",
              lineHeight: 1,
              color: "rgba(255,255,255,.04)",
              letterSpacing: "-.04em",
              fontWeight: "800",
            }}
          >
            AFSHTS
          </div>
          <div
            className="relative max-w-5xl mx-auto w-full px-6 flex flex-col items-center justify-center text-center"
            style={{ minHeight: "70vh" }}
          >
            <Rev>
              <span
                className="fp-tag mb-6"
                style={{
                  backgroundColor: "rgba(255,255,255,.12)",
                  color: "rgba(255,255,255,.9)",
                  border: "1px solid rgba(255,255,255,.15)",
                }}
              >
                ⚡ Armed Forces SHTS · Kumasi, Ghana
              </span>
            </Rev>
            <Rev delay={80}>
              <h1
                className="fp-h1 text-white mb-6"
                style={{
                  fontWeight: "800",
                  fontSize: "3.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                Feature Page
              </h1>
            </Rev>
            <Rev delay={160}>
              <p
                className="text-base sm:text-lg leading-relaxed mb-10 mx-auto"
                style={{ color: "rgba(255,255,255,.7)", maxWidth: "700px" }}
              >
                <b className="text-white">
                  Armed Forces Senior High Technical School Terminal Report
                  Management System.{" "}
                </b>{" "}
                <br />A digitalises academic records, report cards, attendance
                and school communications purposely for Ghana's double-track
                Senior High Schools.
              </p>
            </Rev>
            <Rev delay={220}>
              <div className="flex flex-wrap justify-center gap-3 mb-16">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="fp-btn inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--accent-red)" }}
                >
                  Get Started
                  <svg
                    width="14"
                    height="14"
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
                  onClick={() =>
                    document
                      .getElementById("portals")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="fp-btn inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: "rgba(255,255,255,.1)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,.2)",
                  }}
                >
                  Explore Features ↓
                </button>
              </div>
            </Rev>
            <Rev delay={280}>
              <div
                className="flex flex-wrap justify-center gap-8 pt-8 border-t w-full"
                style={{ borderColor: "rgba(255,255,255,.12)" }}
              >
                {[
                  { v: 4, suffix: "+", l: "Portals" },
                  { v: 5000, suffix: "+", l: "Students" },
                  { v: 20, suffix: "+", l: "Teaching Staff" },
                  { v: 6, suffix: "+", l: "Teacher Roles" },
                ].map(({ v, suffix, l }) => (
                  <div key={l} className="text-center">
                    <p
                      className="text-2xl text-white"
                      style={{ fontWeight: "800" }}
                    >
                      <Counter end={v} suffix={suffix} />
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "rgba(255,255,255,.45)" }}
                    >
                      {l}
                    </p>
                  </div>
                ))}
                <div className="text-center">
                  <p
                    className="text-2xl text-white"
                    style={{ fontWeight: "800" }}
                  >
                    A1–F9
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,.45)" }}
                  >
                    WASSCE Grading
                  </p>
                </div>
                <div className="text-center">
                  <p
                    className="text-2xl text-white"
                    style={{ fontWeight: "800" }}
                  >
                    Track A/B
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "rgba(255,255,255,.45)" }}
                  >
                    Double Track
                  </p>
                </div>
              </div>
            </Rev>
          </div>
        </section>

        {/* MARQUEE */}
        <div
          className="overflow-hidden py-3.5 border-y"
          style={{
            backgroundColor: "var(--dark-gray)",
            borderColor: "#374151",
          }}
        >
          <div
            className="fp-marquee text-xs font-semibold uppercase tracking-widest"
            style={{ color: "rgba(255,255,255,.35)" }}
          >
            {MARQUEE_ITEMS.map((t, i) => (
              <span key={i} className="flex-shrink-0 flex items-center gap-4">
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ background: "var(--accent-red)" }}
                />
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* PORTALS */}
          <section id="portals" className="py-20">
            <Rev>
              <span
                className="fp-tag mb-4"
                style={{
                  backgroundColor: "#eef2ff",
                  color: "var(--royal-blue)",
                }}
              >
                The Four Portals
              </span>
              <h2
                className="text-3xl sm:text-4xl mt-3 mb-2"
                style={{
                  color: "var(--dark-gray)",
                  letterSpacing: "-.02em",
                  display: "block",
                  fontWeight: "800",
                }}
              >
                A Dedicated Workspace for Everyone
              </h2>
              <p
                className="text-sm mb-10 max-w-lg"
                style={{ color: "#6b7280" }}
              >
                Each user type has their own secure portal showing only the
                tools and information relevant to their role.
              </p>
            </Rev>
            <Rev delay={80}>
              <div className="flex flex-wrap gap-2 mb-8">
                {PORTALS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setTab(p.id)}
                    className="fp-tab px-5 py-2.5 rounded-full text-sm font-semibold"
                    style={{
                      borderColor: tab === p.id ? p.hex : "var(--medium-gray)",
                      backgroundColor: tab === p.id ? p.hex : "white",
                      color: tab === p.id ? "white" : "var(--dark-gray)",
                    }}
                  >
                    {p.label} Portal
                  </button>
                ))}
              </div>
            </Rev>
            {portal && (
              <div
                key={portal.id}
                className="fp-hover rounded-2xl overflow-hidden border-2"
                style={{ borderColor: portal.hex + "35" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div
                    className="p-8 sm:p-10"
                    style={{
                      background: `linear-gradient(150deg,${portal.bg},white)`,
                    }}
                  >
                    <span
                      className="fp-tag mb-4"
                      style={{
                        backgroundColor: portal.bg,
                        color: portal.hex,
                        border: `1px solid ${portal.hex}25`,
                      }}
                    >
                      {portal.label} Portal
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl mt-3 mb-2"
                      style={{
                        color: "var(--dark-gray)",
                        letterSpacing: "-.02em",
                        display: "block",
                        fontWeight: "800",
                      }}
                    >
                      {portal.headline}
                    </h3>
                    <p
                      className="text-xs font-semibold mb-4"
                      style={{ color: portal.hex }}
                    >
                      {portal.audience}
                    </p>
                    <p
                      className="text-sm leading-relaxed mb-7"
                      style={{ color: "#6b7280" }}
                    >
                      {portal.desc}
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(portal.loginPath)}
                      className="fp-btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: portal.hex }}
                    >
                      Go to {portal.label} Login
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
                  </div>
                  <div
                    className="p-8 sm:p-10 bg-white border-t lg:border-t-0 lg:border-l"
                    style={{ borderColor: "var(--medium-gray)" }}
                  >
                    <p
                      className="text-xs font-bold uppercase tracking-widest mb-5"
                      style={{ color: portal.hex }}
                    >
                      What {portal.label}s Can Do
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {portal.features.map((f) => (
                        <Tick key={f} text={f} color={portal.hex} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* HOW IT WORKS */}
          <section
            className="py-20 border-t"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <Rev>
              <span
                className="fp-tag mb-4"
                style={{
                  backgroundColor: "#f0fdf4",
                  color: "var(--success-dark)",
                }}
              >
                How It Works
              </span>
              <h2
                className="text-3xl sm:text-4xl mt-3 mb-2"
                style={{
                  color: "var(--dark-gray)",
                  letterSpacing: "-.02em",
                  display: "block",
                  fontWeight: "800",
                }}
              >
                Setup to Report Cards in 4 Steps
              </h2>
              <p
                className="text-sm mb-12 max-w-lg"
                style={{ color: "#6b7280" }}
              >
                The system follows the natural flow of a Ghanaian school term -
                from first configuration all the way to published results.
              </p>
            </Rev>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {STEPS.map((s, i) => (
                <Rev key={s.n} delay={i * 90}>
                  <div
                    className="fp-hover relative bg-white rounded-2xl border p-8 overflow-hidden h-full"
                    style={{ borderColor: "var(--medium-gray)" }}
                  >
                    <div
                      className="absolute right-4 top-3 pointer-events-none select-none"
                      style={{
                        fontSize: "7rem",
                        lineHeight: 1,
                        color: s.c,
                        opacity: 0.06,
                        fontWeight: "800",
                      }}
                    >
                      {s.n}
                    </div>
                    <div className="relative">
                      <p
                        className="text-4xl mb-4"
                        style={{ color: s.c, fontWeight: "800" }}
                      >
                        {s.n}
                      </p>
                      <h3
                        className="font-bold text-base mb-2"
                        style={{ color: "var(--dark-gray)" }}
                      >
                        {s.t}
                      </h3>
                      <p
                        className="text-sm leading-relaxed mb-4"
                        style={{ color: "#6b7280" }}
                      >
                        {s.d}
                      </p>
                      <div className="space-y-2">
                        {s.ticks.map((t) => (
                          <Tick key={t} text={t} color={s.c} />
                        ))}
                      </div>
                    </div>
                  </div>
                </Rev>
              ))}
            </div>
          </section>
        </div>

        {/* TEACHER ROLES - full-bleed */}
        <section
          className="py-20 px-4 sm:px-6"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue-dark),var(--royal-blue))",
          }}
        >
          <div className="max-w-6xl mx-auto">
            <Rev>
              <div className="text-center mb-12">
                <span
                  className="fp-tag mb-4"
                  style={{
                    backgroundColor: "rgba(255,255,255,.12)",
                    color: "white",
                    border: "1px solid rgba(255,255,255,.18)",
                  }}
                >
                  Teacher Role System
                </span>
                <h2
                  className="text-3xl sm:text-4xl mt-3 text-white"
                  style={{
                    letterSpacing: "-.02em",
                    display: "block",
                    fontWeight: "800",
                  }}
                >
                  6 Roles. One Portal. Smart Access.
                </h2>
                <p
                  className="text-sm mt-3 max-w-md mx-auto"
                  style={{ color: "rgba(255,255,255,.6)" }}
                >
                  Each teacher's dashboard and tools automatically match their
                  assigned role - no manual configuration needed.
                </p>
              </div>
            </Rev>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TEACHER_ROLES.map((role, i) => {
                const Icon = role.icon;
                return (
                  <Rev key={role.r} delay={i * 70}>
                    <div
                      className="fp-hover rounded-2xl p-6 h-full"
                      style={{
                        backgroundColor: "rgba(255,255,255,.07)",
                        border: "1px solid rgba(255,255,255,.11)",
                      }}
                    >
                      {/* Icon box */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                        style={{ backgroundColor: "rgba(255,255,255,.12)" }}
                      >
                        <Icon size={22} color={role.color} />
                      </div>
                      <p className="font-bold text-sm text-white mb-2">
                        {role.r}
                      </p>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "rgba(255,255,255,.55)" }}
                      >
                        {role.d}
                      </p>
                    </div>
                  </Rev>
                );
              })}
            </div>
          </div>
        </section>

        {/* DOUBLE TRACK */}
        <section
          className="py-20 px-4 sm:px-6 border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          <div className="max-w-6xl mx-auto">
            <Rev>
              <span
                className="fp-tag mb-4"
                style={{ backgroundColor: "#fef3c7", color: "#92400e" }}
              >
                Double Track System
              </span>
              <h2
                className="text-3xl sm:text-4xl mt-3 mb-2"
                style={{
                  color: "var(--dark-gray)",
                  letterSpacing: "-.02em",
                  display: "block",
                  fontWeight: "800",
                }}
              >
                Built for Ghana's Double Track SHS
              </h2>
              <p
                className="text-sm mb-12 max-w-lg"
                style={{ color: "#6b7280" }}
              >
                Track A and Track B students coexist in one system with fully
                separate calendars, term dates and results - aligned with GES
                policy.
              </p>
            </Rev>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  id: "A",
                  hex: "#854d0e",
                  bg: "#fefce8",
                  border: "#fcd34d",
                  status: "In Session",
                  pts: [
                    "Separate term start and end dates from Track B",
                    "Own resumption and vacation calendar",
                    "Students see only their track's schedule",
                    "Results and reports filtered by track",
                  ],
                },
                {
                  id: "B",
                  hex: "#166534",
                  bg: "#f0fdf4",
                  border: "#86efac",
                  status: "On Vacation",
                  pts: [
                    "Both tracks complete 3 full terms per year",
                    "Admin can switch active track with one click",
                    "Classes clearly labelled Track A or Track B",
                    "Report cards generated per track independently",
                  ],
                },
              ].map((t, i) => (
                <Rev key={t.id} delay={i * 120}>
                  <div
                    className="fp-hover rounded-2xl border-2 overflow-hidden h-full"
                    style={{ borderColor: t.border }}
                  >
                    <div
                      className="p-8"
                      style={{
                        background: `linear-gradient(145deg,${t.bg},white)`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3
                          className="text-5xl"
                          style={{ color: t.hex, fontWeight: "800" }}
                        >
                          Track {t.id}
                        </h3>
                        <span
                          className="fp-tag"
                          style={{
                            backgroundColor: t.bg,
                            color: t.hex,
                            border: `1px solid ${t.border}`,
                          }}
                        >
                          {t.status}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {t.pts.map((p) => (
                          <Tick key={p} text={p} color={t.hex} />
                        ))}
                      </div>
                    </div>
                  </div>
                </Rev>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <Rev>
              <div className="text-center mb-10">
                <span
                  className="fp-tag mb-4"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    color: "var(--dark-gray)",
                  }}
                >
                  FAQ
                </span>
                <h2
                  className="text-3xl sm:text-4xl mt-3"
                  style={{
                    color: "var(--dark-gray)",
                    letterSpacing: "-.02em",
                    display: "block",
                    fontWeight: "800",
                  }}
                >
                  Common Questions
                </h2>
              </div>
            </Rev>
            <div className="space-y-3">
              {FAQS.map((f, i) => (
                <Rev key={f.q} delay={i * 50}>
                  <FaqItem {...f} i={i} />
                </Rev>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section
          className="py-20 px-4 sm:px-6"
          style={{
            background:
              "linear-gradient(150deg,var(--dark-gray) 0%,#111827 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <Rev>
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                style={{ backgroundColor: "var(--accent-red)" }}
              >
                <span
                  className="text-white text-xl"
                  style={{ fontWeight: "800" }}
                >
                  AF
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl text-white mb-4"
                style={{
                  letterSpacing: "-.02em",
                  display: "block",
                  fontWeight: "800",
                }}
              >
                Everything in One Secure Platform
              </h2>
              <p
                className="text-sm leading-relaxed mb-10 max-w-lg mx-auto"
                style={{ color: "rgba(255,255,255,.5)" }}
              >
                Armed Forces Senior High Technical School now runs on a fully
                digital academic management system - no more paper records, no
                more manual calculations.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  {
                    l: "Admin Portal",
                    p: "/adminLogin",
                    c: "var(--accent-red)",
                  },
                  {
                    l: "Teacher Portal",
                    p: "/teacherLogin",
                    c: "var(--royal-blue)",
                  },
                  { l: "Student Portal", p: "/studentLogin", c: "#7c3aed" },
                  { l: "Parent Portal", p: "/parentLogin", c: "#b45309" },
                ].map(({ l, p, c }) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => navigate(p)}
                    className="fp-btn px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: c }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </Rev>
          </div>
        </section>
      </div>
    </>
  );
}
