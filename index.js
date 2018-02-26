import http from 'http'
import { Router } from './framework/router'
import { Request } from './framework/request'

const router = new Router(__dirname)

http.createServer(async (req, res) => {
    /* HTTP Header */
    res.writeHead(200, { 'Content-Type': 'text/html' })

    const request = new Request(req)
    let content = ''
    if (request.pathURL !== 'favicon.ico') {
        content = await router.getView(request.pathURL)
    }

    res.write(content)
    res.end()
})
    .listen(3000, () => {
        console.log('server start at port 3000')
    })