"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import api from "@/lib/axios";
import Protected from "@/components/auth/Protected";

type InvoiceSummary = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceType: "TAX" | "PROFORMA";
  taxType: "CGST_SGST" | "IGST";
  total: number;
  clientName: string;
};

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/invoices");
        setInvoices(res.data);
      } catch (err) {
        console.error("Error fetching invoices", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const handleView = (id: string) => {
    router.push(`/invoices/${id}`);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this invoice?"
    );
    if (!confirm) return;
    try {
      await api.delete(`/invoices/${id}`);
      setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete invoice");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <Protected>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">All Invoices</h1>

        {invoices.length === 0 ? (
          <p>No invoices found.</p>
        ) : (
          <div className="grid gap-4">
            {invoices.map((inv) => (
              <Card
                key={inv.id}
                className="p-4 flex items-center justify-between"
              >
                <div>
                  <h2 className="font-semibold">{inv.invoiceNumber}</h2>
                  <p className="text-sm text-muted-foreground">
                    {inv.clientName} —{" "}
                    {format(new Date(inv.invoiceDate), "dd MMM yyyy")}
                  </p>
                  <p className="text-sm mt-1">Total: ₹{inv.total.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={inv.invoiceType === "TAX" ? "default" : "outline"}
                  >
                    {inv.invoiceType}
                  </Badge>
                  <Button
                    variant="secondary"
                    onClick={() => handleView(inv.id)}
                  >
                    View
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(inv.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Protected>
  );
}
