import http from 'http'
import path from 'path'
import { Router } from './framework/router'
import { Request } from './framework/request'
import { mkDir, unlinkDir } from './lib/server/extensions'
import globCfg from './config/global'

// Clears outputPath
unlinkDir(path.relative(__dirname, globCfg.outputPath))

// Create project directorys
mkDir(path.relative(__dirname, globCfg.viewPath))
mkDir(path.relative(__dirname, globCfg.cssPath))
mkDir(path.relative(__dirname, globCfg.jsPath))
mkDir(path.relative(__dirname, globCfg.outputPath))

const router = new Router(__dirname)

http.createServer(async (req, res) => {
    /* HTTP Header */
    res.writeHead(200, { 'Content-Type': 'text/html' })

    const request = new Request(req)

    let content = ''

    if (!Request.filter(request.pathURL)) {
        content = await router.getView(request.pathURL)
    }

    res.write(content)
    res.end()
})
    .listen(globCfg.port, () => {
        console.log('server start at port 3000')
    })