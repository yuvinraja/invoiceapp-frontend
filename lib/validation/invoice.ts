import { z } from "zod"

export const invoiceSchema = z.object({
  invoiceType: z.enum(["TAX", "PROFORMA"]),
  taxType: z.enum(["CGST_SGST", "IGST"]),
  invoiceDate: z.string().min(1),
  poNumber: z.string().optional(),
  vehicleNumber: z.string().optional(),
  transporter: z.string().optional(),
  bundleCount: z.number().min(0).optional(),
  taxRate: z.number().min(0),
  client: z.object({
    name: z.string().min(1),
    gstin: z.string().optional(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string()
  }),
  items: z
    .array(
      z.object({
        description: z.string().min(1),
        hsnCode: z.string(),
        quantity: z.number().min(1),
        rate: z.number().min(0)
      })
    )
    .min(1)
})

export type InvoiceInput = z.infer<typeof invoiceSchema>
