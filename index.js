import http from 'http'
import path from 'path'
import { start, use, mwStatic, get, post, router } from './framework'

import { cookieParser } from './lib/cookie'
import { jwt_init } from './lib/jwt'

use(mwStatic('/public'))
use(post())

//use(cookieParser('SECRET', options))
use(cookieParser())
use(jwt_init)
/*
    jwt via non signed cookies 
    adds a jwt object to the req
    jwt
        .clear()
        .sign()
        .valid:boolean
        .editAndSign()
        .payload:obj if valid
*/
use((req, res) => {
    console.log(req.jwt.valid, 'valid', req.jwt.payload)
    return false
})

use(router())

start()
