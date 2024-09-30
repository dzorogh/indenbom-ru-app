import {Photo} from "@/types";
import {Article} from "@/components/article";
import {Calendar03Icon, Location01Icon} from "hugeicons-react";
import {FamilyPersonGalleryItemImage} from "@/components/family-person-gallery-item-image";
import {Badge} from "@/components/ui/badge";
import Link from "next/link";
import {AppLink} from "@/components/app-link";

export const FamilyPersonGalleryItem = ({photo}: { photo: Photo }) => {

    return (
        <div className="flex h-full flex-col bg-white overflow-hidden break-words rounded-md shadow-lg">

            <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-slate-200 relative">
                <FamilyPersonGalleryItemImage photo={photo}/>
            </div>

            <div className="p-4 flex flex-col gap-4 grow">
                <div className="grow">
                    {photo.description ?
                        <Article content={photo.description}/>
                        : <div className="text-slate-300">Без описания</div>}
                </div>

                {photo.people ?
                    <div className="text-slate-500">
                        На фото:
                        <div className="flex flex-col">
                            {photo.people.map(person =>
                                <div className="text-xs">
                                    <AppLink href={`/person/${person.id}`}>
                                        {person.full_name}
                                    </AppLink>
                                    {person.position_on_photo ?
                                        <span className="text-slate-300"> {person.position_on_photo}</span>
                                        : ""
                                    }
                                </div>
                            )}
                        </div>
                    </div> : ""
                }

                <div className="flex justify-between items-center">
                    <div className="text-slate-400 flex items-center gap-2">
                        <Calendar03Icon/> {photo.approximate_date ?? "?"}
                    </div>

                    <div className="text-slate-400 flex items-center gap-2">
                        <Location01Icon/> {photo.place ?? "?"}
                    </div>
                </div>

            </div>

        </div>
    )
};
