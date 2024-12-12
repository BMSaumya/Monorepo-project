import { z } from "zod";

export type FormState =
  | {
      error?: {
        name?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "name must be at least 2 characters long" })
    .trim(),

  email: z.string().email({ message: "please enter a valid email" }).trim(),

  password: z
    .string()
    .min(8, { message: "at least 8 characters long" })
    .regex(/[a-zA-Z]/, { message: "contain at least one letter" })
    .regex(/[0-9]/, { message: "contain at least one number" })
    .regex(/[^a-zA-Z0-9]/, {
      message: "contain at least one special character",
    })
    .trim(),
});

export const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(1, { message: "Password must not be empty" }),
});

export enum Role {
  ADMIN = "ADMIN",
  EDITOR = "EDITOR",
  USER = "USER",
}
