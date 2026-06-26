"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-store"
import { formatCurrency } from "@/lib/utils"

const emptyDraft = {
  title: "",
  description: "",
  reward: "",
  dueDate: "",
}

export default function DashboardPage() {
  const { tasks, orders, walletBalance, createTask, updateTask, deleteTask, checkoutOrder, setTaskStatus } = useApp()
  const [draft, setDraft] = useState(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)

  const stats = useMemo(() => ({
    openTasks: tasks.filter((task) => task.status !== "done").length,
    completedTasks: tasks.filter((task) => task.status === "done").length,
    orders: orders.length,
  }), [orders.length, tasks])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.title || !draft.description || !draft.reward) return
    if (editingId) {
      updateTask(editingId, {
        title: draft.title,
        description: draft.description,
        reward: Number(draft.reward),
        dueDate: draft.dueDate,
      })
    } else {
      createTask({
        title: draft.title,
        description: draft.description,
        reward: Number(draft.reward),
        dueDate: draft.dueDate,
      })
    }
    setDraft(emptyDraft)
    setEditingId(null)
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">Operations hub</p>
            <h1 className="mt-2 text-3xl font-semibold">Task board and delivery queue</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Create tasks, assign priorities, and publish checkout-ready orders that draw from your wallet balance.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-secondary px-4 py-3 text-sm">
            <p className="text-muted-foreground">Wallet balance</p>
            <p className="text-2xl font-semibold">{formatCurrency(walletBalance)}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Open tasks</p>
            <p className="mt-2 text-2xl font-semibold">{stats.openTasks}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="mt-2 text-2xl font-semibold">{stats.completedTasks}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Orders</p>
            <p className="mt-2 text-2xl font-semibold">{stats.orders}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Create or edit a task</h2>
              <p className="text-sm text-muted-foreground">Keep your task queue fresh for the next payout window.</p>
            </div>
            <Button variant="ghost" onClick={() => { setDraft(emptyDraft); setEditingId(null) }}>
              Reset
            </Button>
          </div>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              className="w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="Task title"
              value={draft.title}
              onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
            />
            <textarea
              className="min-h-28 w-full rounded-xl border border-border bg-background px-3 py-2"
              placeholder="Task details"
              value={draft.description}
              onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                className="w-full rounded-xl border border-border bg-background px-3 py-2"
                type="number"
                placeholder="Reward"
                value={draft.reward}
                onChange={(event) => setDraft((current) => ({ ...current, reward: event.target.value }))}
              />
              <input
                className="w-full rounded-xl border border-border bg-background px-3 py-2"
                type="date"
                value={draft.dueDate}
                onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))}
              />
            </div>
            <Button type="submit">{editingId ? "Save changes" : "Create task"}</Button>
          </form>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Ready for checkout</h2>
          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium">{task.status}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
                  <span>{formatCurrency(task.reward)}</span>
                  <span>Due {task.dueDate || "Flexible"}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => checkoutOrder(task)}>
                    Claim & pay
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => { setEditingId(task.id); setDraft({ title: task.title, description: task.description, reward: String(task.reward), dueDate: task.dueDate }) }}>
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => deleteTask(task.id)}>
                    Delete
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => setTaskStatus(task.id, task.status === "done" ? "todo" : "done")}>
                    Mark {task.status === "done" ? "todo" : "done"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
