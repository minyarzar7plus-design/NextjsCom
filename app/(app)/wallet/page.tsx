"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-store"
import { formatCurrency } from "@/lib/utils"

export default function WalletPage() {
  const { walletBalance, transactions, addFunds, withdrawFunds } = useApp()
  const [amount, setAmount] = useState("50")

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Wallet and payments</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Top up your wallet or move funds out with one-click actions that update your activity feed instantly.
        </p>
        <div className="mt-6 rounded-2xl border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Current balance</p>
          <p className="mt-2 text-4xl font-semibold">{formatCurrency(walletBalance)}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Manage funds</h2>
          <div className="mt-4 space-y-4">
            <input
              className="w-full rounded-xl border border-border bg-background px-3 py-2"
              type="number"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <div className="flex gap-3">
              <Button onClick={() => addFunds(Number(amount) || 0)}>Deposit</Button>
              <Button variant="outline" onClick={() => withdrawFunds(Number(amount) || 0)}>Withdraw</Button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Recent activity</h2>
          <div className="mt-4 space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="rounded-2xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">{transaction.date}</p>
                  </div>
                  <span className={`text-sm font-semibold ${transaction.amount > 0 ? "text-success" : "text-destructive"}`}>
                    {transaction.amount > 0 ? "+" : ""}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
