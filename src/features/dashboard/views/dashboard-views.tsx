import { PageHeader } from "@/components/page-header";
import { HeroPattern } from "../components/hero-pattern";
import { DashboardHeader } from "../components/dashboard-header";
import { TextInputPanel } from "@/features/dashboard/components/text-input-panel"

export default function DashboardView(){
    return(
        <div className="relative flex-1 w-full">
            <PageHeader title="home" className="lg:hidden"/>
            <HeroPattern/>
            <div className="relative space-y-8 p-4 lg:p-16">
               <DashboardHeader/>
               <TextInputPanel/>
           </div>
        </div>
    )
}