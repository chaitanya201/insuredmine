import z from "zod";

export const getPolicyInfoSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .regex(/^[A-Za-z ]+$/, "Username must contain only letters and spaces"),
});

export const uploadPolicySchema = z.object({
  policyFileName: z.string().refine(
    (name) => {
      const validExtensions = [".xlsx", ".csv"];
      return validExtensions.some((ext) => name.endsWith(ext));
    },
    {
      message: "File must be an Excel or CSV file",
    }
  ),
});

export const policyRowSchema = z.object({
  agent: z.string().min(1),
  userType: z.string().min(1),
  policy_mode: z.number().or(z.string()),
  producer: z.string().min(1),
  policy_number: z.string().min(1),
  premium_amount_written: z.number().optional().nullable(),
  premium_amount: z.number().or(z.string()),
  policy_type: z.string().min(1),
  company_name: z.string().min(1),
  category_name: z.string().min(1),
  policy_start_date: z.string().min(1),
  policy_end_date: z.string().min(1),
  csr: z.string().optional(),
  account_name: z.string().min(1),
  email: z.string().email(),
  gender: z.string().optional().nullable(),
  firstname: z.string().min(1),
  city: z.string().optional(),
  account_type: z.string().optional(),
  phone: z.string().min(1),
  address: z.string().optional(),
  state: z.string().optional(),
  zip: z.number().optional().or(z.string().optional()),
  dob: z.string().min(1),
  primary: z.string().optional().nullable(),
  "Applicant ID": z.any().optional(),
  agency_id: z.any().optional(),
  "hasActive ClientPolicy": z.boolean().optional(),
});
