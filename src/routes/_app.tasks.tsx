import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Plus } from "lucide-react";
import { PageHeader, Card, Badge } from "@/components/layout/PageHeader";
import { tasks as seed } from "@/lib/mock-data";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const [items, setItems] = useState(seed);
  const [text, setText] = useState("");

  const cols = [
    { key: "Todo", tone: "default" as const },
    { key: "In Progress", tone: "info" as const },
    { key: "Blocked", tone: "destructive" as const },
  ];

  const add = () => {
    if (!text.trim()) return;
    setItems((it) => [...it, { id: it.length + 1, title: text, assignee: "You", due: "Today", status: "Todo", priority: "Medium" }]);
    setText("");
    toast.success("Task added");
  };

  const toggle = (id: number) => {
    setItems((it) => it.map((t) => t.id === id ? { ...t, status: t.status === "Todo" ? "In Progress" : t.status === "In Progress" ? "Todo" : t.status } : t));
  };

  return (
    <>
      <PageHeader title="Tasks" description="Your work and team tasks in one board." icon={ListChecks} />
      <Card className="mb-6">
        <div className="flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add a task…" className="flex-1 h-10 rounded-lg border border-border bg-card/60 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/50" />
          <button onClick={add} className="h-10 px-4 rounded-lg bg-[image:var(--gradient-primary)] text-white text-sm font-medium glow-primary inline-flex items-center gap-2"><Plus className="h-4 w-4" /> Add</button>
        </div>
      </Card>

      <div className="grid md:grid-cols-3 gap-4">
        {cols.map((c) => (
          <Card key={c.key}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-medium">{c.key}</div>
              <Badge tone={c.tone}>{items.filter((t) => t.status === c.key).length}</Badge>
            </div>
            <ul className="space-y-2">
              {items.filter((t) => t.status === c.key).map((t) => (
                <li key={t.id} onClick={() => toggle(t.id)} className="p-3 rounded-lg border border-border hover:bg-accent/40 cursor-pointer transition">
                  <div className="text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{t.assignee} · {t.due}</div>
                  <div className="mt-2"><Badge tone={t.priority === "High" ? "destructive" : t.priority === "Medium" ? "warning" : "default"}>{t.priority}</Badge></div>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}
