function call(ep, json) {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'json'
        xhr.onloadend = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                return res(xhr.response)
            }
            return res({
                error: { code: 500, msg: 'internal server error' }
            })
        }
        xhr.onabort = () => {
            return rej({
                error: { code: 500, msg: 'internal server error' }
            })
        }
        xhr.open('POST', `http://${window.location.hostname}:3000${ep}`, true)
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(json))
    })
}
