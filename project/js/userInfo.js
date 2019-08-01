let userInfo = {}

let setUserInfo = function(info){
    userInfo = info
}

let setUsername = function(params) {
    userInfo.username = params
}

let setPassword = function(params) {
    userInfo.password = params
}

let getUsername = function(){
    return userInfo.username
}

let getUserId = function(){
    return userInfo.id
}

let getPassword = function(){
    return userInfo.password
}

let setAppList = function(info){
    userInfo.list = info
}

let getAppList = function(){
    return userInfo.list
}

export default{
    setUserInfo,
    getUsername,
    getUserId,
    getPassword,
    setAppList,
    getAppList,
    setUsername,
    setPassword,
}