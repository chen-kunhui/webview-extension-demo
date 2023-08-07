import { Disposable } from "vscode";

export enum HttpMethod {
    get = 'get',
    post = 'post',
    put = 'put',
    delete = 'delete'
}

export interface ViewServer {
    postMessage(message: any): any
    onDidReceiveMessage(listener: (e: any) => any, thisArgs?: any, disposables?: Disposable[]): Disposable;
}

export interface Request {
    method: HttpMethod,
    url: string,
data: { [key: string]: any }
}

export type Respond = {
    (status: number, data: any): void
}

export interface Route {
    method: HttpMethod
    url: string
    handle: (request: Request, respond: Respond) => void | any,
    thisArgs?: any
}