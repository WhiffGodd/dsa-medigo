const { useState, useEffect, useRef } = React;

// ─── Shared Live Tracker ─────────────────────────────────────────
const TrackingView = ({ tracker, onClose }) => (
    <div>
        <h2 style={{color:"green"}}>Dispatched Successfully!</h2>
        <p>Your courier is en route.</p>
        <div className="mock-map-container">
            <div className="mock-vehicle" style={{left:`${tracker.progress}%`}}>{tracker.vehicleIcon}</div>
            <div className="mock-route"></div>
            <div className="mock-marker start">🏥</div>
            <div className="mock-marker end">🔬</div>
        </div>
        <div className="live-status-box">
            <strong>Status:</strong> <span style={{color:"var(--primary-blue)"}}>{tracker.status}</span><br/>
            <strong>ETA:</strong> <span>{tracker.eta}</span>
        </div>
        <button onClick={onClose} className="btn btn-secondary" style={{marginTop:"20px",width:"100%"}}>Close Tracker</button>
    </div>
);

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

// ─── Main App ─────────────────────────────────────────────────────
const App = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    const [modalStep, setModalStep] = useState(1);
    const [tracker, setTracker] = useState({ progress:10, status:"", eta:"", vehicleIcon:"🚁" });
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
        { name:"Vitamin D3",      time:"01:00 PM" }
    ]);
    const [newPillName, setNewPillName] = useState("");
    const [newPillTime, setNewPillTime] = useState("");
    const chatBodyRef = useRef(null);
    const trackerIntervalRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        setTimeout(() => setChatbotOpen(true), 1500);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }, [chatMessages]);

    const openModal = (name) => { setActiveModal(name); setModalStep(1); };
    const closeModal = () => { setActiveModal(null); setModalStep(1); if(trackerIntervalRef.current) clearInterval(trackerIntervalRef.current); };

    const runSimulation = (cfg) => {
        setModalStep(2);
        setTracker({ progress:10, status:cfg.initStatus, eta:cfg.initEta, vehicleIcon:cfg.initIcon });
        let p = 10;
        trackerIntervalRef.current = setInterval(() => {
            p += 5;
            setTracker(prev => {
                let t = { ...prev, progress: p };
                if(p === 30)   { t.status = cfg.s30; t.eta = cfg.e30; t.vehicleIcon = cfg.i30 || prev.vehicleIcon; }
                else if(p===50){ t.status = cfg.s50; t.eta = cfg.e50; }
                else if(p===70){ t.status = cfg.s70; t.eta = cfg.e70; }
                else if(p>=90) { t.status = cfg.s90; t.eta = "0 Mins"; t.progress = 90; clearInterval(trackerIntervalRef.current); }
                return t;
            });
        }, 1000);
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
            const hospitals = ["Mercy General Hospital","City Health Center","Metro Medical Institute","Saint Luke's ER"];
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
            keys: ['hello','hi','hey','good morning','good evening','howdy','sup'],
            replies: [
                "👋 Hello! Welcome to Medigo — your trusted medical courier service. How can I assist you today?",
                "Hi there! 😊 I'm Medigo's support assistant. Ask me anything about tracking, orders, prescriptions, or services!",
                "Hey! Great to have you here. What can I help you with — tracking a package, placing an order, or something else?"
            ],
            followUps: ['Track my order','Post a prescription','Emergency order','Our services']
        },
        {
            keys: ['track','tracking','where is','locate','status','shipment','parcel','package','delivery status'],
            replies: [
                "📦 To track your parcel, scroll up to the **Track Your Medical Parcel** box on the homepage and enter your **8–10 character tracking number** (e.g. MP12345678). Results appear in seconds!",
                "🔍 Your tracking number was sent via SMS/email when your order was dispatched. Enter it in the tracking box at the top of the page. Need help finding your number? Call 1-800-555-M-PAK.",
                "📍 Live tracking is available 24/7. Use the tracking section on the homepage — just type your number like **MP12345678** and hit Track. Status updates every few minutes."
            ],
            followUps: ['Track number format','Parcel delayed?','Contact support']
        },
        {
            keys: ['prescription','rx','upload prescription','doctor note','medicine order','post prescription'],
            replies: [
                "💊 You can upload a prescription easily! Click the **📝 Post Prescription** button on the homepage. You can drag & drop a photo or PDF, then select any over-the-counter items you need alongside it.",
                "📋 To post your Rx: tap **Post Prescription** → drag & drop your prescription image or PDF → add any OTC items → enter your address → hit Process Order. It's that simple!",
                "🩺 We accept prescription photos (JPEG, PNG) and PDFs. Once uploaded via the Post Prescription button, our pharmacist team verifies it within 30 minutes before dispatch."
            ],
            followUps: ['What formats are accepted?','How long until delivery?','OTC items available']
        },
        {
            keys: ['emergency','urgent','critical','sos','hospital alert','911','life threatening'],
            replies: [
                "🚨 For a medical emergency, use the red **HOSPITAL ALERT** button (bottom-right of the page) immediately. It will ping the nearest hospital and dispatch a courier. For life-threatening emergencies, also dial **911**.",
                "⚡ Emergency orders are dispatched within **minutes**. Click the **🚨 Emergency Order** button on the homepage, fill in pickup & destination details, and we'll mobilize instantly.",
                "🏥 We handle critical organ transport, blood samples, and emergency medications. Tap **Emergency Order** now — our dispatch team is on standby 24/7."
            ],
            followUps: ['Emergency order details','Call dispatch team','Hospital coverage area']
        },
        {
            keys: ['family','loved one','relative','send to','remote','care package','parents','grandparents'],
            replies: [
                "❤️ Use the **Order for Family** button to send medical supplies to loved ones anywhere. Enter their name, address, and choose immediate dispatch or schedule a future delivery date.",
                "🏠 Our Family Care service lets you remotely send prescription refills, medical equipment, or daily supplies to a relative. Just click **Order for Family** and fill in the details!",
                "📬 Yes! We deliver to addresses nationwide. Use the Family Order feature to schedule recurring refills or a one-time care package for your loved ones."
            ],
            followUps: ['Scheduling a delivery','Recurring orders','Delivery areas']
        },
        {
            keys: ['price','cost','fee','charge','rate','quote','how much','billing','payment'],
            replies: [
                "💰 Pricing is tailored based on **distance**, **urgency**, and **package type** (e.g., refrigerated items cost more). Contact us at 1-800-555-M-PAK for an instant quote — it usually takes under 2 minutes!",
                "📊 We offer tiered pricing: Standard (3–5 hrs), Express (1–2 hrs), and Emergency (<30 min). Exact costs vary. Call 1-800-555-M-PAK or email dispatch@medigosystems.com for a quote.",
                "🏷️ Our rates are competitive and transparent with no hidden fees. For prescription deliveries, insurance co-pays may apply. Get a free quote by calling 1-800-555-M-PAK."
            ],
            followUps: ['Insurance coverage','Payment methods','Get a quote']
        },
        {
            keys: ['time','how long','eta','when','duration','fast','speed','quick','slow','delayed','delay'],
            replies: [
                "⏱️ Delivery times: **Emergency** orders arrive in 15–30 min, **Express** in 1–2 hours, **Standard** in 3–5 hours. Real-time ETAs are shown on the live tracking map after dispatch.",
                "🚀 Our Emergency Drone dispatch averages **18 minutes** to pickup. Standard courier takes 3–5 hours. Track your exact ETA live once your order is placed!",
                "📅 If your shipment is delayed beyond the estimated window, please call 1-800-555-M-PAK immediately. We have a delay guarantee — if we're late, you get a priority re-dispatch."
            ],
            followUps: ['Track live ETA','Report a delay','Express options']
        },
        {
            keys: ['service','what do you','offer','provide','speciali','lab','specimen','blood','organ','equipment','pharmacy'],
            replies: [
                "🏥 We specialize in: **Lab Specimens** (blood, tissue, biopsies), **Pharmacy Deliveries** (prescription & OTC), and **Medical Equipment** (devices, surgical tools). All under strict HIPAA & cold-chain protocols.",
                "🔬 Our core services: \n• Lab specimen courier (temperature-controlled) \n• Prescription & OTC pharmacy delivery \n• Medical device & equipment logistics \n• Emergency organ transport \n• Family care packages",
                "💼 Medigo handles B2B hospital logistics, direct-to-patient pharmacy delivery, and on-demand emergency medical courier. Scroll down to **Our Specialized Services** for full details!"
            ],
            followUps: ['Cold-chain transport','HIPAA compliance','Book a service']
        },
        {
            keys: ['hipaa','compliance','secure','privacy','data','confidential','regulation','fda'],
            replies: [
                "🔒 We are fully **HIPAA compliant**. All patient data, prescription information, and medical records shared with us are encrypted and handled under strict privacy protocols.",
                "✅ Medigo operates under HIPAA, OSHA, and FDA transport guidelines. Our couriers are certified for handling sensitive biological and pharmaceutical materials.",
                "🛡️ Your privacy is our priority. We never share patient data with third parties. All delivery manifests are encrypted and auto-deleted after 90 days per regulatory requirements."
            ],
            followUps: ['Data security','Courier certification','Compliance docs']
        },
        {
            keys: ['contact','phone','email','reach','call','support','help','agent','human','operator'],
            replies: [
                "📞 Reach our team 24/7:\n• **Phone:** 1-800-555-M-PAK\n• **Email:** dispatch@medigosystems.com\n• **Address:** 123 Healthway Blvd, Suite 400, Metropolis, NY 10001",
                "💬 You can contact us via phone at **1-800-555-M-PAK** for immediate assistance, or email **dispatch@medigosystems.com** for non-urgent inquiries. Average response time is under 3 minutes!",
                "🧑‍💼 To speak with a live agent, call **1-800-555-M-PAK** — we're available 24/7/365. For prescription queries, ask for our pharmacy coordination desk."
            ],
            followUps: ['Operating hours','Email support','Office location']
        },
        {
            keys: ['hours','open','available','24','around the clock','when are','operation','operate'],
            replies: [
                "🕐 Medigo operates **24 hours a day, 7 days a week, 365 days a year** — including holidays. Emergency dispatch is always available.",
                "✅ We never close! Whether it's 3 AM on Christmas or a busy Monday morning, our dispatch team and couriers are ready to serve you.",
                "🌙 Our 24/7 operations mean your medical supplies reach you on time — any time. Emergency orders are handled within minutes, even at midnight."
            ],
            followUps: ['Emergency availability','Holiday delivery','Book a time slot']
        },
        {
            keys: ['cancel','cancellation','change order','modify','update order','wrong address','mistake'],
            replies: [
                "✏️ To cancel or modify an order, call us **immediately** at 1-800-555-M-PAK. Orders can be modified within **10 minutes** of placement before courier dispatch.",
                "⚠️ Once a courier is dispatched, cancellation may incur a small fee. Contact us right away at 1-800-555-M-PAK to minimize charges and arrange changes.",
                "🔄 Address changes must be requested before the package leaves the facility. Call 1-800-555-M-PAK with your tracking number ready for fastest resolution."
            ],
            followUps: ['Track my order','Contact support','Refund policy']
        },
        {
            keys: ['refund','money back','return','reimburse','charge dispute','overcharged'],
            replies: [
                "💳 Refund requests are processed within **3–5 business days**. Email dispatch@medigosystems.com with your order ID and reason. We have a 100% satisfaction guarantee for failed deliveries.",
                "🔁 If your delivery was lost, damaged, or significantly delayed beyond our SLA, you're eligible for a full refund or re-dispatch at no cost. Call 1-800-555-M-PAK to initiate.",
                "✅ We stand behind every delivery. If something went wrong, contact us within **48 hours** of the scheduled delivery for a full investigation and refund/re-delivery."
            ],
            followUps: ['Contact support','Order status','Re-delivery options']
        },
        {
            keys: ['pill','reminder','medication','medicine reminder','schedule','dose','alarm'],
            replies: [
                "💊 Use our **Pill Reminder** tool in the Patient Portal section below! Add your medication name and time, and we'll help you stay on schedule. It's free and built right into this portal.",
                "⏰ Never miss a dose! Scroll to the **Patient Portal** section → find the Pill Reminder card → add your medication name and reminder time. Simple and effective!",
                "🩺 The Pill Reminder in our Patient Portal lets you track all your scheduled medications. It's great for managing multiple prescriptions or helping an elderly family member."
            ],
            followUps: ['Set a reminder','Patient portal','Order medication']
        },
        {
            keys: ['area','coverage','deliver to','location','city','state','region','nationwide','international'],
            replies: [
                "🗺️ We currently serve **all major metropolitan areas** across the US, with expanding coverage in suburban regions. Call 1-800-555-M-PAK to confirm delivery to your specific zip code.",
                "📍 Medigo covers 50+ cities nationwide. Enter your delivery address in any order form — if we can't reach you directly, we'll connect you to a partner courier network.",
                "🌎 We handle domestic deliveries across the US. International medical logistics partnerships are available for select countries — contact us for details."
            ],
            followUps: ['Check my zip code','International inquiry','Partner network']
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
            reply: "🤔 I'm not sure I caught that. Could you rephrase? You can also reach a live agent at **1-800-555-M-PAK** or email **dispatch@medigosystems.com** for complex queries.",
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

    const emergencySimCfg = {
        initStatus:"Courier Dispatched — En Route to Pickup", initEta:"12 Mins", initIcon:"🚁",
        s30:"Package Secured at Pickup", e30:"10 Mins", i30:"🚚",
        s50:"In Transit via Highway", e50:"7 Mins",
        s70:"Approaching Destination", e70:"2 Mins",
        s90:"Package Delivered Successfully! ✅"
    };
    const familySimCfg = {
        initStatus:"Care Package Dispatched", initEta:"45 Mins", initIcon:"🚁",
        s30:"Picked up from Pharmacy", e30:"30 Mins", i30:"🚐",
        s50:"In Transit", e50:"15 Mins",
        s70:"Arriving in Neighbourhood", e70:"3 Mins",
        s90:"Care Package Delivered! ❤️"
    };
    const rxSimCfg = {
        initStatus:"Prescription Processing — Preparing Order", initEta:"60 Mins", initIcon:"🚁",
        s30:"Order Picked up from Pharmacy", e30:"45 Mins", i30:"🚐",
        s50:"In Transit to Destination", e50:"20 Mins",
        s70:"Approaching Delivery Address", e70:"5 Mins",
        s90:"Order Delivered Successfully! 📝"
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
                        <li><a href="#services" onClick={()=>setMenuOpen(false)}>Services</a></li>
                        <li><a href="#patient-portal" onClick={()=>setMenuOpen(false)}>Patient Portal</a></li>
                        <li><a href="#contact" onClick={()=>setMenuOpen(false)}>Contact</a></li>
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
                    <h2>Secure, Compliant Medical Courier Services</h2>
                    <p>Ensuring safe, timely, and temperature-controlled delivery for your critical medical packages, lab specimens, and equipment.</p>
                    <div className="cta-buttons"><a href="#services" className="btn btn-secondary">Learn More</a></div>
                </div>
                <div id="track" className="tracking-box">
                    <h3>Track Your Medical Parcel</h3>
                    <p>Enter your tracking number to see live delivery status.</p>
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
                    <p>Manage your health records and set medication reminders.</p>
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
            </div>
        </section>

        {/* ── FOOTER ── */}
        <footer id="contact" className="main-footer">
            <div className="container footer-container">
                <div className="footer-info">
                    <h3>Medigo Systems</h3>
                    <p>123 Healthway Blvd, Suite 400<br/>Metropolis, NY 10001</p>
                    <p>Phone: 1-800-555-M-PAK</p>
                    <p>Email: dispatch@medigosystems.com</p>
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
            <div className="footer-bottom"><div className="container"><p>&copy; 2026 Medigo Systems. All rights reserved.</p></div></div>
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
                        <form style={{textAlign:"left",marginTop:"15px"}} onSubmit={(e)=>{e.preventDefault();runSimulation(emergencySimCfg);}}>
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
                                <button type="submit" className="btn btn-primary" style={{flex:2,backgroundColor:"var(--accent-red)"}}>Dispatch Drone / Courier</button>
                                <button type="button" onClick={closeModal} className="btn btn-secondary" style={{flex:1}}>Cancel</button>
                            </div>
                        </form>
                    </div>
                ) : <TrackingView tracker={tracker} onClose={closeModal}/>}
            </div>
        </div>

        {/* ── FAMILY ORDER MODAL ── */}
        <div className={`emergency-modal${activeModal==='family'?' active':''}`}>
            <div className="modal-content" style={{maxWidth:"500px",width:"95%"}}>
                {modalStep===1
                    ? <FamilyOrderForm onCancel={closeModal} onSubmit={()=>runSimulation(familySimCfg)}/>
                    : <TrackingView tracker={tracker} onClose={closeModal}/>}
            </div>
        </div>

        {/* ── PRESCRIPTION MODAL ── */}
        <div className={`emergency-modal${activeModal==='prescription'?' active':''}`}>
            <div className="modal-content" style={{maxWidth:"550px",width:"95%"}}>
                {modalStep===1
                    ? <RxOrderForm onCancel={closeModal} onSubmit={()=>runSimulation(rxSimCfg)}/>
                    : <TrackingView tracker={tracker} onClose={closeModal}/>}
            </div>
        </div>
        </>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
