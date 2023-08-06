import { Uri, ViewColumn, Webview } from "vscode";

export interface View {
    readonly page: Uri
    extensionUri: Uri
    webview: Webview | null | undefined
    webviewResourceRoot: Uri

    show: (viewColumn?: ViewColumn) => void
}