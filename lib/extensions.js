import fs from 'fs'
import path from 'path'

/***
 * Checks if file exists synchronously
 * @param filePath
 */
export function fileExists(filePath) {
    return fs.existsSync(filePath)
}

/***
 * Creates new directory and all other directories in path
 * @param dirPath
 */
export function mkDir(dirPath) {
    let tmpPath = ''
    let paths = dirPath.split('/')
    for (let p of paths) {
        try {
            tmpPath = path.join(tmpPath, p)
            fs.mkdirSync(tmpPath)
        } catch (err) {
            if (err.code !== 'EEXIST') {
                throw err
            }
        }
    }
}

/***
 * Removes directory synchronously
 * @param dirPath
 */
export function unlinkDir(dirPath) {
    if (fs.existsSync(dirPath)) {
        let files = fs.readdirSync(dirPath)
        if (files.length > 0) {
            files.forEach(file => {
                let filePath = path.join(dirPath, file)
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath)
                }
            })
        }
    }
}
