import fs from 'fs'
import path from 'path'

export function mkDir(dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err
        }
    }
}

export function unlinkDir(dirPath) {
    let files = fs.readdirSync(dirPath)
    if (files.length > 0) {
        files.forEach(file => {
            let filePath = path.join(dirPath, file)
            if (fs.statSync(filePath)
                  .isFile()) {
                fs.unlinkSync(filePath)
            }
        })
    }
}

/*
 export async function unlinkDir(dirPath) {
 await fs.readdir(dirPath, 'utf8', async (err, files) => {
 if (err) {
 throw err
 }
 await files.forEach(async file => {
 await fs.stat(file, (err) => {
 if (!err) {
 fs.unlink(file, (error) => {
 if (error) {
 throw error
 }
 })
 }
 })
 })
 })
 }
 */