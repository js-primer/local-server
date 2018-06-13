import * as http from "http";
import * as path from "path";
import connect = require("connect");
import serveStatic = require("serve-static");
import { HandleFunction } from "connect";
import detectPort = require("detect-port");
import { responseLog } from "./middlewares/response-log";
import chalk from "chalk";

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
                console.log(
                    `${logSymbols.warning} ポート番号:${
                        this.port
                    }はすでに使われています。利用できる別のポート番号を探索中です。`
                );
            }
            const serve = serveStatic(this.rootDir, { index: ["index.html", "index.htm"] }) as HandleFunction;
            this.server = connect()
                .use(responseLog())
                .use(serve)
                .listen(newPort, () => {
                    const appName = path.basename(this.rootDir) || "app";
                    console.log(`
${chalk.underline(appName)}のローカルサーバを起動しました。
次のURLをブラウザで開いてください。

  URL: ${chalk.underline(`http://localhost:${newPort}`)}

`);
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
