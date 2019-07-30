<template lang="">
    <div style='position: absolute; width: 100%; height: 100%;'>
        <div class = 'top'>
            <img src = '../images/homepage/home.svg'/>
            <p>前端日志监控系统</p>
        </div>
        <div class='left'>
            <div class = 'list'>
                <img src = '../images/homepage/list.svg' />
                <p>应用列表</p>
            </div>
            <div class = 'person'>
                <img src='../images/homepage/person.svg'/>
                <p>个人信息</p>
            </div>
        </div>
    </div>
</template>

<script>
import router from '../src/router'


export default {
    name: 'home-menu',
    router,
    data() {
        return {
            
        }
    },
    created() {
        
    },
    methods: {
        
    },
}
</script>
<style>
    *{
        margin: 0;
    }
    .top{
        background: #F5F5F5;
        border: 1px solid #DCDCDC;
    }
    .top  img{
        width:2em
    }
    .top p{
        display: inline;
        font-size: 2em;
        color: #515151;
        line-height: 2em;
    }
    .left{
        width: 10em;
        background: #F5F5F5;
        height: calc(100% - 4.1em);
    }
    .left .list, .left .person{
        background: white;
        /* margin-top: 5em; */
        height: 3em;
    }
    .left .list{
        transform: translateY(5em);
        margin-bottom: 11em;
    }
    .left .list img, .left .person img{
        width: 1em;
        padding-left: 1em;
    }
    .left .list p, .left .person p{
        display: inline;
        font-size: 20px;
        line-height: 2.5em;
        color: #515151
    }
</style>
