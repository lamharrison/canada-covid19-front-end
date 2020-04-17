<template>
    <div id="timeheat">
        <div class="title" style="background: #1D1F21; width: 100%; margin-bottom: 0px;">
            <div class="title-area inner" style="width: 92%; padding-top: 20px; padding-bottom:20px; margin-left:auto; margin-right: auto;">
                <span>{{getLang("Data Release")}}</span><br>
                <div style="font-size: 12px; opacity: 0.5;">{{getLang("when gov.uk website was edited (some might not updating figures)")}}</div>
            </div>
        </div>

        <div id="chart" v-if="loaded">
            <apexchart type="heatmap" height="250" :options="opts" :series="cd"></apexchart>
        </div>
    </div>
</template>

<script>
import { genGet } from '../../request'
import { putCN } from '../../translate'

export default {
    name: "timeheat",
    data(){
        return{
            api: "/timeline",
            loaded: false,
            timeline: [],
            cd: [
                { name: "8", data: [] },
                { name: "9", data: [] },
                { name: "10", data: [] },
                { name: "11", data: [] },
                { name: "12", data: [] },
                { name: "13", data: [] },
                { name: "14", data: [] },
                { name: "15", data: [] },
                { name: "16", data: [] },
                { name: "17", data: [] },
                { name: "18", data: [] },
                { name: "19", data: [] },
                { name: "20", data: [] },
                { name: "21", data: [] },
                { name: "22", data: [] },
                { name: "23", data: [] }
            ],
            opts: {
                chart: {
                    foreColor: '#8D9EAA',
                    type: 'heatmap',
                    animations: {enabled: false,}
                },
                dataLabels: { enabled: false },  
                tooltip: { enabled: false},
                legend: { show: false },
                xaxis: {
                    type: 'category',
                    categories: [],
                    labels:{
                        style: {
                            fontSize:  '8px',
                        },
                    },
                },
                yaxis:{
                    
                    labels:{
                        formatter: function(val){
                            if(val) return val + " h"
                            
                        },
                        style: {
                            fontSize:  '8px',
                        },
                    },
                },
                fill: {
                    color: "#1F2224",
                    pattern: {
                        strokeWidth: 0,
                    },
                },
                stroke: {
                    show: true,
                    colors: ["#373D41"],
                    width: 1, 
                },
                grid: {
                    borderColor: 'rgba(55,61,65,1)',
                },
                plotOptions: {
                    heatmap: {
                        radius: 0,
                        enableShades: false,
                        useFillColorAsStroke: true,
                        colorScale: {
                            ranges: [
                                {
                                    from: 1,
                                    to: 2,
                                    name: '',
                                    color: '#1F2224'
                                },
                                {
                                    from: 2,
                                    to: 3,
                                    name: '',
                                    color: '#36FFAB'
                                },
                            ]
                        }
                    }
                }
            },
            
        }
    },
    created(){
        this.getData()
    },
    methods:{
        getData(){
            genGet(this.api, [], false, (res)=>{
                if(res.status){
                    let tl = res.data.timeline
                    tl = tl.reverse()

                    tl.splice(0, tl.length - 30)

                    let last

                    for(let i = 0; i< tl.length; i++){
                        let el = tl[i]
                        let d = new Date(tl[i])

                        let date = d.getMonth()+1 + "-" + d.getDate()

                        // If is same date
                        if(date == last) {
                            this.toRightSlot(d, true)
                        } else {
                            this.opts.xaxis.categories.push(date)
                            this.toRightSlot(d, false)
                        }

                        last = date

                        
                        //console.log(d.getHours())
                    }

                    this.loaded = true

                }
                
            })
        },

        toRightSlot(dateObj, sameDay){

            let h = dateObj.getHours()
            
            this.cd.forEach((el, i) => {

                if(sameDay){
                    let len = this.cd[i].data.length
                    if(el.name == h) {
                        this.cd[i].data[len-1] = 2
                    }

                } else {

                    if(el.name == h) {
                        this.cd[i].data.push(2)
                    } else {
                        this.cd[i].data.push(1)
                    }

                }
                
                
            });
            
            
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