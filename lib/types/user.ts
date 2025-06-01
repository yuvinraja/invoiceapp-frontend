export type User = {
  id: string
  email: string
  password: string
  name?: string
  company: string
  gstin?: string
  phone?: string
  mobile?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  logoUrl?: string
  
  bankDetail?: BankDetail
  settings?: UserSettings
  invoices?: Invoice[]
  clients?: Client[]
  
  createdAt: Date
  updatedAt: Date
}

export type BankDetail = {
  id: string
  userId: string
  bankName: string
  branch: string
  accountNo: string
  ifscCode: string
  
  user?: User
}

export type UserSettings = {
  id: string
  userId: string
  terms?: string
  
  user?: User
}

export type Client = {
  id: string
  userId: string
  name: string
  gstin?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  
  user?: User
  invoices?: Invoice[]
  
  createdAt: Date
}

export type Invoice = {
  id: string
  userId: string
  clientId?: string
  
  invoiceNumber: number
  invoiceType: InvoiceType
  taxType: TaxType
  taxRate: number
  
  invoiceDate: Date
  dueDate?: Date
  
  poNumber?: string
  vehicleNumber?: string
  transporter?: string
  bundleCount?: number
  
  notes?: string
  
  subtotal: number
  cgst?: number
  sgst?: number
  igst?: number
  total: number
  roundedTotal: number
  
  items?: Item[]
  user?: User
  client?: Client
  
  createdAt: Date
  updatedAt: Date
}

export type Item = {
  id: string
  invoiceId: string
  description: string
  hsnCode?: string
  quantity: number
  rate: number
  amount: number
  
  invoice?: Invoice
}

export enum InvoiceType {
  TAX = 'TAX',
  PROFORMA = 'PROFORMA'
}

export enum TaxType {
  CGST_SGST = 'CGST_SGST',
  IGST = 'IGST'
}