// types/user.ts
export type User = {
  id: string;
  email: string;
  password: string;
  name?: string;
  company: string;
  gstin?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  logoUrl?: string;
  bankDetail?: BankDetail;
  settings?: UserSettings;
  createdAt: Date;
  updatedAt: Date;
};

export type BankDetail = {
  id: string;
  userId: string;
  bankName: string;
  branch: string;
  accountNo: string;
  ifscCode: string;
};

export type UserSettings = {
  id: string;
  userId: string;
  terms?: string;
};
