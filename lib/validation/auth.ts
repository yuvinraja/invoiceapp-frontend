import { z } from "zod"

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  company: z.string().min(1),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
