<template lang="">
    <div style='position: absolute; width: 100%; height: 100%;top: 0;'>  
         <div class='menu-top'  v-if='type === "homepage"'>
            <img src = '../images/homepage/home.svg' @click = 'list' style='cursor:pointer'/>
            <p @click = 'list' style='cursor:pointer'>前端日志监控系统</p>
            <span class='menu-exit' @click='exit'>退出</span>
        </div>
        <div class='menu-top' style='text-align:center' v-else >
            <img src='../images/back.svg' style='float:left;padding-top:1em;cursor:pointer' @click='back()'/>
            <p>
                {{appName}}
            </p>
            <span class='menu-exit' @click='exit'>退出</span>
        </div>
        <div class='menu-left'>
            <div v-if='type === "homepage"'>
                <div class = 'menu-list' @click='list'>
                    <img src = '../images/homepage/list.svg' />
                    <p>应用列表</p>
                </div>
                <div class = 'menu-person' @click='person'>
                    <img src='../images/homepage/person.svg'/>
                    <p>个人信息</p>
                </div>
            </div>
            <div v-else>
                <div class = 'menu-list' @click='statistics'>
                    <img src = '../images/application/statistics.svg' />
                    <p>收集信息</p>
                </div>
                <div class = 'menu-person' @click='appInfo'>
                    <img src='../images/application/app.svg'/>
                    <p>应用信息</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from '../src/router'
import send from '../js/send'

export default {
    name: 'home-menu',
    router,
    props: ['type', 'appName'],
    data() {
        return {
            
        }
    },
    created() {
        // console.log(this.type)
    },
    methods: {
        list(){
            console.log(123)
            this.$router.push({path: './applicationList'})
        },
        person(){
            this.$router.push({path: './person'})
        },
        back(){
            this.$router.push({path: '../homepage/applicationList'})
        },
        statistics(){
            this.$router.push({path: './exhibition'})
        },
        appInfo(){
            this.$router.push({path: './information'})

        },
        exit(){
            let that = this
            send.sendMessage('post', 'http://127.0.0.1:8080/loginOut').then(res=>{
                that.$router.push({path:'../login'})
            }).catch(err=>{
                that.$router.push({path:'../login'})
            })
        }
    },
}
</script>
<style>
    body{
        margin: 0;
        background: #F5F5F5;
    }
    .menu-top{
        background: #ffffff;
        border-bottom: 1px solid #DCDCDC;
    }
    .menu-top  img{
        width:2em;    
        background: white;
        padding-bottom: 1em;
    }
    .menu-top p{
        display: inline;
        font-size: 2em;
        color: #515151;
        line-height: 2em;
        background: white;
    }
    .menu-left{
        width: 10em;
        background: #ffffff;
        height: calc(100% - 4.1em);
        border-right: 1px solid #DCDCDC;
    }
    .menu-left .menu-list, .menu-left .menu-person{
        background: #F5F5F5;
        /* margin-top: 5em; */
        height: 3em;
        cursor: pointer;
    }
    .menu-left .menu-list{
        transform: translateY(5em);
        margin-bottom: 11em;

    }
    .menu-left .menu-list img, .menu-left .menu-person img{
        width: 3em;
        height: 2em;
        padding-left: 1em;
        padding-bottom: 0.3em;
    }
    .menu-left .menu-list p, .menu-left .menu-person p{
        display: inline;
        font-size: 20px;
        line-height: 2.5em;
        color: #515151
    }
    .menu-exit{
        float: right;
        font-size: 15px;
        line-height: 83px;
        color: #00B2EE;
        padding-right: 17px;
        background: transparent;
        cursor:pointer
    }
</style>
