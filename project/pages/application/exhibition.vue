<template>
    <div>
        <home-menu :type = 'type' :appName="app.name"></home-menu>
        <exhibition-list></exhibition-list>
        
    </div>
</template>

<script>
import homeMenu from '../../components/menu.vue'
import exhibitionList from '../../components/exhibition/list'
import router from '../../src/router'
import send from '../../js/send';
export default {
    name: 'exhibition',
    router,
    components:{
        homeMenu,
        exhibitionList
    },
    data() {
        return {
            app: {},
            type: 'app',
            list: ['全部时间', "白屏时间", '首屏时间','DNS查询时间', '页面加载完全时间', 'TCP连接时间', 'onLoad事件加载时间', '读取第一个字节时间', '解析DOM树时间', '内容加载完全时间', '重定向时间', '用户可操作时间'],
            onShowType: '全部时间',
            choose: false,
            showType: 0
        }
    },
    mounted() {
        let that = this
        send.sendMsgGet('http://127.0.0.1:8080/queryApplication').then(res=>{
            if(res.data.code === 100){
                that.app = res.data.data
            }
        }).catch(err=>{
            if(err.response.data.code === 250) {
                that.$router.push({path:'../login'})
            }
        })
    },
    methods: {
        showChoose(){
            this.choose = true
        },
        hideChoose(){
            this.choose = false
        },
        changeTime(index){
            console.log(index)
            this.showType = index
        }
    },
}
</script>

<style lang="">
    
</style>