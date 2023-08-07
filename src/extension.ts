import * as vscode from 'vscode'
import { Page1View, Page2View, PageHomeView } from './webviews/views/demoView'

export function activate(context: vscode.ExtensionContext) {
	vscode.window.showInformationMessage("start ...")

	new PageHomeView(context.extensionUri, 'pageHome').show()
	new Page1View(context.extensionUri, 'page1').show()
	new Page2View(context.extensionUri, 'page2').show()
}

export function deactivate() {}
