<template>
  <div id="home">

    <div v-if="error">

      Fail to connect API, please report ISSUE to:
      <li>https://github.com/isjeffcom/coronvirusFigureUK</li>
      <li>https://spectrum.chat/covid-19-uk-update?tab=posts</li>
    </div>

    <overall
      :allData="allData"
      :renderData="renderData"
      :historyData="historyData"
      :DPosi="DPosi"
      v-if="loaded">
    </overall>

    <!-- HERD IMMUNITY -->
    <!--div id="herd" style="margin-top:40px;margin-bottom:40px;" v-if="loaded">
      <div class="title" style="background: #1D1F21; width: 100%; margin-bottom: 0px;">
        <div class="title-area inner" style="width: 92%; padding-top: 20px; padding-bottom:20px; margin-left:auto; margin-right: auto;">
          <span>{{getLang("Herd Immunity")}}</span><br>
          <div style="font-size: 12px; opacity: 0.5;">{{getLang("UK Population")}}: 66.44 {{getLang("Million")}} | {{getLang("Immunity Point")}}: 60%</div>
        </div>
      </div>

      <ptg :mData="[allData[0].confirmed, 66440000]" style="margin-top:20px;margin-bottom:20px;"></ptg>

    </div-->

    <cdata
        :allCharts="allCharts"
        :confirmCharts="confirmCharts"
        :deathCharts="deathCharts"
        :testedCharts="testedCharts"
        v-if="chartLoaded">
    </cdata>


    <carea
      :renderArea="renderArea"
      :mapData="mapData"
      :geoData="geoAll"
      :unknown="unknown"
      v-if="areaLoaded">
    </carea>

    <more></more>

    <keydata v-if="keyDataLoaded" :allData="allKeyData"></keydata>

    <timeheat v-if="tlLoaded"></timeheat>

    <groupup></groupup>
    <sources></sources>

    <!--tweet></tweet-->

    <!-- AUTHOR INFO -->
    <div class="author">
      <div class="author-inner">
        <h3>{{getLang("Author")}}: </h3><br>
        <a href="https://github.com/lamharrison" target="_blank">@Zhishu Lin</a>
      </div>
    </div>


    <!-- DONATION FOOTER -->
    <div id="donation" v-if="areaLoaded">
      <div id="d-inner">
        <div id="d-cont">
          <div id="d-title">{{getLang("Support Us")}}</div>
          <div id="d-sub">{{getLang("We promise free access, however, maintaining this server has costs and it's not cheap.")}}</div>
        </div>

        <div id="d-btn">
          <button v-on:click="openDonate(true)">{{getLang("SUPPORT")}}</button>
        </div>
      </div>
    </div>


    <!-- DONATION OVERLAP -->
    <!-- donation overlap from /src/components/widgets/donate -->
    <donate v-if="donate"></donate>

  </div>
</template>

<script>
// Utils
import { genGet } from '../../request'
import { indexOfObjArr, deepCopy } from '../../utils'

// Components
import overall from '../../components/overall'
import world from '../../components/world'
import carea from '../../components/carea'
import cdata from '../../components/cdata'
import more from '../../components/more'
import keydata from '../../components/keydata'
import sources from '../../components/sources'
import groupup from '../../components/groupup'
import timeheat from '../../components/timeheat'
import donate from '../../components/widgets/donate'
//import tweet from '../../components/tweet'

// Event Bus
import { EventBus } from '../../bus'

// Custom
import { putCN } from '../../translate'

// Charts calculation functions
import { confirmCal } from '../../calculate/confirmed'
import { deathCal } from '../../calculate/death'
import { testCal } from '../../calculate/tested'


