import { Request, Respond } from "../driver/interface";

export function ping(request: Request, respond: Respond) {
    console.log(request)

    respond(200, 'pong')
}