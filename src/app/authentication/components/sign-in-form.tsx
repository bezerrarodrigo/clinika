"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const loginSchema = z.object({
  email: z
    .string()
    .email("Email inválido.")
    .trim()
    .min(1, "Email é obrigatório."),
  password: z.string().trim().min(8, "Senha deve ter pelo menos 8 caracteres."),
});

export function SignInForm() {
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function loginSubmit(values: z.infer<typeof loginSchema>) {
    console.log(values);
    loginForm.reset();
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
          <CardContent className="space-y-2">
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
          <CardFooter>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
