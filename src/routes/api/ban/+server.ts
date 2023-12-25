import { error,json } from '@sveltejs/kit';
import { adminDB } from '$lib/server/admin';
import { FieldValue } from 'firebase-admin/firestore';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { userId } = await request.json();
    console.log(userId);
    if(!userId) throw error(400, 'Missing userId');
    try {
        await adminDB.runTransaction(async (transaction) => {
        const doc = await transaction.get(adminDB.collection('users').doc(userId));
        if (!doc.exists) throw error(404, 'User not found');
        const user = doc.data();
        if (user.banned) throw error(400, 'User already banned');
            await transaction.update(doc.ref, { banned: true });
            await transaction.update(adminDB.collection('index').doc('metrics'), {
                banned: FieldValue.increment(1),
            })
    });
        return json({ success: true });
    } catch (e) {
        console.log(e);
        throw error(500, 'Internal Server Error');
    }
}