import * as vscode from 'vscode';
import { View } from './interface';
import { renderHtml } from './utils';
import { webviewResourcePath } from './constant';

export abstract class BaseView implements View {
    abstract readonly page: vscode.Uri;
    public webview: vscode.Webview | undefined | null;
    public readonly webviewResourceRoot: vscode.Uri

    constructor (
        public extensionUri: vscode.Uri,
        public readonly title: string,
        public readonly viewType?: string,
    ) {
        this.webviewResourceRoot = vscode.Uri.joinPath(this.extensionUri, webviewResourcePath)
        this.viewType = viewType || this.title
    }

    public show(viewColumn: vscode.ViewColumn = vscode.ViewColumn.Active) {
        const panel = vscode.window.createWebviewPanel(
            this.viewType || this.title,
            this.title,
            viewColumn,
            {
                enableScripts: true,
                localResourceRoots: [this.webviewResourceRoot]
            }
        );
        this.webview = panel.webview;
        this.webview.html = renderHtml(this);

        this.webview.onDidReceiveMessage((data: any) => {
            console.log("================onDidReceiveMessage", data)
            panel.webview.postMessage({
                uuid: data.uuid,
                request: data.request,
                status: 200,
                statusText: 'success',
                data: {message: 'success'}
            })
        })
    }
}