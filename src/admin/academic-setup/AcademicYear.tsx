// // src/admin/academic-setup/AcademicYear.jsx
// import React, { useState, useMemo } from 'react';
// import {
//   Plus, Edit3, Trash2, Save, X,
//   CheckCircle2, AlertCircle, Calendar,
//   Clock, RefreshCw, Award, ChevronDown,
//   BookOpen, TrendingUp, Archive
// } from 'lucide-react';

// // Helpers
// const diffWeeks = (start, end) => {
//   const s = new Date(start), e = new Date(end);
//   return Math.max(0, Math.round((e - s) / (7 * 24 * 60 * 60 * 1000)));
// };

// const weeksGone = (start, end) => {
//   const today = new Date();
//   const s = new Date(start), e = new Date(end);
//   if (today < s) return 0;
//   if (today > e) return diffWeeks(start, end);
//   return Math.round((today - s) / (7 * 24 * 60 * 60 * 1000));
// };

// const fmt = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

// const termStatus = (start, end) => {
//   const today = new Date();
//   const s = new Date(start), e = new Date(end);
//   if (!start || !end) return 'notset';
//   if (today < s)  return 'upcoming';
//   if (today > e)  return 'ended';
//   return 'active';
// };

// const TERM_STATUS_STYLE = {
//   active:   { bg: '#f0fdf4', color: 'var(--success-dark)', label: 'In Session'  },
//   upcoming: { bg: '#eef2ff', color: 'var(--royal-blue)',   label: 'Upcoming'    },
//   ended:    { bg: '#f3f4f6', color: '#6b7280',             label: 'Ended'       },
//   notset:   { bg: '#fffbeb', color: 'var(--warning)',       label: 'Not Set'     },
// };

// const YEAR_STATUS_STYLE = {
//   active:   { bg: '#f0fdf4', color: 'var(--success-dark)', label: 'Active'   },
//   archived: { bg: '#f3f4f6', color: '#6b7280',             label: 'Archived' },
//   upcoming: { bg: '#eef2ff', color: 'var(--royal-blue)',   label: 'Upcoming' },
// };

// const EMPTY_YEAR = {
//   year: '', status: 'upcoming',
//   term1: { start: '', end: '', trackAStart: '', trackBStart: '' },
//   term2: { start: '', end: '', trackAStart: '', trackBStart: '' },
//   term3: { start: '', end: '', trackAStart: '', trackBStart: '' },
//   notes: '',
// };

// // Initial data
// const INITIAL_YEARS = [
//   {
//     id: 1, year: '2024/2025', status: 'active',
//     term1: { start: '2024-09-02', end: '2024-12-13', trackAStart: '2024-09-02', trackBStart: '2024-12-16' },
//     term2: { start: '2025-01-06', end: '2025-04-11', trackAStart: '2025-01-06', trackBStart: '2025-04-14' },
//     term3: { start: '2025-04-14', end: '2025-07-25', trackAStart: '2025-04-14', trackBStart: '2025-07-28' },
//     notes: 'Current academic year - WASSCE for Form 3 in May/June 2025',
//   },
//   {
//     id: 2, year: '2023/2024', status: 'archived',
//     term1: { start: '2023-09-04', end: '2023-12-15', trackAStart: '2023-09-04', trackBStart: '2023-12-18' },
//     term2: { start: '2024-01-08', end: '2024-04-12', trackAStart: '2024-01-08', trackBStart: '2024-04-15' },
//     term3: { start: '2024-04-15', end: '2024-07-26', trackAStart: '2024-04-15', trackBStart: '2024-07-29' },
//     notes: 'Completed successfully. WASSCE results published August 2024.',
//   },
//   {
//     id: 3, year: '2022/2023', status: 'archived',
//     term1: { start: '2022-09-05', end: '2022-12-16', trackAStart: '2022-09-05', trackBStart: '2022-12-19' },
//     term2: { start: '2023-01-09', end: '2023-04-14', trackAStart: '2023-01-09', trackBStart: '2023-04-17' },
//     term3: { start: '2023-04-17', end: '2023-07-28', trackAStart: '2023-04-17', trackBStart: '2023-07-31' },
//     notes: 'Completed. First year with full double-track implementation.',
//   },
// ];

// // Year Form Modal
// const YearModal = ({ yearData, onSave, onClose }) => {
//   const isEdit = !!yearData?.id;
//   const [form, setForm] = useState(yearData || EMPTY_YEAR);
//   const [errors, setErrors] = useState({});

