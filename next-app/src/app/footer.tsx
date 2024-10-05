import React from "react";
import { Separator } from "@/components/ui/separator";
import { AppLink } from "@/components/app-link";

export default function Footer() {
    return (
        <div className="bg-secondary text-muted-foreground">
            <div className="container mx-auto px-4 py-1 md:py-4 text-center text-sm md:text-md flex items-center h-12 gap-4 justify-center">
                Сергей Инденбом © {new Date().getFullYear()}
                <Separator orientation="vertical" />
                <AppLink href="https://admin.indenbom.ru/docs/api">API</AppLink>
            </div>
        </div>
    )
}
