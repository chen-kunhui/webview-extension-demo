import { JsonData, Respond } from "simple-webview";

export function initCsvEditor(params: JsonData, respond: Respond) {
    console.log(params)
    respond({success: true})
}

export function updateDocument(params: JsonData, respond: Respond) {
    console.log(params)
    respond({success: false})
}

export function saveDocument(params: JsonData, respond: Respond) {
    console.log(params)
    respond({success: false})
}

export function getDocument(params: JsonData, respond: Respond) {
    console.log(params)
    respond({success: false})
}

export function insertRow(params: JsonData, respond: Respond) {
    console.log(params)
    respond({success: false})
}
