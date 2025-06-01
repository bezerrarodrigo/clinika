import { z } from "zod";

export const upsertDoctorFormSchema = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(1, "Nome é obrigatório."),
    specialty: z.string().trim().min(1, "Especialidade é obrigatória."),
    appointmentPriceInCents: z
      .number()
      .min(1, "Preço da consulta é obrigatório."),
    availableFromWeekDay: z.number().min(0).max(6),
    availableToWeekDay: z.number().min(0).max(6),
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

export type UpsertDoctorFormSchema = z.infer<typeof upsertDoctorFormSchema>;
