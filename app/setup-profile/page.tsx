/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileInput } from "@/lib/validation/profile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axios";
import Protected from "@/components/auth/Protected";

export default function SetupProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      company: user?.company ?? "",
      gstin: "",
      phone: "",
      mobile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      logoUrl: "",
      terms: "",
      bank: {
        bankName: "",
        branch: "",
        accountNo: "",
        ifscCode: "",
      },
    },
  });

  const onSubmit = async (values: ProfileInput) => {
    setSubmitting(true);
    try {
      await api.post("/user/setup-profile", values);
      router.push("/create-invoice");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!loading && user?.bankDetail) {
      router.push("/create-invoice");
    }
  }, [user, loading, router]);

  return (
    <Protected>
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Setup Profile</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input {...form.register("company")} />
            </div>
            <div>
              <Label>GSTIN</Label>
              <Input {...form.register("gstin")} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input {...form.register("phone")} />
            </div>
            <div>
              <Label>Mobile</Label>
              <Input {...form.register("mobile")} />
            </div>
            <div>
              <Label>Address</Label>
              <Input {...form.register("address")} />
            </div>
            <div>
              <Label>City</Label>
              <Input {...form.register("city")} />
            </div>
            <div>
              <Label>State</Label>
              <Input {...form.register("state")} />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input {...form.register("pincode")} />
            </div>
            <div>
              <Label>Company Logo URL (optional)</Label>
              <Input {...form.register("logoUrl")} />
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="font-semibold text-lg mb-2">Bank Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Bank Name</Label>
                <Input {...form.register("bank.bankName")} />
              </div>
              <div>
                <Label>Branch</Label>
                <Input {...form.register("bank.branch")} />
              </div>
              <div>
                <Label>Account No</Label>
                <Input {...form.register("bank.accountNo")} />
              </div>
              <div>
                <Label>IFSC Code</Label>
                <Input {...form.register("bank.ifscCode")} />
              </div>
            </div>
          </div>

          <div>
            <Label>Terms & Conditions (optional)</Label>
            <Input {...form.register("terms")} />
          </div>

          <Button type="submit" disabled={submitting}>
            {submitting ? "Saving..." : "Save & Continue"}
          </Button>
        </form>
      </div>
    </Protected>
  );
}
