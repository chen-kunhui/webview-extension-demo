import { Respond, JsonData } from "simple-webview";

export function ping(params: JsonData, respond: Respond) {
    console.log(params)
    respond({message: 'pong'})
}