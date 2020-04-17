<template>
    <div id="ptg">
        
        <div id="ptg-txt">
            <div class="ptg-txt-s">
                <div class="ptg-txt-tit">{{getLang(txt1)}}</div>
                <div class="ptg-txt-num" :style="'color:' + bColor">{{res1}}</div>
            </div>

            <div class="ptg-txt-s">
                <div class="ptg-txt-tit">{{getLang(txt2)}}</div>
                <div class="ptg-txt-num" :style="'color:' + aColor">{{resPoint}}%</div>
            </div>
        </div>

        <div id="ptg-inner">
            <div class="ptg-bar ptg-bar-a" :style="'width:' + aWidth + 'px;background:'+aColor+';'"></div>
            <div class="ptg-bar ptg-bar-b" :style="'background:'+bColor+';'" :ref="'bBar'"></div>
            <div class="ptg-point" :style="'margin-left:'+pointPosi+'px;background:'+pointColor+';'"></div>
        </div>
    </div>
</template>

<script>

import { putCN } from '../../translate'

export default {
    name: "ptg",
    props:{
        txt1:{
            type: String,
            default: "Cases to go until herd immunity"
        },
        txt2:{
            type: String,
            default: "Progress"
        },
        point: {
            type: Number,
            default: 0.6
        },
        aColor: {
            type: String,
            default: "#FF3A46"
        },
        bColor: {
            type: String,
            default: "#29D38C"
        },
        pointColor:{
            type: String,
            default: "#148267"
        },
        mData: {
            type: Array,
            default: ()=>{return [2626, 66440000]}
        }
    },
    data(){
        return{
            aWidth: 0,
            bWidth: 0,
            pointPosi: 0,
            res1: 0,
            res2: 0,
            resPoint: 0
        }
    },
    mounted(){

        this.res1 = (this.mData[1] * this.point) - this.mData[0]
        
        this.res2 = ((this.mData[0] / this.mData[1])*100).toFixed(5)
        this.res2 = Number(this.res2)
        this.aWidth = this.res2 > 1 ? this.res2.toFixed(3) : 4
        this.resPoint = ((this.mData[0] / (this.mData[1] * this.point))*100).toFixed(5)


        let bBar = this.$refs['bBar']
        this.bWidth = parseInt(window.getComputedStyle(bBar).width)
        this.pointPosi = this.bWidth * this.point

        document.addEventListener("resize", ()=>{
            this.bWidth = parseInt(window.getComputedStyle(bBar).width)
            this.pointPosi = this.bWidth * this.point
        })
        
    },
    methods:{
        getLang(str){
            if(window.navigator.language != "zh-CN"){
                return str
            } else {
                return putCN(str)
            }
        },
    }
}
</script>

<style scoped>

#ptg{
    width: 100%;
    height: 100%;
}

#ptg-inner{
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}

#ptg-txt{
    width: 90%;
    margin-left: auto;
    margin-right: auto;
}

.ptg-txt-s{
    margin-top: 10px;
    margin-bottom:10px;
}

.ptg-txt-tit{
    opacity: 0.6;
    font-size: 16px;
}

.ptg-txt-num{
    font-weight:bold;
    font-size:24px;
}

.ptg-bar{
    height: 10px;
    border-radius: 100px;
}

.ptg-bar-a{
    position: absolute;
}

.ptg-bar-b{
    width: 100%;
}

.ptg-point{
    width: 6px;
    height: 20px;
    border-radius: 2px;
    margin-top: -15px;
    position: absolute;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.25);
}
</style>