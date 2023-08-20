import {  Uri } from "vscode";
import { BaseView } from "./base";

export class SidebarView extends BaseView {
    get page(): Uri {
        return Uri.joinPath(this.webviewResourceRoot, 'index.html')
    }
}
