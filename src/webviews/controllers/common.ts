import { JsonData, Respond } from "simple-webview";
import { commands } from "vscode";

export function openUrl(params: JsonData, respond: Respond) {
    commands.executeCommand('vscode.open', params.url);
    respond({status: 200})
}