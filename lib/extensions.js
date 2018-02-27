import fs from 'fs'

export function mkdir(dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err
        }
    }
}