"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/axios";
import Protected from "@/components/auth/Protected";

const COLORS = ["#3b82f6", "#10b981", "#facc15", "#ef4444", "#a855f7"];

export default function DashboardPage() {
  interface Stats {
    totalInvoices: number;
    totalRevenue: number;
    averageInvoiceValue: number;
    byInvoiceType: Record<string, number>;
    byTaxType: Record<string, number>;
  }

  const [stats, setStats] = useState<Stats | null>(null);
  interface Client {
    clientId: string;
    name: string;
    invoiceCount: number;
  }

  const [topClients, setTopClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, clientsRes] = await Promise.all([
          api.get("/stats/summary"),
          api.get("/stats/topclients"),
        ]);
        setStats(statsRes.data);
        setTopClients(clientsRes.data);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  const typeData = Object.entries(stats.byInvoiceType).map(([type, count]) => ({
    type,
    count,
  }));
  const taxData = Object.entries(stats.byTaxType).map(([type, count]) => ({
    type,
    count,
  }));

  return (
    <Protected>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.totalInvoices}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ₹{stats.totalRevenue.toFixed(2)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Average Invoice Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                ₹{stats.averageInvoiceValue.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={typeData}>
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Type Split</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={taxData}
                    dataKey="count"
                    nameKey="type"
                    outerRadius={80}
                    label
                  >
                    {taxData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Clients */}
        <Card>
          <CardHeader>
            <CardTitle>Top Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {topClients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clients yet.</p>
            ) : (
              <ul className="space-y-2">
                {topClients.map((c, i) => (
                  <li
                    key={c.clientId}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {i + 1}. {c.name}
                    </span>
                    <Badge variant="outline">{c.invoiceCount} invoices</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
