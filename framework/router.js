import fs from 'fs'
import path from 'path'
import pathCfg from '../config/paths'
import globCfg from '../config/global'

export class Router {
    constructor(ctx) {
        this.path = globCfg.viewPath
        this.ctxPath = ctx
        this.views = []
        this._init()
    }

    _init() {
        this._readView(this.path)
    }

    /**
     * Returns the requested view
     * @param reqPath
     */
    getView(reqPath) {
        return new Promise((resolve, reject) => {
            let resPath = ''
            if (this.views[reqPath]) {
                resPath = path.join(globCfg['viewPath'], this.views[reqPath].src)
            } else {
                resPath = path.join(globCfg['viewPath'], this.views[globCfg['notFound']].src)
            }
            fs.readFile(resPath, 'UTF-8', (err, data) => {
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

    /***
     * Reads view directory recursively
     * @param viewPath
     */
    _readView(viewPath) {
        for (let file of pathCfg) {
            /* Ensure that path is a relative path */
            const rPath = path.relative(this.ctxPath, viewPath)
            const filePath = path.join(rPath, file['src'])
            if (fs.existsSync(rPath)) {
                if (file['requestURL'] === '/') {
                    this.addView({
                        ...file,
                        requestURL: '/index'
                    })
                }
                this.addView(file)
            } else {
                console.error(`Error: View file for '${file['requestURL']}' not found!`)
                return
            }
        }
    }
}