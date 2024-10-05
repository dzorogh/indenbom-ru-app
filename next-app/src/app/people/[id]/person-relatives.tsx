import React from "react";
import {Person} from "@/types";
import {AppLink} from "@/components/app-link";
import {ArrowDownRight01Icon, ArrowMoveDownRightIcon} from "hugeicons-react";

export const PersonRelatives = ({person}: { person: Person }) => {
    const siblings = person.parent_couple?.children?.filter(sibling => sibling.id !== person.id);


    return (
        <div>
            <h3 className="scroll-m-20 font-semibold tracking-tight">Семья</h3>

            <div className="flex gap-2">
                Отец:
                {person.parent_couple?.first_person ? <AppLink
                        href={`/people/${person.parent_couple.first_person.id}`}>
                        {person.parent_couple.first_person.full_name}
                    </AppLink>
                    : <div className="text-muted-foreground">Неизвестно</div>
                }
            </div>


            <div className="flex gap-2">
                Мать:
                {person.parent_couple?.second_person ?
                    <AppLink href={`/people/${person.parent_couple.second_person.id}`}>
                        {person.parent_couple.second_person.full_name}
                    </AppLink>
                    : <div className="text-muted-foreground">Неизвестно</div>
                }
            </div>


            <div className="flex gap-2">
                Братья/сестры:
                { siblings?.length ?
                    siblings.map(sibling => {
                        return (
                            <AppLink key={`sibling-${sibling.id}`} href={`/people/${sibling.id}`}>
                                {sibling.full_name}
                            </AppLink>
                        )
                    })
                    : <div className="text-muted-foreground">Отсутствуют или неизвестны</div>
                }
            </div>


            {person.couples?.map(couple => {
                return (
                    <div key={`couple-${couple.id}`}>
                        {couple.second_person && couple.first_person_id === person.id ?
                            <div className="flex gap-2">
                                Жена:
                                <AppLink href={`/people/${couple.second_person.id}`}>
                                    {couple.second_person.full_name}
                                </AppLink>
                            </div>
                            : ""
                        }

                        {couple.first_person && couple.second_person_id === person.id ?
                            <div className="flex gap-2">
                                Муж:
                                <AppLink
                                    href={`/people/${couple.first_person.id}`}>
                                    {couple.first_person.full_name}
                                </AppLink>
                            </div>
                            : ""
                        }

                        {couple.children?.length ?
                            <div className="flex gap-2 flex-wrap">
                                <ArrowMoveDownRightIcon height={16} />
                                Дети:
                                {couple.children.map<React.ReactNode>(child =>
                                    <AppLink key={`child-${child.id}`}
                                             href={`/people/${child.id}`}>{child.full_name}</AppLink>
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
