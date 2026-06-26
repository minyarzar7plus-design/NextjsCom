"use client"

import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-store"
import { formatCurrency } from "@/lib/utils"

export default function OrdersPage() {
  const { tasks, orders, walletBalance, checkoutOrder } = useApp()

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Orders and checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review your current orders, pay from your wallet, and keep the flow moving without leaving the dashboard.
        </p>
        <div className="mt-4 rounded-2xl border border-border bg-background p-4 text-sm">
          <p className="text-muted-foreground">Available wallet balance</p>
          <p className="mt-1 text-2xl font-semibold">{formatCurrency(walletBalance)}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Deck of available tasks</h2>
          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(task.reward)}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{task.status}</span>
                  <Button size="sm" onClick={() => checkoutOrder(task)}>
                    Checkout
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent orders</h2>
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{order.title}</p>
                    <p className="text-sm text-muted-foreground">{order.paymentMethod} • {order.status}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatCurrency(order.amount)}</span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">{order.purchasedAt}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
