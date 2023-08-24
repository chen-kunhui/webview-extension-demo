import { Disposable, ViewServer, Response, Request, SocketAdapter, RouteDispatcher } from "simple-webview";
import { URLS } from "./urls";

export class MockSocket implements SocketAdapter {
    private server: MockServer = new MockServer(this)
    listener: any = null
    send(message: Request): any {
        this.server.listener && this.server.listener(message)
    }

    onmessage(callback: (message: Response) => any) {
        this.listener = callback
    }

    receiveServerMsg(message: Response) {
        this.listener && this.listener(message)
    }
}

class MockServer implements ViewServer {
    listener: any = null
    constructor(private client: MockSocket) {
        new RouteDispatcher(URLS).mount(this)
    }

    postMessage(message: Response): any {
        this.client.receiveServerMsg(message)
    }

    onDidReceiveMessage(listener: (e: Request) => any, _?: any, __?: Disposable[]): Disposable {
        this.listener = listener
        return this
    };

    dispose(): any {
    }
}