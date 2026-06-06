"use client"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const page = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8">
      <h1 className="text-6xl">
        Welcome to Sonar
      </h1>
      <Button size="xs" onClick={() => toast.success("Hello World")}>
        Click Me!
      </Button>
    </div>
  );
};

export default page;
