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
        console.log(this.getParams)
    }
    
    _parseGet(query) {
        let params = query.split('&')
        for (let i = 0; i < params.length; i++) {
            let pair = params[i].split('=')
            let clearUrlPair = pair[0].split('?')
            if (typeof clearUrlPair[0] === 'undefined' ||
                typeof clearUrlPair[1] === 'undefined') {
                this.getParams[pair[0]] = decodeURIComponent(pair[1])
            } else if (typeof clearUrlPair[0] === 'string') {
                console.log(this.getParams[clearUrlPair[1]])
                this.getParams[clearUrlPair[1]] = decodeURIComponent(pair[1])
            }
        }
    }
}