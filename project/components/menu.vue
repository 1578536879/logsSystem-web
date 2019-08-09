<template lang="">
    <div style='position: absolute; width: 100%; height: 100%;'>  
         <div class='top'  v-if='type === "homepage"'>
            <img src = '../images/homepage/home.svg' @click = 'list' style='cursor:pointer'/>
            <p @click = 'list' style='cursor:pointer'>前端日志监控系统</p>
        </div>
        <div class='top' style='text-align:center' v-else >
            <img src='../images/back.svg' style='float:left;padding-top:1em;cursor:pointer' @click='back()'/>
            <p>
                {{appName}}
            </p>
        </div>
        <div class='left'>
            <div v-if='type === "homepage"'>
                <div class = 'list' @click='list'>
                    <img src = '../images/homepage/list.svg' />
                    <p>应用列表</p>
                </div>
                <div class = 'person' @click='person'>
                    <img src='../images/homepage/person.svg'/>
                    <p>个人信息</p>
                </div>
            </div>
            <div v-else>
                <div class = 'list' @click='statistics'>
                    <img src = '../images/application/statistics.svg' />
                    <p>收集信息</p>
                </div>
                <div class = 'person' @click='appInfo'>
                    <img src='../images/application/app.svg'/>
                    <p>应用信息</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import router from '../src/router'


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
            this.$router.go(-1)
        },
        statistics(){

        },
        appInfo(){

        }
    },
}
</script>
<style>
    body{
        margin: 0;
        background: #F5F5F5;
    }
    .top{
        background: #ffffff;
        border-bottom: 1px solid #DCDCDC;
    }
    .top  img{
        width:2em;    
        background: white;
        padding-bottom: 1em;
    }
    .top p{
        display: inline;
        font-size: 2em;
        color: #515151;
        line-height: 2em;
        background: white;
    }
    .left{
        width: 10em;
        background: #ffffff;
        height: calc(100% - 4.1em);
        border-right: 1px solid #DCDCDC;
    }
    .left .list, .left .person{
        background: #F5F5F5;
        /* margin-top: 5em; */
        height: 3em;
        cursor: pointer;
    }
    .left .list{
        transform: translateY(5em);
        margin-bottom: 11em;

    }
    .left .list img, .left .person img{
        width: 3em;
        height: 2em;
        padding-left: 1em;
        padding-bottom: 0.3em;
    }
    .left .list p, .left .person p{
        display: inline;
        font-size: 20px;
        line-height: 2.5em;
        color: #515151
    }
</style>
