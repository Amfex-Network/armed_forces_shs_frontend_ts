// src/teacher/data/teacherData.js
// Re-exports from central data source + teacher-specific data
import {
  STUDENTS,
  SCHOOL_INFO as _SCHOOL_INFO,
  TERM_INFO as _TERM_INFO,
  ACADEMIC_YEARS as _ACADEMIC_YEARS,
  TEACHERS as _TEACHERS,
  PARENTS as _PARENTS,
  PARENT_CHILDREN as _PARENT_CHILDREN,
  STUDENT_PARENT as _STUDENT_PARENT,
  SCHOOL_STATS as _SCHOOL_STATS,
  GRADE_SCALE as _GRADE_SCALE,
  getGradeFromScore as _getGradeFromScore,
  getGradeLabel as _getGradeLabel,
  getGradeColor as _getGradeColor,
  getGradeColorHex as _getGradeColorHex,
  getPerformanceBand as _getPerformanceBand,
  getAttendanceColor as _getAttendanceColor,
  ATTENDANCE_STATUS_STYLE as _ATTENDANCE_STATUS_STYLE,
} from "../../data/schoolData";

// ─── Re-exports ───────────────────────────────────────────────────────────────
export const SCHOOL_INFO = _SCHOOL_INFO;
export const TERM_INFO = _TERM_INFO;
export const ACADEMIC_YEARS = _ACADEMIC_YEARS;
export const TEACHERS = _TEACHERS;
export const PARENTS = _PARENTS;
export const PARENT_CHILDREN = _PARENT_CHILDREN;
export const STUDENT_PARENT = _STUDENT_PARENT;
export const SCHOOL_STATS = _SCHOOL_STATS;
export const GRADE_SCALE = _GRADE_SCALE;
export const getGradeFromScore = _getGradeFromScore;
export const getGradeLabel = _getGradeLabel;
export const getGradeColor = _getGradeColor;
export const getGradeColorHex = _getGradeColorHex;
export const getPerformanceBand = _getPerformanceBand;
export const getAttendanceColor = _getAttendanceColor;
export const ATTENDANCE_STATUS_STYLE = _ATTENDANCE_STATUS_STYLE;

// ─── CLASSES_DATA — derived from STUDENTS ────────────────────────────────────
export const CLASSES_DATA = [...new Set(STUDENTS.map((s) => s.formClass))]
  .filter(Boolean)
  .map((fc) => ({
    id: fc,
    name: fc,
    track: STUDENTS.find((s) => s.formClass === fc)?.track || "A",
    students: STUDENTS.filter((s) => s.formClass === fc).length,
  }));

// ─── FORM_CLASS_STUDENTS — map of formClass -> students array ─────────────────
export const FORM_CLASS_STUDENTS = STUDENTS.reduce((acc, s) => {
  if (!acc[s.formClass]) acc[s.formClass] = [];
  acc[s.formClass].push(s);
  return acc;
}, {});

// ─── ATTENDANCE_STUDENTS ──────────────────────────────────────────────────────
export const ATTENDANCE_STUDENTS = STUDENTS.map((s) => ({
  id: s.id,
  studentId: s.studentId,
  name: `${s.firstName} ${s.lastName}`,
  class: s.formClass,
  status: "present",
}));

// ─── getGradeFromTotal (legacy alias) ─────────────────────────────────────────
export const getGradeFromTotal = (total) => {
  if (total >= 80) return "A1";
  if (total >= 70) return "B2";
  if (total >= 65) return "B3";
  if (total >= 60) return "C4";
  if (total >= 55) return "C5";
  if (total >= 50) return "C6";
  if (total >= 45) return "D7";
  if (total >= 40) return "E8";
  return "F9";
};

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  {
    id: 1,
    type: "info",
    title: "Score Submission Reminder",
    message: "End of term scores due by Friday March 28, 2025.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Attendance Marked",
    message: "Attendance for Form 3 Science A successfully recorded.",
    time: "Today 08:15",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "HOD Meeting",
    message: "Department meeting scheduled for Monday at 10:00 AM.",
    time: "Yesterday",
    read: false,
  },
  {
    id: 4,
    type: "info",
    title: "Report Cards Ready",
    message: "Semester 1 report cards are now available for review.",
    time: "2 days ago",
    read: true,
  },
  {
    id: 5,
    type: "success",
    title: "Timetable Updated",
    message: "Your timetable has been updated for the new term.",
    time: "3 days ago",
    read: true,
  },
];

