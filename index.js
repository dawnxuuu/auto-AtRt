const fs = require('fs-extra')
var rl =  require('readline')
const rwByLine = require('./src/readWriteFileByLine.js')

let fsWait = false

const listenDir = './'

const rawFileGqlFetch = './src/raw-file-gql-fetch.js'
const targetFileGqlFetch = '../../b-mobile/weex-b-app/apis/request/gql-fetch.js'
fs.copySync(targetFileGqlFetch, rawFileGqlFetch)

const rawFileAppQqlFetch = './src/raw-file-appqql-fetch.js'
const targetFileAppQqlFetch = '../../b-mobile/weex-b-app/apis/request/appgql-fetch.js'
fs.copySync(targetFileAppQqlFetch, rawFileAppQqlFetch)

let newAt = ''
let newRt = ''
let newDepartmentid = '0'

console.log(`正在监听文件变化`)

fs.watch(listenDir, (event, filename) => {

    if (filename) {
        if (fsWait) return
        fsWait = setTimeout(() => {
            fsWait = false;
        }, 100)

        console.log(`文件发生更新`)


        const newDetail = fs.createReadStream('./source.txt')
        const readLine = rl.createInterface({
            input: newDetail
        })
        readLine.on('line', function(line){
            const rs = line.toString()
            if (rs.indexOf('x-zp-at') !== -1) {
                newAt = rs.replace(/^(x-zp-at: )/, "")
            }
            
            if (rs.indexOf('x-zp-rt') !== -1) {
                newRt = rs.replace(/^(x-zp-rt: )/, "")
            }

            if (rs.indexOf('x-zp-departmentid') !== -1) {
                newDepartmentid = rs.replace(/^(x-zp-departmentid: )/, "")
            }
        })


        rwByLine.readWriteFileByLineWithProcess(rawFileGqlFetch, targetFileGqlFetch, function (line) {
            let rs = line.toString()
            if (rs.indexOf('at =') !== -1) {
                return `at = '${newAt}', version = '', rt = '${newRt}', deviceId = '', fromsystem = this.getFromsystem(), departmentId = '${newDepartmentid}', refer, clientType = this.getClientType()`
            }

            return rs
        })

        rwByLine.readWriteFileByLineWithProcess(rawFileAppQqlFetch, targetFileAppQqlFetch, function (line) {
            let rs = line.toString()
            if (rs.indexOf('at =') !== -1) {
                return `at = '${newAt}', version = '', rt = '${newRt}', deviceId = '', fromsystem = this.getFromsystem(), departmentId = '${newDepartmentid}', refer, clientType = this.getClientType()`
            }

            return rs
        })

        console.log('文件 gql-fetch.js 修改成功')
        console.log('文件 appgql-fetch.js 修改成功')
    }

})