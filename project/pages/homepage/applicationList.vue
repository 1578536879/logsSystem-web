<template>
    <div class="applicationList">
        <home-menu :type='type'></home-menu>

        <b-alert show variant="success" v-if="successMessage" dismissible class="delete">{{successMessage}}</b-alert>
        <b-alert show variant="danger" v-if="errMessage" dismissible class="delete">{{errMessage}}</b-alert>

        <b-alert show variant="warning"  class="delete" v-if="del !== -1">
            <span>你确定要删除此应用吗？</span>
            <b-button  variant="outline-warning"  @click="sureDel">确 定</b-button>
            <b-button variant="outline-secondary"  style='margin-right: 4%' @click="cancel">取 消</b-button>
        </b-alert>
        <div class="applist">
            <div v-for="(item, index) in appList" :key="index" class="apps" :style="appStyle[index]" @mouseenter="enter(index)" @mouseleave="leave(index)">
                <p >{{ item.name }}</p>
                <span>创建时间：{{item.createTime}}</span> 
                <div v-if="show === index" class="show">
                    <button style="margin-right: 10%; background: green;" @click="lookAppInfo(index)">查 看</button>
                    <button style="background:red" @click="deleteApp(index)">删 除</button>
                </div>
            </div>
            <div class="add" @click="addApp">
                <span>+</span>
            </div>
        </div>
    </div>
</template>
<script>
import homeMenu from '../../components/menu.vue'
import router from '../../src/router'
import send from '../../js/send';
import userInfo from '../../js/userInfo'

export default {
    name: 'applicationList',
    router,
    components:{
        homeMenu
    },
    data() {
        return {
            appInfo: [],
            appList:[],
            colors:['#97B7B4', '#929CD2', '#E1B16A', '#CD5C5C', '#20B2AA', '#DB7093', '#7B68EE', '#9EB089', '#DAA520'],
            appStyle:[],
            show: -1,
            del: -1,
            type: 'homepage',
            successMessage: '',
            errMessage:''
        }
    },
    created() {
        let that = this
        if(userInfo.getAppList()){
            this.appList = userInfo.getAppList()
            for(let i=0;i<this.appList.length;i++){
                let index = parseInt(Math.random() * that.colors.length)
                that.appStyle.push({background: that.colors[index]})
            }
        }
        else {
            send.sendMsgGet('http://127.0.0.1:8080/queryAppList', `userId=${that.$route.query.userId}`).then(function(r){
                if(r.data.code === 100){
                    that.appInfo = r.data.data
                    r.data.data.forEach(ele => {
                        let time = new Date(parseInt(ele.time))
                        time = `${time.getFullYear()}.${time.getMonth()+1}.${time.getDate()}` 
                        let name = ele.name
                        that.appList.push({
                            name: name,
                            createTime: time,
                            id: ele.id
                        })
                        userInfo.setAppList(that.appList)
                        let index = parseInt(Math.random() * that.colors.length)
                        that.appStyle.push({background: that.colors[index]})
                    });
                } else if(r.data.code === 101) {
                    that.appList = []
                }
            })
        }
    },
    methods: {
        enter(index){
            console.log(index)
            this.appStyle[index] = {
                background: this.appStyle[index].background,
                opacity: 0.5
            }
            this.show = index
        },
        leave(index){
            this.appStyle[index] = {
                background: this.appStyle[index].background,
            }
            this.show = -1
        },
        lookAppInfo(index){

        },
        deleteApp(index){
            this.del = index
            console.log(this.del)
        },
        addApp(index){
            this.$router.push({path: './addApplication'})
        },
        cancel(){
            this.del = -1
        },
        sureDel(){
            let that = this
            let appId = that.appList[that.del].id
            send.sendMsgDelete('http://127.0.0.1:8080/deleteApp', {appId: appId}).then(res=>{
                    if(res.data.code === 100){
                        that.appList.splice(that.del,1)
                        
                        userInfo.setAppList(that.appList)
                        that.del = -1
                        that.successMessage = '应用删除成功  √'

                    }else {
                        that.del = -1
                        that.errMessage = res.data.message
                    }
                })
        }
    },
}
</script>

<style>
    .applicationList{
        width: 100%;
    }
    .applicationList .applist{
        position: relative;
        top: 8em;
        left: 20%;
        width: 77%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        flex-wrap: wrap;
    }
    .applicationList .applist .apps{
        color: white;
        text-align: center;
        padding-top: 1em;
        cursor: pointer;
    }
    .applicationList .applist .show{
        width: 100%;
        opacity: 1;
        transform: translateY(-85%);
    }
    .applicationList .applist .show button{
        
        border: none;
        color: white;
        width: 35%;
        height: 1.9em;
        border-radius: 3px;
    }
    .applicationList .applist .apps p{
        line-height: 2em;
        -webkit-margin-after: 0;
    }
    .applicationList .applist .add, .applicationList .applist .apps{
        width: 12em;
        height: 7em;
        border-radius: 8px;
        display: inline-block;
        margin-right: 5em;
        margin-bottom: 2em;
    }
    .add{
        background: white;
        text-align: center;
        line-height: 5em;
        overflow: hidden;
        cursor: pointer;
    }
    .add span{
        background: white;
        font-size: 9em;
        color: #DCDCDC;
    }
    .delete{
        top: 6em;
        left: 20%;
        width: 70%;
    }
    /* .delete .alert{
        width: 30%;
        height: 20em;
        margin: 10em auto;
        opacity: 1;
        background: white;
        text-align: center
    }
    .delete .alert img{
        width:30%
    } */
    .delete button{
        width: 4.5em;
        float: right;
        transform: translateY(-0.2em);
        margin-right: 4%;
        height: 2em;
        line-height: 0em;
    }
    
</style>