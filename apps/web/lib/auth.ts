"use server";

import { redirect } from "next/navigation";
import { FormState, LoginFormSchema, SignupFormSchema } from "./type";
import { BACKEND_URL } from "./constants";
import { log } from "console";
import { createSession } from "./session";

export async function signUp(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validateFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return {
      error: validateFields.error.flatten().fieldErrors,
    };
  }

  try {
    const response = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validateFields.data),
    });
    if (response.ok) {
      redirect("/auth/signin");
    } else {
      return {
        message:
          response.status === 409 ? "User already exists" : response.statusText,
      };
    }
  } catch (error) {
    return {
      message: "something went wrong",
    };
  }
}

export async function signIn(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  const validateFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success)
    return {
      error: validateFields.error.flatten().fieldErrors,
    };

  const response = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(validateFields.data),
  });

  if (response.ok) {
    const result = await response.json();
    //create session for authenticated user
    await createSession({
      user: {
        id: result.id,
        name: result.name,
      },
      accessToken: result.accessToken,
    });
    redirect("/");
    console.log({ result });
  } else {
    return {
      message:
        response.status === 401 ? "invalid credentials" : response.statusText,
    };
  }
}
