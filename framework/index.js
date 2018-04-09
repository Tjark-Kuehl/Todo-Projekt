import http from 'http'
import path from 'path'
import fs from 'fs'

import { Router } from './classes/router'
export * from './classes/router'

import cfg from '../config/global'
import url from 'url'

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

import sass from 'node-sass'
import { minify as HTMLminify } from 'html-minifier'
import htmlminify_options from '../config/html-minify'

function processViewData(data, options) {
    let matched = ''
    /* Get all files to import (templating syntax) */
    while (matched = /{{[\s]*([^|\s]+)[\s]*[|]?[\s]*([^\s]*)[\s]*}}/.exec(data)) {
        switch (matched[1]) {
            /* CSS Stylesheet */
            case 'style': {
                let style_data = '<style>'

                style_data += sass.renderSync({
                    data: fs.readFileSync(path.join(options.cssPath, matched[2]), 'utf8'),
                    includePaths: [options.cssPath]
                }).css.toString()

                let matched2 = ''
                while (matched2 = /url\(['"]?(.+\.svg)['"]?\)/.exec(style_data)) {
                    let data = fs.readFileSync(path.join(options.imgPath, matched2[1]))
                        .toString('base64')
                    style_data = style_data.replace(matched2[1], `data:image/svg+xml;base64,${data}`)
                }

                style_data += '</style>'
                data = data.replace(matched[0], style_data)
                break
            }
            /* Javascript */
            case 'script': {
                let script_data = '<script>'
                script_data += fs.readFileSync(path.join(options.jsPath, matched[2]), 'utf8')
                script_data += '</script>'
                data = data.replace(matched[0], script_data)
                break
            }
            default: {
                console.error(`View compile error at '${matched[0]}'!`)
            }
        }
    }
    return HTMLminify(data, htmlminify_options)
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
        path.join(path.dirname(module.parent.filename), 'static', 'js')
    options.cssPath =
        options.cssPath ||
        path.join(path.dirname(module.parent.filename), 'static', 'css')
    options.imgPath =
        options.imgPath ||
        path.join(path.dirname(module.parent.filename), 'static', 'img')
    options.defaultLayout = options.defaultLayout || 'default'

    const routers = []
        ; (function sc_router(dir) {
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
        ; (function sc_view(dir) {
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
                ] = processViewData(data, options)
            }
        })('')
        ; (function sc_layout(dir) {
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
                _layouts[`${path.join(dir, matches[1]).replace(/\\/g, '/')}`] = data
            }
        })('')

    return async (req, res) => {
        res.render = (template, ctx, layout = options.defaultLayout) => {
            if (
                _layouts.hasOwnProperty(layout) &&
                _views.hasOwnProperty(template)
            ) {
                const page = _layouts[layout].replace(
                    /{{{\s*body\s*}}}/g,
                    _views[template]
                )

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })
                return res.end(page)
            }

            res.writeHead(400, { 'Content-Type': 'text/plain' })
            return res.end('bad request')
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
    let regex = new RegExp(`^(/favicon.ico)|(${p}/.*)$`)
    return (req, res) => {
        if (!regex.exec(req.url.pathname)) {
            return false
        }
        fs.readFile(
            path.join(__dirname, '..', req.url.pathname),
            'utf8',
            (err, data) => {
                if (err) {
                    req.connection.destroy()
                }
                if (!data) {
                    return res.end()
                }
                res.writeHead(200, { 'Content-Type': 'text/plain' })
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
                req.on('data', function (data) {
                    body += data
                    if (body.length > maxPostSize) {
                        req.connection.destroy()
                        return resolve(true)
                    }
                })
                req.on('end', function () {
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