<template>
  <div>
    <div class="com-container">
      <div class="com-chatrs" ref="hot_ref"></div>
      <span class="iconfont left" @click="toLeft" :style="comStyle"
        >&#xe6ef;</span
      >
      <span class="iconfont right" @click="toRight" :style="comStyle"
        >&#xe6ed;</span
      >
      <span class="cat-name" :style="comStyle">{{ catName }}</span>
    </div>
  </div>
</template>

<script>
import hotApi from "@/api/user";
export default {
  name: "",
  components: {},

  data() {
    return {
      chartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0,
    };
  },
    computed: {
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    comStyle() {
      return {
        fontSize: this.titleFontSize + "px",
      };
    },
  },
  created() {},
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  deactivated() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, "chalk");
      const initOption = {
        title: {
          text: "▎ 热销商品占比",
          top: 20,
          left: 20,
        },
        legend: {
          icon: "circle",
          top: "20%",
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const third = arg.data.children;
            let total = 0;
            third.forEach((item) => {
              total += item.value;
            });
            let retStr = "";
            third.forEach((item) => {
              retStr += `
              ${item.name}: ${parseInt((item.value / total) * 100) + "%"}
              </br>
              
              `;
            });
            return retStr;
          },
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },
    async getData() {
      const res = await hotApi.getHot();
      this.allData = res;
      console.log(this.allData);
      this.updataChart();
    },
    updataChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => item.name
      );
      const seriesDate = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );
      const dataOption = {
        series: [
          {
            data: seriesDate,
          },
        ],
        legend: {
          data: legendData,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFontSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize,
          },
        },
        legend: {
          itemWidth: this.titleFontSize / 2,
          itemHeight: this.titleFontSize / 2,
          itemGap: this.titleFontSize / 2,
          textStyle: {
            fontSize: this.titleFontSize / 2,
          },
        },
        series: [
          {
            center: ["50%", "60%"],
            radius: this.titleFontSize * 4.5,
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.updataChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updataChart();
    },
  },
};
</script>
<style scoped lang="scss">
.com-chatrs {
  height: 43.75rem;
}
.left {
  position: absolute;
  left: 10%;
  top: 60%;
  transform: translateY(-50%);
  color: #fff;
  // font-size: 4rem;
  cursor: pointer;
}
.right {
  position: absolute;
  right: 10%;
  top: 60%;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
  // font-size: 4rem;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 10%;
  color: #fff;
  // font-size: 2rem;
}
</style>
