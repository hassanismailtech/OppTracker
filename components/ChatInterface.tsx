import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Opportunity, UserProfile } from '../types';
import { analyzeJobText, matchProfileToJob, createOpportunityFromAnalysis } from '../services/geminiService';
import { Send, Bot, ShieldCheck, ShieldAlert, Check, Copy } from 'lucide-react';

interface ChatInterfaceProps {
  userProfile: UserProfile;
  onOpportunityFound: (opp: Opportunity) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userProfile, onOpportunityFound }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hi ${userProfile.name.split(' ')[0]}! 👋 I'm your OppTracker agent. \n\nForward me job links or paste descriptions here. I'll vet them for scams and check if they match your profile.`,
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // 1. Analyze Job
      const analysis = await analyzeJobText(userMsg.text);
      
      // 2. Match Profile
      const match = await matchProfileToJob(userProfile, analysis);

      // 3. Create Opportunity Object
      const newOpp = createOpportunityFromAnalysis(analysis, match, userMsg.text);
      
      // 4. Save to Parent State
      onOpportunityFound(newOpp);

      // 5. Respond
      const botResponse: ChatMessage = {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: "I've analyzed that for you.",
        timestamp: Date.now(),
        relatedOpportunityId: newOpp.id,
      };

      // Add "Card" logic inside the message renderer, but here we just store the ID relation
      // We pass the full object via a specialized message or just render differently based on ID presence
      // For simplicity, we'll append a custom property to the message object in state if needed, 
      // but let's just use the message renderer to look up the ID if we had a central store.
      // Since we don't have a central store accessible inside this component easily without props drill,
      // We will embed the opportunity data into the message for display purposes.
      (botResponse as any).embeddedOpp = newOpp;

      setMessages(prev => [...prev, botResponse]);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender: 'bot',
        text: "Sorry, I had trouble analyzing that. Please try pasting the text again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#e5ddd5] relative">
      {/* Background Pattern Mimic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4a5568 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 z-10">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[60%] rounded-lg p-3 shadow-sm relative ${
                msg.sender === 'user'
                  ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none'
                  : 'bg-white text-slate-900 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{msg.text}</div>
              
              {/* Embedded Opportunity Card within Chat */}
              {(msg as any).embeddedOpp && (
                <div className="mt-3 bg-slate-50 rounded border border-slate-200 p-3 text-left">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="font-bold text-slate-800">{(msg as any).embeddedOpp.title}</h4>
                     {/* Scam Check Icon */}
                     {(msg as any).embeddedOpp.scamRiskScore < 30 ? (
                        <ShieldCheck size={18} className="text-green-500" />
                     ) : (
                        <ShieldAlert size={18} className="text-red-500" />
                     )}
                  </div>
                  <div className="text-xs text-slate-500 mb-2">{(msg as any).embeddedOpp.company}</div>
                  
                  <div className="flex gap-2 text-xs font-mono mb-2">
                     <span className={`px-1.5 py-0.5 rounded ${(msg as any).embeddedOpp.fitScore > 70 ? 'bg-green-200 text-green-800' : 'bg-amber-200 text-amber-800'}`}>
                        Fit: {(msg as any).embeddedOpp.fitScore}%
                     </span>
                     <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                        Risk: {(msg as any).embeddedOpp.scamRiskScore}%
                     </span>
                  </div>
                  
                  <div className="text-xs text-slate-600 italic border-l-2 border-slate-300 pl-2 mb-2">
                    "{(msg as any).embeddedOpp.fitReasoning}"
                  </div>

                  <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Check size={10} /> Saved to Tracker
                  </div>
                </div>
              )}

              <div className="text-[10px] text-slate-400 text-right mt-1 opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
           <div className="flex justify-start">
            <div className="bg-white rounded-lg rounded-tl-none p-3 shadow-sm flex gap-1 items-center">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
            </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#f0f2f5] md:static border-t border-slate-200 z-20 pb-safe md:pb-3">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste job description or URL here..."
            className="flex-1 rounded-2xl border border-slate-300 px-4 py-3 focus:outline-none focus:border-brand-500 text-sm resize-none h-12 max-h-32 overflow-hidden"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-brand-500 text-white p-3 rounded-full hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex items-center justify-center w-12 h-12"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="text-[10px] text-center text-slate-400 mt-1">
            Simulated WhatsApp Interface &bull; Powered by Gemini
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;