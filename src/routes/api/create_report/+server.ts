import {adminDB} from '$lib/server/admin';
import {error,json} from '@sveltejs/kit';
import {utils,writeXLSX,writeFile} from 'xlsx';

/** @type {import('./$types').RequestHandler} */
export async function GET ({ request }) {
    const users = await adminDB.collection('users').get();
    const userDataJSON = [];
    users.forEach(user => {
        const data = user.data();
        userDataJSON.push({
            "Username": data.username,
            "Email": data.email,
            "Account Created": data.accountCreated.toDate().toLocaleString(),
            "User ID": data.userId
    });
    const worksheet = utils.json_to_sheet(userDataJSON);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Users");
    const buffer = writeXLSX(workbook, {type: "buffer"});
    const filename = "users.xlsx";
    const mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    return {
        headers: {
            "Content-Disposition": `attachment; filename=${filename}`,
            "Content-Type": mimeType
        },
        body: buffer
    };
});
}
