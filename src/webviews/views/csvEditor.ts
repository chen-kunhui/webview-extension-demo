import * as vscode from 'vscode';
import { BaseView } from './base';
import { CSVManager } from '../../csv/csvManager';

export class CSVEditor extends BaseView {
    get page(): vscode.Uri {
        return vscode.Uri.joinPath(this.webviewResourceRoot, 'src/pages/csv/index.html')
    }

    public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		token: vscode.CancellationToken
	): Promise<void> {
		CSVManager.resolveCustomTextEditor(document, webviewPanel, token)
		this.renderWebview(webviewPanel.webview, [`<meta name="fs-path" content="${document.uri.fsPath}" />`])
	}
}
