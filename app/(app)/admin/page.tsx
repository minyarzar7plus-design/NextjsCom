"use client"

import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-store"
import { formatCurrency } from "@/lib/utils"

export default function AdminPage() {
  const { profile, tasks, orders, walletBalance, setTaskStatus } = useApp()

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Admin workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {profile.name} is viewing the control center for queue approvals and payout activity.
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Tasks</p>
            <p className="mt-2 text-2xl font-semibold">{tasks.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Orders</p>
            <p className="mt-2 text-2xl font-semibold">{orders.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Liquidity</p>
            <p className="mt-2 text-2xl font-semibold">{formatCurrency(walletBalance)}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Queue approvals</h2>
        <div className="mt-4 space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">Reward {formatCurrency(task.reward)} • Owner {task.owner}</p>
                </div>
                <Button size="sm" variant={task.status === "done" ? "secondary" : "default"} onClick={() => setTaskStatus(task.id, task.status === "done" ? "todo" : "done")}>
                  {task.status === "done" ? "Reopen" : "Approve"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
