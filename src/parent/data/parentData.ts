// src/parent/data/parentData.js
// Re-exports from central data source + parent-specific data
import {
  SCHOOL_INFO as _SI,
  TERM_INFO as _TI,
  STUDENTS as _STUDENTS,
  PARENTS as _PARENTS,
  PARENT_CHILDREN as _PC,
  STUDENT_PARENT as _SP,
  GRADE_SCALE as _GS,
  getGradeFromScore as _gGFS,
  getGradeLabel as _gGL,
  getGradeColor as _gGC,
  getGradeColorHex as _gGCH,
  getPerformanceBand as _gPB,
  getAttendanceColor as _gAC,
  ATTENDANCE_STATUS_STYLE as _ASS,
} from "../../data/schoolData";

// ─── Re-exports ───────────────────────────────────────────────────────────────
export const SCHOOL_INFO = _SI;
export const TERM_INFO = _TI;
export const STUDENTS = _STUDENTS;
export const PARENTS = _PARENTS;
export const PARENT_CHILDREN = _PC;
export const STUDENT_PARENT = _SP;
export const GRADE_SCALE = _GS;
export const getGradeFromScore = _gGFS;
export const getGradeLabel = _gGL;
export const getGradeColor = _gGC;
export const getGradeColorHex = _gGCH;
export const getPerformanceBand = _gPB;
export const getAttendanceColor = _gAC;
export const ATTENDANCE_STATUS_STYLE = _ASS;
export const STATUS_STYLE = _ASS;

// ─── CHILDREN_DATA ────────────────────────────────────────────────────────────
// Used by ParentDashboardLayout (child switcher) and ParentProfile
// In a real app this comes from the logged-in parent's profile
// Here we use the demo parent (id:1 — Mr Emmanuel Asante, 2 children)
export const CHILDREN_DATA = [
  {
    id: 15,
    studentId: "AFTS/2024/001",
    name: "Kofi Asante",
    firstName: "Kofi",
    lastName: "Asante",
    year: "Form 2",
    formClass: "Form 2 Science A",
    program: "General Science",
    track: "A",
    house: "Warrior",
    status: "Active",
    attendance: 94,
    avgScore: 82,
    gender: "Male",
    dob: "2008-03-15",
  },
  {
    id: 17,
    studentId: "AFTS/2024/003",
    name: "Abena Asante",
    firstName: "Abena",
    lastName: "Asante",
    year: "Form 1",
    formClass: "Form 1 Arts A",
    program: "General Arts",
    track: "A",
    house: "Eagle",
    status: "Active",
    attendance: 98,
    avgScore: 89,
    gender: "Female",
    dob: "2009-07-10",
  },
];

