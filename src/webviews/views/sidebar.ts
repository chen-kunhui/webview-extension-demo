import { CancellationToken, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext } from "vscode";
import { URLS } from "../urls";
import { RouteDispatcher } from "simple-webview";
import { readFileSync } from "fs";

export class SidebarView implements WebviewViewProvider {
	public static readonly viewType = 'extension-demo.sidebar';
    protected readonly webviewResourceRoot: Uri
    get page(): Uri {
        return Uri.joinPath(this.webviewResourceRoot, 'index.html')
    }

	constructor(
		public extensionUri: Uri
	) {
        this.webviewResourceRoot = Uri.joinPath(this.extensionUri, 'ui/dist')
    }

	public resolveWebviewView(
		webviewView: WebviewView,
		context: WebviewViewResolveContext,
		_token: CancellationToken,
	) {
		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,

			localResourceRoots: [
				this.webviewResourceRoot
			]
		};

		webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

		new RouteDispatcher(URLS).mount(webviewView.webview)
	}

	private _getHtmlForWebview(webview: Webview) {
		if (!webview) {
            return ''
        }

        const assetsHost = webview.asWebviewUri(this.page)
        const el = `<base href="${assetsHost}" />`
    
        let html = readFileSync(this.page.fsPath).toString()
        html = html.replace('<!--base tag-->', el)
        return html
	}
}
