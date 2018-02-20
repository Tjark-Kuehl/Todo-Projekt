import http from 'http'
import { Router } from './framework/router'
import { Request } from './framework/request'

//import pathCfg from './config/paths'
import cfg from './config/global'

const router = new Router(__dirname, cfg.viewPath)

http.createServer((req, res) => {
    /* HTTP Header */
    res.writeHead(200, { 'Content-Type': 'text/html' })

    const request = new Request(req)
})
    .listen(3000, () => {
        console.log('server start at port 3000')
    })