// // src/admin/academic-structure2/ProgramTrackManagement.jsx
// import React, { useState } from 'react';
// import { Save, Edit3, CheckCircle2, Plus, Trash2, X, BookOpen, Users } from 'lucide-react';
// import { STUDENTS } from '../data/adminData';

// const INIT = [
//   { id:1, name:'General Science', code:'SCI',  track:'Both', color:'var(--royal-blue)', bg:'#eef2ff', years:['Form 1','Form 2','Form 3'], maxPerClass:40, active:true,
//     desc:'Mathematics, Physics, Chemistry, Biology and ICT.',
//     coreSubjects:['Core Mathematics','English Language','Integrated Science','Social Studies','ICT'],
//     electiveSubjects:['Physics','Chemistry','Biology','Elective Mathematics'],
//   },
//   { id:2, name:'General Arts',    code:'ARTS', track:'Both', color:'#7c3aed',           bg:'#f5f3ff', years:['Form 1','Form 2','Form 3'], maxPerClass:40, active:true,
//     desc:'Literature, History, Geography, Economics and Languages.',
//     coreSubjects:['Core Mathematics','English Language','Integrated Science','Social Studies','ICT'],
//     electiveSubjects:['Literature in English','History','Geography','Economics','Government'],
//   },
//   { id:3, name:'Business',        code:'BUS',  track:'Both', color:'#ca8a04',           bg:'#fefce8', years:['Form 1','Form 2','Form 3'], maxPerClass:40, active:true,
//     desc:'Accounting, Economics, Business Management and ICT.',
//     coreSubjects:['Core Mathematics','English Language','Integrated Science','Social Studies','ICT'],
//     electiveSubjects:['Accounting','Economics','Business Management','Typewriting'],
//   },
//   { id:4, name:'Technical',       code:'TECH', track:'Both', color:'var(--success-dark)',bg:'#f0fdf4', years:['Form 1','Form 2','Form 3'], maxPerClass:40, active:true,
//     desc:'Technical Drawing, Auto Mechanics, Welding and Electronics.',
//     coreSubjects:['Core Mathematics','English Language','Integrated Science','Social Studies','ICT'],
//     electiveSubjects:['Technical Drawing','Auto Mechanics','Welding & Fabrication','Electronics'],
//   },
// ];

// const EMPTY = { id:null, name:'', code:'', track:'Both', color:'var(--royal-blue)', bg:'#eef2ff', years:['Form 1','Form 2','Form 3'], maxPerClass:40, active:true, desc:'', coreSubjects:[], electiveSubjects:[] };
// const TRACK_OPTS = ['Both','A','B'];
// const YEARS = ['Form 1','Form 2','Form 3'];

// const Toggle = ({ checked, onChange, color='var(--royal-blue)' }) => (
//   <button type="button" onClick={()=>onChange(!checked)}
//     className="relative inline-flex h-5 w-9 rounded-full flex-shrink-0 transition-colors"
//     style={{ backgroundColor:checked?color:'#d1d5db' }}>
//     <span className="inline-block h-4 w-4 mt-0.5 rounded-full bg-white shadow transition-transform"
//       style={{ transform:checked?'translateX(20px)':'translateX(2px)' }}/>
//   </button>
// );

// const ProgramTrackManagement = () => {
//   const [progs,    setProgs]    = useState(INIT);
//   const [editId,   setEditId]   = useState(null);
//   const [showForm, setShowForm] = useState(false);
//   const [form,     setForm]     = useState({...EMPTY});
//   const [toast,    setToast]    = useState(null);

//   const showToast = (msg,type='success') => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };
//   const set = (k,v) => setForm(f=>({...f,[k]:v}));

//   const toggleYear  = (yr) => set('years', form.years.includes(yr)?form.years.filter(y=>y!==yr):[...form.years,yr]);
//   const update = (id,k,v) => setProgs(ps=>ps.map(p=>p.id===id?{...p,[k]:v}:p));

//   const openAdd  = () => { setEditId(null); setForm({...EMPTY,id:Date.now()}); setShowForm(true); };
//   const openEdit = (p) => { setEditId(p.id); setForm({...p}); setShowForm(true); };

//   const handleSave = () => {
//     if (!form.name.trim()) return;
//     if (editId) {
//       setProgs(ps=>ps.map(p=>p.id===editId?{...form}:p));
//       showToast(`${form.name} updated`);
//     } else {
//       setProgs(ps=>[...ps,{...form}]);
//       showToast(`${form.name} created`);
//     }
//     setShowForm(false);
//   };

//   const handleDelete = (p) => {
//     setProgs(ps=>ps.filter(x=>x.id!==p.id));
//     showToast(`${p.name} removed`,'error');
//   };

