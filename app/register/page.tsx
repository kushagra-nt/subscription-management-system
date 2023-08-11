"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import toastStyle from "@/utils/toastStyle";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

const FormSchema = z.object({
  UserName: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(25, {
      message: "Username must be max 25 characters.",
    }).refine(val => !/\s/.test(val), {
      message: "Username cannot contain white spaces.",
    }),
  Email: z.string().email("Please enter valid email address"),
  Password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
  ConfirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  })
});

const Register = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {

    const { UserName, Email, Password, ConfirmPassword } = data;

    if (Password !== ConfirmPassword) {
        return toast.error("Password does not match", {
            style: toastStyle,
        });
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/register", {
        userName: UserName,
        email: Email,
        password: Password
      });

      if (response.data?.success === true) {
        toast.success(`${response.data?.message}`, {
          style: toastStyle,
        });
        
        setIsLoading(false);

        form.reset();
        router.push("/login");
        router.refresh();
      } else {
        toast.error(`${response.data?.message}`, {
          style: toastStyle,
        });
      }
    } catch (err:any) {
      toast.error(`${err.response?.data?.message || 'Uhh oh! something went wrong'}`, {
        style: toastStyle,
      });
      console.log(err);
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 bg-gray-700">
        <div className="m-auto items-center min-w-[400px] px-10 py-16 bg-gray-300 rounded-lg">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full md:mt-0 sm:max-w-md xl:p-0"
          >
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <FormField
              control={form.control}
              name="UserName"
              render={({ field }) => (
                <FormItem>
                  <Label>UserName</Label>
                  <FormControl>
                    <Input
                      className="w-full px-3"
                      placeholder="Enter Your UserName"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="Email"
              render={({ field }) => (
                <FormItem>
                  <Label>Email Address</Label>
                  <FormControl>
                    <Input
                      className="w-full px-3 py-2"
                      type="email"
                      placeholder="Enter Your Email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            
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
                      placeholder="Enter Your Password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ConfirmPassword"
              render={({ field }) => (
                <FormItem>
                  <Label>Confirm Password</Label>
                  <FormControl>
                    <Input
                      className="w-full px-3 py-2"
                      type="Password"
                      placeholder="Enter Your Password Again"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              // disabled={!form.formState.isDirty || isLoading}
              className="w-full"
              type="submit"
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
            <p className="text-center text-sm font-light text-gray-800">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary-600 hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </Form>
        </div>
      </div>
    </>
  );
};

export default Register;