export default {
  name: 'home',
  components:{
    overall,
    cdata,
    donate,
    carea,
    more,
    keydata,
    groupup,
    sources,
    timeheat
    //tweet
  },
  data(){
    return{
      // If couldn't get data from API, display error info
      error: false,

      // Language
      lang: "",

      // Loaded status for different section, render only if data ready
      loaded: false,
      chartLoaded: false,
      areaLoaded: false,
      worldLoaded: false,
      keyDataLoaded: false,
      tlLoaded: false,

      // List search input var
      listSearch: "",

      // API URLs
      api: "/",
      api_history: "/historyfigures",
      api_locations: "/locations",
      api_eu: "https://global.covid19uk.live/majoreu",
      api_global_status: "https://global.covid19uk.live/status",
      api_prediction: "./uk.json",

      // Data storage variable
      allData: [],
      renderData: {},
      renderArea: {},
      mapData: [],
      historyData: [],
      allKeyData: [],
      geoAll:[],
      DPosi: 0,

      // Unknow location cases count var
      unknown: 0,


      // Charts render options for APEXCHART package
      chartOptions: {
        chart: {
          foreColor: '#8D9EAA',
          toolbar:{
            show: false,
          },
          zoom:{
            enabled: false
          },
          animations: {
            enabled: false
          }
        },
        stroke: {
          curve: "straight",
          width: 2
        },
        tooltip:{
          y:{}
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100]
            },
        },
        dataLabels:{
          enabled: false,
           style: {
                fontSize: '8px',
                borderWidth: 0,
                padding: 2,
                fontWeight: "normal"
            },
        },
        grid: {
          borderColor: 'rgba(255,255,255,0.08)',
        },
        colors:["#F62E3A", "#949BB5"],
        xaxis: {
          categories: [0, 0, 0, 0, 0, 0, 0, 0],
          labels:{
            hideOverlappingLabels: true,
            style: {
              fontSize:  '8px',
            },
          },
        },
        yaxis:{
          abels:{
            style: {
              fontSize:  '8px',
            },
          },
        }
      },

      // Save current chart view
      currentChartView: 0,

      // Charts data storages
      confirmCharts:[],
      deathCharts:[],
      testedCharts:[],
      euCharts: [],
      preCharts: [],

      // Charts switcher
      allCharts:["Case", "Death", "Test"],

      // Donation popup open or close
      donate: false
    }
  },

  mounted(){

    // On start get data
    this.getData(this.api)
    this.getKeyData(this.api_global_status)
    this.lang = window.navigator.language

  },

  created(){

    EventBus.$on("donate-close", ()=>{
      this.donate = false
    })

  },

  methods:{

    // Get Figure Data from API
    // 从API获取基本数字数据
    getData(api){

      genGet(api, {}, false, (res)=>{

        if(res.status){
          this.allData = res.data.data


          // Process Area Data
          if(this.allData[0].area && this.allData[0].area != ""){
            this.renderArea = JSON.parse(this.allData[0].area)
          }

          // Display
          this.loaded = true

          setTimeout(()=>{
            this.tlLoaded = true
          }, 3000)

          this.getHistory(this.api_history)

        } else {
          this.error = true
        }


      })
    },

    // Get history data from api and generate charts
    // 从API获取历史数据，生成图表
    getHistory(api){

      genGet(api, {}, false, async (res)=>{

        if(res.status){

          // History data is
          this.historyData = res.data.data

          let co = await confirmCal(this.historyData, this.allData[0])
          let de = await deathCal(this.historyData, this.allData[0])
          let te = await testCal(this.historyData, this.allData[0])

          this.$nextTick(()=>{
            this.chartOptions.xaxis.categories = co.cates

            // Compute chart data
            this.confirmCharts.push(this.constChartData("C&D", "area", false, [
              "#F62E3A",
              "#949BB5",
            ], this.constChartSeries([
              ["Cumulative cases", co.co],
              ["Death", co.death]
            ])))

            this.confirmCharts.push(this.constChartData("Daily Increase", "bar", false, [
              "#F62E3A"
            ], this.constChartSeries([
              ["Cases", co.coDaily]
            ])))

            this.confirmCharts.push(this.constChartData("Growth Rate", "area", true, [
              "#F62E3A"
            ], this.constChartSeries([
              ["Rate", co.coInc]
            ])))

            this.deathCharts.push(this.constChartData("Death Increase", "bar", false, [
              "#FFC634"
            ], this.constChartSeries([
              ["Increase", de.inc],
            ])))

            this.deathCharts.push(this.constChartData("Mortality Rate", "area", true, [
              "#FFC634"
            ], this.constChartSeries([
              ["Death Rate", de.rate],
            ])))

            this.testedCharts.push(this.constChartData("Tested Number", "bar", false, [
              "#46DEFF",
              "#31DA93"
            ], this.constChartSeries([
              ["All", te.all],
              ["Increase", te.growth],
            ])))

            this.testedCharts.push(this.constChartData("Positive Rate", "area", true, [
              "#46DEFF"
            ], this.constChartSeries([
              ["Positive Rate", te.pRate],
            ])))


            // Save for calculate CO./TE.
            this.dailyConfirmed = co.coDaily

            // Call here because it relay on get history data
            if(te.pRate[te.pRate.length-1] == 0){
              this.DPosi = Number.parseFloat(te.pRate[te.pRate.length-2])
            }else{
              this.DPosi = Number.parseFloat(te.pRate[te.pRate.length-1])
            }

            this.chartLoaded = true
          })

        }

        // Start Get Location
        this.getLocations(this.api_locations)

      })
    },


    // Get all location center point from api
    // 获取所有的地理位置中心点数据
    getLocations(api){
      var that = this
      genGet(api, {}, false, (res)=>{
        let d = res.data.data
        this.geoAll = res.data.data

        let markers = []

        // Match area data and location data
        // 整合地理位置中心点和区域确诊数据
        this.renderArea.forEach((el, index) => {

          // Match location from location cases list
          let idx = indexOfObjArr(el.location, d, 'name')

          // If matched
          if(el.number != 0 && idx != -1){
            d[idx].confirmed = parseInt(el.number)
            markers.push(d[idx])
          }

        })

        this.mapData = markers

        // Process Data For Unknown Location
        this.unknown = this.calUnknown(this.renderArea, this.allData[0].confirmed)
        this.$nextTick(()=>{
          that.areaLoaded = true
        })

      })

      this.getEU()
    },

    // Get EU data and compare
    // 获取欧洲国家数据并对比
    getEU(){
      genGet(this.api_eu, [], true, (res)=>{
        //for(res.data.data)

        const d = res.data.data

        let confirmed = []
        let death = []
        let len = 0

        // UK
        let ukCoSe = ["UK", []]
        let ukDeSe = ["UK", []]

        for(let i=0;i<this.historyData.length;i++){
          ukCoSe[1].push(this.historyData[i].confirmed)

          // From the day has first death
          if(this.historyData[i].death > 0) ukDeSe[1].push(this.historyData[i].death)
        }

        confirmed.push(ukCoSe)
        death.push(ukDeSe)


        // 4 Country
        for (const prop in d){

          let tmp = [prop, []]
          let tmp_d = [prop, []]

          if(d[prop].length > len){
            len = d[prop].length
          }


          for(let i=0;i<d[prop].length;i++){
            if(d[prop][i].country_region == d[prop][i].province_state || d[prop][i].province_state == ""){

              tmp[1].push(d[prop][i].confirmed)

              // From the day has first death
              if(d[prop][i].death > 0) tmp_d[1].push(d[prop][i].death)

            }
          }

          confirmed.push(tmp)
          death.push(tmp_d)
        }

        this.euCharts.push(
            this.constChartData("Confirmed", "line", false, [
            "#F62E3A", // UK
            "#00FFA3", // Italy
            "#FF7A00", // Germany
            "#0075FF", // France
            "#FFF500", // Spain
          ], this.constChartSeries(confirmed), this.getLabels(len))
        )

        this.euCharts.push(
            this.constChartData("Death", "line", false, [
            "#F62E3A", // UK
            "#00FFA3", // Italy
            "#FF7A00", // Germany
            "#0075FF", // France
            "#FFF500", // Spain
          ], this.constChartSeries(death), this.getLabels(len))
        )

        genGet(this.api_prediction, [], true, (res)=>{
            const d = res.data

            let c = []
            for (const prop in d){
              c.push(d[prop][0].toFixed(0))
            }

            let cr = ukCoSe[1]
            cr.push(this.allData[0].confirmed)

            this.preCharts.push(
              this.constChartData("UK Prediction", "line", false, [
                "#F62E3A", // Current
                "#4696CB", // Forcast
              ], this.constChartSeries([
                ["Current", cr],
                ["Forecast",c]
              ]), this.getLabels(c.length))
            )

            this.worldLoaded = true
        })



      })
    },

    // Generate labels by length
    // 辅助方法：使用长度生成labels，用于在不完整数据集中获取labels
    getLabels(len){
      let labels = []

      for(let i=0;i<len;i++){
        labels.push("D" + (i+1) )
      }

      return labels
    },

    getKeyData(api){

      genGet(api, [], true, (res) => {

        this.allKeyData = [

          {
            name: "Global Cases",
            num: res.data.data.confirmed,
            color: "rgb(255, 81, 81)"
          },
          {
            name: "Global Death",
            num: res.data.data.death,
            color: "rgb(255, 206, 31)"
          },
          {
            name: "Cases to go until herd immunity(UK)",
            num: Math.floor((66440000 * 0.6) - this.allData[0].confirmed),
            color: "rgb(86, 255, 184)"
          }
        ]

        this.keyDataLoaded = true
      })


    },

    // Calculate unknow location cases
    // 辅助方法：计算未知地理位置
    calUnknown(areaData, confirmed){

      let all = 0
      if(areaData){
        areaData.forEach(el => {
          if(!isNaN(el.number)){
            all = all + parseInt(el.number)
          }
        })
      }


      return confirmed - all


    },

    // Construct chart data
    // 辅助方法：组合图标整体数据
    constChartData(name, type, ptg, colors, data, categories){


      let options = deepCopy(this.chartOptions)
      if(colors){
        options.colors = colors
      }

      if(categories){
        options.xaxis.categories = categories
      }

      if(type == "line" || type == "bar"){
        options.fill = {}
      }

      if(type == "bar"){
        options.chart.stacked = true
      }

      if(name == "UK Prediction"){
        options.stroke = {
          width: 3,
          dashArray: [0, 2]
        }
      }

      if(ptg){

        options.dataLabels.formatter = (val)=>{
          return val == 0 ? "" : val + "%"
        }

        options['tooltip']['y'].formatter = (val)=>{
          return val == 0 ? "" : val + "%"
        }
      }


      return {
        name: name,
        type: type,
        options: options,
        data: data
      }
    },


    // Construct Chart Data Series
    // 辅助方法：组合图标纯数组数据
    constChartSeries(arr){

      let res = []
      for(let i=0;i<arr.length;i++){
        res.push({
          name: arr[i][0],
          data: arr[i][1]
        })
      }

      return res
    },

    // Chinese translate, provide by translate.js
    // 翻译，由translate.js提供字典
    getLang(str){
      if(this.lang != "zh-CN"){
        return str
      } else {
        return putCN(str)
      }
    },

    // Open donation overlay
    // 打开捐赠浮层
    openDonate(bol){
      this.donate = bol
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#home{
  color: #CED3D6;
}

#d-title{
  font-size: 24px;
  font-weight: bold;
}

