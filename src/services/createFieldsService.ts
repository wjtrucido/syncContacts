import Mailchimp from 'mailchimp-api-v3';

const apiKey = process.env.apiKey;
const client = new Mailchimp(apiKey!);
const candidateFieldsToCreate = [
    {
        name: 'System record ID',
        type: 'text',
        tag: 'IDRECORD'
    },
    {
        name: 'Date changed',
        type: 'text',
        tag: 'DATECHANGE'
    },
    {
        name: 'Email Addresses\Date changed',
        type: 'text',
        tag: 'EADATEC'
    },
    {
        name: 'Todays Visitors Attribute\Value',
        type: 'text',
        tag: 'TVAV'
    },
    {
        name: 'Todays Visitors Attribute\Date changed',
        type: 'text',
        tag: 'TVADATEC'
    },
    {
        name: 'Phones\Date changed',
        type: 'text',
        tag: 'PHONEDATEC'
    }
];
export const createFieldsService = async (listId: string) => {
    let newFields = [];
    try {
        const response = await client.get(`/lists/${listId}/merge-fields/`);
        const obtaineFields = response.merge_fields;
        newFields = candidateFieldsToCreate.filter(
            (object1) => !obtaineFields.some((object2: any) => object1['tag'] == object2['tag'])
        );
        if (newFields.length > 0) {
            const requests = newFields.map(field => ({
                method: 'POST',
                path: `/lists/${listId}/merge-fields`,
                body: field
            }));
            await client.batch(requests);
        }
    } catch (error) {
        throw new Error('An error has occurred');
    }
}