import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Volume2,
  Calendar,
  Send,
  Sparkles,
  MessageSquare,
  Clock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { soundEngine } from '../../lib/audio';
import { useAppStore } from '../../store/useAppStore';

export const OrientationGizmo: React.FC = () => {
  const receptionistOpen = useAppStore((s) => s.receptionistOpen);
  const setReceptionistOpen = useAppStore((s) => s.setReceptionistOpen);

  const [activeTab, setActiveTab] = useState<'voice' | 'calendar'>('voice');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: "Greetings. I am Maya, Nikneuron's autonomous digital receptionist. How may I assist your engineering project today?",
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    email: '',
    date: '2026-03-25',
    time: '14:00',
    projectNote: 'Discovery call regarding Nikneuron engineering & tool development.',
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Speech Recognition hook
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleUserSubmit(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05;
      utterance.rate = 1.02;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleUserSubmit = (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    soundEngine.playTone(700, 0.05, 'sine', 0.04);
    const newMsgs = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMsgs);
    setInputText('');

    setTimeout(() => {
      let reply = "Understood. Our systems engineer Aditya Tamta specializes in high-performance client-side WASM architectures, custom Android haptic dials, and autonomous AI agents. Would you like to schedule a 15-minute discovery consultation?";
      if (textToSend.toLowerCase().includes('filecore')) {
        reply = "FileCore is our 100% private, client-side toolkit. No files or media ever touch a server. You can test run it right inside the catalog under /run/filecore.";
      } else if (textToSend.toLowerCase().includes('orbit') || textToSend.toLowerCase().includes('dial')) {
        reply = "Orbit Theme Dial brings tactile rotary physics to Android. You can download the latest APK directly from our Downloads section.";
      }

      setMessages((prev) => [...prev, { role: 'ai' as const, text: reply }]);
      speakText(reply);
      soundEngine.playTone(880, 0.06, 'sine', 0.05);
    }, 600);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      soundEngine.playTone(900, 0.08, 'sawtooth', 0.05);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Google Calendar URL Generator
  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Nikneuron Discovery Call: Aditya Tamta & ${bookingDetails.name || 'Client'}`);
    const details = encodeURIComponent(bookingDetails.projectNote);
    const location = encodeURIComponent('Google Meet (Audio / Video Link will be provided)');
    const startIso = `${bookingDetails.date.replace(/-/g, '')}T${bookingDetails.time.replace(':', '')}00Z`;
    const endHour = String(parseInt(bookingDetails.time.split(':')[0], 10) + 1).padStart(2, '0');
    const endIso = `${bookingDetails.date.replace(/-/g, '')}T${endHour}${bookingDetails.time.split(':')[1]}00Z`;

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}`;
  };

  // Download .ics calendar invite
  const downloadIcsFile = () => {
    soundEngine.playLaserShoot();
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NikneuronDev//Discovery Call//EN
BEGIN:VEVENT
SUMMARY:Nikneuron Discovery Call - Aditya Tamta
DESCRIPTION:${bookingDetails.projectNote}
STATUS:CONFIRMED
LOCATION:Virtual / Online
DTSTART:${bookingDetails.date.replace(/-/g, '')}T${bookingDetails.time.replace(':', '')}00
DTEND:${bookingDetails.date.replace(/-/g, '')}T150000
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nikneuron-discovery-call-${bookingDetails.date}.ics`;
    link.click();
    setBookingConfirmed(true);
  };

  return (
    <>
      {/* Floating 3D Glowing Wireframe Core Trigger Button */}
      <div className="fixed bottom-5 left-4 sm:left-6 z-40">
        <button
          type="button"
          onClick={() => setReceptionistOpen(!receptionistOpen)}
          className="relative group p-3 rounded-2xl bg-void-deep/90 border border-cyan-electric/40 backdrop-blur-xl transition-all duration-300 hover:border-cyan-electric hover:shadow-cyan-glow hover:scale-105 active:scale-95 flex items-center gap-3 cursor-pointer"
          title="Talk with AI Receptionist (Maya)"
        >
          {/* Animated 3D Ring Orb */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-cyan-electric/50 animate-spin-slow" />
            <span className="absolute inset-1 rounded-full border border-pink-accent/60 animate-spin" style={{ animationDirection: 'reverse' }} />
            <span className="w-3 h-3 rounded-full bg-cyan-electric shadow-cyan-glow-sm animate-pulse" />
          </div>

          <div className="hidden sm:flex flex-col text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
              <span className="text-[11px] font-display font-bold text-white tracking-wide">
                MAYA AI
              </span>
            </div>
            <span className="text-[9px] font-mono text-cyan-electric uppercase tracking-wider">
              24/7 RECEPTIONIST
            </span>
          </div>
        </button>
      </div>

      {/* Persistent AI Dialog Window */}
      {receptionistOpen && (
        <div className="fixed bottom-20 left-4 sm:left-6 z-50 w-[350px] sm:w-[410px] max-w-[calc(100vw-2rem)] glass-surface-tier-1 rounded-2xl border border-cyan-electric/40 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
          {/* Window Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-void-surface/50">
            <div className="flex items-center gap-2.5">
              <div className="relative w-6 h-6 rounded-full bg-cyan-electric/20 border border-cyan-electric flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-electric animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xs text-white">Maya Receptionist</h3>
                <p className="text-[9px] font-mono text-cyan-electric">AUDIO TELEMETRY ONLINE</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveTab('voice')}
                className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'voice' ? 'bg-cyan-electric/20 text-cyan-electric border border-cyan-electric/40' : 'text-text-dim hover:text-white'
                }`}
                title="Voice & Chat"
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                  activeTab === 'calendar' ? 'bg-pink-accent/20 text-pink-accent border border-pink-accent/40' : 'text-text-dim hover:text-white'
                }`}
                title="Book Call"
              >
                <Calendar className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReceptionistOpen(false)}
                className="p-1.5 rounded-lg text-text-dim hover:text-white transition-all ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tab 1: Voice & Conversation */}
          {activeTab === 'voice' && (
            <div className="flex flex-col h-[340px]">
              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 font-body text-xs">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${
                        m.role === 'user'
                          ? 'bg-pink-accent/20 border border-pink-accent/40 text-white rounded-br-none'
                          : 'bg-void-surface border border-cyan-electric/30 text-text-primary rounded-bl-none shadow-sm'
                      }`}
                    >
                      <p className="leading-relaxed">{m.text}</p>
                    </div>
                    {m.role === 'ai' && (
                      <button
                        onClick={() => speakText(m.text)}
                        className="mt-1 flex items-center gap-1 text-[9px] font-mono text-cyan-electric hover:underline"
                      >
                        <Volume2 className="w-2.5 h-2.5" /> Speak
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Audio Waveform Equalizer Display */}
              <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between bg-void-surface/30">
                <div className="flex items-center gap-1">
                  {[4, 12, 8, 16, 6, 14, 9, 18, 5, 11].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-cyan-electric rounded-full transition-all duration-150"
                      style={{
                        height: isListening ? `${h}px` : '4px',
                        opacity: isListening ? 1 : 0.4,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-text-dim">
                  {isListening ? 'MICROPHONE ACTIVE...' : 'READY FOR INPUT'}
                </span>
              </div>

              {/* Input Row */}
              <div className="p-3 border-t border-white/10 flex items-center gap-2 bg-void-surface/60">
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl border transition-all ${
                    isListening
                      ? 'bg-pink-accent text-white border-pink-accent animate-pulse shadow-pink-glow-sm'
                      : 'bg-void-surface text-cyan-electric border-cyan-electric/40 hover:bg-cyan-electric/15'
                  }`}
                  title="Voice Input (Microphone)"
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUserSubmit()}
                  placeholder="Ask Maya about apps or services..."
                  className="flex-1 bg-white/5 border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder-text-dim focus:outline-none focus:border-cyan-electric font-body"
                />

                <button
                  type="button"
                  onClick={() => handleUserSubmit()}
                  className="p-2 rounded-xl bg-cyan-electric/20 border border-cyan-electric/50 text-cyan-electric hover:bg-cyan-electric/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Book Discovery Call */}
          {activeTab === 'calendar' && (
            <div className="p-4 space-y-3 h-[340px] overflow-y-auto font-body text-xs">
              <div className="flex items-center gap-2 text-cyan-electric font-display font-semibold text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>15-Minute Technical Discovery</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-snug">
                Reserve an engineering architecture sync with founder Aditya Tamta.
              </p>

              <div>
                <label className="text-[10px] font-mono text-text-dim uppercase block mb-1">Your Name</label>
                <input
                  type="text"
                  value={bookingDetails.name}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, name: e.target.value })}
                  placeholder="Jane Smith"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-electric"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-mono text-text-dim uppercase block mb-1">Date</label>
                  <input
                    type="date"
                    value={bookingDetails.date}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-electric"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-text-dim uppercase block mb-1">Time</label>
                  <input
                    type="time"
                    value={bookingDetails.time}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, time: e.target.value })}
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-electric"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-text-dim uppercase block mb-1">Project Brief</label>
                <textarea
                  rows={2}
                  value={bookingDetails.projectNote}
                  onChange={(e) => setBookingDetails({ ...bookingDetails, projectNote: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-electric resize-none"
                />
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => soundEngine.playLaserShoot()}
                  className="w-full py-2 px-3 rounded-xl bg-cyan-electric/20 border border-cyan-electric text-cyan-electric font-display font-semibold text-xs flex items-center justify-center gap-2 hover:bg-cyan-electric/30 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Add to Google Calendar</span>
                </a>

                <button
                  type="button"
                  onClick={downloadIcsFile}
                  className="w-full py-2 px-3 rounded-xl bg-void-surface border border-white/15 text-text-primary font-mono text-xs flex items-center justify-center gap-2 hover:border-pink-accent/50 hover:text-pink-accent transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Download .ICS Invitation</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="flex items-center gap-1.5 text-green-400 text-[11px] font-mono pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Calendar file generated! Check your downloads.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

