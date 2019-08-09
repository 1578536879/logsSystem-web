<template>
    <div>
        <home-menu :type = 'type' :appName="app.name"></home-menu>
        <b-modal ref="information-doaminName-modal" hide-footer>
            <b-form-input v-model="domainName" placeholder="Enter your name" v-if="modifyIndex !== -1" style="margin-bottom:2em"></b-form-input>
            <p v-if="deleteIndex !== -1">确定删除此域名吗？</p>
            <b-button variant="light" @click='cancle' style="float:right">取消</b-button>
            <b-button variant="success" @click="submit" style="float:right;margin-right:2em">确定</b-button>
        </b-modal>
        <b-alert v-if="result" show dismissible >
            {{result}}
        </b-alert>
        <div class="info">
            <p style="font-size:25px;text-align:center">应用信息</p>
            <div class="appName"> 
                <span style="float:left">应用名： </span>
                <span>{{app.name}}</span>
                <span style="float:right;color: green;opacity: 0.7;font-size: 15px;cursor: pointer;" @click="modify('username')">修改</span>
            </div>
            <div class="appId">
                <span style="float:left">应用Id：</span>
                <span>{{app.id}}</span>
            </div>
        </div>
        <div class="names">
            <span style="font-size:25px;">应用域名</span>
            <img src="../../images/application/insert.svg" style="position: absolute;right: 17%;width: 1.3em;top:2.5em" @click="insert()"/>

            <b-list-group style="margin-top: 1em;">
                <b-list-group-item v-for="(item, index) in domainNames" :key="index" style="width:70%;margin:auto">
                    {{item}}
                    <img src="../../images/application/modify.svg" style="position: absolute;right: 17%;width: 1.3em;" @click="modify(index)"/>
                    <img src="../../images/application/delete.svg" style="position: absolute;right: 10%;width: 1.3em;" @click="deleteDomainName(index)"/>
                </b-list-group-item>
            </b-list-group>
        </div>
    </div>
</template>

<script>
import homeMenu from '../../components/menu.vue'
import router from '../../src/router'
import send from '../../js/send';
import userInfo from '../../js/userInfo'

export default {
    name: 'applicationInfo',
    router,
    components:{
        homeMenu
    },
    data() {
        return {
            type: 'application',
            app: {},
            domainNames: [],
            domainName: '',
            deleteIndex: -1,
            modifyIndex: -1,
            result: ''
        }
    },
    created() {
        this.app = this.$route.query.app
        console.log(this.app)
        let apps = userInfo.getAppList()
        let that = this
        apps = apps.filter(ele => ele.id === that.app.id)
        this.domainNames = apps[0].domainNames

        // console.log(this.domainName)
    },
    methods: {
        insert(){
            this.$refs["information-doaminName-modal" ].show()

        },
        deleteDomainName(index){
            this.deleteIndex = index
            this.$refs["information-doaminName-modal" ].show()
        },
        modify(index){
            this.modifyIndex = index
            this.doaminName = this.domainNames[index]
            this.$refs["information-doaminName-modal" ].show()

        },
        cancle(){
            this.deleteIndex = -1
            this.modifyIndex = -1
            this.$refs["information-doaminName-modal" ].hide()

        },
        submit(){
            let that = this
            let flag = false
            if(this.deleteIndex !== -1){
                console.log(this.domainNames)
                this.domainNames.splice(this.deleteIndex, 1)
                flag = true
                this.deleteIndex = -1

            } else if(this.modifyIndex !== -1){
                this.domainNames[this.modifyIndex] = this.doaminName
                this.modifyIndex = -1
                this.domainName = ''

                flag = true
            } else {
                if(this.doaminName){
                    this.domainNames.push(this.doaminName)
                    this.domainName = ''

                    flag = true
                }
            }
            if(flag){
                send.sendMessage('post', 'http://127.0.0.1:8080/modifyDomainNames', {
                    appId: that.app.id,
                    domainNames: that.domainNames
                }).then(res=>{
                    console.log(res)       
                    if(res.data.code === 100){
                        
                    }   
                }).catch(err=>{
                    that.result = err.response.data.message
                })
            }
            this.$refs["information-doaminName-modal" ].hide()

        }
    },
}
</script>

<style lang="">
    .info{
        position: relative;
        width: 65%;
        background: white;
        left: 20%;
        top: 5em;
        padding-top: 1em;
        padding-bottom: 1em;
    }
    .appName, .appId{
        width: 70%;
        margin: auto;
        text-align: center;
        font-size: 20px;
        margin-bottom: 1em;
    }
    .names{
        width: 65%;
        text-align: center;
        left: 20%;
        position: relative;
        background: white;
        top: 7em;
        padding-top: 1.5em;
        padding-bottom: 4em;
    }
</style>