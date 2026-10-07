// src/admin/academic-setup/CommentBank.jsx
import React, { useState, useMemo, useEffect } from "react";
import { commentBankApi } from "../../api/commentBank";
import { useConfirm } from "../../components/common/ConfirmDialog";
import {
  Plus,
  Edit3,
  Trash2,
  Copy,
  Save,
  X,
  Search,
  CheckCircle2,
  MessageSquare,
  ChevronDown,
  Filter,
  Star,
  BookOpen,
} from "lucide-react";
import {
  FaBook,
  FaChalkboardTeacher,
  FaUserTie,
  FaStar,
  FaRegStar,
} from "react-icons/fa";

// Initial comments
// Starter comments the admin can load into an empty bank in one click.
const STARTER_COMMENTS = [
  // Subject Teacher - Excellent
  {
    id: 21,
    category: "subjectTeacher",
    performance: "excellent",
    text: "{name} has shown exceptional understanding of the subject this term. A consistent and hardworking student who grasps concepts quickly and applies them accurately.",
    tags: ["understanding", "hardworking"],
    favourite: true,
  },
  {
    id: 22,
    category: "subjectTeacher",
    performance: "excellent",
    text: "Outstanding performance in this subject. {name} demonstrates in-depth knowledge and always submits well-researched work. Keep it up.",
    tags: ["outstanding", "knowledge"],
    favourite: false,
  },
  {
    id: 23,
    category: "subjectTeacher",
    performance: "excellent",
    text: "{name} is an excellent student in this subject. Participates actively, asks insightful questions and consistently scores at the top of the class.",
    tags: ["participation", "top performance"],
    favourite: true,
  },

  // Subject Teacher - Good
  {
    id: 24,
    category: "subjectTeacher",
    performance: "good",
    text: "{name} has performed well this term. With a little more revision and practice, even better results are achievable. Good effort overall.",
    tags: ["revision", "effort"],
    favourite: false,
  },
  {
    id: 25,
    category: "subjectTeacher",
    performance: "good",
    text: "A good performance in this subject. {name} understands the core content well and should focus on improving speed and accuracy in assessments.",
    tags: ["understanding", "accuracy"],
    favourite: true,
  },

  // Subject Teacher - Average
  {
    id: 26,
    category: "subjectTeacher",
    performance: "average",
    text: "{name} shows some understanding of the subject but needs to put in more consistent effort, especially with revision and practice exercises.",
    tags: ["effort", "revision"],
    favourite: false,
  },
  {
    id: 27,
    category: "subjectTeacher",
    performance: "average",
    text: "An average result this term. {name} is advised to attend extra classes, complete all assignments on time and review class notes regularly.",
    tags: ["extra classes", "assignments"],
    favourite: false,
  },

  // Subject Teacher - Needs Improvement
  {
    id: 28,
    category: "subjectTeacher",
    performance: "needsImprovement",
    text: "{name} has struggled with this subject this term. Regular practice, extra support and a more focused approach in class are strongly recommended.",
    tags: ["practice", "support"],
    favourite: false,
  },
  {
    id: 29,
    category: "subjectTeacher",
    performance: "needsImprovement",
    text: "A disappointing result. {name} must pay more attention in class, complete all assignments and seek help from the subject teacher without delay.",
    tags: ["attention", "assignments"],
    favourite: false,
  },

  // Form Teacher - Excellent
  {
    id: 1,
    category: "formTeacher",
    performance: "excellent",
    text: "An exceptionally dedicated student who demonstrates outstanding academic commitment. {name} is a role model to peers and is encouraged to maintain this excellent standard.",
    tags: ["dedication", "commitment"],
    favourite: true,
  },
  {
    id: 2,
    category: "formTeacher",
    performance: "excellent",
    text: "{name} has shown remarkable improvement this term. A hardworking and disciplined student who gives their best in all areas.",
    tags: ["improvement", "hardworking"],
    favourite: false,
  },
  {
    id: 3,
    category: "formTeacher",
    performance: "excellent",
    text: "A brilliant student with exceptional intellectual ability. {name} approaches every challenge with confidence and determination.",
    tags: ["brilliant", "confident"],
    favourite: true,
  },
  {
    id: 4,
    category: "formTeacher",
    performance: "excellent",
    text: "{name} is a pleasure to teach. Consistent, focused and always willing to go above and beyond. Keep it up!",
    tags: ["consistent", "focused"],
    favourite: false,
  },

  // Form Teacher - Good
  {
    id: 5,
    category: "formTeacher",
    performance: "good",
    text: "{name} is a good student who is performing well. With more focus and consistent effort, there is room to reach the very top.",
    tags: ["focus", "effort"],
    favourite: false,
  },
  {
    id: 6,
    category: "formTeacher",
    performance: "good",
    text: "A committed student who participates actively in class. {name} should work on time management and completing assignments on time.",
    tags: ["participation", "time management"],
    favourite: false,
  },
  {
    id: 7,
    category: "formTeacher",
    performance: "good",
    text: "{name} has demonstrated solid understanding of the core concepts. Encouraged to tackle more challenging problems and seek help when needed.",
    tags: ["understanding", "challenge"],
    favourite: true,
  },

  // Form Teacher - Average
  {
    id: 8,
    category: "formTeacher",
    performance: "average",
    text: "{name} has the potential to perform much better. A more serious attitude towards studies and regular revision will make a significant difference.",
    tags: ["potential", "revision"],
    favourite: false,
  },
  {
    id: 9,
    category: "formTeacher",
    performance: "average",
    text: "There are signs of ability in {name}, but inconsistency in performance is a concern. Regular attendance and focused study will help greatly.",
    tags: ["consistency", "attendance"],
    favourite: false,
  },
  {
    id: 10,
    category: "formTeacher",
    performance: "average",
    text: "{name} is advised to seek additional support from subject teachers and spend more time on personal study outside the classroom.",
    tags: ["support", "personal study"],
    favourite: false,
  },

  // Form Teacher - Needs Improvement
  {
    id: 11,
    category: "formTeacher",
    performance: "needsImprovement",
    text: "{name} must demonstrate greater commitment to academic work. Irregular attendance and incomplete assignments have affected performance significantly.",
    tags: ["attendance", "assignments"],
    favourite: false,
  },
  {
    id: 12,
    category: "formTeacher",
    performance: "needsImprovement",
    text: "A serious concern about {name}'s performance this term. Parents are urged to provide closer supervision and support at home.",
    tags: ["concern", "parent support"],
    favourite: false,
  },

  // Headmaster - Excellent
  {
    id: 13,
    category: "headmaster",
    performance: "excellent",
    text: "An outstanding result. {name} has proven to be among the very best in the school. We are proud of this achievement and look forward to continued excellence.",
    tags: ["outstanding", "achievement"],
    favourite: true,
  },
  {
    id: 14,
    category: "headmaster",
    performance: "excellent",
    text: "Commendable performance. {name} embodies the values of Armed Forces SHTS - discipline, dedication and excellence.",
    tags: ["discipline", "values"],
    favourite: false,
  },

  // Headmaster - Good
  {
    id: 15,
    category: "headmaster",
    performance: "good",
    text: "A good result from {name}. With sustained effort and determination, even greater heights are achievable. Keep working hard.",
    tags: ["effort", "determination"],
    favourite: false,
  },
  {
    id: 16,
    category: "headmaster",
    performance: "good",
    text: "{name} has performed creditably. The school is pleased with this progress and encourages continued dedication.",
    tags: ["progress", "dedication"],
    favourite: true,
  },

  // Headmaster - Average
  {
    id: 17,
    category: "headmaster",
    performance: "average",
    text: "{name} can do better. I encourage a more focused approach to studies and making the most of every learning opportunity provided.",
    tags: ["improvement", "opportunities"],
    favourite: false,
  },
  {
    id: 18,
    category: "headmaster",
    performance: "average",
    text: "A fair performance. {name} is reminded that excellence requires consistent effort. There is no substitute for hard work and discipline.",
    tags: ["excellence", "hard work"],
    favourite: false,
  },

  // Headmaster - Needs Improvement
  {
    id: 19,
    category: "headmaster",
    performance: "needsImprovement",
    text: "{name}'s performance is below expectation. Parents and student must work together urgently to reverse this trend before the next term.",
    tags: ["expectation", "urgent"],
    favourite: false,
  },
  {
    id: 20,
    category: "headmaster",
    performance: "needsImprovement",
    text: "An unsatisfactory result. {name} must redouble their efforts and take school work much more seriously. Parental involvement is essential.",
    tags: ["unsatisfactory", "parental involvement"],
    favourite: false,
  },
];

