<template>
    <div class="xf-excel" ref="appRef">
        <div class="cf-search">
            <input v-model="searchText" @input="updateSate" type="text" />
            <div>
                <span class="codicon codicon-search" @click="onSearch()"></span>
                <span class="codicon codicon-chrome-close" @click="closeSearchBox"></span>
            </div>
        </div>
        <div class="xf-excel-header">
            <div class="xf-excel-header-tool-btn" @click="saveDocument">
                <i class="codicon codicon-save"></i><span>保存(ctrl+S)</span>
            </div>
            <div class="xf-excel-header-tool-btn" @click="openSearchBox">
                <i class="codicon codicon-search"></i><span>搜索(ctrl+F)</span>
            </div>
            <div class="xf-excel-header-tool-btn" @click="openDoc">
                <i class="codicon codicon-library"></i><span>使用文档</span>
            </div>
            <div class="xf-excel-header-tool-btn" @click="feedback">
                <i class="codicon codicon-feedback"></i><span>使用反馈</span>
            </div>
        </div>
        <div class="xf-excel-content">
            <div class="xf-excel-preview-input">
                <div><i class="codicon codicon-edit"></i><span>{{activeCellName}}</span></div>
                <textarea class="xf-excel-preview-textarea" @input="onTextareaInput"></textarea>
            </div>
            <div class="xf-excel-body">
                <div class="xf-excel-body-bg"></div>
                <table cellspacing="0" border="0" cellpadding="0" @click="onTableClick">
                    <thead>
                        <tr>
                            <th v-for="(value, index) in tableHeader" :key="index">{{value}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <textarea class="cell-editor" style="visibility: hidden;" @input="onTextareaInput"></textarea>
                        <tr v-for="(tr, index) in tableData" :key="index">
                            <td class="row-num">
                                {{tr.rowNo}}
                            </td>
                            <td v-for="(td, i) in tr.cells" :key="i"><div class="xf-csv-tr-data">{{td}}</div></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="xf-excel-footer">
                <div class="xf-excel-status-bar">
                    <div><span :title="'文件总行数 | csv总行数'">【{{lineCount}}|{{rowTotal}}】</span></div>
                    <div><span>总条数</span><span>({{dataTotal}})</span></div>
                    <div><span>每页显示条数</span><span>({{prePage}})</span></div>
                    <div><span>当前选中单元格</span><span>({{activeCellName}})</span></div>
                    
                </div>
                <div class="xf-excel-pagination">
                    <button @click="gotoLastPage">上一页</button>
                    <select v-model="page" @change="gotoPage">
                        <option v-for="i in pageTotal" :key="i" :value="i">{{i}}</option>
                    </select>
                    <button @click="gotoNextPage">下一页</button>
                </div>
            </div>
        </div>
        <div class="xf-contextmenu">
            <ul>
                <li @click="insertRow('after')">在下方插入行</li>
                <li @click="insertRow('before')">在上方插入行</li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, ref } from "vue";
import { excelHeaderMap } from "./excelColMap";
import { Socket } from 'simple-webview';
import { message } from 'ant-design-vue';

let textarea: any = null;
let previewTextarea: any = null;
let activeCell: any = null;
let timer: any = null;
let csvTable: any = null;
let vscodeState = {
    page: 1,
    prePage: 100,
    searchText: '',
    lastTriggerSearchTxt: '',
    searchVisiable: false,
    activeCellPosition: {
        x: 1,
        y: 1
    }
}

const socket: Socket = inject('$socket')!
const appRef = ref<any>(null)
const initiated = ref(false)
const fsPath = ref('')
const tableHeader = ref(excelHeaderMap)
const tableData = ref<any[]>([]) // [{rowNo: 0, cells: [1,2,3]}, ...]
const searchText = ref('')
const lastTriggerSearchTxt = ref('')
const lineCount = ref(0)
const rowTotal = ref(0)
const dataTotal = ref(0)
const page = ref(1)
const prePage = ref(100)
const activeCellPosition = ref({
    x: 1,
    y: 1
})

onMounted(() => {
    let metaTag = document.querySelector('meta[name="fs-path"]')
    if (metaTag) {
        fsPath.value = metaTag.getAttribute('content') || ''
    }

    if (!fsPath.value) {
        return message.error('缺少 fsPath 信息!')
    }

    socket.send('/csv/editor/init', {fsPath: fsPath.value}).then(() => {
        page.value = vscodeState.page
        prePage.value = vscodeState.prePage
        activeCellPosition.value.x = vscodeState.activeCellPosition.x
        activeCellPosition.value.y = vscodeState.activeCellPosition.y
        searchText.value = vscodeState.searchText
        lastTriggerSearchTxt.value = vscodeState.lastTriggerSearchTxt

        if (vscodeState.searchVisiable) {
            let search = appRef.value.querySelector('.cf-search')
            search.setAttribute('style', 'visibility: visible')
        }

        gotoPage();

        socket.listen('/update/table', () => {
            gotoPage();
        })
    });
})

