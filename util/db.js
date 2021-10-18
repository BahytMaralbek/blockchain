const { google } = require('googleapis')

const spreadsheetId = "1GxuBUv9gwKHC9sP4qulcX8CUyon86-ECSalXU6-1f4U"

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const client = auth.getClient();

const googleSheets = google.sheets({ version: "v4", auth: client});

// const metadata = googleSheets.spreadsheets.get({
//     auth, 
//     spreadsheetId
// })

async function getRows() {
    const rows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Лист1!A2:K500"
    })

    return rows
}
let date = new Date()

async function writeRows(array) {
    const rows = await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Лист1!A:H",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [
                array
            ]
        }
    })
    console.log('Here', array)
    return rows
}


module.exports = {
    getRows,
    writeRows 
}