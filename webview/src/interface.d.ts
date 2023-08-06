export interface VsCode {
    postMessage: (message: any) => void
    getState: () => any
    setState: (newState: any) => void
}

export interface AjaxConfig {
    method: string,
    url: string,
    data: { [key: string]: any }
}

export interface AjaxSender {
    send: <T>(config: AjaxConfig) => Promise<AjaxResponse<T>>
}

export interface AjaxResponse<T> {
    data: T;
    status: number;
    statusText: string;
}
