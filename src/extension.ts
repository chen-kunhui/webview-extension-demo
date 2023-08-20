import * as vscode from 'vscode'
import { PageHomeView } from './webviews/views/demoView'
import { SidebarView } from './webviews/views/sidebar';
import { PanelView } from './webviews/views/panel';
import { CSVEditorProvider } from './csvEditorProvider';

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("start ...")
	const provider = new SidebarView(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(SidebarView.viewType, provider)
	);

	const panel = new PanelView(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(PanelView.viewType, panel)
	);

	context.subscriptions.push(vscode.commands.registerCommand(
		"extension-demo.open-in-edit",
		() => {
			new PageHomeView(context.extensionUri, 'pageHome').show()
		}
	));

	context.subscriptions.push(CSVEditorProvider.register(
		context,
		'extension-demo.csv-editor'
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
