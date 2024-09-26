import Image from "next/image";
import {Photo} from "@/types";
import {Article} from "@/components/article";
import {Calendar03Icon, Location01Icon, QuestionIcon} from "hugeicons-react";

export const FamilyPersonGalleryItem = ({photo}: { photo: Photo }) => {
    return (
        <div className="flex flex-col bg-white overflow-hidden break-words rounded-md shadow-lg">
            <Image src={photo.media_url} width={600} height={600} alt="" className="rounded-md"/>

            {photo.description || photo.approximate_date || photo.place ?
                <div className="p-4 flex flex-col gap-4">
                    {photo.description ? <div>
                        <Article content={photo.description}/>
                    </div> : ""}

                    <div className="flex justify-between items-center">
                        <div className="text-slate-400 flex items-center gap-2">
                            <Calendar03Icon/> {photo.approximate_date ?? "?"}
                        </div>

                        <div className="text-slate-400 flex items-center gap-2">
                            <Location01Icon/> {photo.place ?? "?"}
                        </div>
                    </div>

                </div> : ""
            }

        </div>
    )
};
