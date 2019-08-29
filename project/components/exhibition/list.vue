<template>
    <div style="position: relative;left: 11%;top: 4em;width: 89%;">
        <b-modal ref="exhibition-list-setCondition" title='设置范围' hide-footer>
            <div class="exhitbition-list-condition">
            <div>日期范围：<input type="date" ref="startTime" value=""/> ~ <input type='date' ref="endTime" @click="setEndTime" value=""/></div>
            <div>时间取值：
                <input type="number" style="width: 50px;border: none;border-bottom: 1px solid gray;" ref="intervalTime"/>
                <select v-model="intervalTimeType" name='second' style="border:none">
                    <option value ="second">秒</option>
                    <option value ="minute">分</option>
                    <option value="hour">时</option>
                </select>
                <span style="font-size: 5px;">
                    默认为1分钟
                </span>
            </div>
            <b-button variant="outline-success" style="float: right;height: 35px;" @click="setCondition">确定</b-button>
            <b-button variant="outline-secondary" style="float: right;height: 35px;margin-right:15px" @click="cancel">取消</b-button>
        </div>
        </b-modal>
        <div  style="" class="exhibition-list-type"> 
            <span @click="showChoose">{{onShowType}}</span>
            <span style="writing-mode: vertical-lr;transform: scaleX(1.5);"  @click="showChoose"> ></span>
            <img src="../../images/setting.svg" style="cursor: pointer;" @click="showCondition"/>
        </div>
        
        <div v-if="choose" class="exhibition-list-choose" @click="hideChoose">
            <div>
                <b-list-group class="exhibition-list-choose-item">
                    <b-list-group-item href="#some-link"  v-for="(item, index) in titles" :key="index" @click="changeTime(index)">
                        {{item}}
                    </b-list-group-item>
                </b-list-group>
            </div>
        </div>
        <div ref='showLogs' style="width:75%;height:500px;margin: auto;top: 85px"></div>
    </div>
</template>

<script>
import router from '../../src/router'
import send from '../../js/send';
import userInfo from '../../js/userInfo'
import echarts from 'echarts'

