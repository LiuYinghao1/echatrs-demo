<template>
  <div class="com-container" @dblclick="revcrtMap">
    <div class="com-chatrs" ref="map_ref"></div>
  </div>
</template>

<script>
import axios from "axios";
import mapApi from "@/api/user";
import { getProvinceMapInfo } from "@/utils/map_utils";
export default {
  name: "",
  components: {},
  data() {
    return {
      chartInstance: null,
      allData: null,
      mapData: {},
    };
  },
  created() {},
  mounted() {
    this.initChart(), this.getData();
    window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, "chalk");
      //获取地图矢量数据
      const res = await axios.get(
        "http://localhost:9999/static/map/china.json"
      );
      this.$echarts.registerMap("china", res.data);
      const initOption = {
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },
        title: {
          text: "|  商家分别",
          left: 20,
          top: 20,
        },
        legend: {
          left: "5%",
          bottom: "7%",
          orient: "vertical",
        },
      };
      this.chartInstance.setOption(initOption);
      // arg 所点击的省份的中文名称
      this.chartInstance.on("click", async (arg) => {
        // console.log(arg);
        const provinceInfo = getProvinceMapInfo(arg.name);
        console.log(provinceInfo);
        // if判单是否有缓存数据
        if (!this.mapData[provinceInfo.key]) {
          const ret = await axios.get(
            "http://localhost:9999" + provinceInfo.path
          );
          // 缓存省份地图数据
          this.mapData[provinceInfo.key] = ret.data;
          // console.log(ret);
          this.$echarts.registerMap(provinceInfo.key, ret.data);
        }

        const changeOption = {
          geo: {
            map: provinceInfo.key,
          },
        };
        this.chartInstance.setOption(changeOption);
      });
    },
    async getData() {
      const res = await mapApi.getMap();
      // console.log(res);
      this.allData = res;
      console.log(this.allData);
      this.updataChart();
    },
    updataChart() {
      //图例的数据
      const legendArr = this.allData.map((item) => {
        return item.name;
      });

      const seriesArr = this.allData.map((item) => {
        return {
          type: "effectScatter",
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      const titleFontSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize,
          },
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2,
          },
          itemGap: titleFontSize / 2,
        },
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    revcrtMap() {
      const revcrtOption = {
        geo: {
          map: "china",
        },
      };
      this.chartInstance.setOption(revcrtOption);
    },
  },
};
</script>
<style scoped lang="scss">
.com-chatrs {
  height: 43.75rem;
}
</style>
