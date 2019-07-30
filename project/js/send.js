import axios from 'axios'

let sendMessage = function(method, route, msg){
    return axios({
        method: method,
        url: route,
        data: msg
    }).then(function(res){
        return res.data
    }).catch(function(err){
        console.log(err)
    })
}

let sendMsgGet = function(route, msg){
    return axios.get(`${route}?${msg}`,{
        params: msg
    }).then(function(res){
        return res
    }).catch(function(err){
        console.log(err)
    })
}

export default{
    sendMessage,
    sendMsgGet
}