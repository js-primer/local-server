const assert = require("assert");
const path = require("path");
const request = require("supertest");
const { LocalServer } = require("../src/local-server");
const fixtures = path.join(__dirname, "/fixtures");

async function createServer(dir) {
    const server = new LocalServer({
        rootDir: dir || fixtures
    });
    await server.start();
    return server.server;
}

describe("LocalServer", function() {
    describe("basic operations", function() {
        let server;
        before(async function() {
            server = await createServer();
        });
        after(() => {
            return server.close();
        });

        it("should serve static files", function(done) {
            request(server)
                .get("/todo.txt")
                .expect(200, "- groceries", done);
        });

        it("should support nesting", function(done) {
            request(server)
                .get("/users/tobi.txt")
                .expect(200, "ferret", done);
        });

        it("should set Content-Type", function(done) {
            request(server)
                .get("/todo.txt")
                .expect("Content-Type", "text/plain; charset=UTF-8")
                .expect(200, done);
        });

        it("should set Last-Modified", function(done) {
            request(server)
                .get("/todo.txt")
                .expect("Last-Modified", /\d{2} \w{3} \d{4}/)
                .expect(200, done);
        });

        it("should default max-age=0", function(done) {
            request(server)
                .get("/todo.txt")
                .expect("Cache-Control", "public, max-age=0")
                .expect(200, done);
        });

        it("should support urlencoded pathnames", function(done) {
            request(server)
                .get("/foo%20bar")
                .expect(200, Buffer.from("baz"), done);
        });

        it("should not choke on auth-looking URL", function(done) {
            request(server)
                .get("//todo@txt")
                .expect(404, done);
        });

        it("should support index.html", function(done) {
            request(server)
                .get("/users/")
                .expect(200)
                .expect("Content-Type", /html/)
                .expect("<p>tobi, loki, jane</p>", done);
        });

        it("should support ../", function(done) {
            request(server)
                .get("/users/../todo.txt")
                .expect(200, "- groceries", done);
        });

        it("should support HEAD", function(done) {
            request(server)
                .head("/todo.txt")
                .expect(200, {}, done);
        });

        it("should support conditional requests", function(done) {
            request(server)
                .get("/todo.txt")
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    request(server)
                        .get("/todo.txt")
                        .set("If-None-Match", res.headers.etag)
                        .expect(304, done);
                });
        });

        it("should support precondition checks", function(done) {
            request(server)
                .get("/todo.txt")
                .set("If-Match", '"foo"')
                .expect(412, done);
        });

        it("should serve zero-length files", function(done) {
            request(server)
                .get("/empty.txt")
                .expect(200, "", done);
        });

        it("should ignore hidden files", function(done) {
            request(server)
                .get("/.hidden")
                .expect(404, done);
        });
    });
});
