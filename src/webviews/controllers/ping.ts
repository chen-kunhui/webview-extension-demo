import { Respond, JsonData } from "simple-webview";

export function ping(request: JsonData, respond: Respond) {
    respond({message: 'pong'})
}