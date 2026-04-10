const { useState, useEffect, useRef } = React;

// ─── Priority levels config ──────────────────────────────────────
const PRIORITY_LEVELS = [
    { label: "Low",      color: "#64748b", bg: "#f1f5f9", icon: "🟡" },
    { label: "Normal",   color: "#2563eb", bg: "#eff6ff", icon: "🔵" },
    { label: "High",     color: "#d97706", bg: "#fffbeb", icon: "🟠" },
    { label: "Critical", color: "#dc2626", bg: "#fef2f2", icon: "🔴" },
];

// ─── Queue Status View ────────────────────────────────────────────
const QueueView = ({ queueNum, priority, onPriorityChange, onClose }) => {
    const current = PRIORITY_LEVELS.find(p => p.label === priority) || PRIORITY_LEVELS[1];
    const [showPicker, setShowPicker] = React.useState(false);
    return (
        <div>
            <div style={{textAlign:"center",marginBottom:"18px"}}>
                <div style={{fontSize:"3rem",marginBottom:"8px"}}>📋</div>
                <h2 style={{color:"#2563eb",margin:0}}>Order Queued!</h2>
                <p style={{color:"#64748b",marginTop:"6px"}}>Your request has been placed in the processing queue.</p>
            </div>

            {/* Queue card */}
            <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"18px",marginBottom:"18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                    <span style={{fontWeight:700,color:"#1e293b"}}>Queue Number</span>
                    <span style={{fontFamily:"monospace",fontWeight:800,fontSize:"1.1rem",color:"#2563eb",background:"#dbeafe",padding:"4px 12px",borderRadius:"8px"}}>{queueNum}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                    <span style={{fontWeight:700,color:"#1e293b"}}>Status</span>
                    <span style={{background:"#fef3c7",color:"#92400e",fontWeight:700,padding:"4px 14px",borderRadius:"20px",fontSize:"0.85rem"}}>⏳ In Queue</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontWeight:700,color:"#1e293b"}}>Priority</span>
                    <span style={{background:current.bg,color:current.color,fontWeight:700,padding:"4px 14px",borderRadius:"20px",fontSize:"0.85rem"}}>
                        {current.icon} {current.label}
                    </span>
                </div>
            </div>

            {/* Priority assignment button */}
            <div style={{position:"relative",marginBottom:"14px"}}>
                <button
                    id="assign-priority-btn"
                    onClick={() => setShowPicker(p => !p)}
                    style={{
                        width:"100%",padding:"12px",borderRadius:"10px",border:`2px solid ${current.color}`,
                        background:current.bg,color:current.color,fontWeight:700,fontSize:"0.95rem",
                        cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",
                        transition:"all 0.2s"
                    }}
                >
                    🎯 Assign Priority Level {showPicker ? "▲" : "▼"}
                </button>
                {showPicker && (
                    <div style={{
                        position:"absolute",bottom:"calc(100% + 6px)",left:0,right:0,
                        background:"#fff",border:"1px solid #e2e8f0",borderRadius:"12px",
                        boxShadow:"0 8px 24px rgba(0,0,0,0.12)",overflow:"hidden",zIndex:10
                    }}>
                        {PRIORITY_LEVELS.map(lvl => (
                            <button
                                key={lvl.label}
                                id={`priority-${lvl.label.toLowerCase()}`}
                                onClick={() => { onPriorityChange(lvl.label); setShowPicker(false); }}
                                style={{
                                    width:"100%",padding:"12px 18px",border:"none",background: priority===lvl.label ? lvl.bg : "#fff",
                                    color:lvl.color,fontWeight: priority===lvl.label ? 800 : 600,
                                    fontSize:"0.9rem",cursor:"pointer",textAlign:"left",
                                    display:"flex",alignItems:"center",gap:"10px",transition:"background 0.15s"
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = lvl.bg}
                                onMouseLeave={e => e.currentTarget.style.background = priority===lvl.label ? lvl.bg : "#fff"}
                            >
                                {lvl.icon} {lvl.label} {priority===lvl.label && "✓"}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <button onClick={onClose} className="btn btn-secondary" style={{width:"100%"}}>Close</button>
        </div>
    );
};

// ─── Prescription Upload Form ─────────────────────────────────────
const RxOrderForm = ({ onCancel, onSubmit }) => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };
    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) setFileName(e.dataTransfer.files[0].name);
    };

    return (
        <div>
            <h2 style={{color:"#8b5cf6",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px"}}>📝 Upload & Order Items</h2>
            <p>Upload a doctor's prescription or select OTC items.</p>
            <form style={{textAlign:"left",marginTop:"20px"}} onSubmit={(e)=>{e.preventDefault();onSubmit();}}>
                {/* Drag & Drop Zone */}
                <div
                    onDragEnter={handleDrag} onDragLeave={handleDrag}
                    onDragOver={handleDrag} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        marginBottom:"20px",padding:"30px 15px",borderRadius:"12px",
                        border:`2px dashed ${dragActive ? '#8b5cf6' : '#cbd5e1'}`,
                        backgroundColor: dragActive ? '#f3e8ff' : '#f8fafc',
                        textAlign:"center",cursor:"pointer",transition:"all 0.3s ease"
                    }}
                >
                    <div style={{fontSize:"2.5rem",marginBottom:"8px"}}>☁️</div>
                    <p style={{fontWeight:600,marginBottom:"6px",color:"#1e1b4b"}}>Drag & Drop your prescription photo here</p>
                    <p style={{color:"#64748b",fontSize:"0.85rem"}}>or click to browse — Image / PDF accepted</p>
                    <input ref={fileInputRef} type="file" accept="image/*,.pdf" style={{display:"none"}}
                        onChange={(e) => { if(e.target.files?.[0]) setFileName(e.target.files[0].name); }} />
                    {fileName && (
                        <div style={{marginTop:"10px",padding:"6px 14px",background:"#d1fae5",borderRadius:"20px",display:"inline-block",color:"#065f46",fontWeight:500,fontSize:"0.85rem"}}>
                            ✅ {fileName}
                        </div>
                    )}
                </div>

                <div style={{marginBottom:"15px"}}>
                    <label style={{display:"block",marginBottom:"6px",fontWeight:600}}>Select OTC Items <span style={{fontWeight:400,color:"#64748b"}}>(Optional)</span></label>
                    <select className="modal-input" multiple style={{height:"80px"}}>
                        <option value="firstaid">Advanced First Aid Kit</option>
                        <option value="vitamins">Multivitamins Bundle</option>
                        <option value="mask">N95 Respirators (Box of 50)</option>
                        <option value="monitor">Blood Pressure Monitor</option>
                    </select>
                    <small style={{color:"#64748b",fontSize:"0.8rem"}}>Hold CTRL/CMD to select multiple.</small>
                </div>

                <div style={{marginBottom:"20px"}}>
                    <label style={{display:"block",marginBottom:"6px",fontWeight:600}}>Delivery Address</label>
                    <input type="text" className="modal-input" required placeholder="Full Shipping Address"/>
                </div>
                <div style={{display:"flex",gap:"10px"}}>
                    <button type="submit" className="btn btn-primary" style={{flex:2,background:"linear-gradient(135deg,#8b5cf6,#6d28d9)"}}>Process Order</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary" style={{flex:1}}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

// ─── Family Order Form ────────────────────────────────────────────
const FamilyOrderForm = ({ onCancel, onSubmit }) => {
    const [schedType, setSchedType] = useState("now");
    return (
        <div>
            <h2 style={{color:"#10b981",display:"flex",alignItems:"center",justifyContent:"center",gap:"10px"}}>❤️ Order for Family</h2>
            <p>Send crucial medical supplies to a loved one living far away.</p>
            <form style={{textAlign:"left",marginTop:"15px"}} onSubmit={(e)=>{e.preventDefault();onSubmit();}}>
                <div style={{marginBottom:"15px"}}><label style={{display:"block",marginBottom:"6px",fontWeight:600}}>Relative's Name</label><input type="text" className="modal-input" required placeholder="e.g. Jane Doe"/></div>
                <div style={{marginBottom:"15px"}}><label style={{display:"block",marginBottom:"6px",fontWeight:600}}>Delivery Address</label><input type="text" className="modal-input" required placeholder="Full Address"/></div>
                <div style={{marginBottom:"15px"}}>
                    <label style={{display:"block",marginBottom:"6px",fontWeight:600}}>Package Type</label>
                    <select className="modal-input" required>
                        <option value="">Select...</option>
                        <option value="meds">Prescription Refill</option>
                        <option value="equipment">Home Aid Equipment</option>
                        <option value="supplies">Daily Medical Supplies</option>
                    </select>
                </div>
                <div style={{marginBottom:"20px"}}>
                    <label style={{display:"block",marginBottom:"6px",fontWeight:600}}>Delivery Schedule</label>
                    <select className="modal-input" value={schedType} onChange={e=>setSchedType(e.target.value)}>
                        <option value="now">Immediate Dispatch (ASAP)</option>
                        <option value="scheduled">Schedule for Later</option>
                    </select>
                    {schedType === "scheduled" && <input type="datetime-local" className="modal-input" style={{marginTop:"10px"}} required/>}
                </div>
                <div style={{display:"flex",gap:"10px"}}>
                    <button type="submit" className="btn btn-primary" style={{flex:2,background:"linear-gradient(135deg,#10b981,#059669)"}}>Send Care Package</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary" style={{flex:1}}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

// ─── Shared helpers ──────────────────────────────────────────────
const TYPE_META = {
    emergency:    { label: "Emergency Order",  icon: "🚨", color: "#dc2626" },
    family:       { label: "Family Care",       icon: "❤️", color: "#10b981" },
    prescription: { label: "Prescription",      icon: "📝", color: "#8b5cf6" },
};
const STATUS_OPTIONS = ["In Queue","Processing","Dispatched","On Hold"];

// ─── Main App ─────────────────────────────────────────────────────
const App = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [modalStep, setModalStep] = useState(1);
    const [queueNum, setQueueNum] = useState("");
    const [orderPriority, setOrderPriority] = useState("Normal");
    // ── Global Queue ──
    const [globalQueue, setGlobalQueue] = useState([]);
    // ── Admin Panel ──
    const [adminOpen, setAdminOpen] = useState(false);
    const [adminLoggedIn, setAdminLoggedIn] = useState(false);
    const [adminPwInput, setAdminPwInput] = useState("");
    const [adminPwError, setAdminPwError] = useState(false);
    // ── Emergency alert ──
    const [isEmergencyAlertActive, setIsEmergencyAlertActive] = useState(false);
    const [emergencyStatus, setEmergencyStatus] = useState("");
    const [showDismiss, setShowDismiss] = useState(false);
    const [chatbotOpen, setChatbotOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState([{ id:1, text:"Hello! How can I help you today?", isBot:true }]);
    const [chatInput, setChatInput] = useState("");
    const [trackNum, setTrackNum] = useState("");
    const [trackResult, setTrackResult] = useState(null);
    const [pills, setPills] = useState([
        { name:"Lisinopril 10mg", time:"08:00 AM" },
        { name:"Vitamin D3",      time:"01:00 PM" },
        { name:"Paracetamol",     time:"09:00 PM" }
    ]);
    const [newPillName, setNewPillName] = useState("");
    const [newPillTime, setNewPillTime] = useState("");
    const chatBodyRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        setTimeout(() => setChatbotOpen(true), 1500);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }, [chatMessages]);

    const openModal = (name) => { setActiveModal(name); setModalStep(1); setOrderPriority("Normal"); };
    const closeModal = () => { setActiveModal(null); setModalStep(1); };

    // ── Patient Profile (persisted in localStorage) ──
    const PROFILE_KEY = 'medigo_patient_profile';
    const loadProfile = () => {
        try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null; } catch { return null; }
    };
    const defaultProfile = { name:"", phone:"", address:"", medicines:[] };
    const [profile, setProfile] = useState(() => loadProfile() || defaultProfile);
    const [editingProfile, setEditingProfile] = useState(!loadProfile());
    const [profileDraft, setProfileDraft] = useState(() => loadProfile() || defaultProfile);
    const [newMedInput, setNewMedInput] = useState("");
    const [quickOrderSuccess, setQuickOrderSuccess] = useState(false);

    useEffect(() => {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    }, [profile]);

    const saveProfile = () => {
        setProfile(profileDraft);
        setEditingProfile(false);
    };
    const addProfileMed = () => {
        const m = newMedInput.trim();
        if(!m || profileDraft.medicines.includes(m)) return;
        setProfileDraft(d => ({...d, medicines:[...d.medicines, m]}));
        setNewMedInput("");
    };
    const removeProfileMed = (med) => setProfileDraft(d => ({...d, medicines:d.medicines.filter(x=>x!==med)}));

    const handleQuickReorder = () => {
        if(!profile.medicines.length || !profile.address) return;
        const prefix = "MQ";
        const num = Math.floor(10000 + Math.random() * 90000);
        const id = `${prefix}-${num}`;
        const entry = {
            id,
            type: 'prescription',
            priority: "Normal",
            status: "In Queue",
            placedAt: new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}),
            note: `Quick Reorder for ${profile.name || 'Patient'} — ${profile.medicines.join(', ')}`,
        };
        setGlobalQueue(prev => [entry, ...prev]);
        setQuickOrderSuccess(true);
        setTimeout(() => setQuickOrderSuccess(false), 3500);
    };

    const submitToQueue = () => {
        const prefix = "MQ";
        const num = Math.floor(10000 + Math.random() * 90000);
        const id = `${prefix}-${num}`;
        const entry = {
            id,
            type: activeModal,
            priority: "Normal",
            status: "In Queue",
            placedAt: new Date().toLocaleTimeString('en-IN', {hour:'2-digit',minute:'2-digit'}),
        };
        setGlobalQueue(prev => [entry, ...prev]);
        setQueueNum(id);
        setOrderPriority("Normal");
        setModalStep(2);
    };

    // Queue helpers used by both User view and Admin panel
    const cancelOrder  = (id) => setGlobalQueue(prev => prev.filter(o => o.id !== id));
    const updateQueuePriority = (id, p) => setGlobalQueue(prev => prev.map(o => o.id===id ? {...o, priority:p} : o));
    const updateQueueStatus   = (id, s) => setGlobalQueue(prev => prev.map(o => o.id===id ? {...o, status:s}   : o));

    // Admin login
    const handleAdminLogin = () => {
        if(adminPwInput === 'medigo@admin') { setAdminLoggedIn(true); setAdminPwError(false); }
        else { setAdminPwError(true); }
    };

    const fetchLocationData = async () => {
        let gps = "Permission Denied / Unavailable";
        let ip = "Unknown IP";
        try {
            const pos = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            gps = `${pos.coords.latitude}, ${pos.coords.longitude}`;
        } catch (err) { console.error("GPS Error:", err); }
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            ip = data.ip;
        } catch (err) { console.error("IP Error:", err); }
        return { gps, ip };
    };

    const reportEmergency = async (data) => {
        try {
            await fetch('http://localhost:5000/emergency/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (err) { console.error("Bridge Reporting Error:", err); }
    };

    // Hospital Alert
    const handleHospitalAlert = async () => {
        setIsEmergencyAlertActive(true);
        setShowDismiss(false);
        setEmergencyStatus("Tracing your location coordinates... Please stand by.");
        
        const { gps, ip } = await fetchLocationData();
        setEmergencyStatus(`📍 Location acquired: ${gps}\n🌐 IP: ${ip}\nAlerting nearest facility...`);
        
        await reportEmergency({ gps, ip, type: "Hospital Alert" });

        setTimeout(() => {
            const hospitals = ["AIIMS New Delhi","Apollo Hospitals Chennai","Fortis Memorial Research Institute","Kokilaben Dhirubhai Ambani Hospital","Max Super Speciality Hospital","Manipal Hospitals Bengaluru"];
            const h = hospitals[Math.floor(Math.random()*hospitals.length)];
            setEmergencyStatus(`✅ Alert Received! ${h} has been notified and will contact dispatch immediately.\n\nData pushed to secure emergency log.`);
            setShowDismiss(true);
        }, 3000);
    };

    // Tracking
    const handleTrackSubmit = (e) => {
        e.preventDefault();
        const t = trackNum.trim();
        if(!t) return;
        setTrackResult({ loading:true });
        setTimeout(() => {
            if(t.length >= 8) {
                const statuses = ["In Transit","Out for Delivery","Arrived at Facility","Picked Up"];
                const st = statuses[Math.floor(Math.random()*statuses.length)];
                const d = new Date(); d.setHours(d.getHours() - Math.floor(Math.random()*48));
                setTrackResult({ trkNum:t.toUpperCase(), status:st, lastUpdated:d.toLocaleString(), eta:"By 5:00 PM Tomorrow" });
            } else {
                setTrackResult({ error:"Tracking number not found. Please verify (8-10 chars)." });
            }
        }, 800);
    };

    // ── Advanced Chatbot Engine ────────────────────────────────
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState(['Track my order','Prescription upload','Emergency help','Services & pricing']);

    const chatKnowledge = [
        {
            keys: ['hello','hi','hey','good morning','good evening','howdy','sup','namaste'],
            replies: [
                "👋 Namaste! Welcome to Medigo — India's most trusted medical courier service. How can I assist you today?",
                "नमस्ते! 😊 I'm Medigo's support assistant. Ask me anything about tracking, orders, prescriptions, or services!",
                "Hey! Great to have you here. What can I help you with — tracking a package, placing an order, or something else?"
            ],
            followUps: ['Track my order','Post a prescription','Emergency order','Our services']
        },
        {
            keys: ['track','tracking','where is','locate','status','shipment','parcel','package','delivery status'],
            replies: [
                "📦 To track your parcel, scroll up to the **Track Your Medical Parcel** box on the homepage and enter your **8–10 character tracking number** (e.g. MP12345678). Results appear in seconds!",
                "🔍 Your tracking number was sent via SMS/email when your order was dispatched. Enter it in the tracking box at the top of the page. Need help? Call **+91 98765 43210**.",
                "📍 Live tracking is available 24/7. Use the tracking section on the homepage — just type your number like **MP12345678** and hit Track. Status updates every few minutes."
            ],
            followUps: ['Track number format','Parcel delayed?','Contact support']
        },
        {
            keys: ['prescription','rx','upload prescription','doctor note','medicine order','post prescription','parchee','dawai'],
            replies: [
                "💊 You can upload a prescription easily! Click the **📝 Post Prescription** button on the homepage. You can drag & drop a photo or PDF, then select any over-the-counter items you need alongside it.",
                "📋 To post your Rx: tap **Post Prescription** → drag & drop your prescription image or PDF → add any OTC items → enter your address → hit Process Order. Bahut aasaan hai!",
                "🩺 We accept prescription photos (JPEG, PNG) and PDFs. Once uploaded, our pharmacist team verifies it within 30 minutes before dispatch — across all major Indian cities."
            ],
            followUps: ['What formats are accepted?','How long until delivery?','OTC items available']
        },
        {
            keys: ['emergency','urgent','critical','sos','hospital alert','112','ambulance','life threatening'],
            replies: [
                "🚨 For a medical emergency, use the red **HOSPITAL ALERT** button (bottom-right of the page) immediately. It will ping the nearest hospital — AIIMS, Apollo, Fortis, or Max. For life-threatening emergencies, also dial **112**.",
                "⚡ Emergency orders are dispatched within **minutes**. Click the **🚨 Emergency Order** button on the homepage, fill in pickup & destination details, and we'll mobilize instantly.",
                "🏥 We handle critical organ transport, blood samples, and emergency medications for top Indian hospitals like AIIMS, Apollo, Manipal & Kokilaben. Our dispatch team is on standby 24/7."
            ],
            followUps: ['Emergency order details','Call dispatch team','Hospital coverage area']
        },
        {
            keys: ['family','loved one','relative','send to','remote','care package','parents','grandparents','maa','papa','ghar'],
            replies: [
                "❤️ Use the **Order for Family** button to send medical supplies to loved ones anywhere in India. Enter their name, address, and choose immediate dispatch or schedule a future delivery date.",
                "🏠 Our Family Care service lets you remotely send prescription refills, medical equipment, or daily supplies to a relative — be it Delhi, Mumbai, Kolkata or a small town!",
                "📬 Yes! We deliver across India. Use the Family Order feature to schedule recurring refills or a one-time care package for your loved ones at home."
            ],
            followUps: ['Scheduling a delivery','Recurring orders','Delivery areas']
        },
        {
            keys: ['price','cost','fee','charge','rate','quote','how much','billing','payment','kitna','rupee','inr'],
            replies: [
                "💰 Pricing is tailored based on **distance**, **urgency**, and **package type** (e.g., cold-chain items cost more). Call **+91 98765 43210** for an instant quote — usually under 2 minutes!",
                "📊 We offer tiered pricing in INR (₹): Standard (3–5 hrs), Express (1–2 hrs), and Emergency (<30 min). Exact costs vary by city. Call +91 98765 43210 or email Medigotrack@gmail.com.",
                "🏷️ Our rates are competitive and transparent with no hidden charges. We accept UPI, Net Banking, Cards, and Cash. Get a free quote by calling **+91 98765 43210**."
            ],
            followUps: ['UPI payment','Insurance coverage','Get a quote']
        },
        {
            keys: ['time','how long','eta','when','duration','fast','speed','quick','slow','delayed','delay','kitni der'],
            replies: [
                "⏱️ Delivery times: **Emergency** orders arrive in 15–30 min, **Express** in 1–2 hours, **Standard** in 3–5 hours. Real-time ETAs shown after your order is placed.",
                "🚀 Our Emergency dispatch averages **18 minutes** across metros like Mumbai, Delhi, Bengaluru & Chennai. Standard courier takes 3–5 hours. Track your ETA live!",
                "📅 If your shipment is delayed beyond the estimated window, call **+91 98765 43210** immediately. We have a delay guarantee — if we're late, you get a priority re-dispatch at no extra cost."
            ],
            followUps: ['Track live ETA','Report a delay','Express options']
        },
        {
            keys: ['service','what do you','offer','provide','speciali','lab','specimen','blood','organ','equipment','pharmacy'],
            replies: [
                "🏥 We specialize in: **Lab Specimens** (blood, tissue, biopsies), **Pharmacy Deliveries** (prescription & OTC), and **Medical Equipment** — all under strict Indian Medical Council & cold-chain protocols.",
                "🔬 Our core services: \n• Lab specimen courier (temperature-controlled) \n• Prescription & OTC pharmacy delivery \n• Medical device & equipment logistics \n• Emergency organ transport \n• Family care packages across India",
                "💼 Medigo partners with 500+ hospitals and clinics across India including AIIMS, Apollo, Fortis, Manipal, Narayana Health & more. Scroll down to **Our Specialized Services** for details!"
            ],
            followUps: ['Cold-chain transport','CDSCO compliance','Book a service']
        },
        {
            keys: ['compliance','secure','privacy','data','confidential','regulation','cdsco','mci','government'],
            replies: [
                "🔒 We comply with **CDSCO regulations**, Indian Medical Council guidelines, and IT Act data privacy requirements. All patient data is encrypted end-to-end.",
                "✅ Medigo operates under CDSCO, MCI, and Indian Pharmacy Council guidelines. Our couriers are certified for handling sensitive biological and pharmaceutical materials.",
                "🛡️ Your privacy is our priority. We follow India's **Personal Data Protection** standards. Delivery manifests are encrypted and auto-deleted after 90 days."
            ],
            followUps: ['Data security','Courier certification','Compliance docs']
        },
        {
            keys: ['contact','phone','email','reach','call','support','help','agent','human','operator','helpline'],
            replies: [
                "📞 Reach our team 24/7:\n• **Phone:** +91 98765 43210\n• **Email:** Medigotrack@gmail.com\n• **Address:** 4th Floor, Bandra Kurla Complex, Mumbai, Maharashtra 400051",
                "💬 Contact us via phone at **+91 98765 43210** for immediate assistance, or email **Medigotrack@gmail.com** for non-urgent inquiries. Average response time is under 3 minutes!",
                "🧑‍💼 To speak with a live agent, call **+91 98765 43210** — available 24/7/365 across India. For prescription queries, ask for our pharmacy coordination desk."
            ],
            followUps: ['Operating hours','Email support','Office location']
        },
        {
            keys: ['hours','open','available','24','around the clock','when are','operation','operate'],
            replies: [
                "🕐 Medigo operates **24 hours a day, 7 days a week, 365 days a year** — including Diwali, Holi and all Indian public holidays. Emergency dispatch is always available.",
                "✅ We never close! Whether it's 3 AM or a busy festival morning, our dispatch team across India is ready to serve you.",
                "🌙 Our 24/7 operations mean your medical supplies reach you on time — any time, anywhere in India. Emergency orders handled within minutes, even at midnight."
            ],
            followUps: ['Emergency availability','Holiday delivery','Book a time slot']
        },
        {
            keys: ['cancel','cancellation','change order','modify','update order','wrong address','mistake'],
            replies: [
                "✏️ To cancel or modify an order, call us **immediately** at +91 98765 43210. Orders can be modified within **10 minutes** of placement before courier dispatch.",
                "⚠️ Once a courier is dispatched, cancellation may incur a small fee. Contact us right away at +91 98765 43210 to minimize charges and arrange changes.",
                "🔄 Address changes must be requested before the package leaves the facility. Call +91 98765 43210 with your tracking number ready for fastest resolution."
            ],
            followUps: ['Track my order','Contact support','Refund policy']
        },
        {
            keys: ['refund','money back','return','reimburse','charge dispute','overcharged','paisa wapas'],
            replies: [
                "💳 Refund requests are processed within **3–5 business days**. Email Medigotrack@gmail.com with your order ID and reason. We have a 100% satisfaction guarantee for failed deliveries.",
                "🔁 If your delivery was lost, damaged, or significantly delayed beyond our SLA, you're eligible for a full refund or re-dispatch at no cost. Call +91 98765 43210 to initiate.",
                "✅ We stand behind every delivery. If something went wrong, contact us within **48 hours** of the scheduled delivery for full investigation and refund/re-delivery. UPI refunds processed instantly."
            ],
            followUps: ['Contact support','Order status','Re-delivery options']
        },
        {
            keys: ['pill','reminder','medication','medicine reminder','schedule','dose','alarm','dawai','dawa'],
            replies: [
                "💊 Use our **Pill Reminder** tool in the Patient Portal section below! Add your medication name and time, and we'll help you stay on schedule. It's free and built right into this portal.",
                "⏰ Never miss a dose! Scroll to the **Patient Portal** section → find the Pill Reminder card → add your medication name and reminder time. Simple and effective!",
                "🩺 The Pill Reminder helps you track all scheduled medications — great for managing multiple prescriptions or helping elderly parents with their daily medicines."
            ],
            followUps: ['Set a reminder','Patient portal','Order medication']
        },
        {
            keys: ['area','coverage','deliver to','location','city','state','region','nationwide','pin code','district'],
            replies: [
                "🗺️ We serve **50+ cities** across India including Delhi, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Jaipur, Lucknow & more. Call +91 98765 43210 to check your PIN code.",
                "📍 Medigo covers all major metros and Tier-2 cities in India. Enter your delivery address in any order form — if we can't reach you directly, we'll connect you to a partner courier network.",
                "🌏 We deliver across India from Kashmir to Kanyakumari. International medical logistics partnerships are also available for NRIs — contact us for details."
            ],
            followUps: ['Check my PIN code','NRI inquiry','Partner network']
        }
    ];

    const getSmartReply = (text) => {
        const l = text.toLowerCase();
        // Find best matching intent
        let bestMatch = null;
        let bestScore = 0;
        chatKnowledge.forEach(intent => {
            const score = intent.keys.filter(k => l.includes(k)).length;
            if(score > bestScore) { bestScore = score; bestMatch = intent; }
        });
        if(bestMatch && bestScore > 0) {
            const reply = bestMatch.replies[Math.floor(Math.random() * bestMatch.replies.length)];
            return { reply, followUps: bestMatch.followUps };
        }
        return {
            reply: "🤔 I'm not sure I caught that. Could you rephrase? You can also reach a live agent at **110-486-309** or email **Medigotrack@gmail.com** for complex queries.",
            followUps: ['Track my order','Our services','Contact support','Emergency help']
        };
    };

    const sendChat = (text) => {
        if(!text.trim()) return;
        setChatMessages(prev => [...prev, { id:Date.now(), text, isBot:false }]);
        setChatInput("");
        setSuggestions([]);
        setIsTyping(true);
        const delay = 800 + Math.random() * 600; // realistic variable delay
        setTimeout(() => {
            const { reply, followUps } = getSmartReply(text);
            setIsTyping(false);
            setChatMessages(prev => [...prev, { id:Date.now()+1, text:reply, isBot:true }]);
            setSuggestions(followUps || []);
        }, delay);
    };

    const handleChatSubmit = (e) => { e.preventDefault(); sendChat(chatInput); };

    // Pills
    const addPill = (e) => {
        e.preventDefault();
        if(newPillName && newPillTime) {
            let [h,m] = newPillTime.split(':');
            let suf = h >= 12 ? 'PM' : 'AM'; let h12 = h % 12 || 12;
            setPills([...pills, { name:newPillName, time:`${h12}:${m} ${suf}` }]);
            setNewPillName(""); setNewPillTime("");
        }
    };

    return (
        <>
        {/* ── HEADER ── */}
        <header className={`main-header${scrolled?' scrolled':''}`}>
            <div className="container header-container">
                <div className="logo"><h1>Medi<span>go</span></h1></div>
                <nav className={`main-nav${menuOpen?' open':''}`}>
                    <ul>
                        <li><a href="#home" onClick={()=>setMenuOpen(false)}>Home</a></li>
                        <li><a href="#track" onClick={()=>setMenuOpen(false)}>Track Package</a></li>
                        <li><a href="#queue" onClick={()=>setMenuOpen(false)}>My Queue</a></li>
                        <li><a href="#services" onClick={()=>setMenuOpen(false)}>Services</a></li>
                        <li><a href="#patient-portal" onClick={()=>setMenuOpen(false)}>Patient Portal</a></li>
                        <li><a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a></li>
                        <li><a href="#admin" onClick={()=>{setMenuOpen(false);setAdminOpen(true);}} style={{color:"#dc2626",fontWeight:700}}>⚙️ Admin</a></li>
                    </ul>
                </nav>
                <button className="mobile-menu-btn" onClick={()=>setMenuOpen(o=>!o)} aria-label="Toggle menu">
                    {menuOpen ? '✕' : '☰'}
                </button>
            </div>
        </header>

        {/* ── HERO ── */}
        <section id="home" className="hero-section">
            <div className="container hero-container">
                <div className="hero-content">
                    <h2>India's Most Trusted Medical Courier Service</h2>
                    <p>Ensuring safe, timely, and temperature-controlled delivery of critical medical packages, lab specimens, and equipment — across 50+ Indian cities.</p>
                    <div className="cta-buttons"><a href="#services" className="btn btn-secondary">Learn More</a></div>
                </div>
                <div id="track" className="tracking-box">
                    <h3>Track Your Medical Parcel</h3>
                    <p>Enter your tracking number to see live status.</p>
                    <form onSubmit={handleTrackSubmit}>
                        <div className="input-group">
                            <input type="text" placeholder="e.g. MP12345678" required value={trackNum} onChange={e=>setTrackNum(e.target.value)}/>
                            <button type="submit" className="btn btn-primary">Track</button>
                        </div>
                    </form>
                    {trackResult && (
                        <div className="tracking-result">
                            {trackResult.loading ? <p style={{textAlign:"center"}}>Locating package {trackNum}...</p>
                            : trackResult.error ? <p style={{color:"var(--accent-red)",fontWeight:"bold"}}>{trackResult.error}</p>
                            : <>
                                <div className="status-row"><span className="status-label">Tracking#:</span><span className="status-value">{trackResult.trkNum}</span></div>
                                <div className="status-row"><span className="status-label">Status:</span><span className="status-value" style={{fontWeight:"bold",color:trackResult.status==='Out for Delivery'?'#D32F2F':'var(--primary-blue)'}}>{trackResult.status}</span></div>
                                <div className="status-row"><span className="status-label">Last Updated:</span><span className="status-value">{trackResult.lastUpdated}</span></div>
                                <div className="status-row"><span className="status-label">Est. Delivery:</span><span className="status-value">{trackResult.eta}</span></div>
                            </>}
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* ── QUICK ACTIONS ── */}
        <section className="quick-actions-section container">
            <h2 style={{textAlign:"center",color:"var(--primary-blue)",marginBottom:"30px",fontSize:"2rem",fontWeight:800}}>How can we help you today?</h2>
            <div className="quick-actions-grid">
                <button onClick={()=>openModal('emergency')} className="action-card-btn emergency-bg">
                    <span className="action-icon">🚨</span>
                    <span className="action-title">Emergency Order</span>
                    <span className="action-desc">Immediate dispatch protocol</span>
                </button>
                <button onClick={()=>openModal('family')} className="action-card-btn family-bg">
                    <span className="action-icon">❤️</span>
                    <span className="action-title">Order for Family</span>
                    <span className="action-desc">Send care packages remotely</span>
                </button>
                <button onClick={()=>openModal('prescription')} className="action-card-btn rx-bg">
                    <span className="action-icon">📝</span>
                    <span className="action-title">Post Prescription</span>
                    <span className="action-desc">Upload Rx & order items</span>
                </button>
            </div>
        </section>

        {/* ── USER QUEUE SECTION ── */}
        <section id="queue" style={{padding:"60px 0",background:"#f8fafc"}}>
            <div className="container">
                <div className="section-title">
                    <h2>📋 Live Order Queue</h2>
                    <p>View all active orders. You can cancel any order you placed by mistake.</p>
                </div>
                {globalQueue.length === 0 ? (
                    <div style={{textAlign:"center",padding:"50px 20px",color:"#94a3b8"}}>
                        <div style={{fontSize:"3rem",marginBottom:"12px"}}>📭</div>
                        <p style={{fontSize:"1.1rem",fontWeight:600}}>No orders in the queue right now.</p>
                        <p style={{fontSize:"0.9rem"}}>Place an Emergency, Family, or Prescription order above to see it here.</p>
                    </div>
                ) : (
                    <div style={{display:"grid",gap:"16px"}}>
                        {globalQueue.map(order => {
                            const meta = TYPE_META[order.type] || TYPE_META.emergency;
                            const pLvl = PRIORITY_LEVELS.find(p=>p.label===order.priority)||PRIORITY_LEVELS[1];
                            const statusColor = order.status==="In Queue"?"#92400e":order.status==="Processing"?"#1d4ed8":order.status==="Dispatched"?"#065f46":"#6b7280";
                            const statusBg    = order.status==="In Queue"?"#fef3c7":order.status==="Processing"?"#dbeafe":order.status==="Dispatched"?"#d1fae5":"#f1f5f9";
                            return (
                                <div key={order.id} style={{
                                    background:"#fff",borderRadius:"14px",padding:"20px 24px",
                                    border:"1px solid #e2e8f0",display:"flex",alignItems:"center",
                                    gap:"20px",flexWrap:"wrap",boxShadow:"0 2px 8px rgba(0,0,0,0.05)"
                                }}>
                                    <div style={{fontSize:"2rem"}}>{meta.icon}</div>
                                    <div style={{flex:1,minWidth:"180px"}}>
                                        <div style={{fontWeight:800,fontSize:"1rem",color:"#1e293b"}}>{meta.label}</div>
                                        <div style={{fontFamily:"monospace",fontWeight:700,color:"#2563eb",fontSize:"0.9rem"}}>{order.id}</div>
                                        <div style={{color:"#94a3b8",fontSize:"0.8rem",marginTop:"2px"}}>Placed at {order.placedAt}</div>
                                    </div>
                                    <div style={{display:"flex",gap:"10px",alignItems:"center",flexWrap:"wrap"}}>
                                        <span style={{background:statusBg,color:statusColor,fontWeight:700,padding:"4px 14px",borderRadius:"20px",fontSize:"0.82rem"}}>{order.status}</span>
                                        <span style={{background:pLvl.bg,color:pLvl.color,fontWeight:700,padding:"4px 14px",borderRadius:"20px",fontSize:"0.82rem"}}>{pLvl.icon} {pLvl.label}</span>
                                    </div>
                                    <button onClick={()=>cancelOrder(order.id)} style={{
                                        padding:"8px 20px",borderRadius:"8px",border:"2px solid #dc2626",
                                        background:"#fff",color:"#dc2626",fontWeight:700,cursor:"pointer",
                                        fontSize:"0.88rem",transition:"all 0.2s",whiteSpace:"nowrap"
                                    }}
                                    onMouseEnter={e=>{e.currentTarget.style.background='#fef2f2';}}
                                    onMouseLeave={e=>{e.currentTarget.style.background='#fff';}}>
                                        ✕ Cancel Order
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>

        {/* ── SERVICES ── */}
        <section id="services" className="services-section">
            <div className="container">
                <div className="section-title">
                    <h2>Our Specialized Services</h2>
                    <p>We handle all types of medical logistics with professional care.</p>
                </div>
                <div className="services-grid">
                    {[
                        {icon:"🔬",title:"Lab Specimens",desc:"Temperature-controlled transport for blood, tissue, and diagnostic specimens with strict safety protocols."},
                        {icon:"💊",title:"Pharmacy Deliveries",desc:"Direct-to-patient and B2B pharmaceutical deliveries with safe handling of sensitive medications."},
                        {icon:"⚕️",title:"Medical Equipment",desc:"Same-day delivery of critical medical devices, surgical supplies, and hospital equipment."}
                    ].map((s,i)=>(
                        <div key={i} className="service-card">
                            <div className="icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── PATIENT PORTAL ── */}
        <section id="patient-portal" className="portal-section">
            <div className="container">
                <div className="section-title">
                    <h2>Patient Portal</h2>
                    <p>Manage your health records, medication reminders, and quick reorder profile.</p>
                </div>
                <div className="portal-grid">
                    <div className="portal-card">
                        <h3>🩺 Patient Health Record</h3>
                        <div className="record-info">
                            {[["Patient ID","PT-89456"],["Blood Type","O Positive"],["Allergies","Penicillin, Peanuts"],["Last Checkup","Oct 12, 2024"]].map(([k,v])=>(
                                <div key={k} className="record-row"><strong>{k}:</strong><span>{v}</span></div>
                            ))}
                        </div>
                        <div className="record-actions">
                            <button className="btn btn-secondary btn-sm">View Full History</button>
                            <button className="btn btn-secondary btn-sm">Download PDF</button>
                        </div>
                    </div>
                    <div className="portal-card">
                        <h3>💊 Pill Reminder</h3>
                        <p className="portal-desc">Never miss your medication. Add a new reminder below.</p>
                        <form onSubmit={addPill} className="pill-form">
                            <input type="text" placeholder="Medication Name" required value={newPillName} onChange={e=>setNewPillName(e.target.value)}/>
                            <input type="time" required value={newPillTime} onChange={e=>setNewPillTime(e.target.value)}/>
                            <button type="submit" className="btn btn-primary">Add</button>
                        </form>
                        <ul className="pill-list">
                            {pills.map((p,i)=>(
                                <li key={i}><span>{p.name}</span><span className="pill-time-badge">{p.time}</span></li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ── Quick Reorder Profile ── */}
                <div style={{marginTop:"32px"}}>
                    <div style={{
                        background:"linear-gradient(135deg,#1e1b4b,#312e81)",borderRadius:"20px",
                        padding:"32px",color:"#f1f5f9",position:"relative",overflow:"hidden"
                    }}>
                        {/* Background decoration */}
                        <div style={{position:"absolute",top:"-40px",right:"-40px",width:"180px",height:"180px",borderRadius:"50%",background:"rgba(139,92,246,0.15)"}}></div>
                        <div style={{position:"absolute",bottom:"-30px",left:"60px",width:"120px",height:"120px",borderRadius:"50%",background:"rgba(99,102,241,0.1)"}}></div>

                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:"12px",marginBottom:"24px",position:"relative"}}>
                            <div>
                                <h3 style={{color:"#f8fafc",margin:0,fontSize:"1.3rem",display:"flex",alignItems:"center",gap:"10px"}}>
                                    ⚡ Quick Reorder Profile
                                </h3>
                                <p style={{color:"#a5b4fc",marginTop:"4px",fontSize:"0.88rem"}}>Save your details once. Reorder regular medicines in one click.</p>
                            </div>
                            {!editingProfile && (
                                <button onClick={()=>{setProfileDraft({...profile});setEditingProfile(true);}} style={{
                                    padding:"8px 18px",borderRadius:"8px",border:"1px solid #6366f1",
                                    background:"rgba(99,102,241,0.2)",color:"#a5b4fc",fontWeight:600,cursor:"pointer",fontSize:"0.85rem"
                                }}>✏️ Edit Profile</button>
                            )}
                        </div>

                        {editingProfile ? (
                            /* ── Edit Mode ── */
                            <div style={{position:"relative"}}>
                                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"16px"}}>
                                    <div>
                                        <label style={{display:"block",marginBottom:"6px",fontSize:"0.8rem",fontWeight:600,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:"0.05em"}}>Full Name</label>
                                        <input value={profileDraft.name} onChange={e=>setProfileDraft(d=>({...d,name:e.target.value}))}
                                            placeholder="e.g. Ravi Kumar"
                                            style={{width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1px solid #4338ca",background:"rgba(0,0,0,0.3)",color:"#f1f5f9",outline:"none",fontSize:"0.95rem",boxSizing:"border-box"}}/>
                                    </div>
                                    <div>
                                        <label style={{display:"block",marginBottom:"6px",fontSize:"0.8rem",fontWeight:600,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:"0.05em"}}>Phone</label>
                                        <input value={profileDraft.phone} onChange={e=>setProfileDraft(d=>({...d,phone:e.target.value}))}
                                            placeholder="+91 XXXXX XXXXX"
                                            style={{width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1px solid #4338ca",background:"rgba(0,0,0,0.3)",color:"#f1f5f9",outline:"none",fontSize:"0.95rem",boxSizing:"border-box"}}/>
                                    </div>
                                </div>
                                <div style={{marginBottom:"16px"}}>
                                    <label style={{display:"block",marginBottom:"6px",fontSize:"0.8rem",fontWeight:600,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:"0.05em"}}>Delivery Address</label>
                                    <input value={profileDraft.address} onChange={e=>setProfileDraft(d=>({...d,address:e.target.value}))}
                                        placeholder="Flat 4B, Rose Apartments, MG Road, Bengaluru 560001"
                                        style={{width:"100%",padding:"10px 14px",borderRadius:"10px",border:"1px solid #4338ca",background:"rgba(0,0,0,0.3)",color:"#f1f5f9",outline:"none",fontSize:"0.95rem",boxSizing:"border-box"}}/>
                                </div>
                                <div style={{marginBottom:"20px"}}>
                                    <label style={{display:"block",marginBottom:"8px",fontSize:"0.8rem",fontWeight:600,color:"#a5b4fc",textTransform:"uppercase",letterSpacing:"0.05em"}}>Regular Medicines</label>
                                    <div style={{display:"flex",gap:"8px",marginBottom:"10px"}}>
                                        <input value={newMedInput} onChange={e=>setNewMedInput(e.target.value)}
                                            onKeyDown={e=>e.key==='Enter'&&(e.preventDefault(),addProfileMed())}
                                            placeholder="e.g. Metformin 500mg"
                                            style={{flex:1,padding:"10px 14px",borderRadius:"10px",border:"1px solid #4338ca",background:"rgba(0,0,0,0.3)",color:"#f1f5f9",outline:"none",fontSize:"0.9rem"}}/>
                                        <button type="button" onClick={addProfileMed} style={{
                                            padding:"10px 18px",borderRadius:"10px",border:"none",
                                            background:"#6366f1",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:"0.9rem"
                                        }}>+ Add</button>
                                    </div>
                                    <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                                        {profileDraft.medicines.map(med=>(
                                            <span key={med} style={{
                                                display:"inline-flex",alignItems:"center",gap:"6px",
                                                background:"rgba(99,102,241,0.25)",color:"#c7d2fe",
                                                padding:"5px 12px",borderRadius:"20px",fontSize:"0.85rem",fontWeight:500
                                            }}>
                                                💊 {med}
                                                <span onClick={()=>removeProfileMed(med)} style={{cursor:"pointer",color:"#f87171",fontWeight:800,marginLeft:"2px"}}>×</span>
                                            </span>
                                        ))}
                                        {!profileDraft.medicines.length && <span style={{color:"#6366f1",fontSize:"0.85rem",fontStyle:"italic"}}>No medicines added yet.</span>}
                                    </div>
                                </div>
                                <div style={{display:"flex",gap:"10px"}}>
                                    <button onClick={saveProfile} style={{
                                        flex:2,padding:"12px",borderRadius:"10px",border:"none",
                                        background:"linear-gradient(135deg,#6366f1,#4f46e5)",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:"1rem"
                                    }}>✅ Save Profile</button>
                                    {loadProfile() && <button onClick={()=>setEditingProfile(false)} style={{
                                        flex:1,padding:"12px",borderRadius:"10px",border:"1px solid #4338ca",
                                        background:"transparent",color:"#94a3b8",fontWeight:600,cursor:"pointer",fontSize:"0.9rem"
                                    }}>Cancel</button>}
                                </div>
                            </div>
                        ) : (
                            /* ── Saved Profile View ── */
                            <div style={{position:"relative"}}>
                                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"16px",marginBottom:"24px"}}>
                                    <div style={{background:"rgba(0,0,0,0.25)",borderRadius:"12px",padding:"16px"}}>
                                        <div style={{color:"#a5b4fc",fontSize:"0.75rem",fontWeight:600,textTransform:"uppercase",marginBottom:"4px"}}>Patient Name</div>
                                        <div style={{color:"#f1f5f9",fontWeight:700,fontSize:"1rem"}}>{profile.name || "—"}</div>
                                    </div>
                                    <div style={{background:"rgba(0,0,0,0.25)",borderRadius:"12px",padding:"16px"}}>
                                        <div style={{color:"#a5b4fc",fontSize:"0.75rem",fontWeight:600,textTransform:"uppercase",marginBottom:"4px"}}>Phone</div>
                                        <div style={{color:"#f1f5f9",fontWeight:700,fontSize:"1rem"}}>{profile.phone || "—"}</div>
                                    </div>
                                    <div style={{background:"rgba(0,0,0,0.25)",borderRadius:"12px",padding:"16px",gridColumn:"1/-1"}}>
                                        <div style={{color:"#a5b4fc",fontSize:"0.75rem",fontWeight:600,textTransform:"uppercase",marginBottom:"4px"}}>📍 Delivery Address</div>
                                        <div style={{color:"#f1f5f9",fontWeight:600,fontSize:"0.95rem"}}>{profile.address || "—"}</div>
                                    </div>
                                </div>

                                <div style={{marginBottom:"24px"}}>
                                    <div style={{color:"#a5b4fc",fontSize:"0.8rem",fontWeight:600,textTransform:"uppercase",marginBottom:"10px"}}>💊 Saved Medicines</div>
                                    {profile.medicines.length === 0 ? (
                                        <p style={{color:"#6366f1",fontSize:"0.88rem",fontStyle:"italic"}}>No medicines saved. Click Edit Profile to add your regular medicines.</p>
                                    ) : (
                                        <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
                                            {profile.medicines.map(med=>(
                                                <span key={med} style={{
                                                    background:"rgba(99,102,241,0.2)",color:"#c7d2fe",
                                                    padding:"6px 14px",borderRadius:"20px",fontSize:"0.88rem",fontWeight:500
                                                }}>💊 {med}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Quick Reorder button */}
                                {quickOrderSuccess ? (
                                    <div style={{
                                        background:"rgba(16,185,129,0.2)",border:"1px solid #10b981",borderRadius:"12px",
                                        padding:"18px",textAlign:"center",color:"#6ee7b7",fontWeight:700,fontSize:"1rem"
                                    }}>
                                        ✅ Order placed in queue! Check the <a href="#queue" style={{color:"#34d399",textDecoration:"underline"}}>Live Queue</a> section.
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleQuickReorder}
                                        disabled={!profile.medicines.length || !profile.address}
                                        style={{
                                            width:"100%",padding:"16px",borderRadius:"12px",border:"none",
                                            background: (profile.medicines.length && profile.address)
                                                ? "linear-gradient(135deg,#8b5cf6,#6d28d9)"
                                                : "#334155",
                                            color: (profile.medicines.length && profile.address) ? "#fff" : "#64748b",
                                            fontWeight:800,fontSize:"1.1rem",cursor: (profile.medicines.length && profile.address)?"pointer":"not-allowed",
                                            display:"flex",alignItems:"center",justifyContent:"center",gap:"10px",
                                            transition:"all 0.2s",boxShadow: (profile.medicines.length && profile.address)?"0 4px 20px rgba(139,92,246,0.4)":`none`
                                        }}
                                        id="quick-reorder-btn"
                                    >
                                        ⚡ Quick Reorder My Medicines
                                        {(!profile.medicines.length || !profile.address) && <span style={{fontSize:"0.75rem",fontWeight:400}}>(Save address & medicines first)</span>}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>

        {/* ── ADMIN PANEL ── */}
        <section id="admin" style={{padding:"60px 0",background:"#0f172a"}}>
            <div className="container">
                <div className="section-title" style={{color:"#f1f5f9"}}>
                    <h2 style={{color:"#f8fafc"}}>⚙️ Admin Panel</h2>
                    <p style={{color:"#94a3b8"}}>Manage the live order queue — change priorities, update status, or remove orders.</p>
                </div>
                {!adminLoggedIn ? (
                    <div style={{maxWidth:"380px",margin:"0 auto",background:"#1e293b",borderRadius:"16px",padding:"32px",textAlign:"center"}}>
                        <div style={{fontSize:"2.5rem",marginBottom:"12px"}}>🔐</div>
                        <h3 style={{color:"#f1f5f9",marginBottom:"6px"}}>Admin Login</h3>
                        <p style={{color:"#94a3b8",fontSize:"0.88rem",marginBottom:"20px"}}>Enter the admin password to manage the queue.</p>
                        <input
                            type="password"
                            placeholder="Admin Password"
                            value={adminPwInput}
                            onChange={e=>setAdminPwInput(e.target.value)}
                            onKeyDown={e=>e.key==='Enter'&&handleAdminLogin()}
                            style={{
                                width:"100%",padding:"12px 16px",borderRadius:"10px",border:`2px solid ${adminPwError?'#dc2626':'#334155'}`,
                                background:"#0f172a",color:"#f1f5f9",fontSize:"1rem",marginBottom:"14px",outline:"none",boxSizing:"border-box"
                            }}
                        />
                        {adminPwError && <p style={{color:"#f87171",fontSize:"0.85rem",marginBottom:"12px"}}>❌ Incorrect password. Try again.</p>}
                        <button onClick={handleAdminLogin} style={{
                            width:"100%",padding:"12px",borderRadius:"10px",border:"none",
                            background:"linear-gradient(135deg,#2563eb,#1d4ed8)",color:"#fff",
                            fontWeight:700,fontSize:"1rem",cursor:"pointer"
                        }}>Login</button>
                    </div>
                ) : (
                    <div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"24px",flexWrap:"wrap",gap:"12px"}}>
                            <div style={{color:"#94a3b8",fontSize:"0.9rem"}}>
                                ✅ Logged in as Admin &nbsp;|&nbsp; <span style={{color:"#60a5fa"}}>{globalQueue.length} order(s) in queue</span>
                            </div>
                            <button onClick={()=>{setAdminLoggedIn(false);setAdminPwInput('');}} style={{
                                padding:"6px 18px",borderRadius:"8px",border:"1px solid #475569",background:"transparent",color:"#94a3b8",cursor:"pointer",fontSize:"0.85rem"
                            }}>Logout</button>
                        </div>
                        {globalQueue.length === 0 ? (
                            <div style={{textAlign:"center",padding:"40px",color:"#475569"}}>
                                <div style={{fontSize:"2.5rem",marginBottom:"10px"}}>📭</div>
                                <p style={{color:"#64748b"}}>Queue is empty. No orders to manage.</p>
                            </div>
                        ) : (
                            <div style={{display:"grid",gap:"14px"}}>
                                {globalQueue.map(order => {
                                    const meta = TYPE_META[order.type] || TYPE_META.emergency;
                                    const pLvl = PRIORITY_LEVELS.find(p=>p.label===order.priority)||PRIORITY_LEVELS[1];
                                    return (
                                        <div key={order.id} style={{
                                            background:"#1e293b",borderRadius:"14px",padding:"20px 24px",
                                            border:"1px solid #334155",display:"flex",alignItems:"center",
                                            gap:"20px",flexWrap:"wrap"
                                        }}>
                                            <div style={{fontSize:"1.8rem"}}>{meta.icon}</div>
                                            <div style={{flex:1,minWidth:"180px"}}>
                                                <div style={{fontWeight:800,color:"#f1f5f9"}}>{meta.label}</div>
                                                <div style={{fontFamily:"monospace",color:"#60a5fa",fontWeight:700,fontSize:"0.9rem"}}>{order.id}</div>
                                                <div style={{color:"#64748b",fontSize:"0.78rem"}}>Placed at {order.placedAt}</div>
                                            </div>
                                            {/* Priority selector */}
                                            <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                                                <label style={{color:"#94a3b8",fontSize:"0.75rem",fontWeight:600}}>PRIORITY</label>
                                                <select
                                                    value={order.priority}
                                                    onChange={e=>updateQueuePriority(order.id,e.target.value)}
                                                    style={{
                                                        padding:"6px 10px",borderRadius:"8px",border:`1px solid ${pLvl.color}`,
                                                        background:"#0f172a",color:pLvl.color,fontWeight:700,cursor:"pointer",fontSize:"0.85rem"
                                                    }}
                                                >
                                                    {PRIORITY_LEVELS.map(p=>(<option key={p.label} value={p.label}>{p.icon} {p.label}</option>))}
                                                </select>
                                            </div>
                                            {/* Status selector */}
                                            <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
                                                <label style={{color:"#94a3b8",fontSize:"0.75rem",fontWeight:600}}>STATUS</label>
                                                <select
                                                    value={order.status}
                                                    onChange={e=>updateQueueStatus(order.id,e.target.value)}
                                                    style={{
                                                        padding:"6px 10px",borderRadius:"8px",border:"1px solid #475569",
                                                        background:"#0f172a",color:"#e2e8f0",fontWeight:600,cursor:"pointer",fontSize:"0.85rem"
                                                    }}
                                                >
                                                    {STATUS_OPTIONS.map(s=>(<option key={s} value={s}>{s}</option>))}
                                                </select>
                                            </div>
                                            {/* Delete */}
                                            <button onClick={()=>cancelOrder(order.id)} style={{
                                                padding:"10px 18px",borderRadius:"8px",border:"none",
                                                background:"#7f1d1d",color:"#fca5a5",fontWeight:700,
                                                cursor:"pointer",fontSize:"0.85rem",transition:"background 0.2s"
                                            }}
                                            onMouseEnter={e=>e.currentTarget.style.background='#991b1b'}
                                            onMouseLeave={e=>e.currentTarget.style.background='#7f1d1d'}>
                                                🗑 Delete
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>

        {/* ── FOOTER ── */}
        <footer id="contact" className="main-footer">
            <div className="container footer-container">
                <div className="footer-info">
                    <h3>Medigo Systems India Pvt. Ltd.</h3>
                    <p>4th Floor, Tower B, Bandra Kurla Complex<br/>Mumbai, Maharashtra 400051</p>
                    <p>📞 +91 98765 43210</p>
                    <p>📧 Medigotrack@gmail.com</p>
                    <p style={{marginTop:"8px",fontSize:"0.8rem",opacity:0.8}}>CIN: U85100MH2024PTC000001</p>
                </div>
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#track">Track a Package</a></li>
                        <li><a href="#services">Our Services</a></li>
                        <li><a href="#">HIPAA Compliance</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom"><div className="container"><p>&copy; 2026 Medigo Systems India Pvt. Ltd. All rights reserved. | Made with ❤️ in India</p></div></div>
        </footer>

        {/* ── HOSPITAL ALERT BUTTON ── */}
        {!isEmergencyAlertActive && (
            <button onClick={handleHospitalAlert} className="emergency-alert-btn"><span>🚨</span> HOSPITAL ALERT</button>
        )}

        {/* ── HOSPITAL ALERT MODAL ── */}
        <div className={`emergency-modal${isEmergencyAlertActive?' active':''}`}>
            <div className="modal-content">
                <h2>🚨 EMERGENCY INITIATED</h2>
                <p>{emergencyStatus}</p>
                {showDismiss && <button onClick={()=>{ setIsEmergencyAlertActive(false); }} className="btn btn-secondary" style={{marginTop:"20px",width:"100%"}}>Dismiss</button>}
            </div>
        </div>

        {/* ── CHATBOT ── */}
        <button onClick={()=>setChatbotOpen(true)} className="chatbot-btn">💬</button>
        <div className={`chatbot-window${chatbotOpen?'':' hidden'}`}>
            <div className="chatbot-header" style={{background:"linear-gradient(135deg,#2563eb,#1d4ed8)"}}>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{width:"36px",height:"36px",borderRadius:"50%",background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem"}}>🤖</div>
                    <div>
                        <h4 style={{margin:0,fontSize:"1rem"}}>Medigo Assistant</h4>
                        <p style={{margin:0,fontSize:"0.7rem",opacity:0.8}}>● Online — replies instantly</p>
                    </div>
                </div>
                <span onClick={()=>setChatbotOpen(false)} className="close-chat">&times;</span>
            </div>
            <div className="chatbot-body" ref={chatBodyRef}>
                {chatMessages.map(msg=>(
                    <div key={msg.id} className={`chat-message ${msg.isBot?'bot':'user'}`}>
                        <p style={{whiteSpace:"pre-line"}}>{msg.text}</p>
                    </div>
                ))}
                {isTyping && (
                    <div className="chat-message bot" style={{padding:"10px 16px"}}>
                        <span style={{display:"flex",gap:"4px",alignItems:"center"}}>
                            <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#94a3b8",animation:"typingDot 1.2s infinite",animationDelay:"0s"}}></span>
                            <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#94a3b8",animation:"typingDot 1.2s infinite",animationDelay:"0.2s"}}></span>
                            <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#94a3b8",animation:"typingDot 1.2s infinite",animationDelay:"0.4s"}}></span>
                        </span>
                    </div>
                )}
            </div>
            {suggestions.length > 0 && (
                <div style={{padding:"8px 10px",display:"flex",flexWrap:"wrap",gap:"6px",borderTop:"1px solid #f1f5f9",background:"#f8fafc"}}>
                    {suggestions.map((s,i)=>(
                        <button key={i} onClick={()=>sendChat(s)}
                            style={{padding:"5px 12px",fontSize:"0.78rem",borderRadius:"20px",border:"1px solid #e2e8f0",background:"#fff",cursor:"pointer",color:"#2563eb",fontWeight:600,transition:"all 0.2s"}}
                            onMouseOver={e=>e.target.style.background="#eff6ff"}
                            onMouseOut={e=>e.target.style.background="#fff"}
                        >{s}</button>
                    ))}
                </div>
            )}
            <form onSubmit={handleChatSubmit} className="chatbot-input">
                <input type="text" placeholder="Ask me anything..." value={chatInput} onChange={e=>setChatInput(e.target.value)}/>
                <button type="submit">Send</button>
            </form>
        </div>

        {/* ── EMERGENCY ORDER MODAL ── */}
        <div className={`emergency-modal${activeModal==='emergency'?' active':''}`}>
            <div className="modal-content" style={{maxWidth:"500px",width:"95%"}}>
                {modalStep===1 ? (
                    <div>
                        <h2 style={{color:"var(--primary-blue)"}}>Request Emergency Dispatch</h2>
                        <p>Please enter details for immediate pickup and delivery.</p>
                        <form style={{textAlign:"left",marginTop:"15px"}} onSubmit={(e)=>{e.preventDefault();submitToQueue();}}>
                            <div style={{marginBottom:"15px"}}><label style={{display:"block",marginBottom:"6px",fontWeight:600}}>Pickup Location</label><input type="text" className="modal-input" required placeholder="e.g. City Hospital ER"/></div>
                            <div style={{marginBottom:"15px"}}><label style={{display:"block",marginBottom:"6px",fontWeight:600}}>Destination</label><input type="text" className="modal-input" required placeholder="e.g. State Research Lab"/></div>
                            <div style={{marginBottom:"20px"}}>
                                <label style={{display:"block",marginBottom:"6px",fontWeight:600}}>Package Type</label>
                                <select className="modal-input" required>
                                    <option value="">Select...</option>
                                    <option value="blood">Blood/Tissue Sample</option>
                                    <option value="organ">Organ Transport</option>
                                    <option value="medication">Critical Medication</option>
                                    <option value="equipment">Surgical Equipment</option>
                                </select>
                            </div>
                            <div style={{display:"flex",gap:"10px"}}>
                                <button type="submit" className="btn btn-primary" style={{flex:2,backgroundColor:"var(--accent-red)"}}>Add to Queue</button>
                                <button type="button" onClick={closeModal} className="btn btn-secondary" style={{flex:1}}>Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : <QueueView queueNum={queueNum} priority={orderPriority} onPriorityChange={setOrderPriority} onClose={closeModal}/>}
            </div>
        </div>

        {/* ── FAMILY ORDER MODAL ── */}
        <div className={`emergency-modal${activeModal==='family'?' active':''}`}>
            <div className="modal-content" style={{maxWidth:"500px",width:"95%"}}>
                {modalStep===1
                    ? <FamilyOrderForm onCancel={closeModal} onSubmit={submitToQueue}/>
                    : <QueueView queueNum={queueNum} priority={orderPriority} onPriorityChange={setOrderPriority} onClose={closeModal}/>}
            </div>
        </div>

        {/* ── PRESCRIPTION MODAL ── */}
        <div className={`emergency-modal${activeModal==='prescription'?' active':''}`}>
            <div className="modal-content" style={{maxWidth:"550px",width:"95%"}}>
                {modalStep===1
                    ? <RxOrderForm onCancel={closeModal} onSubmit={submitToQueue}/>
                    : <QueueView queueNum={queueNum} priority={orderPriority} onPriorityChange={setOrderPriority} onClose={closeModal}/>}
            </div>
        </div>
        </>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
