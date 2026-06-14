import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

const cookieStore = await cookies();
const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

//this is the magic of layout files in NextJS! Truly amazing to setup common layouts across route groups
export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true} className="h-svh">
        <SidebarInset className="min-h-0 min-w-0">
            <main className="flex min-h-0 flex-1 flex-col">
                {children}  
            </main>
        </SidebarInset>
    </SidebarProvider>


  );
}
