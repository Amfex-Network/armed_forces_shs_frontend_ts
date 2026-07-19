// src/student/data/studentData.js
// Re-exports from central data source — do NOT add data here
export {
  SCHOOL_INFO,
  TERM_INFO,
  STUDENTS,
  PARENTS,
  STUDENT_PARENT,
  STUDENT_BY_ID,
  GRADE_SCALE,
  getGradeFromScore,
  getGradeLabel,
  getGradeColor,
  getGradeColorHex,
  getPerformanceBand,
  getAttendanceColor,
  ATTENDANCE_STATUS_STYLE,
} from "../../data/schoolData";

// ─── Aliases ──────────────────────────────────────────────────────────────────
export { ATTENDANCE_STATUS_STYLE as STATUS_STYLE } from "../../data/schoolData";

// ─── CURRENT_RESULTS ──────────────────────────────────────────────────────────
export const CURRENT_RESULTS = {
  term: "Semester 1",
  academicYear: "2024/2025",
  formClass: "Form 2 Science A",
  position: 4,
  outOf: 40,
  totalScore: 492,
  totalMax: 700,
  aggregate: 12,
  subjects: [
    {
      name: "Core Mathematics",
      ca: 24,
      exam: 58,
      total: 82,
      grade: "A1",
      remarks: "Excellent",
    },
    {
      name: "English Language",
      ca: 20,
      exam: 53,
      total: 73,
      grade: "B2",
      remarks: "Very Good",
    },
    {
      name: "Integrated Science",
      ca: 22,
      exam: 59,
      total: 81,
      grade: "A1",
      remarks: "Excellent",
    },
    {
      name: "Social Studies",
      ca: 18,
      exam: 49,
      total: 67,
      grade: "B3",
      remarks: "Good",
    },
    {
      name: "ICT",
      ca: 23,
      exam: 57,
      total: 80,
      grade: "A1",
      remarks: "Excellent",
    },
    {
      name: "Physics",
      ca: 19,
      exam: 51,
      total: 70,
      grade: "B2",
      remarks: "Very Good",
    },
    {
      name: "Chemistry",
      ca: 16,
      exam: 44,
      total: 60,
      grade: "C4",
      remarks: "Credit",
    },
  ],
};

// ─── PREVIOUS_RESULTS ─────────────────────────────────────────────────────────
export const PREVIOUS_RESULTS = [
  {
    term: "Semester 1",
    academicYear: "2024/2025",
    formClass: "Form 2 Science A",
    position: 5,
    outOf: 40,
    totalScore: 475,
    totalMax: 700,
    aggregate: 14,
    subjects: [
      {
        name: "Core Mathematics",
        ca: 22,
        exam: 55,
        total: 77,
        grade: "B2",
        remarks: "Very Good",
      },
      {
        name: "English Language",
        ca: 19,
        exam: 50,
        total: 69,
        grade: "B3",
        remarks: "Good",
      },
      {
        name: "Integrated Science",
        ca: 21,
        exam: 56,
        total: 77,
        grade: "B2",
        remarks: "Very Good",
      },
      {
        name: "Social Studies",
        ca: 17,
        exam: 46,
        total: 63,
        grade: "C4",
        remarks: "Credit",
      },
      {
        name: "ICT",
        ca: 22,
        exam: 55,
        total: 77,
        grade: "B2",
        remarks: "Very Good",
      },
      {
        name: "Physics",
        ca: 18,
        exam: 48,
        total: 66,
        grade: "B3",
        remarks: "Good",
      },
      {
        name: "Chemistry",
        ca: 15,
        exam: 46,
        total: 61,
        grade: "C4",
        remarks: "Credit",
      },
    ],
  },
  {
    term: "Semester 2",
    academicYear: "2023/2024",
    formClass: "Form 1 Science A",
    position: 6,
    outOf: 38,
    totalScore: 458,
    totalMax: 700,
    aggregate: 16,
    subjects: [
      {
        name: "Core Mathematics",
        ca: 20,
        exam: 52,
        total: 72,
        grade: "B2",
        remarks: "Very Good",
      },
      {
        name: "English Language",
        ca: 18,
        exam: 47,
        total: 65,
        grade: "B3",
        remarks: "Good",
      },
      {
        name: "Integrated Science",
        ca: 19,
        exam: 53,
        total: 72,
        grade: "B2",
        remarks: "Very Good",
      },
      {
        name: "Social Studies",
        ca: 16,
        exam: 44,
        total: 60,
        grade: "C4",
        remarks: "Credit",
      },
      {
        name: "ICT",
        ca: 21,
        exam: 54,
        total: 75,
        grade: "B2",
        remarks: "Very Good",
      },
      {
        name: "Physics",
        ca: 17,
        exam: 44,
        total: 61,
        grade: "C4",
        remarks: "Credit",
      },
      {
        name: "Chemistry",
        ca: 14,
        exam: 39,
        total: 53,
        grade: "C6",
        remarks: "Credit",
      },
    ],
  },
];

