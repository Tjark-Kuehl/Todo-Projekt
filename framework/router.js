import fs from 'fs'
import path from 'path'
import pathCfg from '../config/paths'

export class Router {
    constructor(ctx, path) {
        this.path = path
        this.ctxPath = ctx
        this.views = []
        this._init()
    }

    _init() {
        this._readView(this.path)
    }

    /***
     * Adds path to views array
     * @param viewPath
     */
    addView(viewPath) {
        this.views.push(viewPath)
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
                this.addView(path.join(rPath, file))
            }
        }
    }
}