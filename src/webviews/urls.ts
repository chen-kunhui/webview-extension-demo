import { Route, registerUrl } from "simple-webview";
import { ping } from "./controllers/ping";
import { openUrl } from "./controllers/common";
import { getDocument, initCsvEditor, insertRow, saveDocument, updateDocument } from "./controllers/csvController";

export const URLS: Route[] = [
    registerUrl('/ping', ping),
    registerUrl('/browser/open/url', openUrl),
    registerUrl('/csv/editor/init', initCsvEditor),
    registerUrl('/csv/editor/update/document', updateDocument),
    registerUrl('/csv/editor/get/document', getDocument),
    registerUrl('/csv/editor/save/document', saveDocument),
    registerUrl('/csv/editor/insert/row', insertRow),
]
