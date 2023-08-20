import * as vscode from 'vscode';
import { DocumentGetter } from './documentGetter';
import { csvArray2Str, oneLineCsvStr2Array } from './helper';
import { PageManager } from './pageManager';

export class DocumentEditor {
    constructor(
		private document: vscode.TextDocument,
		private pageManager: PageManager
	) {}

	updateCell(row: number, col: number, text: string): Promise<any> {
		let rowTotal = this.pageManager.rowTotal();
		if (row < rowTotal) {
			let rowInfo = this.pageManager.getRowInfo(row);
			return this.updateExistRow(
				rowInfo.startLine,
				rowInfo.endLine,
				row,
				col,
				text
			)
		} else {
			return this.addNewRows(row, col, text);
		}
	}

	insertRow(params: any, documentGetter: DocumentGetter): Promise<any> {
		return new Promise<any>(resolve => {
			let rowNo = params.rowNo;
			if (!rowNo) {
				resolve({
					success: false
				});
				return;
			}
	
			let rowInfo = this.pageManager.getRowInfo(rowNo);
			let eol = this.document.eol === vscode.EndOfLine.LF ? "\n" : "\r\n";
			let line = this.document.lineAt(rowInfo.endLine);
			let newLine = [line.text, ''].join(eol);
			if (params.insterPosition === 'before') {
				line = this.document.lineAt(rowInfo.startLine);
				newLine = ['', line.text].join(eol);
			}
	
			const edit = new vscode.WorkspaceEdit();
			edit.replace(
				this.document.uri,
				line.range,
				newLine
			);
			vscode.workspace.applyEdit(edit).then(success => {
				if (success) {
					if (params.insterPosition === 'before') {
						this.pageManager.intertBeforeRow(rowNo);
					} else {
						this.pageManager.intertAfterRow(rowNo);
					}
					
					documentGetter.getDocument(params).then(rs => {
						resolve(rs)
					})
				} else {
					resolve({
						success: success
					});
				}
			});
		})
	}

	private updateExistRow(
		start: number,
		end: number,
		row: number,
		col: number,
		text: string
	): Promise<any> {
		return new Promise<any>(resolve => {
			let startLine = this.document.lineAt(start);
			let endLine = this.document.lineAt(end);
			let range: vscode.Range = new vscode.Range(startLine.range.start, endLine.range.end);
			let oldText: string = this.document.getText(range);
			let csv = oneLineCsvStr2Array(oldText);
			let oldCell = csv[col] || ''
			let oldLineCount = oldCell.split(/\n|\r\n/).length || 1;
			let newLineCount = text.split(/\n|\r\n/).length
	
			const edit = new vscode.WorkspaceEdit();
			csv[col] = text;
			let newLine = csvArray2Str([csv]);
			edit.replace(
				this.document.uri,
				range,
				newLine.trimEnd()
			);
	
			vscode.workspace.applyEdit(edit).then(success => {
				if (success) {
					if (oldLineCount !== newLineCount) {
						this.pageManager.updateRows(row, newLineCount - oldLineCount);
					}
				}
				resolve({success: success})
			});
		})
	}

	private addNewRows(row: number, col: number, text: string): Promise<any> {
		return new Promise<any>(resolve => {
			let csv: string[] = []
			for (let start = 0; start <= col; start++) {
				col === start ? csv.push(text) : csv.push('');
			}

			let totalRow = this.pageManager.rowTotal();
			let str = csvArray2Str([csv]);
			let lineCount = this.document.lineCount;
			const lineStr: vscode.TextLine = this.document.lineAt(lineCount - 1)
			let lines = [lineStr.text];
			let addRowTotal = row - totalRow;
			for (let start = 0; start <= addRowTotal; start ++) {
				if (start === addRowTotal) {
					lines.push(str.trimEnd());
				} else {
					lines.push('');
				}
			}

			const edit = new vscode.WorkspaceEdit()
			let eol = this.document.eol === vscode.EndOfLine.LF ? "\n" : "\r\n";
			let newLine = lines.join(eol);
			edit.replace(
				this.document.uri,
				lineStr.range,
				newLine
			);
			vscode.workspace.applyEdit(edit).then(success => {
				if (success) {
					this.pageManager.resetRows(this.document, this.pageManager.rowTotal() - 1)
				}
				resolve({success: success})
			});
		})
	}
}
