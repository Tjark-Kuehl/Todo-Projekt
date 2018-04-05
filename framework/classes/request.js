export class Request {
    constructor(req) {
        this.request = req
        this.headers = req.headers
        this.rawURL = req.url
        this.pathURL = ''
        this.getParams = {}
        this.postParams = {}
        this.validRequest = true
    }

    async accept() {
        this._parseURL()
        return await this._parsePost()
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
        if ((match = rgx.exec(this.rawURL))) {
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
        while ((match = rgx.exec(query))) {
            this.getParams[match[1]] = match[2]
        }
    }

    /***
     * Parses post parameters into an object
     * @private
     */
    _parsePost() {
        return new Promise((resolve, reject) => {
            if (this.request.method === 'POST') {
                let body = ''
                this.request.on('data', function(data) {
                    body += data
                    if (body.length > 1e6) {
                        return resolve(false)
                    }
                })
                this.request.on('end', function() {
                    if (body.length > 0) {
                        if (
                            this.headers['content-type'] === 'application/json'
                        ) {
                            this.postParams = JSON.parse(body)
                        } else if (
                            this.headers['content-type'] ===
                            'application/x-www-form-urlencoded'
                        ) {
                            body = body.split('&')
                            this.postParams = {}
                            for (let i = 0; i < body.length; i++) {
                                let data = body[i].split('=')
                                this.postParams[data[0]] = data[1]
                            }
                        } else {
                            return resolve(false)
                        }
                    }
                    return resolve(true)
                })
            }
        })
    }
}
