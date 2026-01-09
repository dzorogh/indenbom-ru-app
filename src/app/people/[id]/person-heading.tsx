import Image from "next/image";
import {SmileIcon} from "hugeicons-react";
import {FamilyPersonHeadingBadge} from "@/components/family-person-heading-badge";
import React from "react";
import {Person} from "@/types";

export const PersonHeading = ({person}: {person: Person}) => {
    return <div className="relative h-48 bg-gradient-to-r rounded-t-sm from-stone-100 to-stone-200 m-0.5">
        <Image
            src="https://live.staticflickr.com/65535/53590278329_9620f94c83_k.jpg"
            fill={true}
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1600px) 2000px, 100vw"
            className="object-cover rounded-t-sm"
            alt="Фон с липой">
        </Image>

        <div
            className="flex flex-col md:flex-row justify-center items-center md:justify-start absolute -bottom-[125px] px-8 w-full">
            {person.avatar_url ?
                <Image
                    priority={true}
                    src={person.avatar_url}
                    width={250}
                    height={250}
                    className="rounded-full border-[10px] border-white"
                    alt={person.full_name}
                />
                :
                <div
                    className="w-[250px] h-[250px] rounded-full bg-secondary flex items-center justify-center">
                    <SmileIcon size={50} className="opacity-20"/>
                </div>
            }

            <div className="flex flex-wrap justify-center items-center md:ml-10 gap-2 md:gap-4">
                {person.contacts?.length ?
                    <FamilyPersonHeadingBadge>Контакты и ссылки</FamilyPersonHeadingBadge>
                    : ""
                }
                {person.article ?
                    <FamilyPersonHeadingBadge>Биография</FamilyPersonHeadingBadge>
                    : ""
                }
                {person.photos?.length ?
                    <FamilyPersonHeadingBadge>Фотографии</FamilyPersonHeadingBadge>
                    : ""
                }
            </div>
        </div>
    </div>
}
