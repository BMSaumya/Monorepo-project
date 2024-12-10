"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { signUp } from "@/lib/auth";
import React, { useActionState } from "react";

const SignupForm = () => {
  const [state, action] = useActionState(signUp, undefined);
  return (
    <form action={action}>
      {state?.message && (
        <p className="text-sm text-red-500">{state.message}</p>
      )}
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Jhon Doe" />
        </div>
        {state?.error?.name && (
          <p className="text-sm text-red-500">{state.error.name}</p>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="Jhon@gmail.com" />
        </div>
        {state?.error?.email && (
          <p className="text-sm text-red-500">{state.error.email}</p>
        )}
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" placeholder="Jhon Doe" />
        </div>
        {state?.error?.password && (
          <div>
            <p className="text-sm text-red-500">password must: </p>
            <ul>
              {state.error.password.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <SubmitButton>Sign up</SubmitButton>
      </div>
    </form>
  );
};

export default SignupForm;
