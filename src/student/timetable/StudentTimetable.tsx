// // src/student/timetable/StudentTimetable.jsx
// import React, { useState } from 'react';
// import { Clock, BookOpen, RefreshCw } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
// import { TERM_INFO } from '../data/studentData';

// const PERIODS = ['Period 1\n07:30–08:20', 'Period 2\n08:20–09:10', 'Period 3\n09:10–10:00', 'Break\n10:00–10:20', 'Period 4\n10:20–11:10', 'Period 5\n11:10–12:00', 'Period 6\n12:00–12:50', 'Lunch\n12:50–13:30', 'Period 7\n13:30–14:20', 'Period 8\n14:20–15:10'];

// const SUBJECT_COLORS = {
//   'Core Maths':    { bg: '#eef2ff', color: 'var(--royal-blue)'   },
//   'English':       { bg: '#f0fdf4', color: 'var(--success-dark)'  },
//   'Int. Science':  { bg: '#fffbeb', color: 'var(--warning)'       },
//   'Social Std':    { bg: '#f5f3ff', color: '#7c3aed'             },
//   'ICT':           { bg: '#f0f9ff', color: '#0369a1'             },
//   'Physics':       { bg: '#fff1f2', color: 'var(--accent-red)'    },
//   'Chemistry':     { bg: '#fef3c7', color: '#92400e'             },
//   'Biology':       { bg: '#ecfdf5', color: '#065f46'             },
//   'Break':         { bg: '#f3f4f6', color: '#6b7280'             },
//   'Lunch':         { bg: '#f3f4f6', color: '#6b7280'             },
//   'Assembly':      { bg: '#eef2ff', color: 'var(--royal-blue)'   },
//   'Free Period':   { bg: '#f9fafb', color: '#9ca3af'             },
// };

// const TIMETABLE = {
//   Monday: [
//     { subject: 'Core Maths',   teacher: 'Capt Adjei',    room: 'Block A Rm 1' },
//     { subject: 'English',      teacher: 'Mrs Eshun',     room: 'Block A Rm 1' },
//     { subject: 'Physics',      teacher: 'Cpt Adjei',     room: 'Lab 1'        },
//     { subject: 'Break',        teacher: '',              room: ''              },
//     { subject: 'ICT',          teacher: 'Sgt Frimpong',  room: 'Computer Lab' },
//     { subject: 'Social Std',   teacher: 'Lt Asare',      room: 'Block B Rm 3' },
//     { subject: 'Chemistry',    teacher: 'Mrs Ampofo',    room: 'Lab 2'        },
//     { subject: 'Lunch',        teacher: '',              room: ''              },
//     { subject: 'Core Maths',   teacher: 'Capt Adjei',    room: 'Block A Rm 1' },
//     { subject: 'Free Period',  teacher: '',              room: ''              },
//   ],
//   Tuesday: [
//     { subject: 'Biology',      teacher: 'Mr Mensah',     room: 'Lab 3'        },
//     { subject: 'English',      teacher: 'Mrs Eshun',     room: 'Block A Rm 1' },
//     { subject: 'Core Maths',   teacher: 'Capt Adjei',    room: 'Block A Rm 1' },
//     { subject: 'Break',        teacher: '',              room: ''              },
//     { subject: 'Physics',      teacher: 'Cpt Adjei',     room: 'Lab 1'        },
//     { subject: 'ICT',          teacher: 'Sgt Frimpong',  room: 'Computer Lab' },
//     { subject: 'Social Std',   teacher: 'Lt Asare',      room: 'Block B Rm 3' },
//     { subject: 'Lunch',        teacher: '',              room: ''              },
//     { subject: 'Chemistry',    teacher: 'Mrs Ampofo',    room: 'Lab 2'        },
//     { subject: 'Free Period',  teacher: '',              room: ''              },
//   ],
//   Wednesday: [
//     { subject: 'Assembly',     teacher: '',              room: 'Main Hall'    },
//     { subject: 'Chemistry',    teacher: 'Mrs Ampofo',    room: 'Lab 2'        },
//     { subject: 'Social Std',   teacher: 'Lt Asare',      room: 'Block B Rm 3' },
//     { subject: 'Break',        teacher: '',              room: ''              },
//     { subject: 'English',      teacher: 'Mrs Eshun',     room: 'Block A Rm 1' },
//     { subject: 'Biology',      teacher: 'Mr Mensah',     room: 'Lab 3'        },
//     { subject: 'Core Maths',   teacher: 'Capt Adjei',    room: 'Block A Rm 1' },
//     { subject: 'Lunch',        teacher: '',              room: ''              },
//     { subject: 'Int. Science', teacher: 'Dr Osei',       room: 'Lab 1'        },
//     { subject: 'Free Period',  teacher: '',              room: ''              },
//   ],
//   Thursday: [
//     { subject: 'Physics',      teacher: 'Cpt Adjei',     room: 'Lab 1'        },
//     { subject: 'ICT',          teacher: 'Sgt Frimpong',  room: 'Computer Lab' },
//     { subject: 'Biology',      teacher: 'Mr Mensah',     room: 'Lab 3'        },
//     { subject: 'Break',        teacher: '',              room: ''              },
//     { subject: 'Chemistry',    teacher: 'Mrs Ampofo',    room: 'Lab 2'        },
//     { subject: 'English',      teacher: 'Mrs Eshun',     room: 'Block A Rm 1' },
//     { subject: 'Core Maths',   teacher: 'Capt Adjei',    room: 'Block A Rm 1' },
//     { subject: 'Lunch',        teacher: '',              room: ''              },
//     { subject: 'Social Std',   teacher: 'Lt Asare',      room: 'Block B Rm 3' },
//     { subject: 'Free Period',  teacher: '',              room: ''              },
//   ],
//   Friday: [
//     { subject: 'Int. Science', teacher: 'Dr Osei',       room: 'Lab 1'        },
//     { subject: 'Core Maths',   teacher: 'Capt Adjei',    room: 'Block A Rm 1' },
//     { subject: 'Social Std',   teacher: 'Lt Asare',      room: 'Block B Rm 3' },
//     { subject: 'Break',        teacher: '',              room: ''              },
//     { subject: 'English',      teacher: 'Mrs Eshun',     room: 'Block A Rm 1' },
//     { subject: 'Physics',      teacher: 'Cpt Adjei',     room: 'Lab 1'        },
//     { subject: 'Assembly',     teacher: '',              room: 'Main Hall'    },
//     { subject: 'Lunch',        teacher: '',              room: ''              },
//     { subject: 'Biology',      teacher: 'Mr Mensah',     room: 'Lab 3'        },
//     { subject: 'ICT',          teacher: 'Sgt Frimpong',  room: 'Computer Lab' },
//   ],
// };

