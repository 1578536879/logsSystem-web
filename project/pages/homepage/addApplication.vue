<template>
    <div class="addApplication">
        <div class="top">
            <img src="../../images/back.svg" @click="back" style="cursor:pointer"/>
            <p>添加应用</p>
        </div>
        <b-container fluid class="container">
            <div style="height:5em"></div>
            <b-alert show variant="danger" v-if="errMessage" dismissible style="width: 93%;left: 7%;">{{errMessage}}</b-alert>

            <b-row class="my-1">
                <b-col sm="3" style="text-align: center;">
                    <label for="input-none">应用名：</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input v-model="name" :state="nameState" placeholder="请输入应用名"></b-form-input>
                </b-col>
            </b-row>

            <b-row>
                <b-col sm="3" style="text-align: center;">
                    <label for="input-valid">应用域名：</label>
                </b-col>
                <b-col sm="9">
                    <b-form-input v-model="domainName" :state="domainNameState" placeholder="请输入应用域名"></b-form-input>
                    
                </b-col>
            </b-row>
            <b-form-text id="input-live-help" style="left: 27%;position: relative;margin-bottom: 1em;">
                *号表示全匹配；多个域名用英文分号隔开
            </b-form-text>

            <b-button variant="success" @click="submit">提交</b-button>
        </b-container>

        <b-modal ref="add-application" centered hide-footer>
            <p style="font-size: 25px;padding-left: 1em;">添加应用成功</p>
            <b-button variant="outline-warning" @click="continueAdd" class="alertBnt">继续添加</b-button>
            <b-button variant="outline-secondary" @click="back" class="alertBnt" style="margin-right:10%;">返回</b-button>
        </b-modal>
    </div>
</template>
<script>
import router from '../../src/router'
import send from '../../js/send'
import userInfo from '../../js/userInfo'

export default {
    name: 'addApplication',
    router,
    data() {
        return {
            nameState: '',
            domainNameState: '',
            name: '',
            domainName: '',
            errMessage: '',
        }
    },
    methods: {
        submit(){
            let that = this
            let arr = this.domainName.split(';')
            //this.nameState = true
            send.sendMessage('post', 'http://127.0.0.1:8080/createApp', {
                userId: userInfo.getUserId(),
                name: that.name,
                domainNames: arr
            }).then(res=>{
                console.log(res)
                if(res.code === 100){
                    that.$refs['add-application'].show()
                    let apps = userInfo.getAppList()
                    let time = new Date()
                    apps.push({
                        userId: userInfo.getUserId(),
                        name: that.name,
                        domainNames: arr,
                        id: res.data.appId,
                        createTime: `${time.getFullYear()}.${time.getMonth()+1}.${time.getDate()}`
                    })
                    console.log(apps)
                    userInfo.setAppList(apps)
                }
            }).catch(err=>{
                that.errMessage =  err.response.data.message
            })
        },
        back(){
            this.$router.go(-1)
        },
        continueAdd(){
            this.$refs['add-application'].hide()
        }
    },
}
</script>
<style lang="">
    .addApplication .top{
        text-align: center;
        height: 65px;
    }
    .addApplication .top img{
        float: left;
        padding-top: 1em;
        padding-left: 1em;
        width: 3em;
    }
    .addApplication .top p{
        font-size: 22px;
        line-height: 60px;
    }
    .addApplication .container{
        background: white;
        height: 20em;
        margin-top: 1em;
    }
    .my-1{
        margin-bottom: 2em !important
    }
    .addApplication .container button{
        float: right;
        margin-right: 1em;
        width: 10%;
    }
</style>