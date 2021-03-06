import http from 'http'
import path from 'path'
import fs from 'fs'
import zlib from 'zlib'
import url from 'url'

import uglify from 'uglify-es'
import { transform } from 'babel-core'
import sass from 'node-sass'
import { minify } from 'html-minifier'
import html_autoprefixer from 'html-autoprefixer'

import { Router } from './classes/router'
export * from './classes/router'

import cfg from '../config/global.config.json'
import includes from '../config/includes.config.json'
import htmlminify_options from '../config/html-minify.config.json'
import babelClient_options from '../config/babel-client.config.json'

const uglify_options = htmlminify_options.minifyJS
htmlminify_options.minifyJS = text => {
    return uglify.minify(
        transform(text, babelClient_options).code.replace(
            /['"]use strict['"];/g,
            ''
        ),
        uglify_options
    ).code
}

/**
 * Starts the server
 */
export function start() {
    http
        .createServer(async (req, res) => {
            req.url = url.parse(req.url, true)
            for (let i = 0; i < _use.length; ++i) {
                if (await _use[i](req, res)) {
                    return
                }
            }
            res.writeHead(400, { 'Content-Type': 'text/plain' })
            res.end('bad request')
        })
        .listen(cfg.port, () => {
            console.log(`Server is listening on :: ${cfg.port}`)
        })
}

const _use = []

function processData(data, options) {
    let matched = ''
    let js_data = ''

    /* Include globals */
    includes.forEach(entry => {
        js_data += fs.readFileSync(
            path.join(options.jsPath, entry + '.js'),
            'utf8'
        )
    })
    /* Get all files to import (templating syntax) */
    let r1 = /({{{\s*body\s*}}})|(?:{{\s*([^|\s]+)\s*[|]?\s*([^\s]*)\s*}})/g
    while ((matched = r1.exec(data)) !== null) {
        if (matched[1]) {
            continue
        }

        switch (matched[2]) {
            /* HTML Components */
            case 'component': {
                data = data.replace(
                    matched[0],
                    fs.readFileSync(
                        path.join(options.componentPath, matched[3])
                    )
                )
                break
            }
            /* CSS Stylesheet */
            case 'style': {
                let style_data = '<style>'

                style_data += sass
                    .renderSync({
                        data: fs.readFileSync(
                            path.join(options.cssPath, matched[3]),
                            'utf8'
                        ),
                        includePaths: [options.cssPath]
                    })
                    .css.toString()

                let matched2 = ''
                while (
                    (matched2 = /url\(['"]?(.+\.svg)['"]?\)/.exec(style_data))
                ) {
                    let data2 = fs
                        .readFileSync(path.join(options.imgPath, matched2[1]))
                        .toString('base64')
                    style_data = style_data.replace(
                        matched2[1],
                        `data:image/svg+xml;base64,${data2}`
                    )
                }
                style_data += '</style>'
                data = data.replace(matched[0], style_data)
                break
            }
            /* Javascript */
            case 'script': {
                if (!includes.includes(matched[3].slice(0, -3))) {
                    js_data += fs.readFileSync(
                        path.join(options.jsPath, matched[3]),
                        'utf8'
                    )
                }
                data = data.replace(matched[0], '')
                break
            }
            default:
                console.error(`View compile error at '${matched}'!`)
                break
        }
        r1.lastIndex -= matched[0].length
    }
    return minify(
        html_autoprefixer.process(data) + '<script>' + js_data + '</script>',
        htmlminify_options
    )
}

export function use(arg0) {
    if (typeof arg0 === 'function') {
        _use.push(arg0)
    }
}

const _views = {}
const _layouts = {}
export function router(options = {}) {
    /* Path options */
    options.routePath =
        options.routePath ||
        path.join(path.dirname(module.parent.filename), 'routes')
    options.viewPath =
        options.viewPath ||
        path.join(path.dirname(module.parent.filename), 'views')
    options.layoutPath =
        options.layoutPath ||
        path.join(path.dirname(module.parent.filename), 'layouts')
    options.jsPath =
        options.jsPath ||
        path.join(path.dirname(module.parent.filename), 'assets', 'js')
    options.cssPath =
        options.cssPath ||
        path.join(path.dirname(module.parent.filename), 'assets', 'css')
    options.imgPath =
        options.imgPath ||
        path.join(path.dirname(module.parent.filename), 'assets', 'img')
    options.componentPath =
        options.componentPath ||
        path.join(path.dirname(module.parent.filename), 'components')
    options.defaultLayout = options.defaultLayout || 'default'

    const routers = []
    ;(function sc_router(dir) {
        const files = fs.readdirSync(dir, 'utf8')
        for (let filename of files) {
            const matches = /^(.+).js$/.exec(filename)
            if (!matches) {
                sc_router(path.join(dir, filename))
                continue
            }

            const r = require(path.join(dir, filename).replace(/\\/g, '/'))
                .default
            if (r instanceof Router) {
                routers.push(r)
            }
        }
    })(options.routePath)
    ;(function sc_view(dir) {
        const files = fs.readdirSync(path.join(options.viewPath, dir), 'utf8')
        for (let filename of files) {
            const matches = /^(.+).html$/.exec(filename)
            if (!matches) {
                sc_view(path.join(dir, filename))
                continue
            }

            const data = fs.readFileSync(
                path.join(options.viewPath, dir, filename),
                'utf8'
            )

            _views[
                `${path.join(dir, matches[1]).replace(/\\/g, '/')}`
            ] = processData(data, options)
        }
    })('')
    ;(function sc_layout(dir) {
        const files = fs.readdirSync(path.join(options.layoutPath, dir), 'utf8')
        for (let filename of files) {
            const matches = /^(.+).html$/.exec(filename)
            if (!matches) {
                sc_layout(path.join(dir, filename))
                continue
            }

            const data = fs.readFileSync(
                path.join(options.layoutPath, dir, filename),
                'utf8'
            )
            _layouts[
                `${path.join(dir, matches[1]).replace(/\\/g, '/')}`
            ] = processData(data, options)
        }
    })('')

    return async (req, res) => {
        // Send plain text to the client
        res.send = text => {
            res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Encoding': 'gzip'
            })
            return zlib.gzip(Buffer.from(text), (error, result) => {
                return res.end(result)
            })
        }

        // Send rendered html to the client
        res.render = async (template, ctx, layout = options.defaultLayout) => {
            if (
                _layouts.hasOwnProperty(layout) &&
                _views.hasOwnProperty(template)
            ) {
                const page = _layouts[layout].replace(
                    /{{{\s*body\s*}}}/g,
                    _views[template]
                )

                res.writeHead(200, {
                    'Content-Type': 'text/html',
                    'Content-Encoding': 'gzip'
                })

                return zlib.gzip(Buffer.from(page), (error, result) => {
                    return res.end(result)
                })
            }

            res.writeHead(400, { 'Content-Type': 'text/plain' })
            return res.end('bad request')
        }

        // Send json object to client
        res.json = jsObject => {
            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods':
                    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
                'Access-Control-Allow-Headers': 'content-type',
                'Access-Control-Allow-Credentials': true,
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip'
            })
            return zlib.gzip(
                Buffer.from(JSON.stringify(jsObject)),
                (error, result) => {
                    return res.end(result)
                }
            )
        }

        let r = /^(\/.*)\/$/.exec(req.url.pathname)
        r = !r ? req.url.pathname : r[1]

        for (let router of routers) {
            if (r.startsWith(router._basePath)) {
                if (req.method === 'POST') {
                    for (let post in router._post) {
                        if (r === router._basePath + post) {
                            if (await router._post[post](req, res)) {
                                return true
                            }
                        }
                    }
                } else {
                    for (let get in router._get) {
                        if (r === router._basePath + get) {
                            if (await router._get[get](req, res)) {
                                return true
                            }
                        }
                    }
                }
            }
        }
        return false
    }
}

