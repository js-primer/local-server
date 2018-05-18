import * as http from "http";
import * as path from "path";
import connect = require("connect");
import serveStatic = require("serve-static");
import { HandleFunction } from "connect";
import detectPort = require("detect-port");
import { responseLog } from "./middlewares/response-log";

const logSymbols = require("log-symbols");

export interface LocalServerOptions {
    rootDir?: string;
    port?: number;
}

export class LocalServer {
    public server!: http.Server;
    private rootDir: string;
    private port: number;

    constructor(options: LocalServerOptions) {
        this.rootDir = path.normalize(path.resolve(options.rootDir || "."));
        this.port = options.port || 3000;
    }

    start() {
        return detectPort(this.port).then(newPort => {
            if (this.port !== newPort) {
                console.log(`${logSymbols.warning} Port:${this.port} is already used. Lookup next available port.`);
            }
            const serve = serveStatic(this.rootDir, { index: ["index.html", "index.htm"] }) as HandleFunction;
            this.server = connect()
                .use(responseLog())
                .use(serve)
                .listen(newPort, function() {
                    console.log(`${logSymbols.info} Open http://localhost:${newPort}`);
                });
            return this.server;
        });
    }

    stop() {
        if (this.server) {
            this.server.close();
        }
    }
}
