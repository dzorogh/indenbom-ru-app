import Image from "next/image";
import {Photo} from "@/types";
import {FamilyPersonGalleryItem} from "@/components/family-person-gallery-item";

export const FamilyPersonGallery = ({ photos }: {photos: Photo[]}) => {

    const firstColumn = photos.filter((_, index) => index % 3 === 0);
    const secondColumn = photos.filter((_, index) => index % 3 === 1);
    const thirdColumn = photos.filter((_, index) => index % 3 === 2);

    return <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="grid gap-8">
            {firstColumn.map((photo) => (
                <FamilyPersonGalleryItem  photo={photo}/>
            ))}
        </div>
        <div className="grid gap-8">
            {secondColumn.map((photo) => (
                <FamilyPersonGalleryItem  photo={photo}/>
            ))}
        </div>
        <div className="grid gap-8">
            {thirdColumn.map((photo) => (
                <FamilyPersonGalleryItem  photo={photo}/>
            ))}
        </div>
    </div>;
};
