import http from 'http'
import path from 'path'
import { start, use, mwStatic, get, post, router } from './framework'

use(mwStatic('/public'))
use(post())

use(router())

start()
