"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { createClinic } from "@/actions/create-clinic";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const clicnicFormSchema = z.object({
  name: z.string().min(1, "O nome obrigatório."),
});

const ClinicForm = () => {
  const clinicForm = useForm<z.infer<typeof clicnicFormSchema>>({
    resolver: zodResolver(clicnicFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof clicnicFormSchema>) {
    try {
      await createClinic(data.name);
      toast.success("Clínica criada com sucesso!");
      clinicForm.reset();
    } catch (error) {
      console.error("Erro ao criar clínica:", error);
      toast.error("Erro ao criar clínica. Tente novamente mais tarde.");
    }
  }

  return (
    <>
      <Form {...clinicForm}>
        <form onSubmit={clinicForm.handleSubmit(onSubmit)}>
          <FormField
            control={clinicForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              disabled={clinicForm.formState.isSubmitting}
              className="mt-4 ml-auto"
              type="submit"
            >
              {clinicForm.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Criar clínica
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  );
};

export default ClinicForm;
