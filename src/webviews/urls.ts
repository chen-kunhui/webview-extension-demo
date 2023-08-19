import { Route, registerUrl } from "simple-webview";
import { ping } from "./controllers/ping";

export const URLS: Route[] = [
    registerUrl('/ping', ping)
]
