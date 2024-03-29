# @js-primer/local-server

Local Server for [JavaScript Primer](https://github.com/asciidwango/js-primer).

[JavaScript Primer](https://github.com/asciidwango/js-primer)のサンプルコードで利用することを目的にしたローカルサーバです。

> **Warning**
> サンプルコードの実行を目的にしたローカルサーバであるため、公開するアプリケーションには利用しないでください。

### Requirements

- Node.js 10+
    - It contains `npm`  5.3.0>=
    - It contains `npx` command 

## Usage

`npx`コマンドを使い直接ダウンロードと実行ができます。

    Usage
      $ npx @js-primer/local-server [<directory>]

    Options:
      --port  TCP port at which the files will be served

サーバを起動する（ベースディレクトリは現在ディレクトリ）

    npx @js-primer/local-server

指定したディレクトリをベースにサーバを起動する

    npx @js-primer/local-server ./docs

指定したポート番号でサーバを起動する

    npx @js-primer/local-server --port 8000

起動したローカルサーバは、コマンドラインで<kbd>Ctrl+C</kbd>のショートカットを押下することで終了できます。

### Usage for global installation

`npm install --global`でグローバルなコマンドとしてインストールできます。

    npm install local-server --global
    $ js-primer-local-server

## Changelog

See [Releases page](https://github.com/js-primer/local-server/releases).

## Running tests

    yarn install && npm test

## Contributing

Pull requests and stars are always welcome.

For bugs and feature requests, [please create an issue](https://github.com/js-primer/local-server/issues).

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## Author

- [github/azu](https://github.com/azu)
- [twitter/azu_re](https://twitter.com/azu_re)

## License

MIT © azu
