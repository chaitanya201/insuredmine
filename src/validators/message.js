import z from "zod";

export const saveScheduledMessageSchema = z.object({
  message: z.string().min(1, "Message is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((dateStr) => !isNaN(Date.parse(dateStr)), {
      message: "Invalid date",
    }),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:MM format"),
});
