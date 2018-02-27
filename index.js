import http from 'http'
import path from 'path'
import { Router } from './framework/router'
import { Request } from './framework/request'
import { mkDir, unlinkDir } from './lib/extensions'
import globCfg from './config/global'

// Clears outputPath
unlinkDir(path.join(__dirname, globCfg.outputPath))

// Create project directorys
mkDir(path.join(__dirname, globCfg.viewPath))
mkDir(path.join(__dirname, globCfg.cssPath))
mkDir(path.join(__dirname, globCfg.jsPath))
mkDir(path.join(__dirname, globCfg.outputPath))

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