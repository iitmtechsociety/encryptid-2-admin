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
        const banLog = {
            type: 'ban',
            timestamp: Date.now(),
        };
        const lb_updater_task = {
            timestamp: Date.now(),
            newLevel: 1,
            newPoints: 0,
            userId: userId,

        }
            transaction.update(doc.ref, { banned: true,logs: FieldValue.arrayUnion(banLog),
                oldLevel: user.level,
                oldPoints: user.points,
                level: 1,
                points: 0,
            });
            transaction.update(adminDB.collection('index').doc('users'), {
                banned: FieldValue.arrayUnion(userId),  
            });

            transaction.update(adminDB.collection('index').doc('metrics'), {
                banned: FieldValue.increment(1),
                
            })
            transaction.update(adminDB.collection('index').doc('leaderboard_task_queue'),{
                jobs: FieldValue.arrayUnion(lb_updater_task),   
            });
    });
        return json({ success: true });
    } catch (e) {
        console.log(e);
        throw error(500, 'Internal Server Error');
    }
}