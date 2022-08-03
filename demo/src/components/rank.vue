<template>
  <div>
    <div class="com-container">
      <div class="com-chatrs" ref="rank_ref"></div>
    </div>
  </div>
</template>

<script>
import rankApi from "@/api/user";
export default {
  name: "",
  components: {},
  data() {
    return {
      chartInstance: null,
      allData: null,
      startValue: 0,
      endValue: 9,
      timerId: null,
    };
  },
  created() {},
  mounted() {
    this.initChart();
    this.getDate();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  deactivated() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timerId);
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, "chalk");
      const initOption = {
        title: {
          text: "▎ 销量排行",
          left: 20,
          top: 20,
        },
        grid: {
          left: "5%",
          right: "5%",
          top: "40%",
          bottom: "5%",
          containLabel: true,
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval();
      });
    },
    async getDate() {
      // 获取服务器的数据，对this.allData进行赋值，调用updateChart()方法更新图表
      const res = await rankApi.getRank();
      console.log(res);
      this.allData = res;
      this.allData.sort((a, b) => {
        return b.value - a.value;
      });
      this.updataChart();
      this.startInterval();
    },
    updataChart() {
      const colorArr = [
        ["#0ba82c", "#4ff778"],
        ["#2e72bf", "#23e5e5"],
        ["#5052ee", "#ab6ee5"],
      ];
      // 处理图标需要的数据
      // 所有省份形成的数组
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      // 所有省份形成的数据金额
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                let targetColorArr = null;
                if (arg.value > 300) {
                  targetColorArr = colorArr[0];
                } else if (arg.value > 200) {
                  targetColorArr = colorArr[1];
                } else {
                  targetColorArr = colorArr[2];
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColorArr[0],
                  },
                  {
                    offset: 1,
                    color: targetColorArr[1],
                  },
                ]);
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    // 屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        series:[
          {
            barWidth:titleFontSize,
            itemStyle:{
              barBorderRadius:[titleFontSize/2,titleFontSize/2,0,0]
            }
          }
        ]
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updataChart();
      }, 2000);
    },
  },
};
</script>
<style scoped lang="scss">
.com-chatrs {
  height: 43.75rem;
}
</style>
