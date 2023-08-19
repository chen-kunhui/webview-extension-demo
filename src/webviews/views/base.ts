import {Uri, Webview, ViewColumn, window} from 'vscode'
import { View } from './interface'
import { URLS } from '../urls'
import { readFileSync } from 'fs'
import { RouteDispatcher } from 'simple-webview'

export abstract class BaseView implements View {
    abstract readonly page: Uri;
    protected webview: Webview | undefined | null;
    protected readonly webviewResourceRoot: Uri

    constructor (
        public extensionUri: Uri,
        public readonly title: string,
        public readonly viewType?: string,
    ) {
        this.webviewResourceRoot = Uri.joinPath(this.extensionUri, 'ui/dist')
        this.viewType = viewType || this.title
    }

    public show(viewColumn: ViewColumn = ViewColumn.Active) {
        const panel = window.createWebviewPanel(
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
