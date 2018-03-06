export class Request {
    constructor(req) {
        this.headers = req.headers
        this.rawURL = req.url
        this.pathURL = ''
        this.getParams = {}
        this.postParams = {}
        this._init()
    }

    _init() {
        this._parseURL()
    }

    get(val) {
        if (this.hasOwnProperty(val)) {
            return this[val]
        }
        throw 'get: value not found!'
    }

    static filter(requestPath) {
        return /^(\/favicon\.ico)|(\/public\/.*)/.exec(requestPath)
    }

    /**
     * Parses the path for the router
     * @private
     */
    _parseURL() {
        let match = undefined
        let rgx = /(\/[^?]*)(.*)/
        if (match = rgx.exec(this.rawURL)) {
            this.pathURL = match[1]
            if (!match[2]) {
                this._parseGet(match[2])
            }
        }
    }

    /***
     * Parses get parameters into an object
     * @private
     */
    _parseGet(query) {
        let match = undefined
        let rgx = /[?|&]([\w_äÄöÖüÜß]+)=([^&\s]+)/g
        while (match = rgx.exec(query)) {
            this.getParams[match[1]] = match[2]
        }
    }
}