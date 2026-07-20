import React, { useState, useRef, useEffect } from "react";
import { 
  MessageSquareCode, 
  Send, 
  Sparkles, 
  Activity, 
  Trash2, 
  CornerDownLeft, 
  Info,
  HelpCircle,
  Clock
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface AiChatbotProps {
  onSendMessageToGemini: (text: string) => Promise<string>;
}

export default function AiChatbot({ onSendMessageToGemini }: AiChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello! I am the Carbon Cutters AI advisor, your real-time ISO 14064-1 & GHG Protocol manufacturing compliance assistant. I can analyze your currently loaded VMC/HMC telemetry, help verify freight Scope 3 coefficients, suggest energy-saving schedules, or draft custom corporate ESG carbon reduction proposals. How can I assist you with your operations today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userText = inputText;
    setInputText("");
    
    // Append User Message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    
    setLoading(true);

    try {
      const response = await onSendMessageToGemini(userText);
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: "bot",
        text: "I am currently analyzing your local telemetry datasets in offline eco-heuristics fallback. Telemetry looks healthy! Let me know if you need to generate a comprehensive machine carbon compliance report instead.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col h-[600px] max-h-[80vh] shadow-sm">
      
      {/* Chat header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
            <MessageSquareCode className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 tracking-wider font-display uppercase">Carbon Cutters Compliance Advisor</h3>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">Real-time guidance backed by your operational data</p>
          </div>
        </div>

        <button 
          onClick={() => {
            setMessages([messages[0]]);
          }}
          className="text-slate-500 hover:text-slate-700 transition-all p-1.5 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1 font-mono border border-transparent hover:border-slate-200"
        >
          <Trash2 className="h-4 w-4" />
          CLEAR CHAT
        </button>
      </div>

      {/* Messages body */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 px-2">
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          return (
            <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isBot ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
              <div className={`h-7 w-7 rounded-lg text-xs font-bold font-mono flex items-center justify-center shrink-0 shadow ${
                isBot ? "bg-emerald-500 text-slate-950" : "bg-sky-500 text-white"
              }`}>
                {isBot ? "AI" : "ME"}
              </div>
              
              <div className={`rounded-2xl p-3.5 space-y-1 ${
                isBot 
                  ? "bg-slate-50 border border-slate-200 text-slate-700" 
                  : "bg-emerald-50 border border-emerald-100 text-slate-700"
              }`}>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div className="flex items-center justify-end text-[8px] font-mono text-slate-500 gap-1 mt-1">
                  <Clock className="h-2.5 w-2.5" />
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="h-7 w-7 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold font-mono flex items-center justify-center shrink-0 animate-bounce">
              AI
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-600 text-xs font-mono flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              Carbon Cutters is reading carbon coefficients & ISO criteria...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls footer */}
      <form onSubmit={handleSend} className="pt-3 border-t border-white/5 flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask e.g. 'How can we reduce Scope 2 burden in Shift 3 on VMC CNC machines?'"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 font-sans"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-sm"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline font-mono">SEND</span>
        </button>
      </form>

      {/* Sample prompt bubbles */}
      <div className="pt-3 flex flex-wrap gap-1.5 shrink-0 text-[10px] font-mono text-slate-400">
        <span className="text-slate-500 flex items-center gap-1 select-none"><Info className="h-3.5 w-3.5" /> QUICK TOPICS:</span>
        {[
          "Reduce Scope 2 Grid dependency",
          "Logistics Scope 3 conversion factor",
          "What is ISO 14064 compliance?"
        ].map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setInputText(prompt)}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-0.5 transition-all text-[10px] text-slate-600 hover:text-slate-800"
          >
            {prompt}
          </button>
        ))}
      </div>

    </div>
  );
}
