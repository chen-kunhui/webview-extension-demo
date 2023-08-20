import { Uri, Webview, ViewColumn, window, WebviewView, WebviewViewResolveContext, CancellationToken, WebviewViewProvider, TextDocument, WebviewPanel, CustomTextEditorProvider } from 'vscode'
import { URLS } from '../urls'
import { readFileSync } from 'fs'
import { RouteDispatcher } from 'simple-webview'

export abstract class BaseView implements WebviewViewProvider, CustomTextEditorProvider {
    public readonly viewType: string
    public readonly title: string

    protected readonly webviewResourceRoot: Uri

    abstract readonly page: Uri;

    constructor(
        public readonly extensionUri: Uri,
        viewType: string,
        title?: string,
    ) {
        this.viewType = viewType
        this.title = title || this.viewType
        this.webviewResourceRoot = Uri.joinPath(this.extensionUri, 'ui/dist')
    }

    // 侧边栏和底部面板类型的 webview
    public resolveWebviewView(
        webviewView: WebviewView,
        _: WebviewViewResolveContext,
        __: CancellationToken,
    ) {
        this.renderWebview(webviewView.webview)
    }

    // 自定义编辑器渲染器类型的webview
    public async resolveCustomTextEditor(
		document: TextDocument,
		webviewPanel: WebviewPanel,
		token: CancellationToken
	): Promise<void> {
		this.renderWebview(webviewPanel.webview)
	}

    // 编辑区 webview
    public resolveView(viewColumn: ViewColumn = ViewColumn.Active) {
        const panel = window.createWebviewPanel(
            this.viewType,
            this.title,
            viewColumn
        );

        this.renderWebview(panel.webview)
    }

    public renderWebview(webview: Webview, metaTags: string[] = []) {
        webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this.webviewResourceRoot
            ]
        };
        new RouteDispatcher(URLS).mount(webview)
        this.renderHtml(webview, metaTags)
    }

    protected renderHtml(webview: Webview, metaTags: string[] = []) {
        const assetsHost = webview.asWebviewUri(this.page)
        let el = [`<base href="${assetsHost}" />`]
        if (metaTags) {
            el = [...el, ...metaTags]
        }

        let html = readFileSync(this.page.fsPath).toString()
        html = html.replace('<!--base tag-->', el.join("\n"))
        webview.html = html
    }
}
