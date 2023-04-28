import Mailchimp from "mailchimp-api-v3";
import Contact from "../models/contacts";
import { createFieldsService } from '../services/createFieldsService';

export const sendContactsToMailChimpService = async () => {
    const apiKey = process.env.apiKey;
    const listId = process.env.listId;
    const batchSize = 30;
    let offset = 0;

    const mailchimp = new Mailchimp(apiKey!);

    async function sendContactsInBatches() {
        await createFieldsService(listId!);
        let areAvailableContacts = true;
        do {
            const contactsFromDatabase = await Contact.find().skip(offset).limit(batchSize);
            if (contactsFromDatabase.length === 0) {
                areAvailableContacts = false;
                continue;
            }
            const contactsToSend = contactsFromDatabase.map((contact) => ({
                email_address: contact.emailAddresses_EmailAddress,
                status: 'subscribed',
                merge_fields: {
                    FNAME: contact.firstName,
                    LNAME: contact.lastName,
                    ADDRESS: {
                        addr1: contact.addresses_AddressLine_1.length > 0 ? contact.addresses_AddressLine_1 : 'without addr.',
                        addr2: contact.addresses_AddressLine_2.length > 0 ? contact.addresses_AddressLine_2 : 'without addr2.',
                        city: contact.addressesCity.length > 0 ? contact.addressesCity : 'without city',
                        state: contact.addresses_StateAbbreviation.length > 0 ? contact.addresses_StateAbbreviation : 'without state',
                        zip: contact.addressesZip.length > 0 ? contact.addressesZip : "00000",
                        country: contact.addresses_CountryAbbreviation.length > 0 ? contact.addresses_CountryAbbreviation : 'without country'
                    },
                    PHONE: contact.phonesNumber,
                    IDRECORD: contact.systemRecordId,
                    DATECHANGE: contact.dateChanged,
                    EADATEC: contact.emailAddresses_DateChanged,
                    TVAV: contact.todaysVisitors,
                    TVADATEC: contact.todaysVisitors_DateChanged != null ? contact.todaysVisitors_DateChanged : 'no change',
                    PHONEDATEC: contact.phones_DateChanged != null ? contact.phones_DateChanged : 'no change'
                }
            }))
            try {
                await sendContactsBatch(contactsToSend);
            } catch (error) {
                throw new Error('Error sending contacts.');
            }
            offset += batchSize;
        } while (areAvailableContacts);
    }
    async function sendContactsBatch(contacts: any) {
        const batch = contacts.map((contact: any) => ({
            method: 'POST',
            path: `/lists/${listId}/members`,
            body: contact
        }))
        try {
            await mailchimp.batch(batch);
        } catch (error) {
            throw new Error('Error sending batch');
        }
    }
    sendContactsInBatches();
}