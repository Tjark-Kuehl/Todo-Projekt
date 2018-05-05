import http from 'http'
import path from 'path'
import { start, use, mwStatic, get, post, router } from './framework'

import { cookieParser } from './lib/cookie'
import { jwt_init } from './lib/jwt'

use(mwStatic('/public'))
use(post())

use(cookieParser())
use(jwt_init)

use(router())

start()
