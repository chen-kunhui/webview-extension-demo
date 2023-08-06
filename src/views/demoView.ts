import { Uri } from 'vscode';
import { BaseView } from './base';

export class PageHomeView extends BaseView {
    get page(): Uri {
        return Uri.joinPath(this.webviewResourceRoot, 'index.html')
    }
}

export class Page1View extends BaseView {
    get page(): Uri {
        return Uri.joinPath(this.webviewResourceRoot, 'src/pages/page1/index.html')
    }
}

export class Page2View extends BaseView {
    get page(): Uri {
        return Uri.joinPath(this.webviewResourceRoot, 'src/pages/page2/index.html')
    }
}