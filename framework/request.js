export class Request {
    constructor(req) {
        this.headers = req.headers
        this.rawURL = req.url
        this.getParams = {}
        this.postParams = {}
        this._init()
    }

    _init() {
        this._parseGet(this.rawURL)
    }

    /***
     * Parses get parameters into an object
     * @param query
     * @private
     */
    _parseGet(query) {
        let match = ''
        let rgx = /[?|&]([\w_äÄöÖüÜß]+)=([^&\s]+)/g
        while (match = rgx.exec(query)) {
            this.getParams[match[1]] = match[2]
        }
    }
}