"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const UpsertDoctorFormSchema = z.object({
  name: z.string().trim().min(1, "Nome é obrigatório."),
  specialty: z.string().trim().min(1, "Especialidade é obrigatória."),
  appointmentPrice: z.number().min(1, "Preço da consulta é obrigatório."),
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
});

type UpsertDoctorFormValues = z.infer<typeof UpsertDoctorFormSchema>;

export const UpsertDoctorForm = () => {
  const form = useForm<UpsertDoctorFormValues>({
    resolver: zodResolver(UpsertDoctorFormSchema),
    defaultValues: {
      name: "",
      specialty: "",
      appointmentPrice: 0,
      availableFromWeekDay: 0,
      availableToWeekDay: 0,
      availableFromTime: "",
      availableToTime: "",
    },
  });

  //functions
  const onsubmit = (data: UpsertDoctorFormValues) => {
    console.log("Form submitted with data:", data);
    // Here you would typically handle the form submission, e.g., send data to an API
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
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Especialidades</SelectLabel>
                        {medicalSpecialties.map((specialty) => (
                          <SelectItem
                            key={specialty.value}
                            value={specialty.value}
                          >
                            {specialty.label}
                          </SelectItem>
                        ))}
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
            name="appointmentPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preço da consulta</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Preço da consulta"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};
