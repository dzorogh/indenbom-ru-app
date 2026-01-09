import {Photo} from "@/types";
import {FamilyPersonGalleryItem} from "@/components/family-person-gallery-item";

export const FamilyPersonGallery = ({ photos }: {photos: Photo[]}) => {

    return <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {photos.map((photo) => (
            <FamilyPersonGalleryItem key={`photo-${photo.id}`} photo={photo}/>
        ))}
    </div>;
};
