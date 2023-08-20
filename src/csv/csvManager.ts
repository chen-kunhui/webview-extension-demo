import { TextDocument, WebviewPanel, CancellationToken } from "vscode";
import { DocumentEditor } from "./documentEditor";
import { DocumentGetter } from "./documentGetter";
import { PageManager } from "./pageManager";

export class CSVManager {
    static cache: Map<string, CSVManager> = new Map()

    public documentEditor: DocumentEditor;
	public documentGetter: DocumentGetter;
	public pageManager: PageManager = new PageManager();
    constructor(public document: TextDocument , public webviewPanel: WebviewPanel) {
        this.pageManager = new PageManager();
        this.pageManager.resetRows(document, 0);
        this.documentGetter = new DocumentGetter(document, this.pageManager);
        this.documentEditor = new DocumentEditor(document, this.pageManager);
    }

    static resolveCustomTextEditor(
        document: TextDocument,
		webviewPanel: WebviewPanel,
		_token: CancellationToken
    ) {
        CSVManager.cache.set(document.uri.fsPath, new CSVManager(document, webviewPanel))
    }
}