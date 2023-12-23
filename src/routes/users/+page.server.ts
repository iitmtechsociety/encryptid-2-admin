import { adminDB } from '$lib/server/admin';

/** @type {import('./$types').PageLoad} */
export async function load({params}) {
    const users = await adminDB.collection('users').get();
    return {
   
        userList: users.docs.map(doc => {
            let docData = doc.data();
            docData['accountCreated'] = docData['accountCreated'].toDate();
            return docData;
        })
        
    }
} 
