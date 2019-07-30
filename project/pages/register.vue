<template lang="">
    <div class = 'register'>
        <p>注 册</p>
        <input type = 'text' placeholder = '请输入用户名' ref="username"/>
        <input type = 'password' placeholder = '请输入密码' ref='pwd'/> 
        <input type = 'password' placeholder = '请确认密码' ref='spwd'/> 
        <button @click = 'submit'>注 册</button>
        <router-link to="login"><span>已有账号？直接登录</span></router-link>
    </div>
</template>
<script>
import router from '../src/router'
import send from '../js/send'

export default {
   name: 'register',
   router,
   data() {
       return {
           username: '',
           password: '',
       }
   }, 
   methods: {
       register(){
           let data = {
               username: this.username,
               password: this.password
           }
           let that = this
           send.sendMessage('post', 'http://127.0.0.1:8080/register', data).then(function(res){
               console.log(res)
               if(res.code === 100){
                   that.$router.push({path: '/login'})
               }
           })
       },
        trim(str){
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
       submit(){
           let username = this.$refs.username.value
            if(!this.trim(username)){
                alert("请输入用户名")
                return 
            }
            let pwd = this.$refs.pwd.value
            if(!this.trim(pwd)) {
                alert("请输入密码")
                return 
            }
            let spwd = this.$refs.spwd.value
            if(!this.trim(spwd)){
                alert('请输入确认密码')
                return 
            }
            if(spwd !== pwd){
                alert('两次密码输入不一致')
                return 
            }
            this.username = username
            this.password = pwd
            this.register()
       }
   },
}
</script>
<style>
    body{
        background:#F5FFFA;
    }
    .register{
        width: 30%;
        height: 450px;
        margin: 100px auto;
        border: 1px solid gray;
        text-align: center;
        background: white;
        border-radius: 5px;
    }
    .register p{
        font-size: 30px;
        -webkit-margin-before: 2em;
    }
    .register input{
        width: 70%;
        height: 40px;
        font-size: 15px;
        display: block;
        margin:2em auto;
        text-indent: 5px;
        /* margin-bottom: 20px; */
    }
    .register button{
        width: 40%;
        height: 40px;
        margin: auto;
        color: white;
        background: #87CEEB;
        border: none;
        display: block;
        font-size: 20px;
        border-radius: 6px;
    }
    .register span{
        float: right;
        padding-top: 1.5em;
        padding-right: 3em;
    }
</style>
