"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { upsertDoctorFormAction } from "@/actions/upsert-doctor-form";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { medicalSpecialties } from "../constants";

const UpsertDoctorFormSchema = z
  .object({
    name: z.string().trim().min(1, "Nome é obrigatório."),
    specialty: z.string().trim().min(1, "Especialidade é obrigatória."),
    appointmentPriceInCents: z
      .string()
      .min(1, "Preço da consulta é obrigatório."),
    availableFromWeekDay: z.number(),
    availableToWeekDay: z.number(),
    availableFromTime: z
      .string()
      .trim()
      .min(1, "Horário de início é obrigatório."),
    availableToTime: z
      .string()
      .trim()
      .min(1, "Horário de término é obrigatório."),
  })
  .refine(
    (data) => {
      return data.availableToTime >= data.availableFromTime;
    },
    {
      message: "Horário de término não deve ser anterior ao horário inicial.",
      path: ["availableToTime"],
    },
  );

type UpsertDoctorFormValues = z.infer<typeof UpsertDoctorFormSchema>;

interface UpsertDoctorFormProps {
  onSuccess?: () => void;
}

export const UpsertDoctorForm = (props: UpsertDoctorFormProps) => {
  const form = useForm<UpsertDoctorFormValues>({
    resolver: zodResolver(UpsertDoctorFormSchema),
    defaultValues: {
      name: "",
      specialty: "",
      appointmentPriceInCents: "0",
      availableFromWeekDay: 1,
      availableToWeekDay: 5,
      availableFromTime: "",
      availableToTime: "",
    },
  });

  // hooks
  const upsertDoctorAction = useAction(upsertDoctorFormAction, {
    onSuccess: () => {
      toast.success("Médico adicionado com sucesso!");
      props.onSuccess?.();
      form.reset();
    },
    onError: () => {
      toast.error(`Erro ao adicionar médico.`);
    },
  });

  // functions
  const onsubmit = (values: z.infer<typeof UpsertDoctorFormSchema>) => {
    upsertDoctorAction.execute({
      ...values,
      availableFromWeekDay: Number(values.availableFromWeekDay),
      availableToWeekDay: Number(values.availableToWeekDay),
      appointmentPriceInCents: Number(
        values.appointmentPriceInCents.replace(/\D/g, ""),
      ),
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar médico</DialogTitle>
        <DialogDescription>
          Adicione um novo médico para sua clínica.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onsubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do médico" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialidade</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {medicalSpecialties.map((specialty) => (
                      <SelectItem key={specialty.value} value={specialty.value}>
                        {specialty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="appointmentPriceInCents"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da consulta</FormLabel>
                <NumericFormat
                  {...field}
                  customInput={Input}
                  placeholder="Preço da consulta"
                  thousandSeparator="."
                  decimalSeparator=","
                  prefix="R$ "
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  onValueChange={(values) => {
                    field.onChange(values.floatValue || 0);
                  }}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromWeekDay"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Dia inicial da semana</FormLabel>
                <FormControl>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o dia inicial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Dias da semana</SelectLabel>
                        <SelectItem value="0">Domingo</SelectItem>
                        <SelectItem value="1">Segunda-feira</SelectItem>
                        <SelectItem value="2">Terça-feira</SelectItem>
                        <SelectItem value="3">Quarta-feira</SelectItem>
                        <SelectItem value="4">Quinta-feira</SelectItem>
                        <SelectItem value="5">Sexta-feira</SelectItem>
                        <SelectItem value="6">Sábado</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableToWeekDay"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Dia final da semana</FormLabel>
                <FormControl>
                  <Select
                    value={String(field.value)}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o dia final" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Dias da semana</SelectLabel>
                        <SelectItem value="0">Domingo</SelectItem>
                        <SelectItem value="1">Segunda-feira</SelectItem>
                        <SelectItem value="2">Terça-feira</SelectItem>
                        <SelectItem value="3">Quarta-feira</SelectItem>
                        <SelectItem value="4">Quinta-feira</SelectItem>
                        <SelectItem value="5">Sexta-feira</SelectItem>
                        <SelectItem value="6">Sábado</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="availableFromTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário inicial de disponibilidade</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Horário inicial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Manhã</SelectLabel>
                        {Array.from({ length: (12 - 7) * 2 }, (_, i) => {
                          const hour = 7 + Math.floor(i / 2);
                          const minute = i % 2 === 0 ? "00" : "30";
                          const value = `${hour.toString().padStart(2, "0")}:${minute}:00`;
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Tarde</SelectLabel>
                        {Array.from({ length: (18 - 13) * 2 + 1 }, (_, i) => {
                          const hour = 13 + Math.floor(i / 2);
                          const minute = i % 2 === 0 ? "00" : "30";
                          const value = `${hour.toString().padStart(2, "0")}:${minute}:00`;
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Noite</SelectLabel>
                        {Array.from({ length: (23 - 19) * 2 + 1 }, (_, i) => {
                          const hour = 19 + Math.floor(i / 2);
                          const minute = i % 2 === 0 ? "00" : "30";
                          const value = `${hour.toString().padStart(2, "0")}:${minute}:00`;
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availableToTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário final de disponibilidade</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Horário final" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Manhã</SelectLabel>
                        {Array.from({ length: (12 - 7) * 2 }, (_, i) => {
                          const hour = 7 + Math.floor(i / 2);
                          const minute = i % 2 === 0 ? "00" : "30";
                          const value = `${hour.toString().padStart(2, "0")}:${minute}:00`;
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Tarde</SelectLabel>
                        {Array.from({ length: (18 - 13) * 2 + 1 }, (_, i) => {
                          const hour = 13 + Math.floor(i / 2);
                          const minute = i % 2 === 0 ? "00" : "30";
                          const value = `${hour.toString().padStart(2, "0")}:${minute}:00`;
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Noite</SelectLabel>
                        {Array.from({ length: (23 - 19) * 2 + 1 }, (_, i) => {
                          const hour = 19 + Math.floor(i / 2);
                          const minute = i % 2 === 0 ? "00" : "30";
                          const value = `${hour.toString().padStart(2, "0")}:${minute}:00`;
                          return (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button disabled={upsertDoctorAction.isPending} type="submit">
              {upsertDoctorAction.isPending && (
                <Loader2 className="mr-2 animate-spin" />
              )}
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
