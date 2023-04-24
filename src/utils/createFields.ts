import Mailchimp from 'mailchimp-api-v3'
import dotenv from 'dotenv'
dotenv.config();

const apiKey = process.env.apiKey

const client = new Mailchimp(apiKey!);
const newFields = [
    {
        name: 'System record ID',
        type: 'text'
    },
    {
        name: 'Date changed',
        type: 'text'
    },
    {
        name: 'Email Addresses\Date changed',
        type: 'text'
    },
    {
        name: 'Todays Visitors Attribute\Value',
        type: 'text'
    },
    {
        name: 'Todays Visitors Attribute\Date changed',
        type: 'text'
    },
    {
        name: 'Phones\Date changed',
        type: 'text'
    }
];
export const createFields = async (listId: string) => {
    try {
        const requests = newFields.map(field => ({
            method: 'POST',
            path: `/lists/${listId}/merge-fields`,
            body: field
        }));
        client.batch(requests);
    } catch (error) {
        console.log(error);
    }
}