import * as vscode from 'vscode'
import { PageHomeView } from './webviews/views/demoView'
import { SidebarView } from './webviews/views/sidebar';
import { PanelView } from './webviews/views/panel';

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

}

export function deactivate() { }
