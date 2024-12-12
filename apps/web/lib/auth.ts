"use server";

import { redirect } from "next/navigation";
import { FormState, LoginFormSchema, SignupFormSchema } from "./type";
import { BACKEND_URL } from "./constants";
import { createSession, updateTokens } from "./session";

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
        role: result.role,
      },
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
    redirect("/");
  } else {
    return {
      message:
        response.status === 401 ? "invalid credentials" : response.statusText,
    };
  }
}

export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: oldRefreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const { accessToken, refreshToken } = await response.json();
    await updateTokens({ accessToken, refreshToken });

    const updateRes = await fetch("http://localhost:3000/api/auth/update", {
      method: "POST",
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });

    if (!updateRes.ok) throw new Error("failed to update the tokens");
    return accessToken;
  } catch (err) {
    console.error("refresh token failed: ", err);
    return null;
  }
};
