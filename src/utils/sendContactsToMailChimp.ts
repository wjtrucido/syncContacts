import Mailchimp from "mailchimp-api-v3";
import Contact from "../models/contacts"

export const sendContactsToMailChimp = async () => {
    const apiKey = process.env.apiKey
    const listId = process.env.listId
    const batchSize = 10;
    let offset = 0;

    const mailchimp = new Mailchimp(apiKey!);

    async function sendContactsInBatches() {
        let areAvailableContacts = true
        do {
            // Obtener los siguientes registros de la base de datos
            const contactsFromDatabase = await Contact.find().skip(offset).limit(batchSize);

            // Si no hay más registros, salir del ciclo while
            if (contactsFromDatabase.length === 0) {
                areAvailableContacts = false
                continue
            }

            // Agregar los registros a la lista de contactos
            const contactsToSend = contactsFromDatabase.map((contact) => ({
                email_address: contact.emailAddresses_EmailAddress,
                status: 'subscribed',
                merge_fields: {
                    FNAME: contact.firstName,
                    LNAME: contact.lastName,
                    ADDRESS: {
                        addr1: contact.addresses_AddressLine_1.length > 0 ? contact.addresses_AddressLine_1 : 'without addr.',
                        addr2: contact.addresses_AddressLine_2,
                        city: contact.addressesCity.length > 0 ? contact.addressesCity : 'without city',
                        state: contact.addresses_StateAbbreviation.length > 0 ? contact.addresses_StateAbbreviation : 'without state',
                        zip: contact.addressesZip.length > 0 ? contact.addressesZip : "00000",
                        country: contact.addresses_CountryAbbreviation
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
                console.error(error)
                throw error
            }
            // Incrementar el offset para la próxima iteración
            offset += batchSize;
        } while (areAvailableContacts)
    }

    async function sendContactsBatch(contacts: any) {
        const batch =
            contacts.map((contact: any) => ({
                method: 'POST',
                path: `/lists/${listId}/members`,
                body: contact
            }))
        try {
            const response = await mailchimp.batch(batch);
            console.log('batches sent to mailChimp');
        } catch (error) {
            console.error('Error sending batch', error);
        }
    }
    sendContactsInBatches();
}