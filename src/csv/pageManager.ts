import * as vscode from 'vscode';

export interface RowInfo {
    rowNo: number // 从 1 开始计数
    startLine: number
    endLine: number
}

export class PageManager {
    private rows: RowInfo[] = [];
    private filterRows: number[] = [];

    initFilterCache(search: string, document: vscode.TextDocument) {
        let startAt: Date = new Date();
        this.clearFilter();
        let total = this.rowTotal();
        let repx = new RegExp(search, 'i');
        for (let i = 0; i < total; i ++) {
            let rowInfo = this.getRowInfo(i)
            let startLine = document.lineAt(rowInfo.startLine)
            let endLine = document.lineAt(rowInfo.endLine)
            let range: vscode.Range = new vscode.Range(startLine.range.start, endLine.range.end)
            let textLine: string = document.getText(range);
            if (repx.test(textLine)) {
                this.filterRows.push(rowInfo.rowNo - 1);
            }
        }
        console.log("设置搜索缓存耗时:", new Date().getTime() - startAt.getTime(), 'ms');
    }

    clearFilter() {
        this.filterRows = [];
    }

    filterTotal(): number {
        return this.filterRows.length;
    }

    getFilterRow(index: number): number {
        return this.filterRows[index];
    }

    rowTotal(): number {
        return this.rows.length;
    }

    getRowInfo(row: number): RowInfo {
        return this.rows[row];
    }

    getLastRowInfo(): RowInfo {
        return this.rows[this.rows.length - 1];
    }

    resetRows(document: vscode.TextDocument, currentRow: number = 0) {
        let startAt: Date = new Date();
        currentRow = currentRow <= 0 ? 0 : currentRow;
        let startRow = this.rows[currentRow];
        if (!startRow) {
            startRow = {
                rowNo: 1,
                startLine: 0,
                endLine: 0
            }
        }
        let flag = 0;
        let startLine: number | null = null;
        let texts = document.getText().split(/\n|\r\n/)
        let rowNo: number = currentRow;
        for (let line = startRow.startLine; line < texts.length; line ++) {
            if (startLine === null) { startLine = line; }

            let text = texts[line];
            for (let i = 0; i < text.length; i ++) {
                if (text[i] !== '"') { continue; }
                flag === 0 ? flag += 1 : flag -= 1;
            }
            if (flag !== 0) { continue; } 

            if (this.rows[rowNo]) {
                this.rows[rowNo] = {
                    rowNo: rowNo + 1,
                    startLine: startLine,
                    endLine: line
                }
            } else {
                this.rows.push({
                    rowNo: rowNo + 1,
                    startLine: startLine,
                    endLine: line
                });
            }

            rowNo += 1;
            startLine = null;
        }
        console.log("设置 csv 文件行信息耗时:", new Date().getTime() - startAt.getTime(), 'ms');
    }

    updateRows(currentRow: number, offset: number) {
        for(let i = currentRow; i < this.rows.length; i++) {
            if (i !== currentRow) {
                this.rows[i].startLine = this.rows[i].startLine + offset;
            }
            this.rows[i].endLine = this.rows[i].endLine + offset;
        }
    }

    intertAfterRow(rowNo: number) {
        if (rowNo === this.rows.length -1) { // 在行末追加
            let lastRow = this.getLastRowInfo();
            this.rows.push({
                rowNo: lastRow.rowNo + 1,
                startLine: lastRow.endLine + 1,
                endLine: lastRow.endLine + 1
            });
        } else {
            let before = this.rows.slice(0, rowNo + 1);
            let after = this.rows.slice(rowNo + 1);
            let row = this.rows[rowNo];
            before.push({
                rowNo: row.rowNo + 1,
                startLine: row.endLine + 1,
                endLine: row.endLine + 1
            });

            for(let i = 0; i < after.length; i++) {
                after[i].rowNo = after[i].rowNo + 1;
                after[i].startLine = after[i].startLine + 1;
                after[i].endLine = after[i].endLine + 1;
            }
            this.rows = before.concat(after);
        }

        // 更新过滤缓存, 避免行号改变后，导致搜索结果错误
        let newFilterResult: number[] = [];
        this.filterRows.forEach(i => {
            if (i > rowNo) {
                newFilterResult.push(i+1);
            } else {
                newFilterResult.push(i);
            }
            if (i === rowNo) {
                newFilterResult.push(rowNo + 1);
            }
        });
        this.filterRows = newFilterResult;
    }

    intertBeforeRow(rowNo: number) {
        if (rowNo === 0) { // 在行首前插入
            for(let i = 0; i < this.rows.length; i++) {
                this.rows[i].startLine = this.rows[i].startLine + 1;
                this.rows[i].endLine = this.rows[i].endLine + 1;
            }
            this.rows.unshift({
                rowNo: 1,
                startLine: 0,
                endLine: 0
            });
        } else {
            let before = this.rows.slice(0, rowNo);
            let after = this.rows.slice(rowNo);
            let row = this.rows[rowNo];
            before.push({
                rowNo: row.rowNo,
                startLine: row.startLine,
                endLine: row.startLine
            });

            for(let i = 0; i < after.length; i++) {
                after[i].rowNo = after[i].rowNo + 1;
                after[i].startLine = after[i].startLine + 1;
                after[i].endLine = after[i].endLine + 1;
            }
            this.rows = before.concat(after);
        }

        // 更新过滤缓存, 避免行号改变后，导致搜索结果错误
        let newFilterResult: number[] = [];
        this.filterRows.forEach(i => {
            if (i === rowNo) {
                newFilterResult.push(rowNo);
            }
            if (i >= rowNo) {
                newFilterResult.push(i+1);
            } else {
                newFilterResult.push(i);
            }
            
        });
        this.filterRows = newFilterResult;
    }
}
