<template>
    <div class='personInfo'>
        <home-menu :type="type"></home-menu>
        <!-- <div v-if="alert"> -->
        <b-alert show variant="success" v-if="successMessage" dismissible style="width: 65%;left: 20%;top: 5em;">{{successMessage}}</b-alert>
        <b-modal ref="person-information" centered hide-footer hide-header-close hide-header>
            
            <p>{{title}}</p>
            <b-alert show variant="danger" v-if="errMessage">{{errMessage}}</b-alert>

            <input type="text" placeholder="请输入修改后的用户名" ref="username" v-if='modifyUsername' class="modifyInput"/>

            <input type="password" placeholder="请输入当前使用密码" ref="password" v-if='modifyPassword' class="modifyInput" style="margin-bottom: 1.5em;"/>
            <input type="password" placeholder="请输入修改后的密码" ref="spassword" v-if='modifyPassword' class="modifyInput"/>


            <b-button variant="outline-warning" @click="submit" class="alertBnt">确定</b-button>
            <b-button variant="outline-secondary" @click="canle" class="alertBnt" style="margin-right:10%;">取消</b-button>
        </b-modal>
        <!-- </div> -->
        <div class="info">
            <p>个人信息</p>
            <div class="username"> 
                <span style="float:left">用户名： </span>
                <span>{{username}}</span>
                <span style="float:right;color: green;opacity: 0.7;font-size: 15px;cursor: pointer;" @click="modify('username')">修改</span>
            </div>
            <div class="password">
                <span style="float:left">密码：</span>
                <span>******</span>
                <span style="float:right;color: green;cursor: pointer;font-size: 15px;cursor: pointer;opacity: 0.7;" @click="modify('password')">修改</span>
            </div>
        </div>
        <div class="listgroup">
            <p>应用列表</p>
            <b-list-group-item variant="secondary" class="title">
                <span  style="float:left">应用名</span>
                <span>应用ID</span>
                <span style='float:right'>操作</span>
            </b-list-group-item>
            <div v-for="(item,index) in list" :key='index' class="content" @click="lookAppInfo(index)">
                <div class="name">{{item.name}}</div>
                <div class="id">{{item.id}}</div>
                <div class="do">
                    <span style='margin-right: 1em;color:red' @click="deleteApp(index)" >删除</span>
                </div>
            </div>
            <p style="font-size: 17px;padding-top: 1em;padding-bottom: 1em;color: green;cursor: pointer;cursor: pointer;" @click="add()">添加</p>
        </div>
    </div>
</template>

<script>
import homeMenu from '../../components/menu.vue'
import router from '../../src/router'
import send from '../../js/send'
import userInfo from '../../js/userInfo'


