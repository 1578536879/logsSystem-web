import axios from 'axios'
import Qs from 'qs'

let sendMessage = function(method, route, msg){
    return axios({
        method: method,
        url: route,
        data: msg
    })
}

let sendMsgGet = function(route, msg){
    return axios.get(`${route}?${msg}`,).then(function(res){
        return res
    }).catch(function(err){
        console.log(err)
    })
}

let sendMsgDelete = function(route, msg){
    route = `${route}?appId=${msg.appId}`
    return axios.delete(route ,{
        params: Qs.stringify(msg)
    }).then(function(res){
        return res
    }).catch(function(err){
        console.log(err)
    })
}

export default{
    sendMessage,
    sendMsgGet,
    sendMsgDelete
}