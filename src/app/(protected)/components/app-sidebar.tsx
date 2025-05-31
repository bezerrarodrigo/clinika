"use client";

import {
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  CalendarDays,
  Gem,
  LayoutDashboard,
  LogOut,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Agendamentos",
    url: "/appointments",
    icon: CalendarDays,
  },
  {
    title: "Médicos",
    url: "/doctors",
    icon: Stethoscope,
  },
  {
    title: "Pacientes",
    url: "/patients",
    icon: UsersRound,
  },
];

const otherItems = [
  {
    title: "Planos",
    url: "/plans",
    icon: Gem,
  },
];

export function AppSidebar() {
  //hooks
  const router = useRouter();
  const session = authClient.useSession();
  const pathName = usePathname();

  //functions
  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/authentication");
        },
      },
    });
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Image src="/clinikaLogo.png" alt="logo" width={136} height={28} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathName === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Outros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer" size="lg">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {session.data?.user.clinic?.name
                        .slice(0, 2)
                        .toLocaleUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm">{session.data?.user.clinic?.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {session.data?.user.email}
                    </p>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuItem
                  className="flex cursor-pointer items-center gap-2"
                  onClick={handleSignOut}
                >
                  <LogOut size={20} />
                  <p className="text-sm">Sair</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