// const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

// const StudentTimetable = () => {
//   const { user } = useAuth();
//   const [view, setView] = useState('week'); // 'week' | 'day'
//   const [selectedDay, setSelectedDay] = useState('Monday');

//   const today = DAYS[new Date().getDay() - 1] || 'Monday';

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="text-xl font-black" style={{ color: 'var(--dark-gray)' }}>My Timetable</h1>
//           <p className="text-xs text-gray-400 mt-0.5">
//             {user?.formClass} · {TERM_INFO.term} · Track {user?.track}
//           </p>
//         </div>
//         <div className="flex gap-2">
//           {['week','day'].map(v => (
//             <button key={v} onClick={() => setView(v)}
//               className="text-sm font-semibold px-4 py-2 rounded-xl capitalize transition"
//               style={{
//                 backgroundColor: view === v ? 'var(--royal-blue)' : 'white',
//                 color: view === v ? 'white' : 'var(--dark-gray)',
//                 border: '1px solid var(--medium-gray)',
//               }}>
//               {v} View
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Track info */}
//       <div className="flex items-center gap-3 p-3 rounded-xl border"
//         style={{ backgroundColor: '#fffbeb', borderColor: '#fcd34d' }}>
//         <RefreshCw size={15} style={{ color: 'var(--warning)' }} className="flex-shrink-0" />
//         <p className="text-xs font-semibold" style={{ color: '#92400e' }}>
//           Track {user?.track || 'A'} — currently in session. This timetable is valid for Track {user?.track || 'A'} students only.
//         </p>
//       </div>

//       {/* Day tabs (mobile-friendly) */}
//       <div className="flex gap-2 overflow-x-auto pb-1">
//         {DAYS.map(day => (
//           <button key={day} onClick={() => { setSelectedDay(day); setView('day'); }}
//             className="flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-xl transition"
//             style={{
//               backgroundColor: selectedDay === day && view === 'day' ? 'var(--royal-blue)' : day === today ? '#eef2ff' : 'white',
//               color: selectedDay === day && view === 'day' ? 'white' : day === today ? 'var(--royal-blue)' : 'var(--dark-gray)',
//               border: '1px solid var(--medium-gray)',
//               fontWeight: day === today ? 700 : undefined,
//             }}>
//             {day.slice(0,3)}{day === today ? ' ●' : ''}
//           </button>
//         ))}
//       </div>

