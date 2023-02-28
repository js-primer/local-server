import meow = require("meow");
import { LocalServer } from "./local-server";

export const run = () => {
    const cli = meow(
        `
    Usage
      $ npx @js-primer/local-server [<directory>]

    Options:
      --port  TCP port at which the files will be served

    Examples
      $ npx @js-primer/local-server 
      $ npx @js-primer/local-server ./docs
`,
        {
            flags: {
                port: {
                    type: "string"
                }
            },
            autoVersion: true,
            autoHelp: true
        }
    );

    const server = new LocalServer({
        rootDir: cli.input.length > 0 ? cli.input[0] : process.cwd(),
        port: cli.flags.port !== undefined ? Number(cli.flags.port) : 3000
    });
    // Ctrl + C を押したときにメッセージを出す
    process.on("SIGINT", function() {
        server.stop();
        process.exit();
    });
    return server
        .start()
        .then(() => {})
        .catch(error => {
            console.error(error.message);
        });
};
