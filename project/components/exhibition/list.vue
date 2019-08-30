<template>
    <div style="position: relative;left: 11%;top: 4em;width: 89%;">
        <b-modal ref="exhibition-list-setCondition" title='设置范围' hide-footer>
            <div class="exhitbition-list-condition">
            <div>日期范围：<input type="date" ref="startTime" value=""/> ~ <input type='date' ref="endTime" @click="setEndTime" value="" /></div>
            <div>时间取值：
                <input type="number" style="width: 50px;border: none;border-bottom: 1px solid gray;" ref="intervalTime"/>
                <select v-model="intervalTimeType" name='second' style="border:none">
                    <option value ="second">秒</option>
                    <option value ="minute">分</option>
                    <option value="hour">时</option>
                </select>
                <span style="font-size: 5px;">
                    当前时间取值为：{{intervalTime}}秒
                    <!-- {{intervalTimeType === 'second'?'秒':intervalTimeType==='huor'?'时':'分'}} -->
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
        <div v-if="!logsInfo" style="width:75%;height:500px;margin: auto;text-align: center;font-size: 20px;position: relative;top: -15em;">莫得日志信息</div>
        <div ref='showLogs' v-else style="width:75%;height:500px;margin: auto;top: 85px;position: relative;"></div>
        <div>
        </div>
        
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
            intervalTime: 60, //日志间隔时间,
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
            version: '',
            logsInfo: true
        }
    },
    mounted() { 
        console.log(this.showIndex)
        this.myChart = echarts.init(this.$refs.showLogs);
        this.getTimeDate()
    },
    watch: {
        // intervalTimeType() {
        //     console.log(this.intervalTimeType)
        // }
    },
    methods: {
        getTimeDate(){
            // if(this.intervalTimeType === 'minute'){
            //     this.intervalTime = this.intervalTime * 60
            // }else if(this.intervalTimeType === 'hour'){
            //     this.intervalTime = this.intervalTime * 3600
            // }
            // this.intervalTime = intervalTime
            this.myChart.showLoading()
            let that = this
            send.sendMsgGet(`http://127.0.0.1:8080/queryLogs?startTime=${that.startTime}&&endTime=${that.endTime}&&intervalTime=${that.intervalTime * 1000}&&environment=${that.environment}&&version=${that.version}`, ).then(res=>{
                if(res.data.code === 100){
                    console.log(res)
                    if(res.data.data.length === 0){
                        that.myChart.hideLoading()
                        that.logsInfo = false
                    }else{
                        that.logs = res.data.data
                        that.logsInfo = true
                        that.getChartData()
                    }
                    
                }
            }).catch(err=>{
                console.log(err)
                if(err.response){
                    if(err.response.data.code === 250){
                        that.$router.push({path:'../login'})
                    }
                }
            })
        },
        getChartData(){
            let that = this
            for(let i=0;i<that.list.length;i++) that.list[i].data=[]
            that.xAxisData = []
            this.logs.forEach(ele=>{
                let time = new Date(ele.content.time)
                time = `${time.getFullYear()}/${time.getMonth()+1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}` 
                that.xAxisData.push(time)
                that.list[0].data.push(ele.content.whiteScreenTime)
                that.list[1].data.push(ele.content.firstScreenTime)
                that.list[2].data.push(ele.content.DNSTime)
                that.list[3].data.push(ele.content.pageLoadingCompleted)
                that.list[4].data.push(ele.content.TCPTime)
                that.list[5].data.push(ele.content.onLoadTime)
                that.list[6].data.push(ele.content.readFirstBitTime)
                that.list[7].data.push(ele.content.analysisDOMTime)
                that.list[8].data.push(ele.content.contentLoadingCompleted)
                that.list[9].data.push(ele.content.redirectTime)
                that.list[10].data.push(ele.content.unloadTime)
                that.list[11].data.push(ele.content.userOperationalTime)
            })
               
            // debugger
            this.showCharts()
            console.log(that.list,that.xAxisData)
        },
        showCharts(){
            let xAxisData = this.xAxisData
            let list = []
            
            let titles = []
            // list = this.list[this.showIndex - 1]
            this.myChart.hideLoading()
            // debugger
            
            if(this.showIndex === 0) {
                list = this.list
                titles = this.titles
            }else if(this.showIndex !== 0){
                list = this.list[this.showIndex - 1]
                titles.push(this.titles[this.showIndex])
            }
            let options = {
                tooltip: {trigger: 'axis'},
                legend: {
                    data: titles,
                },
                grid: {
                    top:'12%',
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
                    type: 'slider',
                    show: true,
                    start: 0,
                    end: 100,
                    handleSize: 8
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
            
            this.myChart.setOption(options, true)
            // this.myChart.setOption(option)
            console.log(options, list)
        },
        changeTime(index){
            if(!this.logsInfo) return
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
            this.$refs.endTime.min = this.$refs.startTime.value
            console.log(this.intervalTimeType)
        },
        setCondition(){
            this.endTime = new Date(`${this.$refs.endTime.value} 23:59:59`).getTime()
            console.log(this.$refs.intervalTime.value)
            if(this.$refs.intervalTime.value){
                this.intervalTime = this.$refs.intervalTime.value
                if(this.intervalTimeType === 'second') {
                    this.intervalTime = this.$refs.intervalTime.value
                }else if(this.intervalTimeType === 'minute'){
                    this.intervalTime = this.$refs.intervalTime.value * 60
                }else if(this.intervalTimeType === 'hour'){
                    this.intervalTime = this.$refs.intervalTime.value * 3600
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
        z-index: 1;
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