import Link from "next/link";
import React from "react";
import SignupForm from "./signupForm";

const SignUpPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 h-fit flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl font-bold md-4">Sign Up Page</h1>
      <SignupForm />
      <div className="flex justify-between text-sm">
        <p>Already have an account?</p>
        <Link className="underline" href={"/auth/signin"}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignUpPage;
