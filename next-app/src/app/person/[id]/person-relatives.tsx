import React from "react";
import {Person} from "@/types";
import {AppLink} from "@/components/app-link";

export const PersonRelatives = ({person}: { person: Person }) => {
    return (
        <div>
            <h3 className="scroll-m-20 font-semibold tracking-tight">Семья</h3>
            {person.parent_couple?.first_person ?
                <div className="flex gap-2">
                    Отец:
                    <AppLink
                        href={`/person/${person.parent_couple.first_person.id}`}>
                        {person.parent_couple.first_person.full_name}
                    </AppLink>
                </div>
                : ""
            }
            {person.parent_couple?.second_person ?
                <div className="flex gap-2">
                    Мать:
                    <AppLink href={`/person/${person.parent_couple.second_person.id}`}>
                        {person.parent_couple.second_person.full_name}
                    </AppLink>
                </div>
                : ""
            }
            {person.couples?.map(couple => {
                return (
                    <div>
                        {couple.second_person && couple.first_person_id === person.id ?
                            <div className="flex gap-2">
                                Жена:
                                <AppLink className="underline"
                                         href={`/person/${couple.second_person.id}`}>
                                    {couple.second_person.full_name}
                                </AppLink>
                            </div>
                            : ""
                        }

                        {couple.first_person && couple.second_person_id === person.id ?
                            <div className="flex gap-2">
                                Муж:
                                <AppLink
                                    href={`/person/${couple.first_person.id}`}>
                                    {couple.first_person.full_name}
                                </AppLink>
                            </div>
                            : ""
                        }

                        {couple.children?.length ?
                            <div className="pl-4 flex gap-2 flex-wrap">
                                Дети:
                                {couple.children.map<React.ReactNode>(child =>
                                    <AppLink href={`/person/${child.id}`}>{child.full_name}</AppLink>
                                )}
                            </div>
                            : ""
                        }
                    </div>
                )
            })}
        </div>
    )
}
