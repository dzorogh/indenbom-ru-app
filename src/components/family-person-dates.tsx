import React, {memo} from 'react';
import {DatePrecision, Person} from "@/types";

const formatExactDate = (date: string | number | Date) => {
    return new Intl.DateTimeFormat("ru-RU").format(new Date(date))
}

const formatApproximateDate = (date: string | number | Date) => {
    return '~' + formatExactDate(date);
}

const formatYearDate = (date: string | number | Date) => {
    return  String(new Date(date).getFullYear()) + ' г.';
}

const formatCenturyDate = (date: string | number | Date) => {
    return String(Math.ceil(new Date(date).getFullYear() / 100)) + ' век';
}

const formatDecadeDate = (date: string | number | Date) => {
    return String(Math.ceil(new Date(date).getFullYear() / 10) * 10) + '-е';
}

export default memo(function FamilyPersonDates(props: { person: Person }) {
    let birthDate: string, deathDate: string;

    if (props.person.birth_date) {
        if (props.person.birth_date_precision === DatePrecision.Exact) {
            birthDate = formatExactDate(props.person.birth_date);
        }

        if (props.person.birth_date_precision === DatePrecision.Approximate) {
            birthDate = formatApproximateDate(props.person.birth_date)
        }

        if (props.person.birth_date_precision === DatePrecision.Year) {
            birthDate = formatYearDate(props.person.birth_date)
        }

        if (props.person.birth_date_precision === DatePrecision.Century) {
            birthDate = formatCenturyDate(props.person.birth_date)
        }

        if (props.person.birth_date_precision === DatePrecision.Decade) {
            birthDate = formatDecadeDate(props.person.birth_date)
        }
    }

    if (props.person.death_date) {
        if (props.person.death_date_precision === DatePrecision.Exact) {
            deathDate = formatExactDate(props.person.death_date);
        }

        if (props.person.death_date_precision === DatePrecision.Approximate) {
            deathDate = formatApproximateDate(props.person.death_date)
        }

        if (props.person.death_date_precision === DatePrecision.Year) {
            deathDate = formatYearDate(props.person.death_date)
        }

        if (props.person.death_date_precision === DatePrecision.Century) {
            deathDate = formatCenturyDate(props.person.death_date)
        }

        if (props.person.death_date_precision === DatePrecision.Decade) {
            deathDate = formatDecadeDate(props.person.death_date)
        }
    }

    if (!birthDate && deathDate) {
        birthDate = '?'
    }

    return (
        <>
            {[birthDate, deathDate].filter(d => d).join(' - ')}
        </>
    );
});
