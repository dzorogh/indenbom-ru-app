import React from "react";
import {Person} from "@/types";
import {AppLink} from "@/components/app-link";
import {ArrowDownRight01Icon, ArrowMoveDownRightIcon} from "hugeicons-react";

export const PersonRelatives = ({person}: { person: Person }) => {
    const fatherSiblings = person.parent_couple?.husband?.couples?.flatMap(couples => {
        return couples.children;
    }) ?? [];
    const motherSiblings = person.parent_couple?.wife?.couples?.flatMap(couples => {
        return couples.children;
    }) ?? [];

    const siblings = [...new Map([...fatherSiblings, ...motherSiblings].map(sibling => [sibling.id, sibling])).values()]
        .filter(sibling => sibling.id !== person.id);

    return (
        <div className="flex flex-col gap-2">
            <h3 className="scroll-m-20 font-semibold tracking-tight">Семья</h3>

            <div className="flex flex-col lg:flex-row gap-x-2">
                Отец:
                {person.parent_couple?.husband ? <AppLink
                        href={`/people/${person.parent_couple.husband.id}`}>
                        {person.parent_couple.husband.full_name}
                    </AppLink>
                    : <div className="text-muted-foreground">Неизвестно</div>
                }
            </div>


            <div className="flex flex-col lg:flex-row gap-x-2">
                Мать:
                {person.parent_couple?.wife ?
                    <AppLink href={`/people/${person.parent_couple.wife.id}`}>
                        {person.parent_couple.wife.full_name}
                    </AppLink>
                    : <div className="text-muted-foreground">Неизвестно</div>
                }
            </div>


            <div className="flex flex-col lg:flex-wrap lg:flex-row gap-x-2">
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
                        {couple.wife && couple.husband_id === person.id ?
                            <div className="flex flex-col lg:flex-row gap-x-2">
                                Жена:
                                <AppLink href={`/people/${couple.wife.id}`}>
                                    {couple.wife.full_name}
                                </AppLink>
                            </div>
                            : ""
                        }

                        {couple.husband && couple.wife_id === person.id ?
                            <div className="flex flex-col lg:flex-row gap-x-2">
                                Муж:
                                <AppLink
                                    href={`/people/${couple.husband.id}`}>
                                    {couple.husband.full_name}
                                </AppLink>
                            </div>
                            : ""
                        }

                        {couple.children?.length ?
                            <div className="flex">
                                <ArrowMoveDownRightIcon height={16} />
                                <div className="flex flex-col lg:flex-row gap-x-2">
                                    Дети:

                                    <div className="flex flex-col lg:flex-row gap-x-2 flex-wrap">
                                        {couple.children.map<React.ReactNode>(child =>
                                            <AppLink key={`child-${child.id}`}
                                                     href={`/people/${child.id}`}>{child.full_name}</AppLink>
                                        )}
                                    </div>
                                </div>
                            </div>
                            : ""
                        }
                    </div>
                )
            })}
        </div>
    )
}
