'use strict'
require('./main.css')
import test from '../../assets/test'
const arr = [1, 2, 3]
const iAmJavascriptES6 = () => console.log(...arr)
window.onload = iAmJavascriptES6
console.log(process.env.NODE_ENV)
test()