// ─── CHILD_RESULTS ────────────────────────────────────────────────────────────
// Keyed by studentId — results for each child
export const CHILD_RESULTS = {
  "AFTS/2024/001": {
    current: {
      term: "Term 2",
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
    },
    previous: [
      {
        term: "Term 1",
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
    ],
  },
  "AFTS/2024/003": {
    current: {
      term: "Term 2",
      academicYear: "2024/2025",
      formClass: "Form 1 Arts A",
      position: 2,
      outOf: 35,
      totalScore: 510,
      totalMax: 700,
      aggregate: 8,
      subjects: [
        {
          name: "Core Mathematics",
          ca: 23,
          exam: 57,
          total: 80,
          grade: "A1",
          remarks: "Excellent",
        },
        {
          name: "English Language",
          ca: 24,
          exam: 60,
          total: 84,
          grade: "A1",
          remarks: "Excellent",
        },
        {
          name: "Integrated Science",
          ca: 21,
          exam: 55,
          total: 76,
          grade: "B2",
          remarks: "Very Good",
        },
        {
          name: "Social Studies",
          ca: 22,
          exam: 58,
          total: 80,
          grade: "A1",
          remarks: "Excellent",
        },
        {
          name: "Literature",
          ca: 23,
          exam: 59,
          total: 82,
          grade: "A1",
          remarks: "Excellent",
        },
        {
          name: "Government",
          ca: 20,
          exam: 53,
          total: 73,
          grade: "B2",
          remarks: "Very Good",
        },
        {
          name: "History",
          ca: 19,
          exam: 50,
          total: 69,
          grade: "B3",
          remarks: "Good",
        },
      ],
    },
    previous: [],
  },
};

// ─── CHILD_ATTENDANCE ─────────────────────────────────────────────────────────
export const CHILD_ATTENDANCE = {
  "AFTS/2024/001": {
    summary: {
      totalDays: 55,
      present: 52,
      absent: 2,
      late: 1,
      excused: 0,
      percentage: 94.5,
    },
    records: [
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
    ],
  },
  "AFTS/2024/003": {
    summary: {
      totalDays: 55,
      present: 54,
      absent: 0,
      late: 1,
      excused: 0,
      percentage: 98.2,
    },
    records: [
      { date: "2025-03-17", day: "Monday", status: "present" },
      { date: "2025-03-14", day: "Friday", status: "present" },
      { date: "2025-03-13", day: "Thursday", status: "late" },
      { date: "2025-03-12", day: "Wednesday", status: "present" },
      { date: "2025-03-11", day: "Tuesday", status: "present" },
      { date: "2025-03-10", day: "Monday", status: "present" },
      { date: "2025-03-07", day: "Friday", status: "present" },
      { date: "2025-03-06", day: "Thursday", status: "present" },
      { date: "2025-03-05", day: "Wednesday", status: "present" },
      { date: "2025-03-04", day: "Tuesday", status: "present" },
    ],
  },
};

// ─── CHILD_REPORT_COMMENTS ────────────────────────────────────────────────────
export const CHILD_REPORT_COMMENTS = {
  "AFTS/2024/001": {
    formTeacher:
      "Kofi is a dedicated and hardworking student who consistently gives his best. Encouraged to maintain this positive attitude and seek help in areas needing improvement.",
    headmaster:
      "A commendable performance. Kofi is reminded that excellence requires consistent effort and discipline. We look forward to even greater achievements next term.",
  },
  "AFTS/2024/003": {
    formTeacher:
      "Abena is an outstanding student who leads by example. Her commitment to academic excellence and school activities is commendable. Keep it up!",
    headmaster:
      "Excellent result. Abena embodies the values of Armed Forces SHTS — discipline, dedication and excellence. We are proud of her achievements.",
  },
};

// ─── PARENT_NOTIFICATIONS ─────────────────────────────────────────────────────
export const PARENT_NOTIFICATIONS = [
  {
    id: 1,
    type: "info",
    title: "End of Term Exams",
    message: "Term 2 examinations for your ward begin March 24, 2025.",
    time: "2 days ago",
    read: false,
    child: "Kofi Asante",
  },
  {
    id: 2,
    type: "success",
    title: "Results Available",
    message: "Kofi's Term 2 results are now available in the results section.",
    time: "1 week ago",
    read: false,
    child: "Kofi Asante",
  },
  {
    id: 3,
    type: "warning",
    title: "Attendance Notice",
    message: "Kofi's attendance is at 94%. Minimum required is 95%.",
    time: "3 days ago",
    read: false,
    child: "Kofi Asante",
  },
  {
    id: 4,
    type: "success",
    title: "Report Card Ready",
    message: "Abena's Term 2 report card is ready to view and download.",
    time: "1 week ago",
    read: true,
    child: "Abena Asante",
  },
  {
    id: 5,
    type: "info",
    title: "Fee Reminder",
    message: "Term 3 fees are due by April 14, 2025. Contact the bursar.",
    time: "2 weeks ago",
    read: true,
    child: "All",
  },
];

// ─── SCHOOL_NOTICES ───────────────────────────────────────────────────────────
export const SCHOOL_NOTICES = [
  {
    id: 1,
    type: "info",
    title: "End of Term Examinations",
    message:
      "Term 2 End of Term Exams begin March 24, 2025. Ensure your ward is well prepared.",
    date: "2025-03-15",
    important: true,
  },
  {
    id: 2,
    type: "warning",
    title: "Fee Payment Deadline",
    message:
      "Term 3 school fees are due by April 14, 2025. Contact the bursar for payment plans.",
    date: "2025-03-10",
    important: true,
  },
  {
    id: 3,
    type: "success",
    title: "Inter-House Sports Day",
    message:
      "Inter-House Sports Day was held on February 21. Warrior House placed 1st overall.",
    date: "2025-02-22",
    important: false,
  },
  {
    id: 4,
    type: "info",
    title: "Parent-Teacher Conference",
    message:
      "The next Parent-Teacher Conference is scheduled for April 5, 2025 from 9AM–3PM.",
    date: "2025-02-20",
    important: true,
  },
  {
    id: 5,
    type: "info",
    title: "Track B Resumption",
    message:
      "Track B students resume on April 14, 2025. Report to school by 7:00 AM.",
    date: "2025-02-18",
    important: false,
  },
  {
    id: 6,
    type: "success",
    title: "WASSCE Registration",
    message:
      "Form 3 WASSCE registration is complete. Exam begins May 12, 2025.",
    date: "2025-02-10",
    important: false,
  },
];
