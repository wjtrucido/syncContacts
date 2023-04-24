import monggose, { Schema, Document } from 'mongoose'

export interface Contact extends Document {
    firstName: string
    lastName: string
    systemRecordId: string
    dateChanged: Date
    emailAddresses_EmailAddress: string
    emailAddresses_DateChanged: Date
    todaysVisitors: string
    todaysVisitors_DateChanged: Date
    addresses_AddressLine_1: string
    addresses_AddressLine_2: string
    addressesCity: string
    addressesZip: string
    addresses_StateAbbreviation: string
    addresses_CountryAbbreviation: string
    phonesNumber: string
    phones_DateChanged: Date
}

const contactSchema = new Schema<Contact>({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    systemRecordId: {
        type: String
    },
    dateChanged: {
        type: Date
    },
    emailAddresses_EmailAddress: {
        type: String,
        required: true
    },
    emailAddresses_DateChanged: {
        type: Date
    },
    todaysVisitors: {
        type: String
    },
    todaysVisitors_DateChanged: {
        type: Date
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
        type: Date
    }
})

const Contact = monggose.model<Contact>('Contact', contactSchema)
export default Contact;