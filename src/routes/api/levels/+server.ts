import { error, json } from '@sveltejs/kit';
import { adminDB, adminStorage } from '$lib/server/admin';
import { FieldValue } from 'firebase-admin/firestore';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    let levelData = await request.json();
    if (!levelData) throw error(400, 'Missing levelData');
    try {
        await adminDB.runTransaction(async (transaction) => {
            const doc = await transaction.get(adminDB.collection('levels').doc(levelData.levelId));
            if (doc.exists) throw error(400, 'Level already exists');
            levelData['createdAt'] = FieldValue.serverTimestamp();
            await transaction.set(doc.ref, levelData);
            await transaction.update(adminDB.collection('index').doc('metrics'), {
                levels: FieldValue.increment(1),
            });
            await transaction.update(adminDB.collection('index').doc('levels'), {
                answers: FieldValue.arrayUnion(levelData.answer),
                order: FieldValue.arrayUnion(levelData.levelId),
            });
        });
        return json({ success: true });
    } catch (e) {
        console.log(e);
        throw error(500, 'Internal Server Error');
    }
}