const CATEGORIES = [
  { value: "subjectTeacher", label: "Subject Teacher Comments", Icon: FaBook },
  {
    value: "formTeacher",
    label: "Form Teacher Comments",
    Icon: FaChalkboardTeacher,
  },
  { value: "headmaster", label: "HOD Comments", Icon: FaUserTie },
];

const PERFORMANCES = [
  { value: "all", label: "All", color: "var(--dark-gray)" },
  { value: "excellent", label: "Excellent", color: "var(--success-dark)" },
  { value: "good", label: "Good", color: "var(--royal-blue)" },
  { value: "average", label: "Average", color: "var(--warning)" },
  {
    value: "needsImprovement",
    label: "Needs Improvement",
    color: "var(--accent-red)",
  },
];

const PERF_STYLE = {
  excellent: {
    bg: "#f0fdf4",
    color: "var(--success-dark)",
    label: "Excellent",
  },
  good: { bg: "#eef2ff", color: "var(--royal-blue)", label: "Good" },
  average: { bg: "#fffbeb", color: "var(--warning)", label: "Average" },
  needsImprovement: {
    bg: "#fff1f2",
    color: "var(--accent-red)",
    label: "Needs Improvement",
  },
};

const EMPTY = {
  category: "subjectTeacher",
  performance: "excellent",
  text: "",
  tags: [],
  favourite: false,
};

