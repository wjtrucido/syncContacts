import Mailchimp from "mailchimp-api-v3";
import Contact from "../models/contacts";

export const getContactsFromMailchimpService = async () => {
    const apiKey = process.env.apiKey;
    const listId = process.env.listId;
    const count = 10;
    let offset = 0;

    const mailchimp = new Mailchimp(apiKey!);
    let areAvailableContacts = true;
    do {
        try {
            const batchContacts = await mailchimp.get(`/lists/${listId}/members?count=${count}&offset=${offset}`);
            if (batchContacts.members.length === 0) {
                areAvailableContacts = false;
                continue;
            }
            for (let member of batchContacts.members) {
                if (member.source != 'API - Generic') {
                    const existInDatabase = await Contact.findOne({ emailAddresses_EmailAddress: member.email_address })
                    if (!existInDatabase) {
                        const syncContact = new Contact({
                            emailAddresses_EmailAddress: member.email_address,
                            firstName: member.merge_fields.FNAME,
                            lastName: member.merge_fields.LNAME,
                            systemRecordId: member.merge_fields.IDRECORD,
                            dateChanged: member.merge_fields.DATECHANGE,
                            emailAddresses_DateChanged: member.merge_fields.EADATEC,
                            todaysVisitors: member.merge_fields.TVAV,
                            todaysVisitors_DateChanged: member.merge_fields.TVADATEC,
                            addresses_AddressLine_1: member.merge_fields.ADDRESS.addr1,
                            addresses_AddressLine_2: member.merge_fields.ADDRESS.addr2,
                            addressesCity: member.merge_fields.ADDRESS.city,
                            addressesZip: member.merge_fields.ADDRESS.zip,
                            addresses_StateAbbreviation: member.merge_fields.ADDRESS.state,
                            addresses_CountryAbbreviation: member.merge_fields.ADDRESS.country,
                            phonesNumber: member.merge_fields.PHONE,
                            phones_DateChanged: member.merge_fields.PHONEDATEC
                        })
                        try {
                            await syncContact.save();
                        } catch (error) {
                            throw new Error('An error occurred while trying to insert synchronized contacts.');
                        }
                    }
                }
            }
        } catch (error) {
            throw new Error('An error occurred when requesting contacts to mailchimp');
        }
        offset += count;
    } while (areAvailableContacts);
}