// ─── ATTENDANCE_SUMMARY ───────────────────────────────────────────────────────
export const ATTENDANCE_SUMMARY = {
  totalDays: 55,
  present: 52,
  absent: 2,
  late: 1,
  excused: 0,
  percentage: 94.5,
  term: "Semester 1",
  academicYear: "2024/2025",
};

// ─── ATTENDANCE_RECORDS ───────────────────────────────────────────────────────
export const ATTENDANCE_RECORDS = [
  { date: "2025-03-17", day: "Monday", status: "present" },
  { date: "2025-03-14", day: "Friday", status: "present" },
  { date: "2025-03-13", day: "Thursday", status: "present" },
  { date: "2025-03-12", day: "Wednesday", status: "late" },
  { date: "2025-03-11", day: "Tuesday", status: "present" },
  { date: "2025-03-10", day: "Monday", status: "present" },
  { date: "2025-03-07", day: "Friday", status: "present" },
  { date: "2025-03-06", day: "Thursday", status: "absent" },
  { date: "2025-03-05", day: "Wednesday", status: "present" },
  { date: "2025-03-04", day: "Tuesday", status: "present" },
  { date: "2025-03-03", day: "Monday", status: "present" },
  { date: "2025-02-28", day: "Friday", status: "present" },
  { date: "2025-02-27", day: "Thursday", status: "present" },
  { date: "2025-02-26", day: "Wednesday", status: "present" },
  { date: "2025-02-25", day: "Tuesday", status: "absent" },
  { date: "2025-02-24", day: "Monday", status: "present" },
  { date: "2025-02-21", day: "Friday", status: "present" },
  { date: "2025-02-20", day: "Thursday", status: "present" },
  { date: "2025-02-19", day: "Wednesday", status: "present" },
  { date: "2025-02-18", day: "Tuesday", status: "present" },
];

// ─── STUDENT_NOTIFICATIONS ────────────────────────────────────────────────────
export const STUDENT_NOTIFICATIONS = [
  {
    id: 1,
    type: "info",
    title: "End of Term Exams",
    message:
      "Semester 1 examinations begin March 24, 2025. Prepare accordingly.",
    time: "2 days ago",
    read: false,
  },
  {
    id: 2,
    type: "success",
    title: "Semester 1 Results Ready",
    message:
      "Your Semester 1 results are now available in the results section.",
    time: "1 week ago",
    read: false,
  },
  {
    id: 3,
    type: "warning",
    title: "Attendance Alert",
    message: "Your attendance dropped below 95% this week. Please take note.",
    time: "3 days ago",
    read: false,
  },
  {
    id: 4,
    type: "info",
    title: "Report Card Available",
    message: "Your Semester 1 report card is ready to view and download.",
    time: "2 weeks ago",
    read: true,
  },
  {
    id: 5,
    type: "info",
    title: "Timetable Update",
    message:
      "The timetable for Semester 1 has been updated. Check your schedule.",
    time: "1 month ago",
    read: true,
  },
];

// ─── REPORT_COMMENTS ──────────────────────────────────────────────────────────
export const REPORT_COMMENTS = {
  formTeacher:
    "Kofi is a dedicated and hardworking student who consistently puts in great effort. He is encouraged to maintain this positive attitude and focus on areas needing improvement.",
  headmaster:
    "A commendable performance this term. Kofi is reminded that excellence requires consistent effort and discipline. We look forward to even greater achievements.",
};
