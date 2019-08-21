let userInfo = {}
import send from './send'

let setUserInfo = function(info){
    userInfo = info
}

let setUsername = function(params) {
    userInfo.username = params
}

let setApplicationId = function(info){
    return send.sendMessage('post', 'http://127.0.0.1:8080/setApplicationId', info).then(res=>{
        return res
    })
}

let getUsername = function(){
    return send.sendMsgGet('http://127.0.0.1:8080/getUsername').then(res=>{
        return res 
    })
    
}

let getUserId = function(){
    return send.sendMsgGet('http://127.0.0.1:8080/getUserId').then(res=>{
        return res
    })
}

let getAppList = function(){
    return send.sendMsgGet('http://127.0.0.1:8080/queryAppList').then(res=>{
        return res
    })
}

let getApplicationId = function(){
    return send.sendMsgGet('http://127.0.0.1:8080/getApplicationId').then(res=>{
        return res
    })
}

export default{
    setUserInfo,
    getUsername,
    getUserId,
    setUsername,
    getAppList,
    getApplicationId,
    setApplicationId
}