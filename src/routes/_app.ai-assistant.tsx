import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Send, User as UserIcon } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/_app/ai-assistant")({
  component: AIAssistantPage,
});

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "Why did sales decrease?",
  "Predict next month's revenue.",
  "Which products should I promote?",
  "What inventory should I reorder?",
  "How can I increase profits?",
];

const answer = (q: string) => {
  const map: Record<string, string> = {
    "Why did sales decrease?": "Sales dipped 2.3% this week, driven mainly by refunds on Vector API (out of stock) and reduced traffic in EU-West after the Nov 3 campaign paused. Restocking Vector API should recover ~$4.3k/day.",
    "Predict next month's revenue.": "Based on 12-month seasonality and current pipeline velocity, projected revenue is $142k–$156k (mid-point $149k). That's a 16% MoM growth — 8% above your Q4 plan.",
    "Which products should I promote?": "Atlas Cloud has the highest ROI ($150 CAC → $6.2k LTV) and lowest saturation. Bundle it with Pulse Analytics for a 22% attach lift. Deprioritize Beacon SEO — its ROI dropped 11% MoM.",
    "What inventory should I reorder?": "Immediate: Vector API (0 units), Ledger Books (6 units). Reorder within 7 days: Atlas Cloud (45 units, 12-day cover). Northwind supplier has 3-day lead time.",
    "How can I increase profits?": "Three levers: (1) Reallocate 20% of paused SEM budget to Winter SaaS Launch (+$8k/mo est.). (2) Renegotiate Contoso pricing — you're 62% concentrated there. (3) Upsell Free→Pro cohort of 812 users with in-app nudge (est. +$14k/mo).",
  };
  return map[q] ?? "I analyzed your recent data. Here's what stands out: revenue is trending 12% ahead of forecast, three customers show churn risk, and Vector API stockouts are the biggest short-term drag. Want me to draft an action plan?";
};

function AIAssistantPage() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi! I'm your BizPilot AI. Ask me about revenue, customers, inventory, marketing, or forecasting — I'll pull the numbers and suggest actions." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { scrollRef.current?.scrollTo({ top: 1e9, behavior: "smooth" }); }, [messages, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: answer(text) }]);
      setTyping(false);
    }, 700 + Math.random() * 500);
  };

  return (
    <>
      <PageHeader title="AI Assistant" description="Chat with BizPilot AI about anything in your business." icon={Sparkles} />

      <div className="card-elevated rounded-2xl flex flex-col h-[calc(100vh-260px)] min-h-[500px] overflow-hidden">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 animate-fade-in ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`h-8 w-8 shrink-0 rounded-lg grid place-items-center ${m.role === "ai" ? "bg-[image:var(--gradient-primary)] text-white" : "bg-accent text-foreground"}`}>
                {m.role === "ai" ? <Sparkles className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "ai" ? "bg-card border border-border" : "bg-primary text-primary-foreground"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3 animate-fade-in">
              <div className="h-8 w-8 rounded-lg bg-[image:var(--gradient-primary)] text-white grid place-items-center"><Sparkles className="h-4 w-4" /></div>
              <div className="bg-card border border-border rounded-2xl px-4 py-3 flex gap-1">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:150ms]" />
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-border p-4 space-y-3">
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:bg-accent transition">
                {s}
              </button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2 h-12 rounded-xl border border-border bg-card/60 px-3 focus-within:ring-2 focus-within:ring-primary/50">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask BizPilot AI anything…" className="flex-1 bg-transparent outline-none text-sm" />
            <button type="submit" disabled={!input.trim()} className="h-9 px-3 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary hover:brightness-110 transition disabled:opacity-50 inline-flex items-center gap-1">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
