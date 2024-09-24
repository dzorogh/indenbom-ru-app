import React, {memo} from 'react';
import {Person} from "../types";

export default memo(function FamilyPersonDates(props: { person: Person }) {
    let birthDate = props.person.birth_date ? new Intl.DateTimeFormat("ru-RU").format(new Date(props.person.birth_date)) : null;
    const deathDate = props.person.death_date ? new Intl.DateTimeFormat("ru-RU").format(new Date(props.person.death_date)) : null;

    if (!birthDate && deathDate) {
        birthDate = '?'
    }

    return (
        <>
            {[birthDate, deathDate].filter(d => d).join(' - ')}
        </>
    );
});
