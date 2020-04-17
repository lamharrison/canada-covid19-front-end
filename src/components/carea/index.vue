<template>
    <div id="carea" :style="'padding-bottom:' + (timeline ? '220px' : '100px')">

        <!-- REGIONAL MAP -->
        <div class="title" style="background: #1D1F21; width: 100%; margin-bottom: 0px;">
            <div class="title-area inner" style="width: 92%; padding-top: 20px; padding-bottom:20px; margin-left:auto; margin-right: auto;">
                <span>{{getLang("Regions")}}</span><br>
                <div style="font-size: 16px;"><b style="color: #7DA5B5;">{{unknown}}</b> {{getLang("Unknown Locations")}}</div>
                <div style="font-size: 16px;"  v-if="nearbyShow"><b style="color: #F62E3A;">{{nearby.num}}</b> {{getLang("Cases Near")}} <b style="color: #FFC634;">{{nearby.name}}</b></div>
                <div style="font-size: 12px; opacity: 0.5;">* {{getLang("At least 1 day in arrears")}}</div>
            </div>

            <div class="title-right" v-on:click="getLoc()" :style="getLocAva ? 'opacity: 1' : 'opacity: 0.2'">
                <img src="https://i.ibb.co/09dv1dN/location.png" alt="location" width="30px" style="cursor: pointer;">
            </div>
        </div>

        <!-- switch between map or list -->
        <div class="tab-switcher">
            <div 
                class="ds-single" 
                v-for="(item, index) in areaViews" 
                :key="index" 
                :style="'width:calc(100%/' + areaViews.length + ');'" 
                v-on:click="switchAreaView(item)">

                <div class="ds-text">
                    <span>{{getLang(item)}}</span>
                </div>

                <div class="ds-ids" v-if="item == currentAreaView"></div>
                
            </div>
        </div>

        <!-- IF MAP -->
        <!-- use ccmap from /src/components/widgets/ccmap -->
            <div id="area-map" v-if="currentAreaView == 'Map'" :style="'opacity:' + (mapLoaded ? 1 : 0.2)">
                <osmmap :mapData="toMapData" :tlMode="tlMode"></osmmap>

                <div class="notice" style="font-size: 10px; width: 95%; margin-top: 6px; margin-bottom:20px; margin-left: auto;margin-right:auto; opacity: 0.7;text-align: center;">
                    Map tiles by <a href="http://stamen.com" target="_blank">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0" target="_blank">CC BY 3.0</a>
                </div>
                
                <button v-on:click="openTL" v-if="!timeline">{{ getLang("Timeline") }}</button>

                <div id="area-map-tl" v-if="timeline">
                    <VueSlideBar
                        v-model="slider.value"
                        :data="slider.data"
                        :range="slider.range"
                        :labelStyles=" sw < 700 ? { opacity: '0' } : {opacity: '1'}"
                        :tooltipStyles="{ backgroundColor: '#FFD643', borderColor: '#FFD643', borderRadius: '2px', color: '#000000', fontWeight: 'bold' }"
                        :processStyle="{ backgroundColor: '#FFD643' }"
                        :speed="0.3"
                        @callbackRange="sliderChange">

                    </VueSlideBar>

                    <span>{{ getLang("All") }}: {{ sliderConf }}</span>
                    <br>
                    <span v-if="tlTracking != ''">{{ tlTracking }}: {{ getTLAreaData(tlTracking) }}</span>

                    <button v-on:click="closeTL">{{ getLang("BACK") }}</button>
                </div>

                
                
            </div>

        <!-- IF LIST -->
            <div v-if="currentAreaView == 'List'" style="margin-top:20px;">

            <div class="area-list-search">
                <input type="text" placeholder="Search by place" v-model="listSearch">
            </div>
            

            <table>
                <tr>
                <th>{{getLang("Location")}}</th>
                <th>{{getLang("Cases")}}</th>

                <tr v-for="item in listFiltered" :key="item.location">
                    <td>{{item.location}}</td>
                    <td>{{item.number}}</td>
                </tr>
            </table>
            </div>

        <!-- IF LIST -->
            <div v-if="currentAreaView == 'Postcode'" style="margin-top:20px;">

            <div class="area-po-search">
                <input type="text" :placeholder="getLang('Your Postcode')" v-model="poSearch" style="width: 70%;"><br>
                <input type="submit" style="margin-left: 5%;width: 25%;" v-on:click="searchPO" />
            </div>

            <div class="area-po-res">
                <div class="area-po-res-cont">
                    <b style="color: #F62E3A;">{{nearby.num}}</b> {{getLang("Cases Near")}} <b style="color: #FFC634;">{{nearby.name}}</b>
                </div>
            </div>
            

            </div>
    </div>
