"use server";

import { headers } from "next/headers";

import { db } from "@/db";
import { clinicTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

export const createClinic = async (name: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Usuário não autenticado.");
  }

  const [clinic] = await db.insert(clinicTable).values({ name }).returning();
  await db.insert(usersToClinicsTable).values({
    userId: session.user.id,
    clinicId: clinic.id,
  });
};
