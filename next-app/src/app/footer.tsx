import React from "react";
import { Separator } from "@/components/ui/separator";
import { AppLink } from "@/components/app-link";

export default function Footer() {
    return (
        <div className="bg-secondary text-muted-foreground">
            <div className="container mx-auto px-4 py-4 text-center text-sm md:text-md flex items-center gap-x-6 gap-y-3 justify-center flex-wrap divide-secondary-foreground">
                Сергей Инденбом © {new Date().getFullYear()}
                <AppLink href="mailto:dzorogh@gmail.com">dzorogh@gmail.com</AppLink>
                <AppLink href="https://admin.indenbom.ru/docs/api">API</AppLink>
                <AppLink href="https://github.com/dzorogh/indenbom-ru">Github Backend</AppLink>
                <AppLink href="https://github.com/dzorogh/indenbom-ru-app">Github Frontend</AppLink>
            </div>
        </div>
    )
}
