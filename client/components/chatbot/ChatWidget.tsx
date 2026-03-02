"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import {
    MessageCircle, X, Send, Loader2,
    AlertTriangle, Bot, User, ChevronRight,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ── Types ────────────────────────────────────────────────────

interface ChatCTA {
    label: string;
    href: string;
    variant: "primary" | "outline";
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    isEmergency?: boolean;
    cta?: ChatCTA;
    timestamp: Date;
}

// ── Quick-reply chips shown on greeting ──────────────────────
const QUICK_REPLIES = [
    "Book an appointment",
    "Treatment prices",
    "Meet our dentists",
    "Clinic hours",
];

// ── Main component ───────────────────────────────────────────
export default function ChatWidget() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showBadge, setShowBadge] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // ── Message history ───────────────────────────────────────
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: isAuthenticated && user
                ? `Hi ${user.name.split(" ")[0]}! 👋 Welcome back to SmileCare. How can I assist you today?`
                : "Hi there! 👋 I'm SmileCare's patient assistant. I can help with appointments, treatments, pricing, and more. How can I help?",
            timestamp: new Date(),
        },
    ]);

    // Update welcome message when auth state resolves
    useEffect(() => {
        setMessages([{
            id: "welcome",
            role: "assistant",
            content: isAuthenticated && user
                ? `Hi ${user.name.split(" ")[0]}! 👋 Welcome back to SmileCare. How can I assist you today?`
                : "Hi there! 👋 I'm SmileCare's patient assistant. I can help with appointments, treatments, pricing, and more. How can I help?",
            timestamp: new Date(),
        }]);
    }, [isAuthenticated, user?.name]);

    // ── Auto-scroll to latest message ────────────────────────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // ── Focus input when opened ───────────────────────────────
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 150);
            setShowBadge(false);
        }
    }, [isOpen]);

    // ── Auto-show badge pulse after 3 seconds ─────────────────
    useEffect(() => {
        const t = setTimeout(() => setShowBadge(true), 3000);
        return () => clearTimeout(t);
    }, []);

    // ── Send message ─────────────────────────────────────────
    const sendMessage = useCallback(async (text: string) => {
        const trimmed = text.trim();
        if (!trimmed || isLoading) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue("");
        setIsLoading(true);

        // Build history for API (exclude welcome, keep last 6 turns)
        const history = messages
            .filter(m => m.id !== "welcome")
            .slice(-6)
            .map(m => ({ role: m.role, content: m.content }));

        try {
            const res = await fetch(`${API}/api/chatbot/message`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    message: trimmed,
                    history,
                }),
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const response = data.data;

            const assistantMessage: Message = {
                id: `bot-${Date.now()}`,
                role: "assistant",
                content: response.reply,
                isEmergency: response.isEmergency,
                cta: response.cta,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    id: `err-${Date.now()}`,
                    role: "assistant",
                    content:
                        "I'm having a moment — please try again or call us directly. " +
                        "We're here Monday–Saturday, 9 AM–6 PM. 🙏",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [messages, isLoading]);

    // ── Keyboard submit ───────────────────────────────────────
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputValue);
        }
    };

    // ── Render ────────────────────────────────────────────────
    return (
        <>
            {/* ── Chat Panel ────────────────────────────────── */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-4 sm:right-6 z-50
                               w-[calc(100vw-2rem)] max-w-sm
                               bg-white rounded-3xl shadow-2xl shadow-primary/15
                               border border-slate-100
                               flex flex-col overflow-hidden
                               animate-in slide-in-from-bottom-4 fade-in duration-300"
                    style={{ height: "min(600px, calc(100dvh - 120px))" }}
                >
                    {/* Header */}
                    <div className="flex items-center gap-3 px-5 py-4
                                    bg-primary text-white shrink-0">
                        <div className="size-9 rounded-full bg-white/20
                                        flex items-center justify-center shrink-0">
                            <Bot size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-sm leading-none">
                                SmileCare Assistant
                            </p>
                            <p className="text-xs text-white/70 mt-0.5">
                                Typically replies instantly
                            </p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="size-8 rounded-full bg-white/10
                                       hover:bg-white/20 flex items-center
                                       justify-center transition-colors shrink-0"
                            aria-label="Close chat"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4
                                    space-y-4 no-scrollbar">
                        {messages.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                onCTAClick={(href) => {
                                    router.push(href);
                                    setIsOpen(false);
                                }}
                            />
                        ))}

                        {/* Quick replies — show only after welcome */}
                        {messages.length === 1 && !isLoading && (
                            <div className="flex flex-wrap gap-2 pt-1">
                                {QUICK_REPLIES.map((qr) => (
                                    <button
                                        key={qr}
                                        onClick={() => sendMessage(qr)}
                                        className="text-xs px-3 py-1.5 rounded-full
                                                   border border-primary/20 text-primary
                                                   bg-primary/5 hover:bg-primary/10
                                                   transition-colors font-medium"
                                    >
                                        {qr}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="flex items-end gap-2">
                                <div className="size-7 rounded-full bg-primary/10
                                                flex items-center justify-center shrink-0">
                                    <Bot size={14} className="text-primary" />
                                </div>
                                <div className="bg-slate-50 rounded-2xl rounded-bl-sm
                                                px-4 py-3 flex items-center gap-1.5">
                                    <span className="size-1.5 rounded-full bg-primary/40
                                                     animate-bounce [animation-delay:0ms]" />
                                    <span className="size-1.5 rounded-full bg-primary/40
                                                     animate-bounce [animation-delay:150ms]" />
                                    <span className="size-1.5 rounded-full bg-primary/40
                                                     animate-bounce [animation-delay:300ms]" />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="shrink-0 border-t border-slate-100
                                    px-4 py-3 bg-white">
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={inputRef}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything..."
                                rows={1}
                                maxLength={500}
                                disabled={isLoading}
                                className="flex-1 resize-none rounded-xl border border-slate-200
                                           bg-slate-50 px-4 py-2.5 text-sm text-slate-800
                                           placeholder:text-slate-400 outline-none
                                           focus:border-primary/40 focus:bg-white
                                           transition-colors min-h-[40px] max-h-[100px]
                                           disabled:opacity-50 no-scrollbar"
                                style={{
                                    height: "auto",
                                    overflowY:
                                        inputValue.split("\n").length > 3
                                            ? "auto"
                                            : "hidden",
                                }}
                                onInput={(e) => {
                                    const t = e.currentTarget;
                                    t.style.height = "auto";
                                    t.style.height = `${Math.min(t.scrollHeight, 100)}px`;
                                }}
                            />
                            <button
                                onClick={() => sendMessage(inputValue)}
                                disabled={!inputValue.trim() || isLoading}
                                className="size-10 rounded-xl bg-primary text-white
                                           flex items-center justify-center shrink-0
                                           hover:opacity-90 active:scale-95
                                           transition-all disabled:opacity-40
                                           disabled:cursor-not-allowed"
                                aria-label="Send message"
                            >
                                {isLoading ? (
                                    <Loader2 size={16} className="animate-spin" />
                                ) : (
                                    <Send size={16} />
                                )}
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-300 text-center mt-2">
                            AI assistant · Not a substitute for medical advice
                        </p>
                    </div>
                </div>
            )}

            {/* ── FAB Button ────────────────────────────────── */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="fixed bottom-5 right-4 sm:right-6 z-50
                           size-14 rounded-full bg-primary text-white
                           shadow-lg shadow-primary/30
                           flex items-center justify-center
                           hover:opacity-90 active:scale-95
                           transition-all duration-200"
                aria-label={isOpen ? "Close chat" : "Open SmileCare chat"}
            >
                {isOpen ? (
                    <X size={22} className="transition-transform duration-200" />
                ) : (
                    <>
                        <MessageCircle size={22} />
                        {showBadge && (
                            <span className="absolute -top-1 -right-1
                                             size-4 rounded-full bg-accent-gold
                                             border-2 border-white
                                             animate-pulse" />
                        )}
                    </>
                )}
            </button>
        </>
    );
}

// ── Message Bubble sub-component ─────────────────────────────
function MessageBubble({
    message,
    onCTAClick,
}: {
    message: Message;
    onCTAClick: (href: string) => void;
}) {
    const isUser = message.role === "user";

    return (
        <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div
                className={`size-7 rounded-full flex items-center justify-center
                             shrink-0 self-end
                             ${isUser
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary"
                    }`}
            >
                {isUser ? <User size={13} /> : <Bot size={13} />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                {/* Emergency banner */}
                {message.isEmergency && (
                    <div className="flex items-center gap-2 px-3 py-2
                                    bg-red-50 border border-red-200 rounded-xl
                                    text-red-700 text-xs font-bold w-full">
                        <AlertTriangle size={13} className="shrink-0" />
                        Dental Emergency Detected
                    </div>
                )}

                {/* Text bubble */}
                <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                        ${isUser
                            ? "bg-primary text-white rounded-br-sm"
                            : `bg-slate-50 text-slate-800 rounded-bl-sm
                           ${message.isEmergency
                                ? "border border-red-200 bg-red-50"
                                : ""}`
                        }`}
                >
                    {isUser ? (
                        <span>{message.content}</span>
                    ) : (
                        <ReactMarkdown
                            components={{
                                p: ({ children }) => (
                                    <p className="mb-1 last:mb-0">{children}</p>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-semibold">{children}</strong>
                                ),
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    )}
                </div>

                {/* CTA button */}
                {message.cta && (
                    <button
                        onClick={() => onCTAClick(message.cta!.href)}
                        className={`flex items-center gap-1.5 text-xs font-bold
                                    px-4 py-2 rounded-xl transition-all
                                    active:scale-95
                                    ${message.cta.variant === "primary"
                                ? "bg-primary text-white shadow-md shadow-primary/20 hover:opacity-90"
                                : "border-2 border-primary/20 text-primary hover:bg-primary/5"
                            }`}
                    >
                        {message.cta.label}
                        <ChevronRight size={13} />
                    </button>
                )}

                {/* Timestamp */}
                <span className="text-[9px] text-slate-300 px-1">
                    {message.timestamp.toLocaleTimeString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </span>
            </div>
        </div>
    );
}
