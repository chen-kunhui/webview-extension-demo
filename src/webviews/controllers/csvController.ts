import { JsonData, Respond, Sender } from "simple-webview"
import { workspace } from "vscode";
import { CSVManager } from "../../csv/CSVManager";

export function initCsvEditor(params: JsonData, respond: Respond, send?: Sender) {
    let manage: CSVManager | undefined = CSVManager.cache.get(params.fsPath)
    if (manage) {
        let updateTimer: any = null;
		let event = workspace.onDidChangeTextDocument(e => {
            if (manage) {
                // ctrl + z, ctrl + y 时更新页面数据
                if (e.document.uri.fsPath === manage.document.uri.fsPath && e.reason) {
                    if (updateTimer) { clearInterval(updateTimer) }
                    updateTimer = setInterval(() => {
                        manage!.pageManager.resetRows(manage!.document, 0);
                        send && send({event: '/update/table'});
                        clearInterval(updateTimer);
                    }, 500);
                }
            }
		});

		manage.webviewPanel.onDidDispose(() => {
			event.dispose();
		});
        respond({success: true})
    } else {
        respond({success: false})
    }
}

export function updateDocument(params: JsonData, respond: Respond) {
    let manage: CSVManager | undefined = CSVManager.cache.get(params.fsPath)
    if (manage) {
		manage.documentEditor.updateCell(params.row, params.col, params.text).then(rs => {
            respond(rs)
        })
    } else {
        respond({success: false})
    }
}

export function saveDocument(params: JsonData, respond: Respond) {
    let manage: CSVManager | undefined = CSVManager.cache.get(params.fsPath)
    if (manage) {
        manage.document.save();
        respond({success: true})
    } else {
        respond({success: false})
    }
}

export function getDocument(params: JsonData, respond: Respond) {
    let manage: CSVManager | undefined = CSVManager.cache.get(params.fsPath)
    if (manage) {
        manage.documentGetter.getDocument(params).then(rs => {
            respond(rs)
        });
    } else {
        respond({success: false})
    }
}

export function insertRow(params: JsonData, respond: Respond) {
    let manage: CSVManager | undefined = CSVManager.cache.get(params.fsPath)
    if (manage) {
        manage.documentEditor.insertRow(params, manage.documentGetter);
    } else {
        respond({success: false})
    }
}
