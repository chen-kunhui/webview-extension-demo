import * as vscode from 'vscode';
import { View } from './interface';
import { renderHtml } from './utils';
import { webviewResourcePath } from './constant';
import { RouteDispatcher } from '../driver/router';
import { URLS } from '../urls';

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
        new RouteDispatcher(URLS).mount(this.webview)

        this.webview.html = renderHtml(this);
    }
}