/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema, InvoiceInput } from "@/lib/validation/invoice";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import api from "@/lib/axios";
import { useState } from "react";

import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/invoice/InvoicePDF";

export default function CreateInvoicePage() {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {},
  } = useForm<InvoiceInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceType: "TAX",
      taxType: "CGST_SGST",
      invoiceDate: new Date().toISOString().split("T")[0],
      taxRate: 18,
      items: [{ description: "", hsnCode: "", quantity: 1, rate: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [loading, setLoading] = useState(false);
  const [submittedData, setSubmittedData] = useState<InvoiceInput | null>(null);

  const onSubmit = async (data: InvoiceInput) => {
    setLoading(true);
    try {
      await api.post("/invoices", data);
      setSubmittedData(data); // Store submitted data for PDF
      alert("Invoice created!");
    } catch (err) {
      console.error(err);
      alert("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  // Subtotal
  const items = watch("items");
  const taxType = watch("taxType");
  const taxRate = watch("taxRate");
  const invoiceType = watch("invoiceType");
  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const cgst = taxType === "CGST_SGST" ? (subtotal * taxRate) / 200 : 0;
  const sgst = taxType === "CGST_SGST" ? (subtotal * taxRate) / 200 : 0;
  const igst = taxType === "IGST" ? (subtotal * taxRate) / 100 : 0;
  const total = subtotal + cgst + sgst + igst;
  const roundedTotal = Math.round(total);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Invoice</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Invoice type & tax */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Invoice Type</Label>
            <Select
              onValueChange={(val) => setValue("invoiceType", val as any)}
              defaultValue="TAX"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TAX">Tax Invoice</SelectItem>
                <SelectItem value="PROFORMA">Proforma Invoice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tax Type</Label>
            <Select
              onValueChange={(val) => setValue("taxType", val as any)}
              defaultValue="CGST_SGST"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CGST_SGST">CGST + SGST</SelectItem>
                <SelectItem value="IGST">IGST</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tax Rate (%)</Label>
            <Input
              type="number"
              step="0.01"
              {...register("taxRate", { valueAsNumber: true })}
            />
          </div>
        </div>

        {/* Invoice Meta */}
        {invoiceType === "TAX" && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Invoice Number</Label>
              <Input
                type="number"
                {...register("invoiceNumber", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>PO Number</Label>
              <Input {...register("poNumber")} />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" {...register("invoiceDate")} />
            </div>
            <div>
              <Label>Vehicle Number</Label>
              <Input {...register("vehicleNumber")} />
            </div>
            <div>
              <Label>Transporter</Label>
              <Input {...register("transporter")} />
            </div>
            <div>
              <Label>No. of Bundles</Label>
              <Input
                type="number"
                {...register("bundleCount", { valueAsNumber: true })}
              />
            </div>
          </div>
        )}

        {invoiceType === "PROFORMA" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice Number</Label>
              <Input
                type="number"
                {...register("invoiceNumber", { valueAsNumber: true })}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input type="date" {...register("invoiceDate")} />
            </div>
          </div>
        )}

        {/* Client */}
        <Card className="p-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Client Details</h2>
          <div className="grid grid-cols-3 gap-4">
            <Input {...register("client.name")} placeholder="Client Name" />
            <Input {...register("client.gstin")} placeholder="GSTIN" />
            <Input {...register("client.address")} placeholder="Address" />
            <Input {...register("client.city")} placeholder="City" />
            <Input {...register("client.state")} placeholder="State" />
            <Input {...register("client.pincode")} placeholder="Pincode" />
          </div>

          {invoiceType === "TAX" && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Input
                {...register("client.shippingName")}
                placeholder="Shipping Name"
              />
              <Input
                {...register("client.shippingAddress")}
                placeholder="Shipping Address"
              />
              <Input
                {...register("client.shippingCity")}
                placeholder="Shipping City"
              />
              <Input
                {...register("client.shippingState")}
                placeholder="Shipping State"
              />
              <Input
                {...register("client.shippingPincode")}
                placeholder="Shipping Pincode"
              />
            </div>
          )}
        </Card>

        {/* Item List */}
        <Card className="p-4 mt-4">
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-5 gap-4 items-end mb-2"
            >
              <Input
                placeholder="Description"
                {...register(`items.${index}.description`)}
              />
              <Input
                placeholder="HSN Code"
                {...register(`items.${index}.hsnCode`)}
              />
              <Input
                type="number"
                placeholder="Qty"
                {...register(`items.${index}.quantity`, {
                  valueAsNumber: true,
                })}
              />
              <Input
                type="number"
                placeholder="Rate"
                {...register(`items.${index}.rate`, { valueAsNumber: true })}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
              >
                Delete
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ description: "", hsnCode: "", quantity: 1, rate: 0 })
            }
          >
            + Add Item
          </Button>
        </Card>

        {/* Totals */}
        <Card className="p-4 mt-4 space-y-2 text-right">
          <p>Subtotal: ₹{subtotal.toFixed(2)}</p>
          {taxType === "CGST_SGST" && (
            <>
              <p>CGST: ₹{cgst.toFixed(2)}</p>
              <p>SGST: ₹{sgst.toFixed(2)}</p>
            </>
          )}
          {taxType === "IGST" && <p>IGST: ₹{igst.toFixed(2)}</p>}
          <p className="font-semibold text-lg">Total: ₹{roundedTotal}</p>
        </Card>

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Generate Invoice"}
        </Button>
      </form>

      {submittedData && (
        <div className="space-y-4 mt-6">
          <PDFDownloadLink
            document={<InvoicePDF data={submittedData} />}
            fileName="invoice.pdf"
            className="inline-block"
          >
            {({ loading }) =>
              loading ? "Generating PDF..." : <Button>Download PDF</Button>
            }
          </PDFDownloadLink>
          <div className="border h-[80vh]">
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <InvoicePDF data={submittedData} />
            </PDFViewer>
          </div>
        </div>
      )}
    </div>
  );
}
