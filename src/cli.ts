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
            }
        }
    );

    const server = new LocalServer({
        rootDir: cli.flags.input.length > 0 ? cli.flags.input[0] : process.cwd(),
        port: cli.flags.port !== undefined ? Number(cli.flags.port) : 3000
    });
    return server
        .start()
        .then(() => {})
        .catch(error => {
            console.error(error.message);
        });
};