// ─── DEPT_TEACHERS ────────────────────────────────────────────────────────────
export const DEPT_TEACHERS = [
  {
    id: 1,
    name: "Capt Kwabena Adjei",
    subject: "Core Mathematics",
    yearGroup: "form1",
    periods: 28,
    maxPeriods: 30,
    status: "Active",
  },
  {
    id: 15,
    name: "Dr Yaa Agyemang",
    subject: "Core Mathematics",
    yearGroup: "form1",
    periods: 30,
    maxPeriods: 30,
    status: "Active",
  },
  {
    id: 3,
    name: "Dr Kofi Osei",
    subject: "Integrated Science",
    yearGroup: "form3",
    periods: 24,
    maxPeriods: 30,
    status: "Active",
  },
  {
    id: 6,
    name: "Mrs Abena Mensah",
    subject: "Physics",
    yearGroup: "form3",
    periods: 25,
    maxPeriods: 30,
    status: "Active",
  },
  {
    id: 7,
    name: "Lt Kwame Asare",
    subject: "Chemistry",
    yearGroup: "form1",
    periods: 23,
    maxPeriods: 30,
    status: "Active",
  },
  {
    id: 8,
    name: "Mr Yaw Tawiah",
    subject: "Biology",
    yearGroup: "form3",
    periods: 26,
    maxPeriods: 30,
    status: "Active",
  },
  {
    id: 4,
    name: "Sgt Efua Frimpong",
    subject: "ICT",
    yearGroup: "form1",
    periods: 22,
    maxPeriods: 30,
    status: "Active",
  },
  {
    id: 12,
    name: "Mr Ekow Sarpong",
    subject: "Geography",
    yearGroup: "form3",
    periods: 0,
    maxPeriods: 30,
    status: "Inactive",
  },
];

// ─── EXAM_DATA ────────────────────────────────────────────────────────────────
export const EXAM_DATA = {
  currentExam: "End of Semester 1 Examinations",
  startDate: "2025-03-24",
  endDate: "2025-04-04",
  venue: "AFTS Examination Halls A, B & C",
  totalCandidates: 145,
  registered: 145,
  submitted: 98,
  pending: 47,
  subjects: [
    {
      name: "Core Mathematics",
      date: "2025-03-24",
      time: "08:00",
      hall: "Hall A",
      invigilator: "Dr Yaa Agyemang",
      submitted: 145,
      pending: 0,
    },
    {
      name: "English Language",
      date: "2025-03-25",
      time: "08:00",
      hall: "Hall B",
      invigilator: "Mrs Ama Eshun",
      submitted: 145,
      pending: 0,
    },
    {
      name: "Integrated Science",
      date: "2025-03-26",
      time: "08:00",
      hall: "Hall A",
      invigilator: "Dr Kofi Osei",
      submitted: 142,
      pending: 3,
    },
    {
      name: "Social Studies",
      date: "2025-03-27",
      time: "08:00",
      hall: "Hall C",
      invigilator: "Mr Nana Boateng",
      submitted: 138,
      pending: 7,
    },
    {
      name: "Physics",
      date: "2025-03-28",
      time: "08:00",
      hall: "Hall A",
      invigilator: "Mrs Abena Mensah",
      submitted: 80,
      pending: 20,
    },
    {
      name: "Chemistry",
      date: "2025-03-31",
      time: "08:00",
      hall: "Hall B",
      invigilator: "Lt Kwame Asare",
      submitted: 75,
      pending: 25,
    },
    {
      name: "Biology",
      date: "2025-04-01",
      time: "08:00",
      hall: "Hall A",
      invigilator: "Mr Yaw Tawiah",
      submitted: 68,
      pending: 32,
    },
    {
      name: "Economics",
      date: "2025-04-02",
      time: "08:00",
      hall: "Hall C",
      invigilator: "Mrs Akua Bonsu",
      submitted: 45,
      pending: 30,
    },
  ],
};

// ─── YEAR_GROUP_DATA ──────────────────────────────────────────────────────────
export const YEAR_GROUP_DATA = {
  yearGroup: "Form 2",
  totalStudents: 80,
  trackA: 40,
  trackB: 40,
  activeStudents: 78,
  avgAttendance: 91,
  avgScore: 74,
  classes: [
    {
      name: "Form 2 Science A",
      yearGroup: "form1",
      students: 20,
      formTeacher: "Capt Kwabena Adjei",
      avgScore: 79,
      attendance: 94,
    },
    {
      name: "Form 2 Science B",
      yearGroup: "form3",
      students: 20,
      formTeacher: "Mr Yaw Tawiah",
      avgScore: 72,
      attendance: 89,
    },
    {
      name: "Form 2 Arts A",
      yearGroup: "form1",
      students: 20,
      formTeacher: "Mr Nana Boateng",
      avgScore: 71,
      attendance: 90,
    },
    {
      name: "Form 2 Business B",
      yearGroup: "form3",
      students: 20,
      formTeacher: "Mrs Esi Tawiah",
      avgScore: 75,
      attendance: 91,
    },
  ],
};