</template>

<script>
import { putCN } from '../../translate'
import osmmap from '../widgets/map'
import { EventBus } from '../../bus'
import { genGet } from '../../request'
import { removeFBSpace } from '../../utils'

import VueSlideBar from 'vue-slide-bar'
import { getDateFromTs, indexOfObjArr, stripSlashes } from '../../utils'

export default {
    name: "carea",
    components:{
        osmmap,
        VueSlideBar
    },
    props:{
        renderArea:{
            type: Array,
            default(){
                return []
            }
        },
        mapData: {
            type: Array,
            default(){
                return []
            }
        },
        geoData:{
            type: Array,
            default(){
                return []
            }
        },
        unknown:{
            type: Number,
            default: 0
        }
    },
    data(){
        return{
            api_pos: "https://api.postcodes.io/postcodes/",
            api_his: "/history",
            nearby: {
                num: 0,
                name: ""
            },
            nearbyShow: false,
            getLocAva: true,
            timeline: false,
            mapLoaded: true,
            tlMode: false,
            tlTracking: "",
            listSearch: "",
            poSearch: "",
            areaViews: ["Map", "List", "Postcode"],
            currentAreaView: "Map",
            areaList: [],
            timelineData: [],
            rangeValue: {},
            sw: 0,
            slider: {
                value: "4.1",
                data: [],
                range: [
                    /*{
                        label: '15 mins'
                    },*/
                ]
            },
            sliderConf: 0,
        }
    },
    created(){
        this.toMapData = this.mapData
        this.sw = screen.width

        // Listen if got gps location than display confirmed figures, from child component map
        EventBus.$on("utla", (area)=>{
            this.displayMyArea(area)
        })

        // If select track a specific area, from child component map
        EventBus.$on("area-track", (area)=>{
            this.tlTracking = area
        })
    },
    computed:{
        // Filter table list
        // 列表搜索的filter，每次键入fire
        listFiltered: function(){
            return this.renderArea.filter(val => {
                return val.location.toLowerCase().includes(this.listSearch.toLowerCase())
            })
        }
    },
    methods:{
        searchPO(){
            genGet(this.api_pos + this.poSearch, [], true, (res)=>{
                if(res.status){
                    let result = res.data.result
                    let UTLA = ""

                    if(result.country == "Scotland"){
                    UTLA = result["nhs_ha"]
                    } 
                    
                    else if(result.country == "England"){
                    UTLA = result["nuts"]
                    }

                    else if(result.country == "Northern Ireland"){
                    UTLA = "Northern Ireland"
                    }

                    else if(result.country == "Wales"){
                    UTLA = "Wales"
                    }

                    this.displayMyArea(UTLA)

                } else {
                    alert("Is this a UK Postcode?")
                }
            })
        },

        displayMyArea(area){
            if(area){
                let n = this.getCasesByArea(area)
                this.nearby.num = n[0].number
                this.nearby.name = n[0].location
                this.nearbyShow = true
            }
        },



        openTL(){
            this.mapLoaded = false
            genGet(this.api_his, [], false, (res)=>{

                let tod = new Date()

                if(res.status){

                    let allTl = res.data.data
                    allTl = allTl.splice(37, allTl.length - 1)

                    for(let i=0;i<allTl.length;i++){

                        // Get each date format like 3.4
                        allTl[i].ds = getDateFromTs(allTl[i].date, "dateslim")

                        // Push each by date
                        this.timelineData.push(this.areaToTl(JSON.parse(stripSlashes(allTl[i].area)), allTl[i].ds))

                        // Push slider value
                        this.slider.data.push(allTl[i].ds)
                        this.slider.range.push({ label: allTl[i].ds, idx: i, confirmed: allTl[i].confirmed })
                    }

                    // Set default is the last one
                    this.slider.value = this.timelineData[this.timelineData.length - 1].date

                    this.toMapData = this.timelineData[this.timelineData.length - 1].series
                    this.sliderConf = this.slider.range[this.timelineData.length - 1].confirmed

                    // open timeline
                    this.$nextTick(()=>{
                        this.timeline = true
                        this.mapLoaded = true
                    })

                    this.tlMode = true

                } else {
                    alert("Unknow Error")
                    this.mapLoaded = true
                    this.closeTL()
                }


                // Request Time Out
                setTimeout(()=>{
                    this.mapLoaded = true
                }, 5000)
                
            })
        },

        closeTL(){
            this.timelineData = []
            this.slider.data = []
            this.slider.range = []
            this.toMapData = this.mapData
            this.timeline = false
            this.tlMode = false
            this.tlTracking = ""
        },


        // Area data convert to timeline data
        areaToTl(data, date){

            let res = {
                date: date,
                series: []
            }

            for(let i=0;i<data.length;i++){

                let el = data[i]


                // Some location has space in front and back
                el.location = removeFBSpace(el.location)

                let tmp = {}
                // Match location from geo list
                let geo = indexOfObjArr(el.location, this.geoData, 'name')

                // If matched
                if(geo != -1){
                    tmp.name = el.location
                    tmp.la = this.geoData[geo].la
                    tmp.lo = this.geoData[geo].lo
                    tmp.confirmed = el.number
                }

                res.series.push(tmp)

            }

            //console.log(res.series)


            return res
        },

        sliderChange(val){
            //console.log(val.label)
            this.toMapData = this.timelineData[val.idx].series
            this.sliderConf = this.slider.range[val.idx].confirmed
        },

        // 更换区域，地图<->列表
        switchAreaView(idx){
            this.currentAreaView = idx
        },

        getCasesByArea(area){
            return this.renderArea.filter(val => {
                return val.location.toLowerCase().includes(area.toLowerCase())
            })
        },

        getLoc(){
            if(this.getLocAva){
                EventBus.$emit("getLoc", true)
                this.getLocAva = false
                setTimeout(()=>{
                    this.getLocAva = true
                }, 8000)
            }
            
        },

        // Display tracked area data in timeline mode
        getTLAreaData(area){
            let res = "No Data"

            let md = this.toMapData

            for(let i=0;i<md.length;i++){
                if(area == md[i].name){
                    res =  md[i].confirmed
                }
            }

            return res
        },

        // 翻译，由translate.js提供字典
        getLang(str){
            if(window.navigator.language != "zh-CN"){
                return str
            } else {
                return putCN(str)
            }
        }
    }
}
</script>

<style scoped>

button{
    height: 58px;
    width:100%;
    margin-top:10px;
    padding-bottom: 16px;
    margin-left: 0px;
    margin-right: 0px;
}

.fade-enter-active {
  transition: opacity 1s;
}

.fade-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #2D3133;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #2D3133;
}



#carea{
  width: 100%;
}

#area-map{
  width: 92%;
  height: 700px;
  margin-left: auto;
  margin-right: auto;
}

.area-list-search{
  width: 89%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}

#area-map-tl{
    width: 88%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 20px;
}

.area-po-search{
  width: 90%;
  display: flex;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}

.area-po-res{
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}

#area table{
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.title-area{
    line-height:24px;
}

@media only screen and (max-width: 800px) {

  #area-map{
    width: 100%;
    height: 450px;
  }
}
</style>