//   const count = (name) => STUDENTS.filter(s=>s.program===name).length;
//   const splitA = (name) => STUDENTS.filter(s=>s.program===name&&s.track==='A').length;
//   const splitB = (name) => STUDENTS.filter(s=>s.program===name&&s.track==='B').length;

//   return (
//     <div className="space-y-5">
//       {toast && (
//         <div className="fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-xl text-white text-sm font-semibold flex items-center gap-2"
//           style={{ backgroundColor:toast.type==='error'?'var(--accent-red)':'var(--success-dark)' }}>
//           <CheckCircle2 size={14}/> {toast.msg}
//         </div>
//       )}

//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="font-black text-base" style={{ color:'var(--dark-gray)' }}>Programme & Track Management</h2>
//           <p className="text-xs text-gray-400">{progs.filter(p=>p.active).length} active programmes</p>
//         </div>
//         <div className="flex gap-2">
//           <button type="button" onClick={openAdd}
//             className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white"
//             style={{ backgroundColor:'var(--royal-blue)' }}>
//             <Plus size={14}/> Add Programme
//           </button>
//         </div>
//       </div>

//       {/* Stats row */}
//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
//         {progs.map(p=>(
//           <div key={p.id} className="bg-white rounded-xl border p-3 shadow-sm" style={{ borderColor:'var(--medium-gray)' }}>
//             <div className="flex items-center justify-between mb-1">
//               <span className="text-xs font-black px-2 py-0.5 rounded text-white" style={{ backgroundColor:p.color }}>{p.code}</span>
//               <Toggle checked={p.active} onChange={v=>update(p.id,'active',v)} color={p.color}/>
//             </div>
//             <p className="text-xl font-black" style={{ color:p.color }}>{count(p.name)}</p>
//             <p className="text-xs text-gray-400">{p.name.replace('General ','')} students</p>
//           </div>
//         ))}
//       </div>

