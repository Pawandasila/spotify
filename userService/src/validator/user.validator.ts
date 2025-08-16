import z from "zod";

export const emailSchema = z
  .string()
  .email("Invalid Email Format")
  .trim()
  .min(1)
  .max(255, "Email cannot be more then 255 charater");

export const passwordSchema = z
  .string()
  .trim()
  .min(4, "password must be atleast 4 charater long");

export const UserRegisterSchema = z.object({
  name: z.string().trim().min(1, "name cannot be empty").max(255),
  email: emailSchema,
  password: passwordSchema,
  role: z.enum(["user", "admin"]).optional().default("user"),
});

export const UserLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type RegisterService = z.infer<typeof UserRegisterSchema>

export type LoginService = z.infer<typeof UserLoginSchema>