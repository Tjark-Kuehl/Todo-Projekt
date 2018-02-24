import fs from 'fs'
import path from 'path'
import pathCfg from '../config/paths'
import globCfg from '../config/global'

export class Router {
    constructor(ctx, path) {
        this.path = path
        this.ctxPath = ctx
        this.views = []
        this._init()
    }

    _init() {
        this._readView(this.path)
        console.log(this.views)
    }

    /***
     * Adds path to views array
     * If the settings exist
     * @param viewPath
     */
    addView(viewPath) {
        // Mapped index to /
        if (viewPath === '/index') {
            viewPath = '/'
        }

        // If viewPath config not exist
        if (!pathCfg[viewPath]) {
            console.error(`Error: View file for '${viewPath}' not found!`)
            return
        }

        this.views[viewPath] = {
            ...pathCfg[viewPath]
        }
    }

    /***
     * Reads view directory recursively
     * @param viewPath
     */
    _readView(viewPath) {
        /* Ensure that path is a relative path */
        const rPath = path.relative(this.ctxPath, viewPath)
        const files = fs.readdirSync(rPath)
        for (let file of files) {
            const stats = fs.statSync(path.resolve(viewPath, file))
            if (stats.isDirectory()) {
                this._readView(path.resolve(viewPath, file))
            } else {
                let cutLen = path.join(globCfg['viewPath']).length
                let viewFormat = path.join(rPath, file)
                                     .substr(cutLen)
                                     .replace(/.html/gi, '')
                this.addView(viewFormat.startsWith('/') ? viewFormat : '/' + viewFormat)
            }
        }
    }
}