"use client"

import Image from "next/image";
import {Photo} from "@/types";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useState} from "react";

export const FamilyPersonGalleryItemImage = ({photo}: { photo: Photo }) => {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="cursor-zoom-in group rounded-md overflow-hidden ">
                <Image src={photo.media_url} width={600} height={600} alt={photo.description} className="rounded-md group-hover:scale-110 transition-transform"/>
            </DialogTrigger>
            <DialogContent onClick={() => setOpen(false)}
                           className="cursor-zoom-out p-0 inline-flex border-0 md:max-w-[calc(100vw-6rem)] max-w-[calc(100vw-3rem)] md:max-h-[calc(100vh-6rem)] max-h-[calc(100vh-3rem)] object-cover overflow-hidden">
                <Image src={photo.media_url} width={2000} height={2000} alt={photo.description}
                       className=" object-contain w-full"/>
            </DialogContent>
        </Dialog>
    )
};
