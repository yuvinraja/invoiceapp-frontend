// lib/api/invoices.ts
import api from "@/lib/axios";
import { Invoice } from "@/lib/types/user";

export async function getInvoiceById(id: string): Promise<Invoice> {
  const response = await api.get(`/invoices/${id}`);
  return response.data;
}
