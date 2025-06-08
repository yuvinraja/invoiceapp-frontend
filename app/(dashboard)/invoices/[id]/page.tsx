"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Loader2 } from "lucide-react";
import { InvoicePDF } from "@/components/invoice/InvoicePDF";
import { Button } from "@/components/ui/button";
import Protected from "@/components/auth/Protected";
import api from "@/lib/axios";
import { Invoice } from "@/lib/types/user";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/invoices/${id}`);
        setInvoice(res.data);
      } catch (err) {
        console.error("Error fetching invoice", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (!invoice) {
    return <p className="text-center mt-12 text-red-500">Invoice not found.</p>;
  }

  return (
    <Protected>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>

        <div className="flex items-center gap-4">
          <PDFDownloadLink
            document={<InvoicePDF data={invoice} />}
            fileName={`invoice-${invoice.invoiceNumber}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <Button disabled>Generating PDF...</Button>
              ) : (
                <Button>Download PDF</Button>
              )
            }
          </PDFDownloadLink>
        </div>

        <div className="border rounded-md overflow-hidden h-[90vh]">
          <PDFViewer style={{ width: "100%", height: "100%" }}>
            <InvoicePDF data={invoice} />
          </PDFViewer>
        </div>
      </div>
    </Protected>
  );
}
