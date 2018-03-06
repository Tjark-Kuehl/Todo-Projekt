/* Default Dependencies */
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import pathCfg from '../config/paths'
import globCfg from '../config/global'

/* JS Dependencies */
import UglifyJS from 'uglify-es'
import uglify_options from '../config/uglify-js'

/* CSS Dependencies */
import sass from 'node-sass'
import CleanCSS from 'clean-css'

export class Router {
    constructor(ctx) {
        this.ctxPath = ctx
        this.views = []
        this._init()
    }

    _init() {
        const template = this._initTemplate()
        if (template) {
            this._readView()
                .forEach(entry => {
                    const compileRes = this._compileView(entry, template)
                    if (compileRes) {
                        this.addView(compileRes)
                    } else {
                        console.error(`Error: template compilation failed on '${entry.src}'`)
                    }
                })
        } else {
            throw 'Error: main template could not be initialized!'
        }
    }

    /***
     * Initializes the main template for all views
     * @private
     */
    _initTemplate() {
        const tPath = path.join(this.ctxPath, globCfg.viewTemplatePath)
        if (fs.existsSync(tPath)) {
            return fs.readFileSync(tPath, 'utf8')
        }
        return false
    }

    /**
     * Compiles the views for the user
     * @param viewObject
     * @param template
     * @returns {{compiledFile: string}}
     * @private
     */
    _compileView(viewObject, template) {
        let fileName = ''
        let data = fs.readFileSync(path.join(this.ctxPath, globCfg.viewPath, viewObject['src']), 'utf8')
        if (data) {
            let matched = ''

            /* Get all files to import (templating syntax) */
            while (matched = /{{[\s]*([^|\s]+)[\s]*[|]?[\s]*([^\s]*)[\s]*}}/.exec(data)) {
                switch (matched[1]) {
                    /* CSS Stylesheet */
                    case 'style': {
                        let style_data = '<style>'
                        style_data += new CleanCSS({ level: 2 }).minify(sass.renderSync({
                            data: fs.readFileSync(path.join(this.ctxPath, globCfg.cssPath, matched[2]), 'utf8')
                        }).css.toString()).styles
                        style_data += '</style>'
                        data = data.replace(matched[0], style_data)
                        break
                    }
                    /* Javascript */
                    case 'script': {
                        let script_data = '<script>'
                        script_data += UglifyJS.minify(
                            fs.readFileSync(path.join(this.ctxPath, globCfg.jsPath, matched[2]), 'utf8'),
                            uglify_options
                        ).code
                        script_data += '</script>'
                        data = data.replace(matched[0], script_data)
                        break
                    }
                    default: {
                        console.error(`View compile error at '${matched[0]}'!`)
                    }
                }
            }
            const resData = template.replace(/{{*\sbody\s*}}/, data)
            fileName = crypto.createHmac('sha1', globCfg.secretKey)
                             .update(resData)
                             .digest('hex') + '.html'
            fs.writeFileSync(path.join(this.ctxPath, globCfg.outputPath, fileName), resData)
            return {
                ...viewObject,
                compiledFile: fileName
            }
        } else {
            console.error(`View compile error at '${viewObject['src']}', file is empty`)
            for (let i = 0; i < this.views.length; i++) {
                if (viewObject['src'] === this.views[i]['src']) {
                    this.views.splice(i, 1)
                }
            }
        }
        return false
    }

    /***
     * Reads view directory recursively
     * @param viewPath
     */
    _readView() {
        let entrys = []
        for (let file of pathCfg) {
            /* Ensure that path is a relative path */
            const rPath = path.join(this.ctxPath, globCfg.viewPath, file['src'])
            if (fs.existsSync(rPath)) {
                if (file['requestURL'] === '/') {
                    entrys.push({
                        ...file,
                        requestURL: '/index'
                    })
                }
                entrys.push(file)
            } else {
                console.error(`Error: View file for '${file['requestURL']}' not found!`)
                return
            }
        }
        return entrys
    }

    /**
     * Returns the requested view
     * @param reqPath
     */
    getView(reqPath) {
        return new Promise((resolve, reject) => {
            let resPath = ''
            if (this.views[reqPath].src) {
                resPath = path.join(globCfg['outputPath'], this.views[reqPath].compiledFile)
            } else {
                resPath = path.join(globCfg['outputPath'], this.views[globCfg['notFound']].compiledFile)
            }
            if (!resPath) {
                return reject('No resource given!')
            }
            fs.readFile(resPath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err)
                }
                return resolve(data)
            })
        })
    }

    /***
     * Adds path to views array
     * If the settings exist
     * @param viewPath
     */
    addView(fileObject) {
        this.views[fileObject['requestURL']] = {
            ...fileObject
        }
        console.log(`Router: Path '${fileObject['requestURL']}' added.`)
    }
}