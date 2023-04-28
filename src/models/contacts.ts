import monggose, { Schema, Document } from 'mongoose'

export interface Contact extends Document {
    firstName: string
    lastName: string
    systemRecordId: string
    dateChanged: string
    emailAddresses_EmailAddress: string
    emailAddresses_DateChanged: string
    todaysVisitors: string
    todaysVisitors_DateChanged: string
    addresses_AddressLine_1: string
    addresses_AddressLine_2: string
    addressesCity: string
    addressesZip: string
    addresses_StateAbbreviation: string
    addresses_CountryAbbreviation: string
    phonesNumber: string
    phones_DateChanged: string
}

const contactSchema = new Schema<Contact>({
    firstName: {
        type: String

    },
    lastName: {
        type: String

    },
    systemRecordId: {
        type: String
    },
    dateChanged: {
        type: String
    },
    emailAddresses_EmailAddress: {
        type: String,
        required: true
    },
    emailAddresses_DateChanged: {
        type: String
    },
    todaysVisitors: {
        type: String
    },
    todaysVisitors_DateChanged: {
        type: String
    },
    addresses_AddressLine_1: {
        type: String
    },
    addresses_AddressLine_2: {
        type: String
    },
    addressesCity: {
        type: String
    },
    addressesZip: {
        type: String
    },
    addresses_StateAbbreviation: {
        type: String
    },
    addresses_CountryAbbreviation: {
        type: String
    },
    phonesNumber: {
        type: String
    },
    phones_DateChanged: {
        type: String
    }
})

const Contact = monggose.model<Contact>('Contact', contactSchema)
export default Contact;