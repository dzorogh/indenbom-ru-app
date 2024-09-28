import {Photo} from "@/types";
import {Article} from "@/components/article";
import {Calendar03Icon, Location01Icon, QuestionIcon} from "hugeicons-react";
import {FamilyPersonGalleryItemImage} from "@/components/family-person-gallery-item-image";

export const FamilyPersonGalleryItem = ({photo}: { photo: Photo }) => {

    return (
        <div className="flex flex-col bg-white overflow-hidden break-words rounded-md shadow-lg">

            <FamilyPersonGalleryItemImage photo={photo}/>

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