//       {/* Week view */}
//       {view === 'week' && (
//         <div className="bg-white rounded-xl border shadow-sm overflow-hidden" style={{ borderColor: 'var(--medium-gray)' }}>
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[700px] text-xs">
//               <thead>
//                 <tr style={{ backgroundColor: 'var(--light-gray)' }}>
//                   <th className="px-3 py-3 text-left font-bold uppercase text-gray-500 border-b border-r w-28" style={{ borderColor: 'var(--medium-gray)' }}>Period</th>
//                   {DAYS.map(d => (
//                     <th key={d} className="px-3 py-3 text-center font-bold uppercase text-gray-500 border-b border-r"
//                       style={{ borderColor: 'var(--medium-gray)', color: d === today ? 'var(--royal-blue)' : undefined }}>
//                       {d.slice(0,3)}{d === today ? ' ●' : ''}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {PERIODS.map((period, pIdx) => {
//                   const [label, time] = period.split('\n');
//                   const isBreak = label === 'Break' || label === 'Lunch';
//                   return (
//                     <tr key={pIdx} style={{ backgroundColor: isBreak ? '#f9fafb' : undefined }}>
//                       <td className="px-3 py-2 border-b border-r font-medium" style={{ borderColor: 'var(--medium-gray)', color: 'var(--dark-gray)' }}>
//                         <p className="font-semibold">{label}</p>
//                         <p className="text-gray-400 text-xs">{time}</p>
//                       </td>
//                       {DAYS.map(d => {
//                         const slot = TIMETABLE[d]?.[pIdx];
//                         const style = SUBJECT_COLORS[slot?.subject] || { bg: 'white', color: '#6b7280' };
//                         return (
//                           <td key={d} className="px-2 py-2 border-b border-r text-center" style={{ borderColor: 'var(--medium-gray)' }}>
//                             {slot && slot.subject !== 'Break' && slot.subject !== 'Lunch' ? (
//                               <div className="rounded-lg px-1.5 py-1.5" style={{ backgroundColor: style.bg }}>
//                                 <p className="font-bold truncate" style={{ color: style.color }}>{slot.subject}</p>
//                                 {slot.teacher && <p className="text-gray-400 truncate" style={{ fontSize: '10px' }}>{slot.teacher}</p>}
//                                 {slot.room && <p className="text-gray-400 truncate" style={{ fontSize: '10px' }}>{slot.room}</p>}
//                               </div>
//                             ) : (
//                               <span className="text-gray-400">{isBreak ? label : '—'}</span>
//                             )}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Day view */}
//       {view === 'day' && (
//         <div className="space-y-3">
//           <h3 className="font-bold text-sm" style={{ color: 'var(--dark-gray)' }}>
//             {selectedDay}{selectedDay === today ? ' (Today)' : ''}
//           </h3>
//           {PERIODS.map((period, pIdx) => {
//             const [label, time] = period.split('\n');
//             const slot = TIMETABLE[selectedDay]?.[pIdx];
//             const style = SUBJECT_COLORS[slot?.subject] || { bg: 'white', color: '#6b7280' };
//             const isBreak = label === 'Break' || label === 'Lunch';

//             return (
//               <div key={pIdx} className="flex items-center gap-4 bg-white rounded-xl border p-4 shadow-sm"
//                 style={{ borderColor: 'var(--medium-gray)', opacity: isBreak ? 0.6 : 1 }}>
//                 <div className="w-16 flex-shrink-0 text-center">
//                   <p className="text-xs font-bold" style={{ color: 'var(--dark-gray)' }}>{label}</p>
//                   <p className="text-xs text-gray-400">{time}</p>
//                 </div>
//                 <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ backgroundColor: style.color }} />
//                 <div className="flex-1 min-w-0">
//                   {slot && !isBreak ? (
//                     <>
//                       <p className="font-bold text-sm" style={{ color: style.color }}>{slot.subject}</p>
//                       {slot.teacher && <p className="text-xs text-gray-500">{slot.teacher}</p>}
//                       {slot.room && (
//                         <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
//                           <BookOpen size={10} /> {slot.room}
//                         </p>
//                       )}
//                     </>
//                   ) : (
//                     <p className="text-sm font-semibold text-gray-400">{isBreak ? label : 'Free Period'}</p>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentTimetable;
