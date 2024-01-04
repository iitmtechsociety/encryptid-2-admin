import { error,json } from '@sveltejs/kit';
import { adminDB } from '$lib/server/admin';
import { FieldValue } from 'firebase-admin/firestore';
/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    const { userId } = await request.json();
    if(!userId) throw error(400, 'Missing userId');
    try {
        await adminDB.runTransaction(async (transaction) => {
        const doc = await transaction.get(adminDB.collection('users').doc(userId));
        if (!doc.exists) throw error(404, 'User not found');
        const user = doc.data();
        if (!user.banned) throw error(400, 'User already unbanned');
        const unbanLog = {
            type: 'unban',
            timestamp: Date.now(),
        };
             transaction.update(doc.ref, { banned: false, logs: FieldValue.arrayUnion(unbanLog),
                level: user.oldLevel,
                points: user.oldPoints,
            }); 
            const lb_updater_task = {
                timestamp: Date.now(),
                newLevel: user.oldLevel,
                newPoints: user.oldPoints,
                userId: userId,
            }
            transaction.update(adminDB.collection('index').doc('leaderboard_task_queue'),{
                jobs: FieldValue.arrayUnion(lb_updater_task),   
            });
            transaction.update(adminDB.collection('index').doc('users'), {
                banned: FieldValue.arrayRemove(userId),
            });
             transaction.update(adminDB.collection('index').doc('metrics'), {
                banned: FieldValue.increment(-1),
            });
        });
        return json({ success: true });
    } catch (e) {
        console.log(e);
        throw error(500, 'Internal Server Error');
    }
}