#donation{
  width: 100%;
  height: 120px;
  margin-top: 40px;
  padding-bottom: 10px;
  color: #111;
}

#d-inner{
  width: 100%;
  height: 100%;
  background: #FFC634;
  border-bottom: 8px solid #152DFF;
  margin-left: auto;
  margin-right:auto;
  display: flex;
}

#d-cont{
  width: 80%;
}

#d-title{
  font-size: 22px;
  font-weight: bold;
  margin-top: 24px;
  margin-left: 24px;
}

#d-sub{
  font-size: 14px;
  font-weight: bold;
  margin-top: 4px;
  margin-left: 24px;
  margin-right: 24px;
}

#d-btn{
  width: 14%;
  margin-top: 28px;
}

#d-btn button{
  position: relative;
  background: #FFC634;
  border: 2px solid #000;
  border-radius: 100px;
  cursor:pointer;
  padding: 12px;
  margin-top: 10px;
  margin-left: 0px;
  height: 40px;
  color: #000;
  font-weight: bold;
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

#d-btn button:hover{
  background: #000;
  color: #fff;
}

.author{
  width: 92%;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  color: #CED3D6;
  font-size: 14px;
  opacity: 0.5;
}

.author a{
  color: rgb(255, 255, 255);
  text-decoration: underline;
  font-size: 16px;
}

.author li{
  font-size: 12px;
}

.coworker li a{
  font-size: 14px;
  line-height: 24px;
}


@media only screen and (max-width: 800px) {

  .overall-source-inner{
    right: 10px;
  }

  .overall-single-title{
    font-size: 10px;
  }

  .overall-single-value{
    font-size: 18px;
  }

  #donation{
    height: 240px;
  }

  #d-cont{
    width: 100%;
    padding-top: 2px;
  }

  #d-btn{
    width: auto;
    margin-left: 20px;
  }

  #d-inner{
    display: block;
    padding-bottom:0px;
  }

}

</style>