const pageTotal = computed(() => {
    return Math.ceil(dataTotal.value / prePage.value)
})

const activeCellName = computed(() => {
    let row = tableData.value[activeCellPosition.value.y - 1]?.rowNo || ''
    return `${excelHeaderMap[activeCellPosition.value.x]}${row}`
})


function updateSate() {
    vscodeState.searchText = searchText.value
}
function openDoc() {
    socket.send('/browser/open/url', {url: 'https://github.com'});
}
function feedback() {
    socket.send('/browser/open/url', {url: 'https://github.com'});
}
function saveDocument() {
    socket.send('/browser/open/url', {url: 'https://github.com'});
}
function openSearchBox() {
    let menu = document.querySelector('.xf-contextmenu')!;
    menu.setAttribute('style', 'hidden');
    let search = appRef.value.querySelector('.cf-search')
    let input = search.querySelector('input')
    search.setAttribute('style', 'visibility: visible')
    input.focus();
    vscodeState.searchVisiable = true
}
function initEvent() {
    if (initiated.value) return;

    document.addEventListener('contextmenu',(e: any)=>{
        e.preventDefault();
        let menu = document.querySelector('.xf-contextmenu')!;
        if (e.target.tagName === 'TD' && !e.target.className.includes("row-num")) {
            resetTextarea(e.target);
            menu.setAttribute('style', `visibility: visible; top: ${e.y}px;left: ${e.x}px;`)
        } else if (e.target.className.includes('xf-csv-tr-data')) {
            resetTextarea(e.target.parentNode);
            menu.setAttribute('style', `visibility: visible; top: ${e.y}px;left: ${e.x}px;`)
        } else if (e.target.tagName === 'TEXTAREA' && e.target.className.includes('cell-editor')) {
            menu.setAttribute('style', `visibility: visible; top: ${e.y}px;left: ${e.x}px;`)
        } else {
            menu.setAttribute('style', 'hidden');
        }
    })
    document.addEventListener('click', () => {
        let menu: any = document.querySelector('.xf-contextmenu');
        menu.setAttribute('style', 'hidden');
    })
    document.addEventListener('keydown',(e)=>{
        if(e.ctrlKey && e.key=== 'f'){
            openSearchBox();
        } else if (e.ctrlKey && e.key=== 's') {
            saveDocument();
        }
    })

    let objResizeObserver = new ResizeObserver((entries) => {
        if (entries[0] && entries[0].target.tagName === 'TD') {
            resetTextarea(activeCell, false)
        }
    });
    objResizeObserver.observe(activeCell);
}
function closeSearchBox() {
    let search = appRef.value.querySelector('.cf-search');
    search.setAttribute('style', 'visibility: hidden');
    searchText.value = '';
    vscodeState.searchText = ''
    vscodeState.searchVisiable = false
    lastTriggerSearchTxt.value = searchText.value
    vscodeState.lastTriggerSearchTxt = lastTriggerSearchTxt.value
    gotoPage(null, 1);
}
function onSearch() {
    lastTriggerSearchTxt.value = searchText.value
    vscodeState.lastTriggerSearchTxt = lastTriggerSearchTxt.value
    gotoPage(null, 1);
}
function onTableClick(e: any) {
    if (e.target.tagName === 'TD') {
        resetTextarea(e.target)
    } else if (e.target.className.includes('xf-csv-tr-data')) {
        resetTextarea(e.target.parentNode)
    }
}
function onTextareaInput(e: any) {
    if(e.target.className.includes("xf-excel-preview-textarea")) {
        textarea = previewTextarea
    } else if (e.target.className.includes("cell-editor")) {
        previewTextarea = textarea
    } else {
        return;
    }

    if (timer) { clearInterval(timer);}
    timer = setInterval(() => {
        clearInterval(timer)
        updateDocument(activeCell, textarea.value)
    }, 500)
}
function resetTextarea(cell: any, resetValue = true){
    if (!cell) {
        textarea.setAttribute('style', `visibility: hidden;`);
        previewTextarea.setAttribute('disabled', 'disabled');
        textarea.value = '';
        previewTextarea.value = '';
        return;
    }

    if(cell.className.includes("row-num")) {
        return
    }

    activeCell = cell

    let row = cell.parentElement.rowIndex
    let col = cell.cellIndex
    activeCellPosition.value.x = col
    activeCellPosition.value.y = row
    vscodeState.activeCellPosition.x = col
    vscodeState.activeCellPosition.y = row

    let text = activeCell.innerText
    let offsetWidth = activeCell.offsetWidth
    let offsetHeight = activeCell.offsetHeight
    let offsetTop = activeCell.offsetTop - 1
    let offsetLeft = activeCell.offsetLeft
    textarea.setAttribute('style', `visibility: visible; top: ${offsetTop}px;left: ${offsetLeft}px; width: ${offsetWidth - 11}px; height: ${offsetHeight - 11}px; padding: 5px;`);
    previewTextarea.removeAttribute('disabled');
    if (resetValue) {
        textarea.value = text
        previewTextarea.value = textarea.value
    }
}
function updateDocument(cell: any, text: string){
    let row = cell.parentElement.rowIndex - 1;
    let col = cell.cellIndex - 1;
    let line = tableData.value[row].rowNo - 1;

    socket.send('/csv/editor/update/document', {
        fsPath: fsPath.value,
        text: text,
        row: line,
        col: col
    }).then((data) => {
        if (data.success) {
            tableData.value[row].cells[col] = text;
        } else {
            console.error("=====修改文档失败=====")
        }
    });
}
function gotoLastPage(e: any) {
    if (page.value !== 1) {
        gotoPage(e, page.value - 1)
    }
}
function gotoNextPage(e: any) {
    if (page.value < pageTotal.value) {
        gotoPage(e, page.value + 1)
    }
}
function gotoPage(_?: any, p?: number) {
    if (p) {
        page.value = p
    }

    let params = {
        fsPath: fsPath.value,
        page: page.value,
        prePage: prePage.value,
        search: lastTriggerSearchTxt.value
    }

    socket.send('/csv/editor/get/document', params).then((data: any) => {
        console.log("===============data", data)
        lineCount.value = data.lineCount;
        rowTotal.value = data.rowTotal;
        dataTotal.value = data.dataTotal;
        tableData.value = initTableData(data.tableData);

        nextTick(function() {
            if (!initiated.value) {
                previewTextarea = appRef.value.querySelector('.xf-excel-preview-textarea');
                textarea = appRef.value.querySelector('.cell-editor');
                csvTable = appRef.value.querySelector('table');
                try {
                    activeCell = csvTable.rows[activeCellPosition.value.y].cells[activeCellPosition.value.x];
                } catch (error) {
                    activeCell = null;
                }
                initEvent();
                initiated.value = true
            } else {
                vscodeState.page = page.value
                activeCell = csvTable.querySelector('td:nth-child(2)');
            }

            resetTextarea(activeCell);
        })
    })
}
function initTableData(data: any) {
    let colSize = tableHeader.value.length - 1
    let result = new Array(prePage.value)
    if (lastTriggerSearchTxt.value) {
        result = new Array(data.length);
    }

    let tempi = [];
    let row = 0;
    let concatArray: any = new Array(colSize);
    let valid = false; // 标识该条数据是否是文件中真实存在的数据
    for (let index = 0; index < result.length; index ++) {
        if (data[index]) {
            row = data[index].rowNo;
            valid = true;
        } else {
            row += 1;
            valid = false;
        }
        tempi = data[index]?.cells || []

        if (tempi.length >= colSize) {
            result[index] = { valid: valid, rowNo: row, cells: tempi }
        } else {
            result[index] = { valid: valid, rowNo: row, cells: tempi.concat(concatArray.slice(0, colSize - tempi.length).join(',').split(','))}
        }
    }
    return result
}
function insertRow(position: any) {
    let row = activeCell.parentElement.rowIndex - 1;
    let col = activeCell.cellIndex;
    if (!tableData.value[row].valid) {
        return;
    }
    let line = tableData.value[row].rowNo - 1;
    let params = {
        fsPath: fsPath.value,
        rowNo: line,
        insterPosition: position,
        page: page.value,
        prePage: prePage.value,
        search: lastTriggerSearchTxt.value
    }
    socket.send('/csv/editor/insert/row', params).then((data) => {
        if (data.success) {
            lineCount.value = data.lineCount;
            rowTotal.value = data.rowTotal;
            dataTotal.value = data.dataTotal;
            tableData.value = initTableData(data.tableData);
            nextTick(function() {
                let newrow = position === 'before' ? row + 2 : row + 1;
                activeCell = csvTable.rows[newrow].cells[col];
                resetTextarea(activeCell);
            });
        }
    })
}
</script>
