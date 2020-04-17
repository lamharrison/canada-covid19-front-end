<template>
    <div id="fullchart" v-if="loaded">
        <apexchart width="100%" :height="ch + 'px'" :ref="'chart-'+d.name" :type="d.type" :options="d.options" :series="d.data"></apexchart>
        <div class="fc-notice">({{getLang("Built for PC")}})</div>
        <div class="fc-back">
            <span v-on:click="back()">{{getLang("BACK")}}</span>
        </div>
    </div>
</template>


<script>
import { putCN } from '../../translate'

export default {
    name: "fullchart",
    data(){
        return{
            d: {},
            ch: 0,
            loaded: false
        }
    },
    mounted(){
        this.ch = Math.floor(window.innerHeight) - 110

        window.addEventListener('resize', ()=>{
            this.ch = Math.floor(window.innerHeight) - 110
        })
    },
    created(){
        
        if(this.$route){


            if(typeof this.$route.query.d == "string"){
                this.$router.push({path:'/'})
                return
            } else {
                this.d = this.$route.query.d
                this.d.options.chart.toolbar.show = true
                this.d.options.chart.zoom.enabled = true
                this.loaded = true
            }

            

        } else {
            console.log("no data")
        }
        
    },
    methods:{
        back(){
            this.$router.go(-1)
        },

        // 翻译，由translate.js提供字典
        getLang(str){
            if(navigator.language != "zh-CN"){
                return str
            } else {
                return putCN(str)
            }
        },
    }
}
</script>

<style scoped>

#fullchart{
    position: absolute;
    left:0px;
    width: 100%;
    height: 100%;
}

.fc-notice{
    width:100%;
    height: 40px; 
    text-align:center; 
    cursor:pointer; 
    color:#ffffff; 
    opacity: 0.4;
    font-size: 14px;
}

.fc-back{
    width:100%;
    height: 140px; 
    text-align:center; 
    cursor:pointer; 
    color:#3F8BBE; 
}
</style>