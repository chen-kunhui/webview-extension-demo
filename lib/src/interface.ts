export interface JsonData {
    [key: string]: any
}

export interface Request {
    uuid: string,
    url: string,
    params: JsonData
}

export interface Response {
    uuid: string,
    url: string,
    data: JsonData
    errorMsg?: string
}

export interface Respond {
    (data: JsonData): void
}

export interface Sender {
    (data: JsonData): void
}

export interface Disposable {
    dispose(): any;
}

export interface SocketAdapter {
    send: (message: Request) => any
    onmessage: (callback: (message: Response) => any) => any
}

export interface Socket {
    send: (url: string, params?: JsonData) => Promise<any>
    listen: (channel: string, callback: Respond) => void
}

export interface ViewServer {
    postMessage(message: Response): any
    onDidReceiveMessage(listener: (e: Request) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface RouteHandle {
    (params: JsonData, respond: Respond, send?: Sender): void
}

export interface Route {
    url: string
    handle: RouteHandle
}
