import Protected from "@/components/auth/Protected"

export default function DashboardPage() {
  return (
    <Protected>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Welcome! This is a protected page.</p>
      </div>
    </Protected>
  )
}