export default {
    name: 'person',
    router,
    components:{
        homeMenu
    },
    data() {
        return {
            username: '',
            password: '',
            list: [],
            title:'',
            modifyUsername: false,
            modifyPassword: false,
            deleteIndex: -1,
            errMessage: '',
            successMessage: '',
            type: 'homepage'
        }
    },
    created() {
        let that = this
        userInfo.getUsername().then(res=>{
            if(res.data.code === 100){
                that.username = res.data.data.username
            }
        }).catch(err=>{
            if(err.response.data.code === 250) {
                that.$router.push({path:'../login'})
                return 
            }
        })
        userInfo.getAppList().then(res=>{
            if(res.data.code === 100){
                that.list = res.data.data
            }
        }).catch(err=>{
            if(err.response.data.code === 250) {
                that.$router.push({path:'../login'})
                return 
            }
        })
    },
    methods: {
        deleteApp(index){
            this.$refs['person-information'].show()
            // this.alert = true
            this.title = '您确定删除此应用吗？'
            this.deleteIndex = index
        },
        modify(x){
            if(x==='username'){
                // this.alert = true
                this.$refs['person-information'].show()
                this.title = '修改用户名'
                this.modifyUsername = true 
            }else if(x === 'password'){
                // this.alert = true
                this.$refs['person-information'].show()
                this.title = '修改密码'

                this.modifyPassword = true 
            }
        },
        modifyUsernameSubmit(){
            let that = this
            let username = this.$refs.username.value

            send.sendMessage('post', 'http://127.0.0.1:8080/modifyUsername', {
                    username: username,
                    oldUsername: that.username
                }).then(res=>{
                    console.log(res)
                    if(res.data.code === 100){
                        that.username = username
                        userInfo.setUsername(username)
                        that.$refs['person-information'].hide()
                        that.modifyUsername = false
                        that.successMessage = '用户名修改成功  √'
                    }else {
                        that.errMessage = res.message
                    }
                }).catch(err=>{
                    that.errMessage = err.response.data.message
                    if(err.response.data.code === 250) {
                        that.$router.push({path:'../login'})
                        return 
                    }
                })
        },
        modifyPasswordSubmit(){
            let that = this
            let password = this.$refs.password.value
            let newPassword = this.$refs.spassword.value
            send.sendMessage('post', 'http://127.0.0.1:8080/modifyPassword', {
                userId: userInfo.getUserId(),
                newPassword: newPassword,
                oldPassword: password
            }).then(res=>{
                if(res.data.code === 100){
                    that.$refs['person-information'].hide()
                    that.modifyPassword = false
                    that.successMessage = '密码修改成功  √'
                }
            }).catch(err=>{
                that.errMessage = err.response.data.message
                if(err.response.data.code === 250) {
                    that.$router.push({path:'../login'})
                    return 
                }
            })
        },
        deleteAppSubmit(){
            let that = this
            let appId = that.list[that.deleteIndex].id
            send.sendMsgDelete('http://127.0.0.1:8080/deleteApp', {appId: appId}).then(res=>{
                if(res.data.code === 100){
                    that.list.splice(that.deleteIndex,1)
                    that.$refs['person-information'].hide()
                    that.successMessage = '应用删除成功  √'
                }
                }).catch(err=>{
                    that.errMessage = err.response.data.message
                    that.$refs['person-information'].hide()
                })
        },
        submit(){
            if(this.modifyUsername){
                this.modifyUsernameSubmit()
            } else if(this.modifyPassword){
                this.modifyPasswordSubmit()
            }
            else {
                this.deleteAppSubmit()
            }
        },
        canle(){
            this.$refs['person-information'].hide()
            this.alert = false
            this.deleteIndex = -1
            this.alert=false
            this.errMessage = ''
            this.modifyUsername=false
            this.modifyPassword=false
        },
        add(){
            this.$router.push({path: './addApplication'})
        },
        lookAppInfo(index){
            let that = this
            userInfo.setApplicationId(that.list[index]).then(res=>{
                that.$router.push({path:'../application/exhibition'})
            })
        }
    },
}
</script>

<style lang="">
.personInfo .info{
    position: relative;
    width: 65%;
    background: white;
    left: 20%;
    top: 5em;
}
.personInfo .info p{
    font-size: 30px;
    padding-left: 3%;
    padding-top: 1%;
    text-align: center;
    margin:auto;
}
.personInfo .info .username{
    border-bottom: 1px solid #DCDCDC;
}
.personInfo .info .password{
    padding-bottom: 3em;
}
.personInfo .info .username, .personInfo .info .password{
    margin:auto;
    width: 60%;
    text-align: center;
    height: 3em;
    padding-top: 1em;
    padding-left: 1em;
    padding-right: 1em;
}
.personInfo .listgroup{
    width: 65%;
    text-align: center;
    left: 20%;
    position: relative;
    background: white;
    top: 7em;
    padding-top: 0.5em;
}
.personInfo .listgroup .title, .personInfo .listgroup .content{
    text-align: center
}
.personInfo .listgroup .content{
    border-bottom: 1px solid #DCDCDC;
    display: flex;
    height: 3em;
    padding-top: 1em;
}
.personInfo .listgroup .content .name{
    width: 20%;
    text-align: left;
    padding-left: 2%;
}
.personInfo .listgroup .content .id{
    width: 60%
}
.personInfo .listgroup .content .do{
    width: 20%
}
.personInfo .listgroup .content .do span{
    float: right;
    opacity: 0.7;
    font-size: 15px;
    cursor: pointer;
}
.personInfo .listgroup p{
    font-size: 30px;
    z-index: 1;
}

.alertBnt{
    margin-top: 2em;
    float: right;
    width: 20%;
}
.modifyInput{
    width: 100%;
    display: block;
    text-indent: 0.7em;
    height: 2.5em;
    border-radius: 4px;
    border: 1px solid gray;
}
</style>