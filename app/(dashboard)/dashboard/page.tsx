"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,

} from "recharts";

import { FileText, IndianRupee, TrendingUp, Users } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";


// Interface for what your API actually returns
interface ApiResponse {
  totalInvoices: number;
  totalRevenue: number;
  averageInvoiceValue: number;
  byInvoiceType: {
    [key: string]: number;
  };
  byTaxType: {
    [key: string]: number;
  };
}

// Interface for what your component uses (transformed data)
interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  averageInvoiceValue: number;
  invoicesByType: Array<{ type: string; count: number }>;
  invoicesByTaxType: Array<{ taxType: string; count: number }>;
  topClients: Array<{
    name: string;
    invoiceCount: number;
    totalAmount: number;
  }>;
}

const CHART_COLORS = [
  "var(--chart-1, #0088FE)",
  "var(--chart-2, #00C49F)",
  "var(--chart-3, #FFBB28)",
  "var(--chart-4, #FF8042)",
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [summaryResponse, topClientsResponse] = await Promise.all([
        api.get("/stats/summary"),
        api.get("/stats/topclients"),
      ]);

      const summaryData: ApiResponse = summaryResponse.data;

      // Transform the data to match what your charts expect
      const transformedStats: DashboardStats = {
        totalInvoices: summaryData.totalInvoices,
        totalRevenue: summaryData.totalRevenue,
        averageInvoiceValue: summaryData.averageInvoiceValue,

        // Transform byInvoiceType object to array format
        invoicesByType: Object.entries(summaryData.byInvoiceType || {}).map(
          ([type, count]) => ({
            type,
            count,
          })
        ),

        // Transform byTaxType object to array format
        invoicesByTaxType: Object.entries(summaryData.byTaxType || {}).map(
          ([taxType, count]) => ({
            taxType: taxType.replace("_", "+"), // Convert CGST_SGST to CGST+SGST
            count,
          })
        ),

        topClients: topClientsResponse.data || [],
      };
      
      setStats(transformedStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse mb-2" />
                <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your invoice management system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInvoices || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time invoices created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{(stats.totalRevenue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Total invoice amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Invoice
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{Math.round(stats.averageInvoiceValue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Per invoice average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(stats.topClients || []).length}
            </div>
            <p className="text-xs text-muted-foreground">Active clients</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Invoice Types Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Types</CardTitle>
            <CardDescription>
              Distribution of TAX vs PROFORMA invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-72 flex items-center justify-center">
              <BarChart
                data={stats.invoicesByType || []}
                width={400}
                height={250}
                className="w-full"
              >
                <XAxis dataKey="type" stroke="var(--muted-foreground, #888)" />
                <YAxis stroke="var(--muted-foreground, #888)" />
                <Tooltip />
                <Bar
                  dataKey="count"
                  fill="var(--chart-1, #0088FE)"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </div>
          </CardContent>
        </Card>

        {/* Tax Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Types</CardTitle>
            <CardDescription>CGST+SGST vs IGST distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-72 flex items-center justify-center">
              <PieChart width={400} height={250} className="w-full">
                <Pie
                  data={stats.invoicesByTaxType || []}
                  dataKey="count"
                  nameKey="taxType"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({percent }) =>
                    `${(percent * 100).toFixed(0)}%`
                  }
                >
                  {(stats.invoicesByTaxType || []).map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={CHART_COLORS[idx % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Top Clients</CardTitle>
          <CardDescription>Clients with highest invoice count</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(stats.topClients || []).map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {client.invoiceCount || 0} invoices
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ₹{(client.totalAmount || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total amount</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
