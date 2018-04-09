export class Router {
    constructor(basePath = '') {
        this._basePath = basePath
        this._get = {}
        this._post = {}
    }

    get(path, cb) {
        if (typeof path === 'string' && typeof cb === 'function') {
            this._get[path] = cb
        }
    }

    post(path, cb) {
        if (typeof path === 'string' && typeof cb === 'function') {
            this._post[path] = cb
        }
    }
}
