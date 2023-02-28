import * as http from "http";
import * as path from "path";
import connect = require("connect");
import serveStatic = require("serve-static");
import { HandleFunction } from "connect";
import detectPort = require("detect-port");
import { responseLog } from "./middlewares/response-log";
import chalk from "chalk";
import logSymbols from "log-symbols";

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

    get appName() {
        return this.rootDir ? path.basename(this.rootDir) : "app";
    }

    start() {
        return detectPort(this.port).then((newPort) => {
            if (this.port !== newPort) {
                console.log(
                    `${logSymbols.warning} ポート番号:${this.port}はすでに使われています。利用できる別のポート番号を探索中です。`
                );
            }
            const serve = serveStatic(this.rootDir, { index: ["index.html", "index.htm"] }) as HandleFunction;
            this.server = connect()
                .use(responseLog())
                .use(serve)
                .listen(newPort, () => {
                    console.log(`
${chalk.underline(this.appName)}のローカルサーバを起動しました。
次のURLをブラウザで開いてください。

  URL: ${chalk.underline(`http://localhost:${newPort}`)}

Ctrl+Cのショートカットを押下することでローカルサーバを終了できます。
`);
                });
            return this.server;
        });
    }

    stop() {
        if (!this.server) {
            return;
        }
        this.server.close();
        console.log(`
${chalk.underline(this.appName)}のローカルサーバを終了しました。
`);
    }
}
