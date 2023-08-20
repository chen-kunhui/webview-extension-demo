import * as vscode from 'vscode'
import { PageHomeView } from './webviews/views/demoView'
import { SidebarView } from './webviews/views/sidebar';
import { PanelView } from './webviews/views/panel';
import { CSVEditor } from './webviews/views/csvEditor';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("start ...")
	const provider = new SidebarView(context.extensionUri, 'sidebar');
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider('extension-demo.sidebar', provider)
	);

	const panel = new PanelView(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PanelView.viewType, panel)
	);

	const csvCustomEditor = new CSVEditor(context.extensionUri, 'csv-editor');
	context.subscriptions.push(
		vscode.window.registerCustomEditorProvider('extension-demo.csv-editor', csvCustomEditor)
	);

	context.subscriptions.push(vscode.commands.registerCommand(
		"extension-demo.open-in-edit",
		() => {
			new PageHomeView(context.extensionUri, 'pageHome').resolveView()
		}
	));

	context.subscriptions.push(vscode.commands.registerCommand('extension-demo.open-with-csv-editor', (uri: vscode.Uri) => {
		if (uri.scheme === 'file' && uri.path.endsWith('csv')) {
			vscode.commands.executeCommand('vscode.openWith', uri, 'extension-demo.csv-editor');
		} else {
			vscode.window.showWarningMessage("仅支持打开 .csv 后缀的文件");
		}
	}));
}

export function deactivate() { }
