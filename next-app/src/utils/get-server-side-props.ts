import { cache } from 'react'
import 'server-only'

export const preload = () => {
    void getServerSideProps()
}

export const getServerSideProps = cache(async () => {
    try {
        const couplesResponse = await fetch('http://147.45.171.210:9081/api/v1/family/couples');
        const peopleResponse = await fetch('http://147.45.171.210:9081/api/v1/family/people');

        if (!couplesResponse.ok || !peopleResponse.ok) {
            throw new Error('Failed to fetch data');
        }

        const couplesData = await couplesResponse.json();
        const peopleData = await peopleResponse.json();

        console.log(couplesData);

        return {
            couples: couplesData.data || [],
            people: peopleData.data || [],
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {
            couples: [],
            people: [],
        };
    }
})