// ─── HOUSE_DATA ───────────────────────────────────────────────────────────────
export const HOUSE_DATA = {
  name: "Warrior House",
  color: "#dc2626",
  master: "Capt Kwabena Adjei",
  totalMembers: 38,
  form1: 12,
  form2: 14,
  form3: 12,
  male: 22,
  female: 16,
  points: 240,
  rank: 1,
  events: [
    {
      name: "Inter-House Athletics",
      date: "2025-02-21",
      result: "1st Place",
      points: 50,
    },
    {
      name: "Quiz Competition",
      date: "2025-02-14",
      result: "2nd Place",
      points: 30,
    },
    {
      name: "Cultural Display",
      date: "2025-01-30",
      result: "1st Place",
      points: 40,
    },
  ],
  members: [
    {
      name: "Kofi Asante",
      class: "Form 2 Science A",
      position: "House Captain",
      gender: "Male",
    },
    {
      name: "Abena Frimpong",
      class: "Form 3 Science A",
      position: "Vice Captain",
      gender: "Female",
    },
    {
      name: "Nana Frimpong",
      class: "Form 1 Arts B",
      position: "Member",
      gender: "Male",
    },
    {
      name: "Kwame Adjei",
      class: "Form 1 Arts B",
      position: "Member",
      gender: "Male",
    },
    {
      name: "Adwoa Mensah",
      class: "Form 1 Science A",
      position: "Member",
      gender: "Female",
    },
  ],
};

// ─── COUNSELLOR_DATA ──────────────────────────────────────────────────────────
export const COUNSELLOR_DATA = {
  totalCases: 24,
  openCases: 8,
  resolvedCases: 16,
  categories: [
    { label: "Academic", count: 10, color: "var(--royal-blue)" },
    { label: "Social", count: 6, color: "#7c3aed" },
    { label: "Personal", count: 5, color: "var(--warning)" },
    { label: "Family", count: 3, color: "var(--accent-red)" },
  ],
  recentCases: [
    {
      id: "C001",
      student: "Anonymous",
      class: "Form 3 Science A",
      category: "Academic",
      status: "Open",
      date: "2025-03-15",
      priority: "High",
    },
    {
      id: "C002",
      student: "Anonymous",
      class: "Form 2 Arts A",
      category: "Personal",
      status: "Open",
      date: "2025-03-14",
      priority: "Medium",
    },
    {
      id: "C003",
      student: "Anonymous",
      class: "Form 1 Business A",
      category: "Social",
      status: "Resolved",
      date: "2025-03-10",
      priority: "Low",
    },
    {
      id: "C004",
      student: "Anonymous",
      class: "Form 3 Business A",
      category: "Family",
      status: "Open",
      date: "2025-03-08",
      priority: "High",
    },
    {
      id: "C005",
      student: "Anonymous",
      class: "Form 2 Science B",
      category: "Academic",
      status: "Resolved",
      date: "2025-03-05",
      priority: "Medium",
    },
  ],
};

// ─── WAEC_DATA ────────────────────────────────────────────────────────────────
export const WAEC_DATA = {
  centreCode: "GH0042",
  centreName: "Armed Forces SHTS",
  year: "2025",
  totalCandidates: 48,
  registered: 48,
  subjects: [
    {
      name: "Core Mathematics",
      candidates: 48,
      internalMark: 72,
      status: "Submitted",
    },
    {
      name: "English Language",
      candidates: 48,
      internalMark: 68,
      status: "Submitted",
    },
    {
      name: "Integrated Science",
      candidates: 48,
      internalMark: 70,
      status: "Submitted",
    },
    {
      name: "Social Studies",
      candidates: 48,
      internalMark: 65,
      status: "Submitted",
    },
    { name: "Physics", candidates: 22, internalMark: 75, status: "Pending" },
    { name: "Chemistry", candidates: 22, internalMark: 71, status: "Pending" },
    { name: "Biology", candidates: 22, internalMark: 73, status: "Pending" },
    { name: "Accounting", candidates: 14, internalMark: 69, status: "Pending" },
    {
      name: "Economics",
      candidates: 14,
      internalMark: 67,
      status: "Not Started",
    },
    {
      name: "Technical Drawing",
      candidates: 12,
      internalMark: 74,
      status: "Not Started",
    },
  ],
  deadlines: [
    {
      task: "Submit Internal Assessment Marks",
      due: "2025-04-15",
      status: "Pending",
    },
    {
      task: "Verify Candidate Registration",
      due: "2025-04-01",
      status: "Done",
    },
    { task: "Collect Question Papers", due: "2025-05-10", status: "Upcoming" },
    { task: "WASSCE Begins", due: "2025-05-12", status: "Upcoming" },
  ],
};

