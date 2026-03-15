const { useState, useEffect, useRef } = React;

const App = () => {
    const [scrolled, setScrolled] = useState(false);
    
    // Global Modal States
    const [activeModal, setActiveModal] = useState(null); // 'emergency', 'family', 'prescription'
    const [isEmergencyAlertActive, setIsEmergencyAlertActive] = useState(false);
    const [chatbotOpen, setChatbotOpen] = useState(false);
    
    // Modal View States (Step 1 form vs Step 2 Tracker)
    const [modalStep, setModalStep] = useState(1); 
    const [trackerState, setTrackerState] = useState({
        progress: 10,
        status: "",
        eta: "",
        vehicleIcon: "🚁"
    });
    
    // Tracking Form State
    const [trackNum, setTrackNum] = useState("");
    const [trackResult, setTrackResult] = useState(null);
    const [trackError, setTrackError] = useState("");

    // Pills State
    const [pills, setPills] = useState([
        { name: "Lisinopril 10mg", time: "08:00 AM" },
        { name: "Vitamin D3", time: "01:00 PM" }
    ]);
    const [newPillName, setNewPillName] = useState("");
    const [newPillTime, setNewPillTime] = useState("");

    // Chatbot State
    const [chatMessages, setChatMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", isBot: true }
    ]);
    const [chatInput, setChatInput] = useState("");
    const chatBodyRef = useRef(null);

    // Scroll Effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        
        // Auto open chatbot after 1.5s
        setTimeout(() => setChatbotOpen(true), 1500);
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to bottom of chat
    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [chatMessages, chatbotOpen]);

    const handleTrackSubmit = (e) => {
        e.preventDefault();
        const trkNum = trackNum.trim();
        if(!trkNum) return;

        setTrackResult({ loading: true });
        
        setTimeout(() => {
            if(trkNum.length >= 8) {
                const statuses = ["In Transit", "Out for Delivery", "Arrived at Facility", "Picked Up"];
                const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                const date = new Date();
                date.setHours(date.getHours() - Math.floor(Math.random() * 48));
                
                setTrackResult({
                    loading: false,
                    trkNum: trkNum.toUpperCase(),
                    status: randomStatus,
                    lastUpdated: date.toLocaleString(),
                    eta: "By 5:00 PM Tomorrow"
                });
                setTrackError("");
            } else {
                setTrackResult(null);
                setTrackError("Error: Tracking number not found. Please verify your tracking number and try again. It should be 8-10 characters long.");
            }
        }, 800);
    };

    const runSimulation = (config) => {
        setModalStep(2);
        setTrackerState({
            progress: 10,
            status: config.initStatus,
            eta: config.initEta,
            vehicleIcon: config.initIcon
        });

        let currentProgress = 10;
        const interval = setInterval(() => {
            currentProgress += 5;
            
            setTrackerState(prev => {
                let newState = { ...prev, progress: currentProgress };
                
                if(currentProgress === 30) {
                    newState.status = config.status30;
                    newState.eta = config.eta30;
                    newState.vehicleIcon = config.icon30;
                } else if(currentProgress === 50) {
                    newState.status = config.status50;
                    newState.eta = config.eta50;
                } else if(currentProgress === 70) {
                    newState.status = config.status70;
                    newState.eta = config.eta70;
                } else if(currentProgress >= 90) {
                    newState.status = config.status90;
                    newState.eta = "0 Mins";
                    newState.progress = 90;
                    clearInterval(interval);
                }
                return newState;
            });
        }, 1000);
    };

    const handleChatSubmit = (e) => {
        e.preventDefault();
        const text = chatInput.trim();
        if(!text) return;
        
        const newMsgId = Date.now();
        setChatMessages(prev => [...prev, { id: newMsgId, text, isBot: false }]);
        setChatInput("");
        
        setTimeout(() => {
            const lowerText = text.toLowerCase();
            let reply = "I'm a virtual assistant. Could you please call our dispatch center at 1-800-555-M-PAK for direct assistance with that?";

            if(lowerText.includes('track') || lowerText.includes('status') || lowerText.includes('where')) {
                reply = "To track a package, locate the 'Track Your Medical Parcel' section on our home page and enter your 10-digit tracking number (e.g., MP12345678).";
            } else if(lowerText.includes('service') || lowerText.includes('deliver') || lowerText.includes('transport')) {
                reply = "We offer transport for Lab Specimens, Pharmacy deliveries, and Medical Equipment. All under strict temperature and compliance controls. Can I help you book one?";
            } else if(lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
                reply = "Hello there! Welcome to Medigo Delivery. How can I help resolve your queries today?";
            } else if(lowerText.includes('cost') || lowerText.includes('price') || lowerText.includes('quote')) {
                reply = "Our pricing is custom depending on distance, urgency, and medical handling requirements (like refrigeration). Please contact our dispatch team at 1-800-555-M-PAK for an exact quote.";
            } else if(lowerText.includes('emergency') || lowerText.includes('urgent') || lowerText.includes('alert')) {
                reply = "If this is a critical medical emergency, please use our red HOSPITAL ALERT button located at the bottom right of the screen or dial 911 immediately.";
            } else if(lowerText.includes('hours') || lowerText.includes('open') || lowerText.includes('time')) {
                reply = "We operate 24/7/365 to handle emergency medical logistics, lab transfers, and critical pharmacy shipments at any hour.";
            } else if(lowerText.includes('contact') || lowerText.includes('phone') || lowerText.includes('email')) {
                reply = "You can reach us directly by phone at 1-800-555-M-PAK or via email at dispatch@medigodelivery.com.";
            }
            
            setChatMessages(prev => [...prev, { id: Date.now()+1, text: reply, isBot: true }]);
        }, 600);
    };

    const addPill = (e) => {
        e.preventDefault();
        if(newPillName && newPillTime) {
            let [hours, minutes] = newPillTime.split(':');
            let suffix = hours >= 12 ? 'PM' : 'AM';
            let hours12 = hours % 12 || 12;
            let formattedTime = `${hours12}:${minutes} ${suffix}`;
            
            setPills([...pills, { name: newPillName, time: formattedTime }]);
            setNewPillName("");
            setNewPillTime("");
        }
    };

    const handleHospitalAlert = () => {
        setIsEmergencyAlertActive(true);
    };

    // Shared Tracker Component
    const TrackingView = () => (
        <div id="order-step-2">
            <h2 style={{color: "green"}}>Dispatched Successfully!</h2>
            <p>Your courier is en route to the pickup location.</p>
            
            <div className="mock-map-container">
                <div className="mock-vehicle" style={{ left: `${trackerState.progress}%` }}>
                    {trackerState.vehicleIcon}
                </div>
                <div className="mock-route"></div>
                <div className="mock-marker start">🏥</div>
                <div className="mock-marker end">🔬</div>
            </div>

            <div className="live-status-box">
                <strong>Status:</strong> <span style={{color: "var(--primary-blue)"}}>{trackerState.status}</span><br/>
                <strong>ETA:</strong> <span>{trackerState.eta}</span>
            </div>

            <button onClick={() => { setActiveModal(null); setModalStep(1); }} className="btn btn-secondary" style={{marginTop: "20px", width: "100%"}}>Close Tracker</button>
        </div>
    );

    return (
        <>
            <header className={`main-header ${scrolled ? 'scrolled' : ''}`}>
                <div className="container header-container">
                    <div className="logo">
                        <h1>Medi<span>go</span></h1>
                    </div>
                    <nav className="main-nav">
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#track">Track Package</a></li>
                            <li><a href="#services">Services</a></li>
                            <li><a href="#patient-portal">Patient Portal</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <section id="home" className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <h2>Secure, Compliant Medical Courier Services</h2>
                        <p>Ensuring safe, timely, and temperature-controlled delivery for your critical medical packages, lab specimens, and equipment.</p>
                        <div className="cta-buttons">
                            <a href="#services" className="btn btn-secondary">Learn More</a>
                        </div>
                    </div>
                    
                    <div id="track" className="tracking-box">
                        <h3>Track Your Medical Parcel</h3>
                        <p>Enter your 10-digit tracking number to see your delivery status.</p>
                        <form onSubmit={handleTrackSubmit}>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    placeholder="e.g. MP12345678" 
                                    required 
                                    value={trackNum}
                                    onChange={e => setTrackNum(e.target.value)}
                                />
                                <button type="submit" className="btn btn-primary">Track</button>
                            </div>
                        </form>
                        
                        {(trackResult || trackError) && (
                            <div className="tracking-result">
                                {trackResult?.loading ? (
                                    <p style={{textAlign:"center"}}>Locating package {trackNum}...</p>
                                ) : trackResult ? (
                                    <>
                                        <div className="status-row">
                                            <span className="status-label">Tracking Number:</span>
                                            <span className="status-value">{trackResult.trkNum}</span>
                                        </div>
                                        <div className="status-row">
                                            <span className="status-label">Status:</span>
                                            <span className="status-value" style={{fontWeight:"bold", color: trackResult.status === 'Out for Delivery' ? '#D32F2F' : 'var(--primary-blue)'}}>
                                                {trackResult.status}
                                            </span>
                                        </div>
                                        <div className="status-row">
                                            <span className="status-label">Last Updated:</span>
                                            <span className="status-value">{trackResult.lastUpdated}</span>
                                        </div>
                                        <div className="status-row">
                                            <span className="status-label">Est. Delivery:</span>
                                            <span className="status-value">{trackResult.eta}</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p style={{color: "var(--accent-red)", fontWeight: "bold"}}>{trackError}</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="quick-actions-section container">
                <h2 style={{textAlign: "center", color: "var(--primary-blue)", marginBottom: "30px", fontSize: "2rem", fontWeight: 800}}>
                    How can we help you today?
                </h2>
                <div className="quick-actions-grid">
                    <button onClick={() => setActiveModal('emergency')} className="action-card-btn emergency-bg">
                        <span className="action-icon">🚨</span>
                        <span className="action-title">Emergency Order</span>
                        <span className="action-desc">Immediate dispatch protocol</span>
                    </button>
                    
                    <button onClick={() => setActiveModal('family')} className="action-card-btn family-bg">
                        <span className="action-icon">❤️</span>
                        <span className="action-title">Order for Family</span>
                        <span className="action-desc">Send care packages remotely</span>
                    </button>
                    
                    <button onClick={() => setActiveModal('prescription')} className="action-card-btn rx-bg">
                        <span className="action-icon">📝</span>
                        <span className="action-title">Post Prescription</span>
                        <span className="action-desc">Upload Rx & order items</span>
                    </button>
                </div>
            </section>

            <section id="services" className="services-section">
                <div className="container">
                    <div className="section-title">
                        <h2>Our Specialized Services</h2>
                        <p>We handle all types of medical logistics with professional care.</p>
                    </div>
                    <div className="services-grid">
                        <div className="service-card" style={{opacity: 1, transform: 'none'}}>
                            <div className="icon">🔬</div>
                            <h3>Lab Specimens</h3>
                            <p>Temperature-controlled transport for blood, tissue, and other diagnostic specimens. Strict adherence to safety protocols.</p>
                        </div>
                        <div className="service-card" style={{opacity: 1, transform: 'none'}}>
                            <div className="icon">💊</div>
                            <h3>Pharmacy Deliveries</h3>
                            <p>Direct-to-patient and B2B pharmaceutical deliveries. Safe handling of sensitive prescription medications.</p>
                        </div>
                        <div className="service-card" style={{opacity: 1, transform: 'none'}}>
                            <div className="icon">⚕️</div>
                            <h3>Medical Equipment</h3>
                            <p>Same-day delivery of critical medical devices, surgical supplies, and hospital equipment.</p>
                        </div>
                    </div>
                </div>
            </section>

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
                                <div className="record-row"><strong>Patient ID:</strong> <span>PT-89456</span></div>
                                <div className="record-row"><strong>Blood Type:</strong> <span>O Positive</span></div>
                                <div className="record-row"><strong>Allergies:</strong> <span>Penicillin, Peanuts</span></div>
                                <div className="record-row"><strong>Last Checkup:</strong> <span>Oct 12, 2024</span></div>
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
                                <input type="text" placeholder="Medication Name" required value={newPillName} onChange={e => setNewPillName(e.target.value)} />
                                <input type="time" required value={newPillTime} onChange={e => setNewPillTime(e.target.value)} />
                                <button type="submit" className="btn btn-primary">Add</button>
                            </form>
                            <ul className="pill-list">
                                {pills.map((p, i) => (
                                    <li key={i}>
                                        <span>{p.name}</span>
                                        <span className="pill-time-badge">{p.time}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

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
                <div className="footer-bottom">
                    <div className="container">
                        <p>&copy; 2026 Medigo Systems. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {!isEmergencyAlertActive && (
                <button onClick={handleHospitalAlert} className="emergency-alert-btn">
                    <span>🚨</span> HOSPITAL ALERT
                </button>
            )}

            <div className={`emergency-modal ${isEmergencyAlertActive ? 'active' : ''}`}>
                <div className="modal-content">
                    <h2>🚨 EMERGENCY INITIATED</h2>
                    <p>Alerting nearest available medical facility...</p>
                    <button onClick={() => setIsEmergencyAlertActive(false)} className="btn btn-secondary" style={{marginTop:"20px", width:"100%"}}>Dismiss</button>
                </div>
            </div>

            <button onClick={() => setChatbotOpen(true)} className="chatbot-btn">💬</button>

            <div className={`chatbot-window ${!chatbotOpen ? 'hidden' : ''}`}>
                <div className="chatbot-header">
                    <h4>Medigo Support</h4>
                    <span onClick={() => setChatbotOpen(false)} className="close-chat">&times;</span>
                </div>
                <div className="chatbot-body" ref={chatBodyRef}>
                    {chatMessages.map(msg => (
                        <div key={msg.id} className={`chat-message ${msg.isBot ? 'bot' : 'user'}`}>
                            <p>{msg.text}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={handleChatSubmit} className="chatbot-input">
                    <input type="text" placeholder="Type your query..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
                    <button type="submit">Send</button>
                </form>
            </div>

            {/* Application Modals */}
            <div className={`emergency-modal ${activeModal === 'emergency' ? 'active' : ''}`}>
                <div className="modal-content" style={{maxWidth: "500px", width: "95%"}}>
                    {modalStep === 1 ? (
                        <div>
                            <h2 style={{color: "var(--primary-blue)"}}>Request Emergency Dispatch</h2>
                            <p>Please enter details for immediate pickup and delivery.</p>
                            <form style={{textAlign: "left"}} onSubmit={(e) => {
                                e.preventDefault();
                                runSimulation({
                                    initStatus: "Courier Dispatched - En Route to Pickup", initEta: "12 Mins", initIcon: "🚁",
                                    status30: "Package Secured at Pickup", eta30: "10 Mins", icon30: "🚚",
                                    status50: "In Transit via Highway", eta50: "7 Mins",
                                    status70: "Approaching Destination", eta70: "2 Mins",
                                    status90: "Package Delivered Successfully!"
                                });
                            }}>
                                <div style={{marginBottom: "15px"}}><label>Pickup</label><input type="text" className="modal-input" required/></div>
                                <div style={{marginBottom: "15px"}}><label>Destination</label><input type="text" className="modal-input" required/></div>
                                <div style={{marginBottom: "20px"}}>
                                    <label>Package Type</label>
                                    <select className="modal-input" required>
                                        <option value="">Select...</option>
                                        <option value="blood">Blood/Tissue Sample</option>
                                        <option value="organ">Organ Transport</option>
                                    </select>
                                </div>
                                <div style={{display: "flex", gap: "10px"}}>
                                    <button type="submit" className="btn btn-primary" style={{flex: 2, backgroundColor: "var(--accent-red)"}}>Dispatch Drone</button>
                                    <button type="button" onClick={() => setActiveModal(null)} className="btn btn-secondary" style={{flex: 1}}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    ) : <TrackingView />}
                </div>
            </div>

            {/* Prescriptions Modal */}
            <div className={`emergency-modal ${activeModal === 'prescription' ? 'active' : ''}`}>
                <div className="modal-content" style={{maxWidth: "550px", width: "95%"}}>
                    {modalStep === 1 ? (
                        <RxOrderForm 
                            onCancel={() => setActiveModal(null)} 
                            onSubmit={() => {
                                runSimulation({
                                    initStatus: "Prescription Processing - Preparing Order", initEta: "60 Mins", initIcon: "🚁",
                                    status30: "Order Picked up from Pharmacy", eta30: "45 Mins", icon30: "🚐",
                                    status50: "In Transit to Destination", eta50: "20 Mins",
                                    status70: "Approaching Delivery Address", eta70: "5 Mins",
                                    status90: "Order Delivered Successfully! 📝"
                                });
                            }} 
                        />
                    ) : <TrackingView />}
                </div>
            </div>

             {/* Family Order Modal */}
            <div className={`emergency-modal ${activeModal === 'family' ? 'active' : ''}`}>
                <div className="modal-content" style={{maxWidth: "550px", width: "95%"}}>
                    {modalStep === 1 ? (
                        <FamilyOrderForm 
                            onCancel={() => setActiveModal(null)} 
                            onSubmit={() => {
                                runSimulation({
                                    initStatus: "Care Package Dispatched", initEta: "45 Mins", initIcon: "🚁",
                                    status30: "Picked up from Pharmacy", eta30: "30 Mins", icon30: "🚐",
                                    status50: "In Transit", eta50: "15 Mins",
                                    status70: "Arriving in Neighborhood", eta70: "3 Mins",
                                    status90: "Care Package Delivered! ❤️"
                                });
                            }} 
                        />
                    ) : <TrackingView />}
                </div>
            </div>

        </>
    );
};

// Extracted Component for Rx form to handle drag/drop specifics neatly
const RxOrderForm = ({ onCancel, onSubmit }) => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFileName(e.dataTransfer.files[0].name);
        }
    };

    return (
        <div>
            <h2 style={{color: "#8b5cf6", display:"flex", alignItems:"center", justifyContent:"center", gap: "10px"}}>📝 Upload & Order Items</h2>
            <p>Upload a doctors prescription or select over-the-counter medical items.</p>
            <form style={{textAlign: "left", marginTop: "20px"}} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                <div 
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        marginBottom: "20px", padding: "30px 15px", borderRadius: "8px", 
                        border: `2px dashed ${dragActive ? '#8b5cf6' : '#cbd5e1'}`, 
                        backgroundColor: dragActive ? '#f3e8ff' : '#f8fafc',
                        textAlign: "center", cursor: "pointer", transition: "all 0.3s ease"
                    }}
                >
                    <div style={{fontSize: "2rem", marginBottom: "10px", color: "#8b5cf6"}}>☁️</div>
                    <label style={{display: "block", fontWeight: 600, marginBottom: "8px", cursor: "pointer"}}>Drag & Drop your photo here</label>
                    <p style={{color: "#64748b", fontSize: "0.9rem", marginBottom: "10px"}}>or click to browse from your device</p>
                    <input 
                        ref={fileInputRef} 
                        type="file" 
                        accept="image/*,.pdf" 
                        style={{display: "none"}} 
                        onChange={(e) => {
                            if(e.target.files?.[0]) setFileName(e.target.files[0].name);
                        }}
                    />
                    {fileName && <div style={{marginTop: "10px", fontWeight: 500, color: "#10b981"}}>Attached: {fileName}</div>}
                </div>

                <div style={{marginBottom: "15px"}}>
                    <label>Select Over-the-Counter Items (Optional)</label>
                    <select className="modal-input" multiple style={{height: "80px"}}>
                        <option value="firstaid">Advanced First Aid Kit</option>
                        <option value="vitamins">Multivitamins Bundle</option>
                        <option value="mask">N95 Respirators</option>
                    </select>
                </div>
                <div style={{marginBottom: "20px"}}>
                    <label>Destination Address</label>
                    <input type="text" className="modal-input" required placeholder="Full Shipping Address"/>
                </div>
                <div style={{display: "flex", gap: "10px"}}>
                    <button type="submit" className="btn btn-primary" style={{flex: 2, background: "linear-gradient(135deg, #8b5cf6, #6d28d9)"}}>Process Order</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary" style={{flex: 1}}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

const FamilyOrderForm = ({ onCancel, onSubmit }) => {
    return (
        <div>
            <h2 style={{color: "#10b981", display:"flex", alignItems:"center", justifyContent:"center", gap: "10px"}}>❤️ Order for Family</h2>
            <form style={{textAlign: "left"}} onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
                <div style={{marginBottom: "15px"}}>
                    <label>Relative's Name</label>
                    <input type="text" className="modal-input" required placeholder="e.g. Jane Doe"/>
                </div>
                <div style={{marginBottom: "15px"}}>
                    <label>Delivery Address</label>
                    <input type="text" className="modal-input" required placeholder="Full Address"/>
                </div>
                <div style={{display: "flex", gap: "10px"}}>
                    <button type="submit" className="btn btn-primary" style={{flex: 2, background: "linear-gradient(135deg, #10b981, #059669)"}}>Send Care Package</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary" style={{flex: 1}}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
