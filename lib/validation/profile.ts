import { z } from "zod";

export const profileSchema = z.object({
  company: z.string().min(1),
  gstin: z.string().min(1),
  phone: z.string().min(5),
  mobile: z.string().min(5),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  pincode: z.string().min(4),
  logoUrl: z.string().url().optional(),
  bank: z.object({
    bankName: z.string(),
    branch: z.string(),
    accountNo: z.string(),
    ifscCode: z.string(),
  }),
  terms: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
