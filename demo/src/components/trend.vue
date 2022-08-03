<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span >{{ showTitle}}</span>
      <span class="iconfont title-icon" :style="comStyle" @click="showChoose=!showChoose">&#xe6eb</span>
      <div class="select-con" v-show="showChoose">
        <div class="select-item" v-for="item in selectTypes" :key="item.key" @click="handleSelect(item.key)">
          {{item.text}}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
import trendApi from "@/api/user";
export default {
  name: "",
  computed:{
    selectTypes(){
      if(!this.allData){
        return [];
      }else{
        return this.allData.type
      }
    },
    showTitle(){
      if(!this.allData){
        return '';
      }else{
        return this.allData[this.choiceType].title
      }
    },
  //设置给标题的样式
  comStyle(){
    return{
      fontSize:this.titleFontSize+'px'
    }
  }
  },
  components: {},
  data() {
    return {
      chartInstane: null,
      allData: [],
      showChoose: false,
      choiceType: "map",
      titleFontSize:0
    };
  },
  created() {},
  mounted() {
    this.initChart(),
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed(){
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chartInstane = this.$echarts.init(this.$refs.trend_ref,'chalk');
      const initOption = {
        xAxis:{
          type:'category',
          boundaryGap:false,
        },
        grid:{
          left:'5%',
          top:'25%',
          right:'5%',
          bottom:'3%',
          containLabel:true,
        },
        tooltip:{
          trigger:'axis'
        },
        legend:{
          left:20,
          top:"15%",
          icon:'circle',
          textStyle:{
            fontSize:20,

          },
        },

        yAxis:{
          type:'value',
        },
      };
      this.chartInstane.setOption(initOption);
    },
    async getData() {
      const res = await trendApi.getTrend();
      // console.log(res);
      this.allData=res

      this.updataChart();
    },
    updataChart() {
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];

      // 处理数据
      // 类目轴的数据
      const timeArr=this.allData.common.month
      // y 轴的数据
      const valueArr=this.allData[this.choiceType].data
      const seriesArr=valueArr.map((item,index)=>{
        return {
          name:item.name,
          type:'line',
          data:item.data,
          stack:this.choiceType,
          areaStyle:{
            color:new this.$echarts.graphic.LinearGradient(0,0,0,1,[{
              offset:0,
              color:colorArr1[index]
            },{
              offset:1,
              color:colorArr2[index]
            }])
          }
        }
      })
      // 图例的数据
      const legendArr=valueArr.map(iten=>{
        return iten.name
      })
      const dataOption = {
        xAxis:{
          data:timeArr
        },
        legend:{
          data:legendArr
        },
        series:seriesArr,
      };
      this.chartInstane.setOption(dataOption);
    },
    screenAdapter(){
      this.titleFontSize=this.$refs.trend_ref.offsetWidth /100 *3.6
      const adapterOption={
        legend:{
          itemWidth:this.titleFontSize,
          itemHeight:this.titleFontSize,
          itemGap:this.titleFontSize,
          textStyle:{
            fontSize:this.titleFontSize/2
          }
        },
      }
      this.chartInstane.setOption(adapterOption);
      this.chartInstane.resize()
    },
    handleSelect(currentType){
      this.choiceType=currentType;
      this.updataChart();
      this.showChoose=false;
    }
  },
};
</script>
<style scoped lang="scss">
.com-chart{
  height: 43.75rem;
}
.title{
  position: absolute;
  z-index: 1;
  left: 20px;
  top: 20px;
  color: #fff;
}
.title-icon{
  margin-left: 10px;
  font-size: 1.25rem; 
  cursor: pointer;
}
.select-item{
  cursor: pointer;
  // font-size: .875rem;
  // padding-top: 3px;
}
// .select-con{
//   margin-top: 5px;
//   border: 1px solid #fff;
//   border-radius: 10px;
//   padding: 5px 5px;
// }
</style>
