// src/admin/academic-structure2/AcademicStructure2.jsx
import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import ClassStreamSetup from "./ClassStreamSetup";
import SubjectManagement from "./SubjectManagement";
import DepartmentManagement from "./DepartmentManagement";

const STEPS = [
  { id: 1, title: "Departments", desc: "Depts, HODs & staff" },
  { id: 2, title: "Classes", desc: "Form classes & capacity" },
  { id: 3, title: "Subjects", desc: "Core & elective subjects" },
];

const AcademicStructure2 = () => {
  const [step, setStep] = useState(1);
  const [visited, setVisited] = useState(new Set([1]));

  const goTo = (targetStep) => {
    setStep(targetStep);
    setVisited((visitedSteps) => new Set([...visitedSteps, targetStep]));
  };
  const next = () => goTo(Math.min(step + 1, STEPS.length));
  const prev = () => goTo(Math.max(step - 1, 1));

  const renderStep = () => {
    switch (step) {
      case 1:
        return <DepartmentManagement />;
      case 2:
        return <ClassStreamSetup />;
      case 3:
        return <SubjectManagement />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1
          className="text-xl font-black"
          style={{ color: "var(--dark-gray)" }}
        >
          School Organisation Setup
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Departments, classes and subjects
        </p>
      </div>

      <div
        className="bg-white rounded-2xl border shadow-sm overflow-hidden"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {/* Step tabs */}
        <div
          className="flex overflow-x-auto border-b"
          style={{ borderColor: "var(--medium-gray)" }}
        >
          {STEPS.map((stepInfo) => {
            const done = visited.has(stepInfo.id) && stepInfo.id < step;
            const active = step === stepInfo.id;
            return (
              <button
                key={stepInfo.id}
                type="button"
                onClick={() => goTo(stepInfo.id)}
                className="flex items-center gap-2.5 px-4 py-3 border-b-2 transition-colors flex-shrink-0"
                style={{
                  borderColor: active ? "var(--royal-blue)" : "transparent",
                  backgroundColor: active ? "#eef2ff" : "white",
                }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{
                    backgroundColor: done
                      ? "var(--success-dark)"
                      : active
                        ? "var(--royal-blue)"
                        : "var(--medium-gray)",
                    color: "white",
                  }}
                >
                  {done ? "✓" : stepInfo.id}
                </div>
                <div className="text-left hidden sm:block">
                  <p
                    className="text-xs font-bold"
                    style={{
                      color: active ? "var(--royal-blue)" : "var(--dark-gray)",
                    }}
                  >
                    {stepInfo.title}
                  </p>
                  <p className="text-xs text-gray-400">{stepInfo.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-5">{renderStep()}</div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={step === 1}
          className="px-4 py-2 text-sm font-semibold rounded-xl border transition"
          style={{
            borderColor: "var(--medium-gray)",
            color: "var(--dark-gray)",
            opacity: step === 1 ? 0.4 : 1,
          }}
        >
          ← Previous
        </button>
        <span className="text-xs text-gray-400">
          Step {step} of {STEPS.length}
        </span>
        {step < STEPS.length ? (
          <button
            type="button"
            onClick={next}
            className="px-5 py-2 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            Next →
          </button>
        ) : (
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: "var(--success-dark)" }}
          >
            <CheckCircle2 size={14} /> Save All
          </button>
        )}
      </div>
    </div>
  );
};

export default AcademicStructure2;
