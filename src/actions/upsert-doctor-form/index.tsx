"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { doctorsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertDoctorFormSchema } from "./schema";

export const upsertDoctorFormAction = actionClient
  .schema(upsertDoctorFormSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Usuário não autenticado.");
    }

    if (!session.user.clinic?.id) {
      throw new Error("Usuário não pertence a uma clínica.");
    }

    await db
      .insert(doctorsTable)
      .values({
        id: parsedInput.id,
        ...parsedInput,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: [doctorsTable.id],
        set: { ...parsedInput },
      });
  });
