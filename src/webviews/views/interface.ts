import { Uri, ViewColumn, Webview } from "vscode";

export interface View {
    readonly page: Uri

    show: (viewColumn?: ViewColumn) => void
}