//   const setF  = (k, v) => setForm(f => ({ ...f, [k]: v }));
//   const setT  = (term, k, v) => setForm(f => ({ ...f, [term]: { ...f[term], [k]: v } }));

//   const validate = () => {
//     const e = {};
//     if (!form.year.trim()) e.year = 'Academic year is required (e.g. 2025/2026)';
//     if (!form.term1.start) e.t1start = 'Term 1 start date required';
//     if (!form.term1.end)   e.t1end   = 'Term 1 end date required';
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const TermSection = ({ termKey, label }) => {
//     const t = form[termKey];
//     return (
//       <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--medium-gray)', backgroundColor: 'var(--light-gray)' }}>
//         <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: 'var(--royal-blue)', opacity: 0.8 }}>
//           {label}
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//           {[
//             { label: 'Term Start',          key: 'start',      required: termKey === 'term1' },
//             { label: 'Term End',            key: 'end',        required: termKey === 'term1' },
//             { label: 'Track A Starts',      key: 'trackAStart' },
//             { label: 'Track B Starts',      key: 'trackBStart' },
//           ].map(({ label, key, required }) => (
//             <div key={key}>
//               <label className="text-xs font-bold uppercase tracking-wider block mb-1"
//                 style={{ color: 'var(--dark-gray)' }}>
//                 {label}{required && <span style={{ color: 'var(--accent-red)' }}> *</span>}
//               </label>
//               <input type="date" value={t[key] || ''}
//                 onChange={e => setT(termKey, key, e.target.value)}
//                 className="w-full px-3 py-2 text-sm rounded-lg border-2 outline-none"
//                 style={{ borderColor: 'var(--medium-gray)', color: 'var(--dark-gray)' }}
//                 onFocus={e => e.target.style.borderColor = 'var(--royal-blue)'}
//                 onBlur={e  => e.target.style.borderColor = 'var(--medium-gray)'}
//               />
//             </div>
//           ))}
//         </div>
//         {termKey === 'term1' && (errors.t1start || errors.t1end) && (
//           <p className="text-xs mt-2" style={{ color: 'var(--accent-red)' }}>
//             {errors.t1start || errors.t1end}
//           </p>
//         )}
//         {t.start && t.end && (
//           <p className="text-xs mt-2 font-semibold" style={{ color: 'var(--success-dark)' }}>
//             ✓ {diffWeeks(t.start, t.end)} weeks · {fmt(t.start)} → {fmt(t.end)}
//           </p>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">

//         <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
//           style={{ background: 'linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))', borderRadius: '1rem 1rem 0 0' }}>
//           <div className="flex items-center gap-3 text-white">
//             <div className="w-9 h-9 rounded-xl flex items-center justify-center"
//               style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
//               {isEdit ? <Edit3 size={16}/> : <Plus size={16}/>}
//             </div>
//             <div>
//               <p className="font-black">{isEdit ? `Edit ${form.year}` : 'Add New Academic Year'}</p>
//               <p className="text-blue-200 text-xs">Define terms, dates and track schedule</p>
//             </div>
//           </div>
//           <button type="button" onClick={onClose} className="text-white hover:text-blue-200"><X size={20}/></button>
//         </div>
//         <div className="h-1 flex-shrink-0" style={{ backgroundColor: 'var(--accent-red)' }}/>

//         <div className="flex-1 overflow-y-auto p-6 space-y-5">

//           {/* Year + Status */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="text-xs font-bold uppercase tracking-wider block mb-1.5"
//                 style={{ color: 'var(--dark-gray)' }}>
//                 Academic Year <span style={{ color: 'var(--accent-red)' }}>*</span>
//               </label>
//               <input type="text" value={form.year}
//                 onChange={e => setF('year', e.target.value)}
//                 placeholder="e.g. 2025/2026"
//                 className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none font-bold"
//                 style={{ borderColor: errors.year ? 'var(--accent-red)' : 'var(--medium-gray)', color: 'var(--dark-gray)' }}
//                 onFocus={e => e.target.style.borderColor = 'var(--royal-blue)'}
//                 onBlur={e  => e.target.style.borderColor = errors.year ? 'var(--accent-red)' : 'var(--medium-gray)'}
//               />
//               {errors.year && <p className="text-xs mt-1" style={{ color: 'var(--accent-red)' }}>{errors.year}</p>}
//             </div>
//             <div>
//               <label className="text-xs font-bold uppercase tracking-wider block mb-1.5"
//                 style={{ color: 'var(--dark-gray)' }}>Status</label>
//               <select value={form.status} onChange={e => setF('status', e.target.value)}
//                 className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white"
//                 style={{ borderColor: 'var(--medium-gray)', color: 'var(--dark-gray)' }}>
//                 <option value="upcoming">Upcoming</option>
//                 <option value="active">Active (Current)</option>
//                 <option value="archived">Archived</option>
//               </select>
//             </div>
//           </div>

//           {/* Term sections */}
//           <TermSection termKey="term1" label="Term 1"/>
//           <TermSection termKey="term2" label="Term 2"/>
//           <TermSection termKey="term3" label="Term 3"/>

//           {/* Notes */}
//           <div>
//             <label className="text-xs font-bold uppercase tracking-wider block mb-1.5"
//               style={{ color: 'var(--dark-gray)' }}>Notes (optional)</label>
//             <textarea value={form.notes} onChange={e => setF('notes', e.target.value)}
//               rows={2} placeholder="Any notes about this academic year…"
//               className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none resize-none"
//               style={{ borderColor: 'var(--medium-gray)', color: 'var(--dark-gray)' }}
//               onFocus={e => e.target.style.borderColor = 'var(--royal-blue)'}
//               onBlur={e  => e.target.style.borderColor = 'var(--medium-gray)'}
//             />
//           </div>
//         </div>

//         <div className="flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0"
//           style={{ borderColor: 'var(--medium-gray)', backgroundColor: 'var(--light-gray)', borderRadius: '0 0 1rem 1rem' }}>
//           <button type="button" onClick={onClose}
//             className="px-4 py-2 text-sm font-semibold rounded-xl border"
//             style={{ borderColor: 'var(--medium-gray)', color: 'var(--dark-gray)' }}>Cancel</button>
//           <button type="button" onClick={() => { if (validate()) onSave(form); }}
//             className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl"
//             style={{ backgroundColor: 'var(--royal-blue)' }}
//             onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--royal-blue-dark)'}
//             onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--royal-blue)'}>
//             <Save size={14}/> {isEdit ? 'Save Changes' : 'Create Year'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Term Progress Bar
// const TermBar = ({ label, start, end, trackAStart, trackBStart }) => {
//   if (!start || !end) {
//     return (
//       <div className="p-3 rounded-xl border" style={{ borderColor: 'var(--medium-gray)', backgroundColor: '#f9fafb' }}>
//         <p className="text-xs font-bold" style={{ color: 'var(--dark-gray)' }}>{label}</p>
//         <p className="text-xs text-gray-400 mt-0.5">Dates not set</p>
//       </div>
//     );
//   }

//   const total  = diffWeeks(start, end);
//   const gone   = weeksGone(start, end);
//   const pct    = total > 0 ? Math.min(100, Math.round((gone / total) * 100)) : 0;
//   const status = termStatus(start, end);
//   const ss     = TERM_STATUS_STYLE[status];

//   return (
//     <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--medium-gray)', backgroundColor: 'var(--light-gray)' }}>
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-sm font-bold" style={{ color: 'var(--dark-gray)' }}>{label}</p>
//         <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
//           style={{ backgroundColor: ss.bg, color: ss.color }}>{ss.label}</span>
//       </div>
//       <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
//         <span>{fmt(start)}</span>
//         <span className="font-semibold" style={{ color: 'var(--dark-gray)' }}>
//           {status === 'active' ? `Week ${gone}/${total}` : `${total} weeks`}
//         </span>
//         <span>{fmt(end)}</span>
//       </div>
//       <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--medium-gray)' }}>
//         <div className="h-full rounded-full transition-all"
//           style={{ width: `${pct}%`, backgroundColor: status === 'active' ? 'var(--royal-blue)' : status === 'ended' ? '#9ca3af' : '#c7d2fe' }}/>
//       </div>
//       <p className="text-xs font-semibold mt-1" style={{ color: status === 'active' ? 'var(--royal-blue)' : '#9ca3af' }}>
//         {pct}% complete
//       </p>
//       {/* Track info */}
//       <div className="flex gap-3 mt-2">
//         {[{ label: 'Track A', date: trackAStart, color: '#854d0e', bg: '#fefce8' },
//           { label: 'Track B', date: trackBStart, color: '#166534', bg: '#f0fdf4' }].map(t => (
//           <div key={t.label} className="flex-1 text-xs px-2 py-1 rounded-lg text-center"
//             style={{ backgroundColor: t.bg, color: t.color }}>
//             <p className="font-bold">{t.label}</p>
//             <p className="font-mono">{fmt(t.date)}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // Main AcademicYear Component
// const AcademicYear = () => {
//   const [years,    setYears]   = useState(INITIAL_YEARS);
//   const [showModal,setModal]   = useState(false);
//   const [editYear, setEditY]   = useState(null);
//   const [expanded, setExpanded]= useState(1); // which year card is expanded
//   const [toast,    setToast]   = useState(null);

//   const showToast = (msg, type = 'success') => {
//     setToast({ msg, type });
//     setTimeout(() => setToast(null), 3000);
//   };

//   const handleSave = (form) => {
//     if (form.id) {
//       // If setting this year as active, deactivate others
//       const updated = form.status === 'active'
//         ? years.map(y => y.id === form.id ? form : { ...y, status: y.status === 'active' ? 'archived' : y.status })
//         : years.map(y => y.id === form.id ? form : y);
//       setYears(updated);
//       showToast(`${form.year} updated`);
//     } else {
//       const newYear = { ...form, id: Date.now() };
//       const updated = form.status === 'active'
//         ? [newYear, ...years.map(y => ({ ...y, status: y.status === 'active' ? 'archived' : y.status }))]
//         : [newYear, ...years];
//       setYears(updated);
//       setExpanded(newYear.id);
//       showToast(`${form.year} created`);
//     }
//     setModal(false); setEditY(null);
//   };

//   const handleActivate = (id) => {
//     setYears(ys => ys.map(y => ({
//       ...y,
//       status: y.id === id ? 'active' : y.status === 'active' ? 'archived' : y.status,
//     })));
//     const yr = years.find(y => y.id === id);
//     showToast(`${yr?.year} set as active year`);
//   };

//   const handleArchive = (id) => {
//     setYears(ys => ys.map(y => y.id === id ? { ...y, status: 'archived' } : y));
//     const yr = years.find(y => y.id === id);
//     showToast(`${yr?.year} archived`, 'warning');
//   };

//   const handleDelete = (id) => {
//     const yr = years.find(y => y.id === id);
//     if (yr?.status === 'active') { showToast('Cannot delete the active year', 'error'); return; }
//     setYears(ys => ys.filter(y => y.id !== id));
//     showToast(`${yr?.year} deleted`, 'error');
//   };

//   const activeYear   = years.find(y => y.status === 'active');
//   const currentTerm  = activeYear
//     ? ['term1','term2','term3'].find(t => termStatus(activeYear[t]?.start, activeYear[t]?.end) === 'active') || 'term1'
//     : 'term1';
//   const activeTerm   = activeYear?.[currentTerm];
//   const termNumber   = currentTerm === 'term1' ? 1 : currentTerm === 'term2' ? 2 : 3;
//   const totalWks     = activeTerm ? diffWeeks(activeTerm.start, activeTerm.end) : 0;
//   const goneWks      = activeTerm ? weeksGone(activeTerm.start, activeTerm.end) : 0;
//   const termPct      = totalWks > 0 ? Math.round((goneWks / totalWks) * 100) : 0;

//   return (
//     <div className="space-y-6">

//       {/* Toast */}
//       {toast && (
//         <div className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
//           style={{ backgroundColor: toast.type === 'error' ? 'var(--accent-red)' : toast.type === 'warning' ? 'var(--warning)' : 'var(--success-dark)', animation: 'fadeIn .2s ease' }}>
//           <CheckCircle2 size={14}/> {toast.msg}
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//         <div>
//           <h1 className="text-xl font-black" style={{ color: 'var(--dark-gray)' }}>Academic Year</h1>
//           <p className="text-xs text-gray-400 mt-0.5">
//             {years.length} year{years.length !== 1 ? 's' : ''} · {years.filter(y => y.status === 'active').length} active · {years.filter(y => y.status === 'archived').length} archived
//           </p>
//         </div>
//         <button type="button" onClick={() => { setEditY(null); setModal(true); }}
//           className="flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-xl text-white shadow-sm"
//           style={{ backgroundColor: 'var(--royal-blue)' }}
//           onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--royal-blue-dark)'}
//           onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--royal-blue)'}>
//           <Plus size={15}/> Add Academic Year
//         </button>
//       </div>

//       {/* Active year summary banner */}
//       {activeYear && (
//         <div className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden"
//           style={{ background: 'linear-gradient(135deg, var(--royal-blue), var(--royal-blue-dark))' }}>
//           <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
//             <div className="w-48 h-48 rounded-full bg-white absolute -right-12 -top-12"/>
//           </div>
//           <div className="relative z-10 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//             <div>
//               <p className="text-blue-200 text-sm mb-1">Currently Active</p>
//               <h2 className="text-2xl font-black">{activeYear.year}</h2>
//               <p className="text-blue-300 text-sm mt-1">
//                 Term {termNumber} · Week {goneWks}/{totalWks}
//               </p>
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {[
//                   { label: `📅 Term ${termNumber}`,              bg: 'rgba(255,255,255,0.15)' },
//                   { label: `📆 ${fmt(activeTerm?.start)} - ${fmt(activeTerm?.end)}`, bg: 'rgba(255,255,255,0.12)' },
//                 ].map(b => (
//                   <span key={b.label} className="text-xs font-semibold px-2.5 py-1 rounded-full"
//                     style={{ backgroundColor: b.bg }}>{b.label}</span>
//                 ))}
//               </div>
//             </div>
//             {/* Term progress */}
//             <div className="rounded-xl p-4 min-w-[160px] flex-shrink-0"
//               style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
//               <p className="text-blue-200 text-xs mb-1">Term {termNumber} Progress</p>
//               <p className="font-black text-3xl">{termPct}%</p>
//               <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
//                 <div className="h-full rounded-full" style={{ width: `${termPct}%`, backgroundColor: '#facc15' }}/>
//               </div>
//               <p className="text-blue-200 text-xs mt-1">{goneWks} of {totalWks} weeks</p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Stats */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {[
//           { label:'Total Years',    value:years.length,                                              color:'var(--royal-blue)',   icon:Calendar   },
//           { label:'Active',         value:years.filter(y=>y.status==='active').length,               color:'var(--success-dark)', icon:CheckCircle2 },
//           { label:'Upcoming',       value:years.filter(y=>y.status==='upcoming').length,             color:'var(--info)',          icon:Clock       },
//           { label:'Archived',       value:years.filter(y=>y.status==='archived').length,             color:'#6b7280',             icon:Archive     },
//         ].map(({ label, value, color, icon: Icon }) => (
//           <div key={label} className="bg-white rounded-xl border p-4 flex items-center gap-3 shadow-sm"
//             style={{ borderColor: 'var(--medium-gray)' }}>
//             <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
//               style={{ backgroundColor: color + '18' }}>
//               <Icon size={18} style={{ color }}/>
//             </div>
//             <div>
//               <p className="text-xl font-black" style={{ color: 'var(--dark-gray)' }}>{value}</p>
//               <p className="text-xs text-gray-500">{label}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Year cards */}
//       <div className="space-y-4">
//         {years
//           .sort((a, b) => (b.status === 'active' ? 1 : 0) - (a.status === 'active' ? 1 : 0) || b.year.localeCompare(a.year))
//           .map(yr => {
//             const ys      = YEAR_STATUS_STYLE[yr.status];
//             const isOpen  = expanded === yr.id;

//             return (
//               <div key={yr.id} className="bg-white rounded-xl border shadow-sm overflow-hidden"
//                 style={{ borderColor: yr.status === 'active' ? 'var(--royal-blue)' : 'var(--medium-gray)', borderWidth: yr.status === 'active' ? 2 : 1 }}>

//                 {/* Year header */}
//                 <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition"
//                   onClick={() => setExpanded(isOpen ? null : yr.id)}>
//                   <div className="flex items-center gap-4 min-w-0">
//                     <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
//                       style={{ backgroundColor: yr.status === 'active' ? '#eef2ff' : 'var(--light-gray)' }}>
//                       <Calendar size={20} style={{ color: yr.status === 'active' ? 'var(--royal-blue)' : '#9ca3af' }}/>
//                     </div>
//                     <div className="min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <p className="font-black text-lg" style={{ color: 'var(--dark-gray)' }}>{yr.year}</p>
//                         <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
//                           style={{ backgroundColor: ys.bg, color: ys.color }}>{ys.label}</span>
//                         {yr.status === 'active' && (
//                           <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
//                             style={{ backgroundColor: '#fffbeb', color: 'var(--warning)' }}>
//                             Term {termNumber} · Week {goneWks}/{totalWks}
//                           </span>
//                         )}
//                       </div>
//                       {yr.notes && (
//                         <p className="text-xs text-gray-400 mt-0.5 truncate max-w-md">{yr.notes}</p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="flex items-center gap-2 flex-shrink-0 ml-4">
//                     {/* Actions */}
//                     {yr.status !== 'active' && (
//                       <button type="button"
//                         onClick={e => { e.stopPropagation(); handleActivate(yr.id); }}
//                         className="text-xs font-semibold px-3 py-1.5 rounded-lg transition"
//                         style={{ backgroundColor: '#f0fdf4', color: 'var(--success-dark)' }}
//                         title="Set as active year">
//                         Activate
//                       </button>
//                     )}
//                     <button type="button"
//                       onClick={e => { e.stopPropagation(); setEditY(yr); setModal(true); }}
//                       className="p-1.5 rounded-lg hover:bg-yellow-50 transition"
//                       style={{ color: 'var(--warning)' }}><Edit3 size={15}/></button>
//                     {yr.status !== 'active' && (
//                       <button type="button"
//                         onClick={e => { e.stopPropagation(); handleDelete(yr.id); }}
//                         className="p-1.5 rounded-lg hover:bg-red-50 transition"
//                         style={{ color: 'var(--accent-red)' }}><Trash2 size={15}/></button>
//                     )}
//                     {yr.status === 'active' && (
//                       <button type="button"
//                         onClick={e => { e.stopPropagation(); handleArchive(yr.id); }}
//                         className="p-1.5 rounded-lg hover:bg-gray-100 transition"
//                         style={{ color: '#6b7280' }} title="Archive this year">
//                         <Archive size={15}/>
//                       </button>
//                     )}
//                     <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
//                   </div>
//                 </div>

//                 {/* Expanded content */}
//                 {isOpen && (
//                   <div className="border-t px-5 py-4 space-y-4"
//                     style={{ borderColor: 'var(--medium-gray)', backgroundColor: 'var(--light-gray)' }}>

//                     {/* Term progress bars */}
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                       {[1, 2, 3].map(n => {
//                         const tk = `term${n}`;
//                         return (
//                           <TermBar key={n}
//                             label={`Term ${n}`}
//                             start={yr[tk]?.start}
//                             end={yr[tk]?.end}
//                             trackAStart={yr[tk]?.trackAStart}
//                             trackBStart={yr[tk]?.trackBStart}
//                           />
//                         );
//                       })}
//                     </div>

//                     {/* Year summary */}
//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                       {[
//                         { label:'Year Start',  value: fmt(yr.term1?.start) },
//                         { label:'Year End',    value: fmt(yr.term3?.end || yr.term2?.end || yr.term1?.end) },
//                         { label:'Total Terms', value: [yr.term1, yr.term2, yr.term3].filter(t => t?.start).length },
//                         { label:'Total Weeks', value: [yr.term1, yr.term2, yr.term3].reduce((s, t) => s + (t?.start && t?.end ? diffWeeks(t.start, t.end) : 0), 0) },
//                       ].map(({ label, value }) => (
//                         <div key={label} className="bg-white rounded-xl p-3 text-center border"
//                           style={{ borderColor: 'var(--medium-gray)' }}>
//                           <p className="text-base font-black" style={{ color: 'var(--royal-blue)' }}>{value}</p>
//                           <p className="text-xs text-gray-400 mt-0.5">{label}</p>
//                         </div>
//                       ))}
//                     </div>

//                     {yr.notes && (
//                       <div className="p-3 rounded-xl" style={{ backgroundColor: 'white', border: '1px solid var(--medium-gray)' }}>
//                         <p className="text-xs font-bold uppercase tracking-wider mb-1 text-gray-400">Notes</p>
//                         <p className="text-sm" style={{ color: 'var(--dark-gray)' }}>{yr.notes}</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <YearModal
//           yearData={editYear}
//           onSave={handleSave}
//           onClose={() => { setModal(false); setEditY(null); }}
//         />
//       )}

//       <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
//     </div>
//   );
// };

// export default AcademicYear;
