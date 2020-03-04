<template>
    <div class="box-card">
        <!--展示-->
        <el-row :gutter="80">
            <el-col :span="8">
                <div class="report report-user">
                    <img src="./../../../assets/report/user.png" alt="">
                    <h4>用户总数</h4>
                    <h5>{{userCount}}</h5>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="report report-article">
                    <img src="./../../../assets/report/article.png" alt="">
                    <h4>文章总数</h4>
                    <h5>{{articleCount}}</h5>
                </div>
            </el-col>
            <el-col :span="8">
                <div class="report report-comment">
                    <img src="./../../../assets/report/comment.png" alt="">
                    <h4>评论总数</h4>
                    <h5>{{commentCount}}</h5>
                </div>
            </el-col>
        </el-row>

        <!--新增文章时间戳-->
        <el-row style="margin-top: 20px" :gutter="80">
            <el-col :span="12"><el-timeline>

                <el-timeline-item :timestamp="item.time|formatTime()" placement="top" v-for="(item,index) in articleList.slice(0,3)" :key="index">
                    <el-card>
                        <h4 style="margin-bottom: 10px">{{item.title}}</h4>
                        <p>{{item.username}} 提交于 {{item.time|formatTime}}</p>
                    </el-card>
                </el-timeline-item>

            </el-timeline></el-col>
            <el-col :span="12"><div id="main" style="width: 100%;height:400px;"></div></el-col>
        </el-row>

    </div>
</template>
<script>
    import {BASE_URL} from "../../../global/util";


    import echarts from "echarts"
    export default {
        name: "Report",
        data(){
            return {
                articleList:[],
                userCount:0,
                articleCount:0,
                commentCount:0,
                tagNameList:[],
                tagValueList:[],
                tagObject:{}
            }
        },
        methods:{
            async getAllTags(){
               let {status,data:{tags}} = await this.$http.get('/api/tag/getAlltags')

                this.tagObject = new Map()
                let tempCount=0
                tags.forEach(item=>{
                    this.tagNameList.push(item.tagName)
                    this.tagValueList.push({name:item.tagName,value:item.articleIDs.length})

                    tempCount++
                    if (tempCount<4) this.tagObject.set(item.tagName,true)
                    else this.tagObject.set(item.tagName,false)
                })

                return {
                    legendData: this.tagNameList,
                    seriesData: this.tagValueList,
                    selected: this.tagObject
                }

            },
            async setEchart(){
                let data = await this.getAllTags()

                let myChart = echarts.init(document.getElementById('main'));





                let option = {
                    title: {
                        text: '文章各类数量',
                        subtext: '统计',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        type: 'scroll',
                        orient: 'vertical',
                        right: 10,
                        top: 20,
                        bottom: 20,
                        data: data.legendData,

                        selected: data.selected
                    },
                    series: [
                        {
                            name: '文章分类',
                            type: 'pie',
                            radius: '55%',
                            center: ['40%', '50%'],
                            data: data.seriesData,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };


                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option);
            },
            async getAllArticle(){
                let {status,data:{code,msg,articleList,count}} = await this.$http.get(`/api/article/getArticle`)
                if (status===200){
                    if (code===0){
                        this.articleList = articleList;
                        this.articleCount = count
                    }else {
                        alert(msg)
                    }
                }else {
                    alert("获取数据失败")
                }
            },
            async getUserCount(){
                let {status,data:{count}} = await this.$http.get('/api/user/getCount')
                this.userCount = count
            },
            async getCommentCount(){
                let {status,data:{count}} = await this.$http.get('/api/comment/getCount')
                this.commentCount = count
            }
        },
        mounted(){
            this.setEchart()
            this.getAllArticle()
            this.getUserCount()
            this.getCommentCount()
            this.getAllTags()
        }
    }
</script>

<style scoped lang="scss">
    .report{
        padding: 20px;
        box-sizing: border-box;
        img{
            width: 70px;
            height: 70px;
        }

        align-items: center;
        font-size: 17px;
        color: white;
        font-weight: bolder;
        text-align: center;
        border-radius: 10px;
        h4,h5{
            margin-top: 10px;
        }
    }

    .report-user{
        background-color: #bd2130;
    }
    .report-article{
        background-color: #d39e00;
    }
    .report-comment{
        background-color: #17a1b7;
    }
#main{
    background-color:rgba(244,251,251,0.47);
}
</style>