//       {/* Programme cards */}
//       <div className="space-y-4">
//         {progs.map(p=>(
//           <div key={p.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden"
//             style={{ borderColor:p.color+'50', borderWidth:2, opacity:p.active?1:0.6 }}>
//             <div className="flex items-center justify-between px-5 py-3.5 border-b"
//               style={{ borderColor:'var(--medium-gray)', backgroundColor:p.bg }}>
//               <div className="flex items-center gap-3">
//                 <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black"
//                   style={{ backgroundColor:p.color }}>{p.code}</div>
//                 <div>
//                   <p className="font-black text-base" style={{ color:'var(--dark-gray)' }}>{p.name}</p>
//                   <p className="text-xs text-gray-400">{p.desc}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-2">
//                 <button type="button" onClick={()=>openEdit(p)} style={{ color:'var(--warning)' }}><Edit3 size={15}/></button>
//                 <button type="button" onClick={()=>handleDelete(p)} style={{ color:'var(--accent-red)' }}><Trash2 size={15}/></button>
//               </div>
//             </div>
//             <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {/* Track */}
//               <div>
//                 <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color:'var(--dark-gray)',opacity:0.5 }}>Track</p>
//                 <div className="flex gap-2">
//                   {(p.track==='Both'?['A','B']:[p.track]).map(t=>(
//                     <div key={t} className="flex-1 text-center py-2 rounded-xl text-sm font-black"
//                       style={{ backgroundColor:t==='A'?'#fefce8':'#f0fdf4', color:t==='A'?'#854d0e':'#166534' }}>
//                       T{t}: {t==='A'?splitA(p.name):splitB(p.name)}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//               {/* Max per class */}
//               <div>
//                 <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color:'var(--dark-gray)',opacity:0.5 }}>Max/Class</p>
//                 <div className="text-center p-2.5 rounded-xl" style={{ backgroundColor:p.bg }}>
//                   <p className="text-2xl font-black" style={{ color:p.color }}>{p.maxPerClass}</p>
//                   <p className="text-xs text-gray-400">students</p>
//                 </div>
//               </div>
//               {/* Year groups */}
//               <div>
//                 <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color:'var(--dark-gray)',opacity:0.5 }}>Years</p>
//                 <div className="flex flex-wrap gap-1.5">
//                   {['Form 1','Form 2','Form 3'].map(yr=>{
//                     const on = p.years.includes(yr);
//                     return (
//                       <span key={yr} className="px-2 py-1 rounded-lg text-xs font-semibold"
//                         style={{ backgroundColor:on?p.bg:' var(--light-gray)', color:on?p.color:'#9ca3af', border:`1px solid ${on?p.color:'var(--medium-gray)'}` }}>
//                         {yr}
//                       </span>
//                     );
//                   })}
//                 </div>
//               </div>
//             </div>
//             {/* Subjects preview */}
//             <div className="px-4 pb-4">
//               <p className="text-xs font-black uppercase tracking-widest mb-2" style={{ color:'var(--dark-gray)',opacity:0.5 }}>Elective Subjects</p>
//               <div className="flex flex-wrap gap-1.5">
//                 {p.electiveSubjects.map(s=>(
//                   <span key={s} className="text-xs px-2 py-1 rounded-lg font-medium"
//                     style={{ backgroundColor:p.bg, color:p.color, border:`1px solid ${p.color}30` }}>{s}</span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Add/Edit Modal */}
//       {showForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
//             <div className="flex items-center justify-between px-5 py-4 flex-shrink-0"
//               style={{ background:'linear-gradient(135deg,var(--royal-blue),var(--royal-blue-dark))' }}>
//               <p className="text-white font-black">{editId?'Edit Programme':'Add Programme'}</p>
//               <button type="button" onClick={()=>setShowForm(false)} className="text-white"><X size={18}/></button>
//             </div>
//             <div className="h-1 flex-shrink-0" style={{ backgroundColor:'var(--accent-red)' }}/>
//             <div className="flex-1 overflow-y-auto p-5 space-y-4">
//               {[
//                 { label:'Programme Name *', field:'name',    placeholder:'e.g. General Science' },
//                 { label:'Code',             field:'code',    placeholder:'e.g. SCI' },
//                 { label:'Description',      field:'desc',    placeholder:'Brief description' },
//               ].map(({label,field,placeholder})=>(
//                 <div key={field}>
//                   <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color:'var(--dark-gray)' }}>{label}</label>
//                   <input value={form[field]||''} onChange={e=>set(field,e.target.value)} placeholder={placeholder}
//                     className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none"
//                     style={{ borderColor:'var(--medium-gray)' }}
//                     onFocus={e=>e.target.style.borderColor='var(--royal-blue)'}
//                     onBlur={e=>e.target.style.borderColor='var(--medium-gray)'}/>
//                 </div>
//               ))}
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color:'var(--dark-gray)' }}>Track Assignment</label>
//                 <select value={form.track} onChange={e=>set('track',e.target.value)}
//                   className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none bg-white"
//                   style={{ borderColor:'var(--medium-gray)' }}>
//                   <option value="Both">Both Tracks (A & B)</option>
//                   <option value="A">Track A Only</option>
//                   <option value="B">Track B Only</option>
//                 </select>
//               </div>
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color:'var(--dark-gray)' }}>Year Groups</label>
//                 <div className="flex gap-2">
//                   {YEARS.map(yr=>(
//                     <button key={yr} type="button" onClick={()=>toggleYear(yr)}
//                       className="flex-1 py-2 rounded-xl text-xs font-semibold"
//                       style={{ backgroundColor:form.years.includes(yr)?'var(--royal-blue)':'white', color:form.years.includes(yr)?'white':'var(--dark-gray)', border:'1px solid var(--medium-gray)' }}>
//                       {yr}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//               <div>
//                 <label className="text-xs font-bold uppercase tracking-wider block mb-1" style={{ color:'var(--dark-gray)' }}>Max Students per Class</label>
//                 <input type="number" min={10} max={60} value={form.maxPerClass}
//                   onChange={e=>set('maxPerClass',parseInt(e.target.value)||40)}
//                   className="w-full px-3 py-2.5 text-sm rounded-xl border-2 outline-none text-center font-black"
//                   style={{ borderColor:'var(--medium-gray)', color:'var(--royal-blue)' }}/>
//               </div>
//               <div className="flex items-center justify-between">
//                 <label className="text-sm font-semibold" style={{ color:'var(--dark-gray)' }}>Active</label>
//                 <Toggle checked={form.active} onChange={v=>set('active',v)}/>
//               </div>
//             </div>
//             <div className="flex justify-end gap-2 px-5 py-4 border-t flex-shrink-0"
//               style={{ borderColor:'var(--medium-gray)', backgroundColor:'var(--light-gray)' }}>
//               <button type="button" onClick={()=>setShowForm(false)}
//                 className="px-4 py-2 text-sm rounded-xl border font-semibold"
//                 style={{ borderColor:'var(--medium-gray)', color:'var(--dark-gray)' }}>Cancel</button>
//               <button type="button" onClick={handleSave}
//                 className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white rounded-xl"
//                 style={{ backgroundColor:'var(--royal-blue)' }}>
//                 <Save size={13}/> {editId?'Update':'Add'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };
// export default ProgramTrackManagement;
