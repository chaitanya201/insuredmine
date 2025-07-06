import z from "zod";

export const getPolicyInfoSchema = z.object({
  username: z.string().min(1, "Username is required"),
});
