import globCfg from '../../config/global'

export function call(ep, json) {
    return new Promise((res, rej) => {
        const xhr = new XMLHttpRequest()
        xhr.responseType = 'json'
        xhr.onloadend = () => {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                return res(xhr.response)
            }
            return res({ error: { status: 500, msg: 'Internal Server Error' } })
        }
        xhr.onabort = () => {
            return rej({ error: { status: 500, msg: 'Internal Server Error' } })
        }
        xhr.open('POST', `http://${window.location.hostname}:${globCfg.port}${ep}`, true)
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify(json))
    })
}
