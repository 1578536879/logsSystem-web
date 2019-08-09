<template lang="">
    <div class = 'login'>
        <p>登 录</p>
        <!-- <b-alert show variant="danger" dismissible v-if='errMsg' style='width: 70%;margin: auto;'>{{errMsg}}</b-alert> -->
        <b-alert show variant="danger" dismissible style='margin: auto;width: 70%;' v-if='errMsg'>
            {{errMsg}}
        </b-alert>
        <input type = 'text' placeholder = '请输入用户名' ref="username" style='margin-top: 1em;'/>
        <input type = 'password' placeholder = '请输入密码' ref='pwd'/> 
        <button @click = 'submit' class='submit'>登 录</button>
        <router-link to='register'><span>没有账号？先注册一波</span></router-link>
    </div>
</template>
<script>
import router from '../src/router'
import send from '../js/send'
import userInfo from '../js/userInfo'

export default {
   name: 'login',
   router,
   data() {
       return {
           username: '',
           password: '',
           errMsg: ''
       }
   }, 
   methods: {
        login(){
            let data = {
                username: this.username,
                password: this.password
            }
            let that = this
            send.sendMessage('post', 'http://127.0.0.1:8080/login', data).then(function(r){
                console.log(r)
                if(r.data.code === 100){
                    let pwd = ''
                    for(let i=0;i<that.password.length; i++){
                        pwd += '*'
                    }
                    userInfo.setUserInfo({
                        username: that.username,
                        password: pwd,
                        id: r.data.userId
                    })
                    that.$router.push({path: './homepage/applicationList',query: {userId: r.data.userId}})
                }
            }).catch(err=>{
                // console.log(err.response)
                
                that.errMsg = err.response.data.message
            })
        },
        trim(str){
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
       submit(){
           let username = this.$refs.username.value
            if(!this.trim(username)){
                that.errMsg = "请输入用户名"
            }
            let pwd = this.$refs.pwd.value
            if(!this.trim(pwd)) {
                that.errMsg = "请输入密码"
            }
            this.username = username
            this.password = pwd
            this.login()
       }
   },
}
</script>
<style>
    body{
        background:#F5F5F5;
    }
    .login{
        width: 30%;
        height: 450px;
        margin: 100px auto;
        border: 1px solid gray;
        text-align: center;
        background: white;
        border-radius: 5px;
    }
    .login p{
        font-size: 30px;
        -webkit-margin-before: 2em;
        background: white
    }
    .login input{
        width: 70%;
        height: 40px;
        font-size: 15px;
        display: block;
        margin:2em auto;
        text-indent: 5px;
        /* margin-bottom: 20px; */
    }
    .submit{
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
    .login span{
        float: right;
        padding-top: 1.5em;
        padding-right: 3em;
    }
</style>
