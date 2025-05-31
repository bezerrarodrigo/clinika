import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { ButtonSignOut } from "./components/ButtonSignOut";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  if (!session.user.clinic) {
    redirect("/clinic-form");
  }

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>{session?.user.name}</p>
      <p>{session?.user.email}</p>
      <ButtonSignOut />
    </div>
  );
};

export default DashboardPage;
