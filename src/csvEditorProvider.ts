import * as vscode from 'vscode';
import { readFileSync } from 'fs';
import { URLS } from './webviews/urls';
import { RouteDispatcher } from 'simple-webview';
import { CSVManager } from './csv/CSVManager';

export class CSVEditorProvider implements vscode.CustomTextEditorProvider {
    protected readonly webviewResourceRoot: vscode.Uri
    get page(): vscode.Uri {
        return vscode.Uri.joinPath(this.webviewResourceRoot, 'ui/dist/src/pages/csv/index.html')
    }

	constructor(
		context: vscode.ExtensionContext,
	) {
        this.webviewResourceRoot = context.extensionUri
    }

	public static register(
		context: vscode.ExtensionContext,
		viewType: string
	): vscode.Disposable {
		const provider = new CSVEditorProvider(context);
		const providerRegistration = vscode.window.registerCustomEditorProvider(viewType, provider);

		return providerRegistration;
	}

	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		token: vscode.CancellationToken
	): Promise<void> {
		webviewPanel.webview.options = {
			enableScripts: true,
            localResourceRoots: [
				this.webviewResourceRoot
			]
		};
        CSVManager.resolveCustomTextEditor(document, webviewPanel, token)

        const getHtmlForWebview = (webview: vscode.Webview) => {
            if (!webview) {
                return ''
            }
    
            const assetsHost = webview.asWebviewUri(this.page)
            const el = `<base href="${assetsHost}" /><meta name="fs-path" content="${document.uri.fsPath}" />`
        
            let html = readFileSync(this.page.fsPath).toString()
            html = html.replace('<!--base tag-->', el)
            return html
        }
        new RouteDispatcher(URLS).mount(webviewPanel.webview)
		webviewPanel.webview.html = getHtmlForWebview(webviewPanel.webview);
	}
}
