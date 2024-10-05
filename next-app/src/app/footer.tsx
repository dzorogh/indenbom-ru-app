import React from "react";

export default function Footer() {
    return (
        <div className="bg-slate-800 text-slate-400">
            <div className="container mx-auto px-4 py-1 md:py-4 text-center text-sm md:text-md">
                Сергей Инденбом © {new Date().getFullYear()}
            </div>
        </div>
    )
}
