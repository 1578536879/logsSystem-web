<template>
    <div>
        <home-menu :type = 'type' :appName="app.name"></home-menu>
        <b-modal ref="information-domainName-modal" hide-footer>
            <p v-if="deleteIndex !== -1">确定删除此域名吗？</p>
            <b-alert show variant="danger" v-if="errMsg">
                {{errMsg}}
            </b-alert>
            <b-form-input v-model="domainName" placeholder="请输入域名" v-if="modifyIndex !== -1 || insertNewDomainName" style="margin-bottom:2em"></b-form-input>
            <b-form-input v-model="modifyName" placeholder="请输入应用名" v-else-if='deleteIndex === -1' style="margin-bottom:2em"></b-form-input>
            <b-button variant="light" @click='cancle' style="float:right">取消</b-button>
            <b-button variant="success" @click="submit" style="float:right;margin-right:2em">确定</b-button>
        </b-modal>
        <b-alert v-if="result" show dismissible >
            {{result}}
        </b-alert>
        <b-alert show variant="danger" v-if="errMsg">
            {{errMsg}}
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
            result: '',
            insertNewDomainName: false,
            errMsg: '',
            modifyName: ''
        }
    },
    mounted() {
        let that = this
        // apps = apps.filter(ele => ele.id === that.app.id)
        // this.domainNames = apps[0].domainNames
        send.sendMsgGet('http://127.0.0.1:8080/queryApplication').then(res=>{
            if(res.data.code === 100){
                that.app = res.data.data
                that.domainNames = res.data.data.domainNames
            }
        }).catch(err=>{
            if(err.response.data.code === 250) {
                that.$router.push({path:'../login'})
            }
        })
        // console.log(this.domainName)
    },
    methods: {
        insert(){
            this.insertNewDomainName = true
            this.$refs["information-domainName-modal" ].show()
            let that = this
            if(!that.domainName){

            }
        },
        deleteDomainName(index){
            this.deleteIndex = index
            this.$refs["information-domainName-modal" ].show()
        },
        modify(type){
            console.log(type)
            if(type === 'username'){
                this.modifyIndex = -1
                this.insertNewDomainName = false
                this.modifyName = this.app.name
            }
            else {
                this.modifyIndex = type
                this.domainName = this.domainNames[type]
            }
            this.$refs["information-domainName-modal" ].show()

        },
        cancle(){
            this.deleteIndex = -1
            this.modifyIndex = -1
            this.insertNewDomainName = false
            this.$refs["information-domainName-modal" ].hide()

        },
        submit(){
            let flag = false
            let domainNames = this.domainNames
            if(this.deleteIndex !== -1){
                domainNames.splice(this.deleteIndex, 1)
                flag = true
            } else if(this.modifyIndex !== -1){
                domainNames[this.modifyIndex] = this.domainName
                flag = true
            } else if(this.insertNewDomainName){
                if(this.domainName){
                    domainNames.push(this.domainName)
                    flag = true
                }else {
                    this.errMsg = '域名不能为空'
                    return
                }
            }else{
                if(!this.modifyName) {
                    this.errMsg = '应用名不能为空'
                    return
                }else{
                   this.modifyAppName()
                }
            }
            if(flag){
                this.modifyDomainName(domainNames)
            }
        },
        modifyDomainName(domainNames){
            let that = this
            send.sendMessage('post', 'http://127.0.0.1:8080/modifyDomainNames', {
                domainNames: domainNames
            }).then(res=>{     
                    if(res.data.code === 100){
                        that.$refs["information-domainName-modal" ].hide()
                        that.domainNames = domainNames
                        that.modifyIndex = -1
                        that.domainName = ''
                        that.deleteIndex = -1
                        that.insertNewDomainName = false
                    }   
            }).catch(err=>{
                if(err.response.data.code === 250){
                    that.$router.push({path:'../login'})
                    return 
                }
                that.errMsg = err.response.data.message
            })
        },
        modifyAppName(){
            let that = this
            send.sendMessage('put', 'http://127.0.0.1:8080/modifyAppName', {
                newName: that.modifyName
            }).then(res=>{
                if(res.data.code === 100){
                    that.$refs["information-domainName-modal" ].hide()
                    that.app.name = that.modifyName
                    that.modifyName = ''
                }
            }).catch(err=>{
                if(err.response.data.code === 250){
                    that.$router.push({path:'../login'})
                    return 
                }
                that.errMsg = err.response.data.message
            })
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