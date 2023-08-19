import { Uri } from 'vscode';
import { BaseView } from './base';

export class PageHomeView extends BaseView {
    get page(): Uri {
        return Uri.joinPath(this.webviewResourceRoot, 'index.html')
    }
}
