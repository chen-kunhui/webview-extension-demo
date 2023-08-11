import * as vscode from 'vscode'
import { View } from './interface'
import { RouteDispatcher } from '../driver/router'
import { URLS } from '../urls'
import { readFileSync } from 'fs'

export abstract class BaseView implements View {
    abstract readonly page: vscode.Uri;
    protected webview: vscode.Webview | undefined | null;
    protected readonly webviewResourceRoot: vscode.Uri

    constructor (
        public extensionUri: vscode.Uri,
        public readonly title: string,
        public readonly viewType?: string,
    ) {
        this.webviewResourceRoot = vscode.Uri.joinPath(this.extensionUri, 'webview/dist')
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

        this.webview.html = this.renderHtml()
    }

    protected renderHtml(): string {
        if (!this.webview) {
            return ''
        }
    
        const assetsHost = this.webview.asWebviewUri(this.page)
        const el = `<base href="${assetsHost}" />`
    
        let html = readFileSync(this.page.fsPath).toString()
        html = html.replace('<!--base tag-->', el)
        return html
    }
}
