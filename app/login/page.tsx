"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";
import toastStyle from "@/utils/toastStyle";


const FormSchema = z.object({
  Email: z
    .string()
    .email('Please enter valid email address'),
  Password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Login = () => {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const {login, user} = useAuth();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const { Email, Password } = data;

    await login( Email, Password, setIsLoading);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-700">
        <div className="m-auto items-center min-w-[400px] px-10 py-16 bg-gray-300 rounded-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full md:mt-0 sm:max-w-md xl:p-0"
          >
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>

            {/* Email */}
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email</Label>
                  <FormControl>
                    <Input
                      className="w-full px-3 py-2"
                      placeholder="Email..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="Password"
              render={({ field }) => (
                <FormItem>
                  <Label>Password</Label>
                  <FormControl>
                    <Input
                      className="w-full px-3 py-2"
                      type="password"
                      placeholder="Password..."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button
              className="w-full"
              type="submit"
            >
              {isLoading ? "Logging..." : "Login"}
            </Button>
            <p className="text-sm font-light text-gray-800 text-center">
              Don’t have an account yet?{" "}
              <Link
                href="/register"
                className="font-medium text-primary-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </form>
        </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
