// Based on https://github.com/glebec/volleyball
import { HandleFunction, NextFunction } from "connect";
import * as http from "http";
import chalk from "chalk";

interface Cycle {
    log: (str: string) => void;
    time: [number, number];
}

const SPACE = " ";
export const responseLog = (): HandleFunction => {
    return (req: http.IncomingMessage, res: http.ServerResponse, next: NextFunction) => {
        // items shared between the request and response of just one cycle
        const cycle: Cycle = {
            log: getLogger(),
            time: process.hrtime()
        };
        const handleClose = () => logClose(req, res, cycle);
        res.on("finish", () => {
            logRes(req, res, cycle);
            res.removeListener("close", handleClose);
        });
        res.on("close", handleClose);

        next();
    };
};

function getLogger() {
    return (str: string) => {
        process.stdout.write(str + "\n");
    };
}

function logRes(req: http.IncomingMessage, res: http.ServerResponse, cycle: Cycle) {
    const status = res.statusCode;
    const meaning = http.STATUS_CODES[status];
    const type = res.getHeader("content-type");

    const statusColor = colorForStatus(status);

    let resLine = `${chalk.bold.underline(req.method || "GET")} ${req.url} `;
    resLine += `${chalk.dim("——>")} `;
    resLine += chalk[statusColor](`${status} ${meaning}`) + SPACE;
    if (type) resLine += chalk.blue.dim(String(type)) + SPACE;

    cycle.log(resLine);
}

function logClose(req: http.IncomingMessage, _res: http.ServerResponse, cycle: Cycle) {
    let closeLine = `${chalk.dim("—X—")} `;
    closeLine += `${chalk.bold.underline(req.method || "GET")} ${req.url} `;
    closeLine += chalk.red("connection closed before res end/flush");

    cycle.log(closeLine);
}

function colorForStatus(status: number) {
    if (status >= 500) return "red";
    if (status >= 400) return "yellow";
    if (status >= 300) return "cyan";
    if (status >= 200) return "green";
    return "reset";
}
