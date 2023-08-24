import { JsonData, Respond } from "simple-webview";

export function openUrl(params: JsonData, respond: Respond) {
    console.log(params)
    respond({status: 200})
}