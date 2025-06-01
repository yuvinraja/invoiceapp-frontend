"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import api from "@/lib/axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import Protected from "@/components/auth/Protected";

const companySchema = z.object({
  name: z.string().optional(),
  company: z.string().min(1),
  gstin: z.string().optional(),
  phone: z.string().optional(),
  mobile: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  logoUrl: z.string().optional(),
});

const bankSchema = z.object({
  bankName: z.string().min(1),
  branch: z.string().min(1),
  accountNo: z.string().min(1),
  ifscCode: z.string().min(1),
});

const termsSchema = z.object({
  terms: z.string().optional(),
});

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  const companyForm = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {},
  });
  const bankForm = useForm({
    resolver: zodResolver(bankSchema),
    defaultValues: {},
  });
  const termsForm = useForm({
    resolver: zodResolver(termsSchema),
    defaultValues: {},
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/user/me");
        const user = res.data.user;

        companyForm.reset({
          ...user,
        });

        if (user.bankDetail) {
          bankForm.reset(user.bankDetail);
        }

        if (user.settings) {
          termsForm.reset(user.settings);
        }
      } catch (err) {
        toast.error("Failed to load user settings.");
        console.error("Settings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [bankForm, companyForm, termsForm]);

  if (loading) return <p className="p-6 text-muted-foreground">Loading...</p>;

  return (
    <Protected>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-2xl font-bold">Settings</h1>

        {/* Company Info */}
        <Card>
          <CardHeader>
            <CardTitle>Company Info</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...companyForm}>
              <form
                onSubmit={companyForm.handleSubmit(async (data) => {
                  try {
                    await api.patch("/user/me", data);
                    toast.success("Company info updated");
                  } catch {
                    toast.error("Failed to update company info");
                  }
                })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {[
                  "company",
                  "gstin",
                  "phone",
                  "mobile",
                  "address",
                  "city",
                  "state",
                  "pincode",
                  "logoUrl",
                ].map((field) => (
                  <FormField
                    key={field}
                    name={field as keyof typeof companySchema.shape}
                    control={companyForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{field.name}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
                <Button type="submit" className="col-span-full w-fit mt-2">
                  Save Company Info
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...bankForm}>
              <form
                onSubmit={bankForm.handleSubmit(async (data) => {
                  try {
                    await api.patch("/user/me/bank", data);
                    toast.success("Bank details updated");
                  } catch {
                    toast.error("Failed to update bank details");
                  }
                })}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {["bankName", "branch", "accountNo", "ifscCode"].map(
                  (field) => (
                    <FormField
                      key={field}
                      name={
                        field as
                          | "bankName"
                          | "branch"
                          | "accountNo"
                          | "ifscCode"
                      }
                      control={bankForm.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{field.name}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )
                )}
                <Button type="submit" className="col-span-full w-fit mt-2">
                  Save Bank Info
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Default Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...termsForm}>
              <form
                onSubmit={termsForm.handleSubmit(async (data) => {
                  try {
                    await api.patch("/user/me/settings", data);
                    toast.success("Terms updated");
                  } catch {
                    toast.error("Failed to update terms");
                  }
                })}
                className="space-y-4"
              >
                <FormField
                  name="terms"
                  control={termsForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Terms</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Terms</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Protected>
  );
}
