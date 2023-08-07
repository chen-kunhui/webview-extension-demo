import { ping } from "./controllers/PingController";
import { HttpMethod, Route } from "./driver/interface";
import { path } from "./driver/router";


export const URLS: Route[] = [
    path(HttpMethod.get, '/ping', ping)
]