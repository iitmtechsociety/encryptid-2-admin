import { adminDB , adminStorage} from '$lib/server/admin';
import { error, json } from '@sveltejs/kit';
import { FieldValue } from 'firebase-admin/firestore';
/** @type {import('./$types').RequestHandler}*/
export async function DELETE({ params }) {   
    try {
        await adminDB.runTransaction(async (transaction) => {
        const doc = await transaction.get(adminDB.collection('levels').doc(params.id));
            if (!doc.exists) throw error(400, 'Level does not exist');
            const data = doc.data();
            if (data.files.length > 0) { 
                data.files.forEach(async (file) => {
                    await adminStorage.bucket().file(file.path).delete();
                });
            }
            if (data.images.length > 0) { 
                data.images.forEach(async (image) => {
                    await adminStorage.bucket().file(image.path).delete();
                });
            }
            
            
        await transaction.delete(doc.ref);
        await transaction.update(adminDB.collection('index').doc('metrics'), {
            levels: FieldValue.increment(-1),
        });
        await transaction.update(adminDB.collection('index').doc('levels'), {
            answers: FieldValue.arrayRemove(doc.data().answer),
            order: FieldValue.arrayRemove(params.id),
        });
    }
    );
    return json({ success: true });
    
    } catch (e) {
        console.log(e);
        throw error(500, 'Internal Server Error');
    }
}