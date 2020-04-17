<template>
    <div id="overall">
        <!-- CURRENT FIGURES -->
        <!-- current figure switcher -->
        <!--div class="tab-switcher">
            <div 
                class="ds-single" 
                v-for="(item, index) in allData" 
                :key="item.id" :style="'width:calc(100%/' + allData.length + ');'" 
                v-on:click="switchData(index)">

                <div class="ds-text">
                    <span>{{item.source}}</span>
                </div>

                <div class="ds-ids" v-if="index == selected"></div>
                
            </div>
        </div-->

        <!-- current figure container -->
        <div id="overall">
            <div id="overall-inner">

                <div id="overall-show">
                    <div 
                        class="overall-single" 
                        v-for="(value, name) in renderData" 
                        :key="name">

                        <div class="overall-single-value" :style="value=='---' ? 'opacity: 0.2;font-weight:bold;' : 'opacity: 1;font-weight:bold;color:' + getColor(name)">
                        
                            <span v-if="value == '---'">{{value}}</span>
                            <span v-if="value != '---' && isNaN(value)">{{value}}</span>

                            <!-- count up animation, provided by vue-countup package -->
                            <ICountUp
                                :delay="100"
                                :endVal="value"
                                :options="countUpOptions"
                                v-if="value!='---' && !isNaN(value)"
                            ></ICountUp>
                        
                        </div>

                        <div class="overall-single-title">
                            <span>{{getLang(name)}}</span>
                        </div>

                        <div class="overall-single-compare">
                            <span :style="'color:' + getColor(name) + ';font-weight: bold; font-size: 14px;opacity: 0.8;'">{{  compare(value, name) }}</span>
                        </div>

                    </div>

                </div>

                <!-- update date -->
                <div id="update">
                    <div>{{getLang("Update")}}: {{update}}</div>
                    <!--div>Due to the statistical changes, test data appears not lining up with the government's figure. Our calculation method will reconsider and reconstruct after midnight.</div-->
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { getDateFromTs } from '../../utils'
import ICountUp from 'vue-countup-v2'

import { putCN } from '../../translate'
import { putColor } from './color'

export default {
    name: "overall",
    props:{
        allData:{
            type: Array,
            default(){
                return []
            }
        },
        historyData:{
            type: Array,
            default(){
                return []
            }
        },
        DPosi: {
            type: Number,
            default: 0
        }
    },

    /*watch: {
        'DPosi' () {
            this.renderData["D. Posi."] = this.DPosi + "%"
        }
    },*/
    components:{
        ICountUp,
    },

    data(){
        return{
            // Update time var
            update:"",
            // Selected data sources on figure section
            selected: 0,
            renderData: {},
            // Render options Count-up package 
            countUpOptions:{
                useEasing: true,
                useGrouping: true,
                separator: ',',
                decimal: '.'
            },
        }
    },

    mounted(){
        this.renderFigure()

        // Get Update Time
        this.update = getDateFromTs(this.allData[0].ts)

    
    },
    methods:{
        
        // 顶上切换数据源tab切换时fire
        /*switchData(idx){
            this.selected = idx
            this.renderFigure()
        },*/

        // 从color.js获取各种颜色
        getColor(str){
            return putColor(str)
        },

        // Render figure data by data sources
        // 渲染数字（主要给切换数据源使用，每次切换调用这个方法）
        renderFigure(){

            // Process Current Selected Data For render
            const all = this.allData[this.selected]
            this.renderData = {
                confirmed: all.confirmed,
                death: all.death,
                tested: all.negative != 0 ? all.confirmed + all.negative : "---",
                negative: all.negative == 0 ? "---" : all.negative,
                "Posi. Rate": (((all.confirmed / (all.confirmed + all.negative))*100).toFixed(2)) + "%",
                mortality: (((all.death / all.confirmed)*100).toFixed(2)) + "%",
                cured: this.allData[1].cured == 0 ? "---" : this.allData[1].cured,
                serious: this.allData[1].serious == 0 ? "---" : this.allData[1].serious,
                //suspected: all.suspected == 0 ? "---" : all.suspected,
            }

            //console.log(all.confirmed / all.confirmed + all.negative)

            /*if(this.selected == 0){
                this.renderData['D. Posi.'] = this.DPosi + "%"
            }*/

        },

        //  顶上八大金刚，对比昨日的数据，没有则显示---
        compare(value, name){

            if(this.historyData.length > 0){
                let res = parseInt(value - this.historyData[this.historyData.length - 1][name])

                // HARD FIX
                if(name == "tested"){
                    res = parseInt(value - (this.historyData[this.historyData.length - 1].confirmed + this.historyData[this.historyData.length - 1].negative))
                }

                if(name == "serious"){
                    res = "---"
                }

                if(isNaN(res)){
                    return '---'
                } else {
                    return res >= 0 ? '+' + res : '-' + res
                }
                
            } else {
                return '+0'
            }
        
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
#update{
  width: 100%;
  text-align: center;
  font-size: 12px;
  padding-bottom: 20px;
  color: #CED3D6;
  opacity: 0.2;
  margin-top: -10px;
}

#overall{
  width: 100%;
}

#overall-inner{
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  background: #1D1F21;
  /*border-radius: 0 0 24px 24px;*/
}

#overall-more{
  display: flex;
  width: 100%;
}

#overall-show{
  display: flex;
  flex-wrap: wrap;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 35px;
}

.overall-single{
  width: calc(100%/4);
  height: 100px;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.overall-single-bg{
  position: absolute;
  background: #2D3133;
  border-radius: 8px;
  width: calc(100%/12);
  height: 70px;
  margin-left: 160px;
  z-index:1;
}

.overall-single-title{
  font-size: 12px;
  font-weight: bold;
  opacity: 0.6;
  z-index:2;
}

.overall-single-value{
  font-size: 20px;
  font-weight: bold;
  z-index:2;
}

.overall-source{
  width: 92%;
  height: 30px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.overall-source-inner{
  width: 100%;
  color: #51606A;
  font-size: 16px;
  font-weight: bold;
  opacity: 0.6;
  cursor: pointer;
}

.overall-source img{
  width: 20px;
  height: 20px;
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
}
</style>