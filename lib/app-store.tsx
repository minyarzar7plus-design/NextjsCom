"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type TaskStatus = "todo" | "in-progress" | "done"
export type OrderStatus = "pending" | "paid" | "completed"
export type TransactionType = "deposit" | "withdraw" | "payment" | "earn"

export type Task = {
  id: string
  title: string
  description: string
  reward: number
  status: TaskStatus
  owner: string
  dueDate: string
}

export type Order = {
  id: string
  title: string
  amount: number
  status: OrderStatus
  paymentMethod: "wallet"
  purchasedAt: string
}

export type Transaction = {
  id: string
  type: TransactionType
  amount: number
  description: string
  date: string
}

export type Profile = {
  name: string
  email: string
  role: "member" | "admin"
  bio: string
  timezone: string
}

type DemoState = {
  isAuthenticated: boolean
  profile: Profile
  tasks: Task[]
  orders: Order[]
  walletBalance: number
  transactions: Transaction[]
}

type AppContextValue = DemoState & {
  login: (email: string, password: string) => void
  signup: (name: string, email: string, password: string) => void
  logout: () => void
  createTask: (task: Omit<Task, "id" | "owner" | "status">) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  checkoutOrder: (task: Task) => void
  addFunds: (amount: number) => void
  withdrawFunds: (amount: number) => void
  updateProfile: (updates: Partial<Profile>) => void
  setTaskStatus: (id: string, status: TaskStatus) => void
}

const STORAGE_KEY = "task-commerce-demo"
const defaultProfile: Profile = {
  name: "Aye Aye",
  email: "demo@taskcommerce.app",
  role: "admin",
  bio: "Operations lead for local task commerce demos.",
  timezone: "UTC+7",
}

const createInitialState = (): DemoState => ({
  isAuthenticated: false,
  profile: defaultProfile,
  tasks: [
    {
      id: "task-1",
      title: "Product copy polish",
      description: "Refine the homepage hero copy for the launch campaign.",
      reward: 120,
      status: "in-progress",
      owner: "Aye Aye",
      dueDate: "2026-06-30",
    },
    {
      id: "task-2",
      title: "Support reply bundle",
      description: "Draft onboarding and billing replies for the next week.",
      reward: 85,
      status: "todo",
      owner: "Aye Aye",
      dueDate: "2026-07-02",
    },
  ],
  orders: [
    {
      id: "order-1",
      title: "Priority task claim",
      amount: 120,
      status: "paid",
      paymentMethod: "wallet",
      purchasedAt: "2026-06-24",
    },
  ],
  walletBalance: 240,
  transactions: [
    {
      id: "txn-1",
      type: "earn",
      amount: 240,
      description: "Welcome wallet credit",
      date: "2026-06-20",
    },
    {
      id: "txn-2",
      type: "payment",
      amount: -120,
      description: "Paid for a priority task claim",
      date: "2026-06-24",
    },
  ],
})

const AppContext = createContext<AppContextValue | undefined>(undefined)

function setSessionCookie(isAuthenticated: boolean) {
  if (typeof document === "undefined") return
  document.cookie = `task-commerce-auth=${isAuthenticated ? "1" : ""}; path=/; max-age=${isAuthenticated ? 60 * 60 * 24 * 7 : 0}; samesite=lax`
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>(createInitialState)
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as DemoState
        setState(parsed)
      }
    } catch {
      // Fall back to defaults when local storage is unavailable.
    } finally {
      setHasHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    setSessionCookie(state.isAuthenticated)
  }, [hasHydrated, state])

  const value = useMemo<AppContextValue>(() => ({
    ...state,
    login: (email: string, password: string) => {
      setState((current) => ({
        ...current,
        isAuthenticated: true,
        profile: {
          ...current.profile,
          email,
          name: email.split("@")?.[0] ?? current.profile.name,
        },
      }))
    },
    signup: (name: string, email: string, password: string) => {
      setState((current) => ({
        ...current,
        isAuthenticated: true,
        profile: {
          ...current.profile,
          name,
          email,
          role: "member",
        },
      }))
    },
    logout: () => {
      setState((current) => ({ ...current, isAuthenticated: false }))
    },
    createTask: (task) => {
      setState((current) => ({
        ...current,
        tasks: [
          {
            id: `task-${Date.now()}`,
            title: task.title,
            description: task.description,
            reward: task.reward,
            status: "todo",
            owner: current.profile.name,
            dueDate: task.dueDate,
          },
          ...current.tasks,
        ],
      }))
    },
    updateTask: (id, updates) => {
      setState((current) => ({
        ...current,
        tasks: current.tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)),
      }))
    },
    deleteTask: (id) => {
      setState((current) => ({
        ...current,
        tasks: current.tasks.filter((task) => task.id !== id),
      }))
    },
    checkoutOrder: (task) => {
      setState((current) => {
        if (current.walletBalance < task.reward) {
          return current
        }
        return {
          ...current,
          walletBalance: current.walletBalance - task.reward,
          orders: [
            {
              id: `order-${Date.now()}`,
              title: task.title,
              amount: task.reward,
              status: "paid",
              paymentMethod: "wallet",
              purchasedAt: new Date().toISOString().slice(0, 10),
            },
            ...current.orders,
          ],
          transactions: [
            {
              id: `txn-${Date.now()}`,
              type: "payment",
              amount: -task.reward,
              description: `Paid for ${task.title}`,
              date: new Date().toISOString().slice(0, 10),
            },
            ...current.transactions,
          ],
        }
      })
    },
    addFunds: (amount) => {
      setState((current) => ({
        ...current,
        walletBalance: current.walletBalance + amount,
        transactions: [
          {
            id: `txn-${Date.now()}`,
            type: "deposit",
            amount,
            description: `Added ${amount} to wallet`,
            date: new Date().toISOString().slice(0, 10),
          },
          ...current.transactions,
        ],
      }))
    },
    withdrawFunds: (amount) => {
      setState((current) => {
        if (current.walletBalance < amount) {
          return current
        }
        return {
          ...current,
          walletBalance: current.walletBalance - amount,
          transactions: [
            {
              id: `txn-${Date.now()}`,
              type: "withdraw",
              amount: -amount,
              description: `Withdrew ${amount} from wallet`,
              date: new Date().toISOString().slice(0, 10),
            },
            ...current.transactions,
          ],
        }
      })
    },
    updateProfile: (updates) => {
      setState((current) => ({
        ...current,
        profile: { ...current.profile, ...updates },
      }))
    },
    setTaskStatus: (id, status) => {
      setState((current) => ({
        ...current,
        tasks: current.tasks.map((task) => (task.id === id ? { ...task, status } : task)),
      }))
    },
  }), [state, hasHydrated])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