export function mwStatic(p) {
    const regex = new RegExp(`^(/favicon.ico)|(${p}/.*)$`)
    const mimes = {
        default: 'text/html',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpg',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.ico': 'image/x-icon'
    }
    return (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
            return false
        }

        if (!regex.exec(req.url.pathname)) {
            return false
        }
        fs.readFile(
            path.join(__dirname, '..', req.url.pathname),
            (err, data) => {
                if (err) {
                    req.connection.destroy()
                }
                if (!data) {
                    return res.end()
                }

                let ext = path.extname(req.url.pathname)
                res.writeHead(200, {
                    'Content-Type': mimes[ext] || mimes['default']
                })
                res.end(data)
            }
        )
        return true
    }
}

export function post(maxPostSize = 1e6) {
    return (req, res) => {
        if (req.method === 'POST') {
            return new Promise((resolve, reject) => {
                let body = ''
                req.on('data', function(data) {
                    body += data
                    if (body.length > maxPostSize) {
                        req.connection.destroy()
                        return resolve(true)
                    }
                })
                req.on('end', function() {
                    if (body.length > 0) {
                        if (
                            req.headers['content-type'] === 'application/json'
                        ) {
                            req.postParams = JSON.parse(body)
                        } else if (
                            this.headers['content-type'] ===
                            'application/x-www-form-urlencoded'
                        ) {
                            body = body.split('&')
                            req.postParams = {}
                            for (let i = 0; i < body.length; ++i) {
                                let data = body[i].split('=')
                                req.postParams[data[0]] = data[1]
                            }
                        }
                    }
                    return resolve(false)
                })
            })
        }
        return false
    }
}