// ─── SPORTS_DATA ──────────────────────────────────────────────────────────────
export const SPORTS_DATA = {
  coordinator: "Capt Kwabena Adjei",
  totalAthletes: 65,
  activeSports: [
    {
      name: "Football",
      team: "Boys",
      members: 22,
      nextMatch: "2025-03-28",
      venue: "School Field",
      wins: 4,
      losses: 1,
    },
    {
      name: "Netball",
      team: "Girls",
      members: 15,
      nextMatch: "2025-03-29",
      venue: "Netball Court",
      wins: 3,
      losses: 2,
    },
    {
      name: "Athletics",
      team: "Mixed",
      members: 18,
      nextMatch: "2025-04-05",
      venue: "Track Field",
      wins: 5,
      losses: 0,
    },
    {
      name: "Basketball",
      team: "Boys",
      members: 10,
      nextMatch: "2025-04-10",
      venue: "Court",
      wins: 2,
      losses: 3,
    },
  ],
  upcomingEvents: [
    {
      name: "Regional Athletics Championship",
      date: "2025-04-05",
      venue: "Kumasi Sports Stadium",
      type: "Regional",
    },
    {
      name: "Inter-School Football Cup",
      date: "2025-03-28",
      venue: "AFTS School Field",
      type: "School",
    },
    {
      name: "ASHSSA Games",
      date: "2025-05-15",
      venue: "Regional Stadium",
      type: "Regional",
    },
  ],
};

// ─── WORKSHOP_DATA ────────────────────────────────────────────────────────────
export const WORKSHOP_DATA = {
  name: "Technical Workshop",
  hod: "Sgt Efua Frimpong",
  totalStudents: 40,
  equipment: [
    {
      name: "Metal Lathe",
      quantity: 4,
      status: "Good",
      lastServiced: "2025-01-10",
    },
    {
      name: "Welding Machine",
      quantity: 6,
      status: "Good",
      lastServiced: "2025-02-01",
    },
    {
      name: "Drill Press",
      quantity: 3,
      status: "Fair",
      lastServiced: "2024-12-15",
    },
    {
      name: "Angle Grinder",
      quantity: 8,
      status: "Good",
      lastServiced: "2025-01-20",
    },
    {
      name: "Bench Vice",
      quantity: 12,
      status: "Good",
      lastServiced: "2024-11-30",
    },
    {
      name: "Arc Welder",
      quantity: 2,
      status: "Faulty",
      lastServiced: "2024-10-05",
    },
    {
      name: "Computer Workstation",
      quantity: 20,
      status: "Good",
      lastServiced: "2025-02-15",
    },
  ],
  practicals: [
    {
      subject: "Technical Drawing",
      class: "Form 2 Tech A",
      date: "2025-03-17",
      topic: "Isometric Drawing",
      status: "Done",
    },
    {
      subject: "Auto Mechanics",
      class: "Form 3 Tech A",
      date: "2025-03-18",
      topic: "Engine Dismantling",
      status: "Done",
    },
    {
      subject: "Electronics",
      class: "Form 1 Tech B",
      date: "2025-03-20",
      topic: "Circuit Basics",
      status: "Upcoming",
    },
    {
      subject: "Welding",
      class: "Form 3 Tech B",
      date: "2025-03-21",
      topic: "Joint Types",
      status: "Upcoming",
    },
  ],
};

// ─── COMMENT_TEMPLATES ────────────────────────────────────────────────────────
export const COMMENT_TEMPLATES = [
  "An excellent student who demonstrates outstanding academic commitment.",
  "A hardworking student who gives their best in all areas.",
  "Good performance this term. With more focus, there is room for improvement.",
  "A committed student who participates actively in class.",
  "There are signs of ability, but consistency needs improvement.",
  "Must demonstrate greater commitment to academic work.",
  "A brilliant student with exceptional intellectual ability.",
  "A pleasure to teach — consistent, focused and always willing to go above and beyond.",
];
