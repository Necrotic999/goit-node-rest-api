import Contact from "../models/contactsMongooseSchemas.js";

// const updateContacts = (contacts) =>
//   fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export function listContacts() {
  Contact.find();
}

// export async function getContactById(contactId) {
//   const contacts = await listContacts();
//   const result = contacts.find((contact) => contact.id === contactId);
//   return result || null;
// }

// export async function removeContact(contactId) {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((contact) => contact.id === contactId);
//   if (index === -1) {
//     return null;
//   }
//   const [result] = contacts.splice(index, 1);
//   await updateContacts(contacts);
//   return result;
// }

export function addContact(data) {
  return Contact.create(data);
}

// export async function updateContactById(contactId, data) {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((contact) => contact.id === contactId);
//   if (index === -1) {
//     return null;
//   }
//   contacts[index] = { ...contacts[index], ...data };

//   await updateContacts(contacts);
//   return contacts[index];
// }
