"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido.")
    .trim()
    .min(1, "Email é obrigatório."),
  password: z.string().trim().min(8, "Senha deve ter pelo menos 8 caracteres."),
});

export function SignInForm() {
  //hooks
  const route = useRouter();

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function loginSubmit(values: z.infer<typeof loginSchema>) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: () => {
          route.push("/dashboard");
        },
        onError: () => {
          toast.error("E-mail ou senha inválidos.");
        },
      },
    );
  }

  async function hadnleSignInWithGoogle() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  return (
    <Card>
      <Form {...loginForm}>
        <form
          onSubmit={loginForm.handleSubmit(loginSubmit)}
          className="space-y-8"
        >
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Faça login com seu usuário e senha para continuar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="Informe o seu email" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Informe a sua senha"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              disabled={loginForm.formState.isSubmitting}
              type="submit"
              className="w-full"
            >
              {loginForm.formState.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Entrar"
              )}
            </Button>
            <Button
              variant="secondary"
              type="button"
              className="w-full"
              onClick={hadnleSignInWithGoogle}
            >
              <Image
                src="/google_icon.svg"
                alt="Google Icon"
                width={22}
                height={22}
              />
              Entrar com Google
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