// Comment Card
const CommentCard = ({ comment, onEdit, onDelete, onToggleFav, onCopy }) => {
  const ps = PERF_STYLE[comment.performance];
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    onCopy(comment.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-all"
      style={{
        borderColor: "var(--medium-gray)",
        borderLeft: `3px solid ${ps.color}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
          style={{ backgroundColor: ps.bg, color: ps.color }}
        >
          {ps.label}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            type="button"
            onClick={() => onToggleFav(comment.id)}
            className="p-1 rounded transition text-sm"
            title={
              comment.favourite ? "Remove from favourites" : "Add to favourites"
            }
          >
            {comment.favourite ? (
              <FaStar style={{ color: "#f59e0b" }} />
            ) : (
              <FaRegStar style={{ color: "#9ca3af" }} />
            )}
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-semibold"
            style={{
              backgroundColor: copied ? "#f0fdf4" : "#eef2ff",
              color: copied ? "var(--success-dark)" : "var(--royal-blue)",
            }}
            title="Copy text"
          >
            {copied ? <CheckCircle2 size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={() => onEdit(comment)}
            className="p-1.5 rounded-lg hover:bg-yellow-50"
            style={{ color: "var(--warning)" }}
          >
            <Edit3 size={13} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            className="p-1.5 rounded-lg hover:bg-red-50"
            style={{ color: "var(--accent-red)" }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--dark-gray)" }}
      >
        {comment.text}
      </p>

      {comment.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {comment.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: "var(--light-gray)",
                color: "var(--dark-gray)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Comment Form Modal
const CommentModal = ({ comment, onSave, onClose }) => {
  const isEdit = !!comment?.id;
  const [form, setForm] = useState(comment || EMPTY);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (t) =>
    set(
      "tags",
      form.tags.filter((x) => x !== t),
    );

  const handleSave = () => {
    if (!form.text.trim()) {
      setError("Comment text is required");
      return;
    }
    onSave(form);
  };

  const previewText = form.text.replace(/{name}/g, "Kofi Mensah");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background:
              "linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))",
            borderRadius: "1rem 1rem 0 0",
          }}
        >
          <div className="flex items-center gap-3 text-white">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <MessageSquare size={16} />
            </div>
            <div>
              <p className="font-black">
                {isEdit ? "Edit Comment" : "Add New Comment"}
              </p>
              <p className="text-blue-200 text-xs">
                Use {"{name}"} as placeholder for student name
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-blue-200"
          >
            <X size={20} />
          </button>
        </div>
        <div
          className="h-1 flex-shrink-0"
          style={{ backgroundColor: "var(--accent-red)" }}
        />

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Category */}
          <div>
            <label
              className="text-xs font-bold uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set("category", c.value)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-semibold transition"
                  style={{
                    borderColor:
                      form.category === c.value
                        ? "var(--royal-blue)"
                        : "var(--medium-gray)",
                    backgroundColor:
                      form.category === c.value ? "#eef2ff" : "white",
                    color:
                      form.category === c.value
                        ? "var(--royal-blue)"
                        : "var(--dark-gray)",
                  }}
                >
                  <span>
                    <c.Icon size={14} />
                  </span>{" "}
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Performance level */}
          <div>
            <label
              className="text-xs font-bold uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Performance Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PERFORMANCES.filter((p) => p.value !== "all").map((p) => {
                const ps = PERF_STYLE[p.value];
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => set("performance", p.value)}
                    className="px-3 py-2 rounded-xl border-2 text-xs font-semibold transition"
                    style={{
                      borderColor:
                        form.performance === p.value
                          ? ps.color
                          : "var(--medium-gray)",
                      backgroundColor:
                        form.performance === p.value ? ps.bg : "white",
                      color:
                        form.performance === p.value
                          ? ps.color
                          : "var(--dark-gray)",
                    }}
                  >
                    {ps.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment text */}
          <div>
            <label
              className="text-xs font-bold uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Comment Text <span style={{ color: "var(--accent-red)" }}>*</span>
            </label>
            <textarea
              value={form.text}
              onChange={(e) => {
                set("text", e.target.value);
                setError("");
              }}
              rows={4}
              placeholder="Type comment here... Use {name} where the student's name should appear"
              className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none resize-none"
              style={{
                borderColor: error ? "var(--accent-red)" : "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--royal-blue)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = error
                  ? "var(--accent-red)"
                  : "var(--medium-gray)")
              }
            />
            {error && (
              <p
                className="text-xs mt-1"
                style={{ color: "var(--accent-red)" }}
              >
                {error}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {form.text.length} characters ·{" "}
              {(form.text.match(/{name}/g) || []).length} {"{name}"}{" "}
              placeholder(s)
            </p>
          </div>

          {/* Preview */}
          {form.text && (
            <div
              className="p-3 rounded-xl"
              style={{
                backgroundColor: "var(--light-gray)",
                border: "1px solid var(--medium-gray)",
              }}
            >
              <p className="text-xs font-bold uppercase tracking-wider mb-1.5 text-gray-400">
                Preview (with sample name)
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--dark-gray)" }}
              >
                {previewText}
              </p>
            </div>
          )}

          {/* Tags */}
          <div>
            <label
              className="text-xs font-bold uppercase tracking-wider block mb-1.5"
              style={{ color: "var(--dark-gray)" }}
            >
              Tags <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="e.g. dedication, improvement"
                className="flex-1 px-3 py-2 text-sm rounded-xl border-2 outline-none"
                style={{
                  borderColor: "var(--medium-gray)",
                  color: "var(--dark-gray)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--royal-blue)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--medium-gray)")
                }
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 text-sm font-semibold rounded-xl text-white"
                style={{ backgroundColor: "var(--royal-blue)" }}
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
                  style={{
                    backgroundColor: "var(--light-gray)",
                    color: "var(--dark-gray)",
                  }}
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Favourite */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => set("favourite", !form.favourite)}
              className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border transition"
              style={{
                borderColor: form.favourite ? "#f59e0b" : "var(--medium-gray)",
                backgroundColor: form.favourite ? "#fffbeb" : "white",
                color: form.favourite ? "#92400e" : "var(--dark-gray)",
              }}
            >
              <>
                {form.favourite ? (
                  <FaStar style={{ color: "#f59e0b" }} />
                ) : (
                  <FaRegStar style={{ color: "#9ca3af" }} />
                )}{" "}
                {form.favourite ? "Marked as Favourite" : "Mark as Favourite"}
              </>
            </button>
          </div>
        </div>

        <div
          className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0"
          style={{
            borderColor: "var(--medium-gray)",
            backgroundColor: "var(--light-gray)",
            borderRadius: "0 0 1rem 1rem",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl border"
            style={{
              borderColor: "var(--medium-gray)",
              color: "var(--dark-gray)",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl"
            style={{ backgroundColor: "var(--royal-blue)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
            }
          >
            <Save size={14} /> {isEdit ? "Save Changes" : "Add Comment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// CommentBank Main
const CommentBank = () => {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();
  const [search, setSearch] = useState("");
  const [filterCat, setFCat] = useState("all");
  const [filterPerf, setFPerf] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editComment, setEditC] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("subjectTeacher");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const load = async () => {
    try {
      setLoading(true);
      setComments(await commentBankApi.list());
    } catch (err: any) {
      showToast(err?.message || "Failed to load the comment bank", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const payloadOf = (form) => ({
    category: form.category,
    performance: form.performance,
    text: (form.text || "").trim(),
    tags: form.tags || [],
    favourite: !!form.favourite,
  });

  const handleSave = async (form) => {
    if (!(form.text || "").trim()) {
      showToast("The comment text is empty", "error");
      return;
    }
    try {
      if (form.id) {
        const saved = await commentBankApi.update(form.id, payloadOf(form));
        setComments((cs) => cs.map((c) => (c.id === saved.id ? saved : c)));
        showToast("Comment updated");
      } else {
        const saved = await commentBankApi.create(payloadOf(form));
        setComments((cs) => [...cs, saved]);
        showToast("Comment added to bank");
      }
      setShowModal(false);
      setEditC(null);
    } catch (err: any) {
      showToast(err?.message || "Failed to save comment", "error");
    }
  };

  const handleDelete = async (id) => {
    const target = comments.find((c) => c.id === id);
    const ok = await confirm({
      title: "Delete this comment?",
      message: target
        ? `"${target.text.slice(0, 120)}${target.text.length > 120 ? "…" : ""}"`
        : undefined,
    });
    if (!ok) return;
    try {
      await commentBankApi.remove(id);
      setComments((cs) => cs.filter((c) => c.id !== id));
      showToast("Comment removed");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete comment", "error");
    }
  };

  const handleToggleFav = async (id) => {
    const target = comments.find((c) => c.id === id);
    if (!target) return;
    try {
      const saved = await commentBankApi.update(id, {
        favourite: !target.favourite,
      });
      setComments((cs) => cs.map((c) => (c.id === id ? saved : c)));
    } catch (err: any) {
      showToast(err?.message || "Failed to update comment", "error");
    }
  };

  const loadStarters = async () => {
    try {
      setBusy(true);
      await commentBankApi.bulkCreate(
        STARTER_COMMENTS.map(({ id, ...rest }) => rest),
      );
      await load();
      showToast("Starter comments added");
    } catch (err: any) {
      showToast(err?.message || "Failed to add starter comments", "error");
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text).catch(() => {});
    showToast("Copied to clipboard");
  };

  const filtered = useMemo(
    () =>
      comments.filter((c) => {
        const matchCat = filterCat === "all" || c.category === filterCat;
        const matchPerf = filterPerf === "all" || c.performance === filterPerf;
        const matchSearch =
          !search ||
          c.text.toLowerCase().includes(search.toLowerCase()) ||
          (c.tags || []).some((t) => t.includes(search.toLowerCase()));
        return matchCat && matchPerf && matchSearch;
      }),
    [comments, filterCat, filterPerf, search],
  );

  const tabComments = filtered.filter((c) => c.category === activeTab);

  const stats = {
    total: comments.length,
    subjectTeacher: comments.filter((c) => c.category === "subjectTeacher")
      .length,
    formTeacher: comments.filter((c) => c.category === "formTeacher").length,
    headmaster: comments.filter((c) => c.category === "headmaster").length,
  };

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
          style={{
            backgroundColor:
              toast.type === "error"
                ? "var(--accent-red)"
                : "var(--success-dark)",
          }}
        >
          {toast.type === "error" ? (
            <Trash2 size={14} />
          ) : (
            <CheckCircle2 size={14} />
          )}{" "}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1
            className="text-xl font-black"
            style={{ color: "var(--dark-gray)" }}
          >
            Comment Bank
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {stats.total} comments · {stats.subjectTeacher} subject teacher ·{" "}
            {stats.formTeacher} form teacher · {stats.headmaster} HOD
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditC(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm"
          style={{ backgroundColor: "var(--royal-blue)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--royal-blue-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--royal-blue)")
          }
        >
          <Plus size={15} /> Add Comment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Comments",
            value: stats.total,
            color: "var(--royal-blue)",
          },
          {
            label: "Subject Teacher",
            value: stats.subjectTeacher,
            color: "var(--royal-blue)",
          },
          { label: "Form Teacher", value: stats.formTeacher, color: "#7c3aed" },
          { label: "HOD", value: stats.headmaster, color: "var(--warning)" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-white rounded-xl border p-4 text-center shadow-sm"
            style={{ borderColor: "var(--medium-gray)" }}
          >
            <p className="text-2xl font-black" style={{ color }}>
              {value}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filters */}
      <div
        className="bg-white rounded-xl border shadow-sm p-4"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search comment text or tags…"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border-2 outline-none"
              style={{
                borderColor: "var(--medium-gray)",
                color: "var(--dark-gray)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--royal-blue)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "var(--medium-gray)")
              }
            />
          </div>
          {/* Performance filter */}
          <div className="flex flex-wrap gap-2">
            {PERFORMANCES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setFPerf(p.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl transition"
                style={{
                  backgroundColor: filterPerf === p.value ? p.color : "white",
                  color: filterPerf === p.value ? "white" : "var(--dark-gray)",
                  border: "1px solid var(--medium-gray)",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
          {(search || filterPerf !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFPerf("all");
              }}
              className="ml-2 font-semibold"
              style={{ color: "var(--accent-red)" }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div
        className="flex border-b"
        style={{ borderColor: "var(--medium-gray)" }}
      >
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setActiveTab(c.value)}
            className="px-5 py-2.5 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2"
            style={{
              borderColor:
                activeTab === c.value ? "var(--royal-blue)" : "transparent",
              color:
                activeTab === c.value
                  ? "var(--royal-blue)"
                  : "var(--dark-gray)",
            }}
          >
            <c.Icon size={14} /> {c.label}
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-bold"
              style={{
                backgroundColor:
                  activeTab === c.value ? "#eef2ff" : "var(--medium-gray)",
                color: activeTab === c.value ? "var(--royal-blue)" : "#6b7280",
              }}
            >
              {filtered.filter((x) => x.category === c.value).length}
            </span>
          </button>
        ))}
      </div>

      {/* Comments grid */}
      {loading ? (
        <p className="text-center py-12 text-sm text-gray-400">
          Loading comment bank…
        </p>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">The comment bank is empty</p>
          <button
            type="button"
            disabled={busy}
            onClick={loadStarters}
            className="mt-3 px-4 py-2 text-sm font-bold text-white rounded-xl disabled:opacity-60"
            style={{ backgroundColor: "var(--royal-blue)" }}
          >
            {busy
              ? "Adding…"
              : `Add ${STARTER_COMMENTS.length} starter comments`}
          </button>
        </div>
      ) : tabComments.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-gray-400 font-medium">No comments found</p>
          <button
            type="button"
            onClick={() => {
              setEditC(null);
              setShowModal(true);
            }}
            className="mt-3 text-sm font-semibold"
            style={{ color: "var(--royal-blue)" }}
          >
            + Add the first comment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Group by performance */}
          {PERFORMANCES.filter((p) => p.value !== "all").map((perf) => {
            const group = tabComments.filter(
              (c) => c.performance === perf.value,
            );
            if (group.length === 0) return null;
            const ps = PERF_STYLE[perf.value];
            return (
              <div key={perf.value}>
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="text-xs font-black uppercase tracking-widest px-2 py-1 rounded-lg"
                    style={{ backgroundColor: ps.bg, color: ps.color }}
                  >
                    {ps.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {group.length} comment{group.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {group.map((comment) => (
                    <CommentCard
                      key={comment.id}
                      comment={comment}
                      onEdit={(c) => {
                        setEditC(c);
                        setShowModal(true);
                      }}
                      onDelete={handleDelete}
                      onToggleFav={handleToggleFav}
                      onCopy={handleCopy}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <CommentModal
          comment={editComment}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditC(null);
          }}
        />
      )}

      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

export default CommentBank;
