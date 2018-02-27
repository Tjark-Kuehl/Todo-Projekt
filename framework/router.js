import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import pathCfg from '../config/paths'
import globCfg from '../config/global'

export class Router {
    constructor(ctx) {
        /*
         this.path = globCfg.viewPath
         this.ctxPath = ctx
         */
        this.ctxPath = ctx
        this.fullPath = path.relative(ctx, globCfg.viewPath)
        this.views = []
        this._init()
    }

    _init() {
        this._readView()
    }

    _compileView(viewObject) {
        fs.readFile(path.join(this.ctxPath, globCfg.viewPath, viewObject['src']), 'UTF-8', (err, data) => {
            if (err) {
                throw err
            }
            if (data) {
                let matched = /{{[\s]*([^|\s]+)[\s]*[|]?[\s]*([^\s]*)[\s]*}}/.exec(data)
                if (matched) {
                    switch (matched[1]) {
                        /* CSS Stylesheet */
                        case 'style': {
                            const filePath = path.join(this.ctxPath, globCfg.cssPath, matched[2])
                            //if (!fs.existsSync(filePath)) {
                            const data2 = fs.readFileSync(filePath, 'UTF-8')
                            data = data.replace(matched[0], data2)
                            //}
                            break
                        }
                        default: {
                            console.error(`View compile error at '${matched[0]}'!`)
                            return
                        }
                    }
                }
                const fileName = crypto.createHmac('sha1', globCfg.secretKey)
                                       .update(data)
                                       .digest('hex')
                fs.writeFileSync(path.join(this.ctxPath, globCfg.outputPath, fileName + '.html'), data)
            } else {
                console.error(`View compile error at '${viewObject['src']}', file is empty`)
                for (let i = 0; i < this.views.length; i++) {
                    if (viewObject['src'] === this.views[i]['src']) {
                        this.views.splice(i, 1)
                    }
                }
            }
        })
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
        this._compileView(fileObject)
    }

    /***
     * Reads view directory recursively
     * @param viewPath
     */
    _readView() {
        for (let file of pathCfg) {
            /* Ensure that path is a relative path */
            const rPath = path.join(this.ctxPath, globCfg.viewPath, file['src'])
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