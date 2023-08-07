import { readFileSync } from 'fs'
import { View } from './interface';

export function renderHtml(view: View): string {
    if (!view.webview) {
        return ''
    }

    const assetsHost = view.webview.asWebviewUri(view.page)
    const el = `<base href="${assetsHost}" />`

    let html = readFileSync(view.page.fsPath).toString()
    html = html.replace('<!--base tag-->', el)
    return html
}