export default {
    name: 'list',
    router,
    // props: ['showIndex'],
    data() {
        return {
            list: [{
                    // id: 'whiteScreenTime',
                    name: '白屏时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'firstScreenTime',
                    name: '首屏时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'DNSTime',
                    name: 'DNS查询时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'pageLoadingCompleted',
                    name: '页面加载完全时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'TCPTime',
                    name: 'TCP连接时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'onLoadTime',
                    name: 'onLoad事件加载时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'readFirstBitTime',
                    name: '读取第一个字节时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'analysisDOMTime',
                    name: '解析DOM树时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'contentLoadingCompleted',
                    name: '内容加载完全时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'redirectTime',
                    name: '重定向时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'unloadTime',
                    name: '卸载页面时间',
                    data: [],
                    type: 'line'
                },{
                    // id: 'userOperationalTime',
                    name: '用户可操作时间',
                    data: [],
                    type: 'line'
                },
            ],
            intervalTime: 60000, //日志间隔时间,
            xAxisData: [],
            myChart: '',
            titles: ['全部时间', "白屏时间", '首屏时间','DNS查询时间', '页面加载完全时间', 'TCP连接时间', 'onLoad事件加载时间', '读取第一个字节时间', '解析DOM树时间', '内容加载完全时间', '重定向时间', '用户可操作时间'],
            choose: false,
            onShowType: '全部时间',
            showIndex: 0,
            logs: [],
            showLogs: [],
            options: {},
            intervalTimeType: 'second',
            startTime: '',
            endTime: '',
            environment: '',
            version: ''
        }
    },
    mounted() { 
        console.log(this.showIndex)
        this.getTimeDate()
    },
    watch: {
        // intervalTimeType() {
        //     console.log(this.intervalTimeType)
        // }
    },
    methods: {
        getTimeDate(){
            this.init()
            let that = this
            send.sendMsgGet(`http://127.0.0.1:8080/queryLogs?startTime=${that.startTime}&&endTime=${that.endTime}&&intervalTime=${that.intervalTime}&&environment=${that.environment}&&version=${that.version}`, ).then(res=>{
                if(res.data.code === 100){
                    console.log(res)
                    that.logs = res.data.data.logs
                    that.xAxisData = res.data.data.xAxisData
                    
                    that.getChartData()
                }
            }).catch(err=>{
                if(err.response){
                    if(err.response.data.code === 250){
                        that.$router.push({path:'../login'})
                    }
                }
            })
        },
        init(){
        let list = this.list
        let titles = this.titles
        this.myChart = echarts.init(this.$refs.showLogs);
        this.myChart.showLoading()
        // let option = {
                
        //     }
        // this.myChart.setOption(options)
        },
        getChartData(){
            let that = this
            this.xAxisData.forEach((e, index) =>{
                let element = that.logs[index]
                if(element){
                    if(index !== that.xAxisData.length - 1){
                        let t1 = new Date(e).getTime()
                        let t2 = new Date(that.xAxisData[index + 1]).getTime()
                        if(!(element >= ti && element < t2)) {
                            for(let i=0; i<that,list.length; i++){
                                that.list[i].data.push(-1)
                            }
                        }else{
                            that.list[0].data.push(element.content.whiteScreenTime)
                            that.list[1].data.push(element.content.firstScreenTime)
                            that.list[2].data.push(element.content.DNSTime)
                            that.list[3].data.push(element.content.pageLoadingCompleted)
                            that.list[4].data.push(element.content.TCPTime)
                            that.list[5].data.push(element.content.onLoadTime)
                            that.list[6].data.push(element.content.readFirstBitTime)
                            that.list[7].data.push(element.content.analysisDOMTime)
                            that.list[8].data.push(element.content.contentLoadingCompleted)
                            that.list[9].data.push(element.content.redirectTime)
                            that.list[10].data.push(element.content.unloadTime)
                            that.list[11].data.push(element.content.userOperationalTime)
                        }
                    }else{
                        that.list[0].data.push(element.content.whiteScreenTime)
                        that.list[1].data.push(element.content.firstScreenTime)
                        that.list[2].data.push(element.content.DNSTime)
                        that.list[3].data.push(element.content.pageLoadingCompleted)
                        that.list[4].data.push(element.content.TCPTime)
                        that.list[5].data.push(element.content.onLoadTime)
                        that.list[6].data.push(element.content.readFirstBitTime)
                        that.list[7].data.push(element.content.analysisDOMTime)
                        that.list[8].data.push(element.content.contentLoadingCompleted)
                        that.list[9].data.push(element.content.redirectTime)
                        that.list[10].data.push(element.content.unloadTime)
                        that.list[11].data.push(element.content.userOperationalTime)
                    }
                    
                    
                }
                else {
                    for(let i=0; i<that.list.length; i++){
                        that.list[i].data.push(-1)
                    }
                }
                
                
            })
            // debugger
            this.showCharts()
            console.log(that.list,that.xAxisData)
        },
        showCharts(){
            let xAxisData = this.xAxisData
            let list = []
            
            let titles = this.titles
            // list = this.list[this.showIndex - 1]
            this.myChart.hideLoading()
            debugger
            
            if(this.showIndex === 0) {
                list = this.list
            }else if(this.showIndex !== 0){
                list = this.list[this.showIndex - 1]
                titles = this.titles[this.showIndex]
            }
            let options = {
                tooltip: {trigger: 'axis'},
                legend: {
                    data: titles,
                },
                grid: {
                    top:'10%',
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                dataZoom: [{
                    type: 'inside',
                    start: 0,
                    end: 10
                
                }],
                yAxis: {
                    type: 'value'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxisData
                },
                series: list
            }
            // if(this.first) {
            //     this.myChart.hideLoading()
               
            //     this.first = false
            // }else {
            //     this.myChart.setOption(option)
            // }
            
            this.myChart.setOption(options, true)
            // this.myChart.setOption(option)
            console.log(options, list)
        },
        changeTime(index){
            this.showIndex = index
            this.onShowType = this.titles[index]
            this.getChartData()
            this.showCharts()
        },
        showChoose(){
            this.choose = true
        },
        hideChoose(){
            this.choose = false
        },
        showCondition(){
            this.$refs['exhibition-list-setCondition'].show()
        },
        setEndTime(){
            this.startTime = new Date(`${this.$refs.startTime.value} 0:0:0`).getTime()
            console.log( this.startTime, this.$refs.startTime.value)
            this.$refs.endTime.min = this.startTime
            console.log(this.intervalTimeType)
        },
        setCondition(){
            this.endTime = new Date(`${this.$refs.endTime.value} 23:59:59`).getTime()
            console.log(this.$refs.intervalTime.value)
            if(this.$refs.intervalTime.value){
                if(this.intervalTimeType === 'second') {
                    this.intervalTime = this.$refs.intervalTime.value * 1000
                }else if(this.intervalTimeType === 'minute'){
                    this.intervalTime = this.$refs.intervalTime.value * 60000
                }else if(this.intervalTimeType === 'hour'){
                    this.intervalTime = this.$refs.intervalTime.value * 3600000
                }
            }
            this.cancel()
            this.getTimeDate()
            
        },
        cancel(){
            this.$refs['exhibition-list-setCondition'].hide()
        }
    },
}
</script>
<style lang="">
    .exhibition-list{
        width: 50%;
        display: inline-block;
        text-align: center;
    }
    .exhibition-list-type{
        position: absolute;
        /* left: 25%; */
        top: 1em;
        width: 100%;
        text-align: center;
        height: 50px;
        font-size: 23px;
        color: gray;
    }
    .exhibition-list-type span{
        cursor: pointer;
    }
    .exhibition-list-choose{
       position: absolute;
        /* left: 11%; */
        top: 0em;
        width: 100%;
        z-index: 1;
        padding-top: 3.5em;
        font-size: 17px;
        padding-left: 1%;
        padding-bottom: 10px;
    }
    .exhibition-list-choose-item{
        width: 16%;
        margin: auto;
        text-align: center;
        z-index: 2;
    }
    .exhitbition-list-condition{
        color: #8a8a8a
    }
    .exhitbition-list-condition input{
        background: transparent;
        border: 1px solid #BBBBBB;
        color: #8a8a8a;
        border-radius: 3px;
    }
    .exhitbition-list-condition select,.exhitbition-list-condition option{
        background: transparent;
        border: 1px solid #BBBBBB;
        color: #8a8a8a
    }
</style> 