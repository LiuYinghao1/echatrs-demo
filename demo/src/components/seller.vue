<template>
  <div class="com-container">
    <div class="com-charts" ref="seller_ref"></div>
  </div>
</template>

<script>
import sellerApi from "@/api/user";
export default {
  name: "",
  components: {},
  data() {
    return {
      chartInstance: null,
      allData: null,
      currentPage: 1,
      totalPage: 0,
      timerId: "",
    };
  },
  created() {},
  destroyed() {
    clearInterval(this.timerId);
    window.addEventListener("resize", this.screenAdapter);
  },
  mounted() {
    this.initChart(),
    this.getData(),
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  methods: {
    // 初始化chartInsrance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, "chalk");
      //对图表初始化配置的控制
      const initOption = {
        title: {
          text: "| 商家销售统计",
          left: 20,
          top: 20,
          textStyle: {
            color: "#fff",
            fontSize: "40",
          },
        },
        xAxis: {
          type: "value",
        },
        grid: {
          top: "20%",
          left: "5%",
          right: "5%",
          buttom: "5%",
          containLable: true,
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              width: 66,
              color: "#2e3342",
            },
          },
        },
        series: [
          {
            type: "bar",
            barWidth: "66",
            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "#fff",
                fontSize: 10,
              },
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052EE",
                },
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
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

    //  获取服务器数据
    async getData() {
      const res = await sellerApi.getSeller();
      console.log(res);
      this.allData = res;
      // 对数组进行排序
      this.allData.sort((a, b) => {
        return a.value - b.value; //从小到大排序
      });
      // 每5个元素显示一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
      this.updataChart();
      // 启动定时器
      this.startInterval();
    },

    // 更新图表
    updataChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end);
      const sellerNames = showData.map((item) => {
        return item.name;
      });
      const sellerValues = showData.map((item) => {
        return item.value;
      });

      const dataOption = {
        yAxis: {
          data: sellerNames,
        },
        series: [
          {
            data: sellerValues,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },

    // 倒计时
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updataChart();
      }, 3000);
    },

    //当浏览器大小发生变化的时候，调用方法，来完成屏幕适配
    screenAdapter() {
      const titleFontSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      // 和分辨率相关的配置大小
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      // 再次调用resize方法，来完成屏幕适配
      this.chartInstance.resize();
    },
  },
};
</script>
<style scoped lang="scss"></style>
