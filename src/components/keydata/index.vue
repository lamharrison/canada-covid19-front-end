<template>
    <div id="keydata">
        <div class="title" style="background: #1D1F21; width: 100%; margin-bottom: 0px;">
            <div class="title-area inner" style="width: 92%; padding-top: 20px; padding-bottom:20px; margin-left:auto; margin-right: auto;">
                <span>{{getLang("Key Data")}}</span><br>
                <div style="font-size: 12px; opacity: 0.5;">* {{ getLang("Global data has 1 Day Delay") }}</div>
            </div>
        </div>

        <div id="keydata-inner">
            <div id="keydata-data">
                <div class="keydata-data-s" v-for="(item, index) in allData" :key="index">
                    <div class="ptg-txt-tit">{{ getLang(item.name )}}</div>
                    <div class="ptg-txt-num" :style="'color:' + item.color">{{ item.num }}</div>
                </div>
            </div>
        </div>
        

    </div>
</template>


<script>

import { putCN } from '../../translate'

export default {
    name: "keydata",
    props: {
        allData: {
            type: Array,
            default(){
                return []
            }
        }
    },
    mounted(){
        
    },
    methods:{
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
#keydata-inner{
    width: 92%;
    margin-left: auto;
    margin-right: auto;
}

.keydata-data-s{
    margin-top:20px;
    margin-bottom: 20px;
}

.ptg-txt-tit{
    opacity: 0.8;
    font-weight: bold;
    font-size: 16px;
}

.ptg-txt-num{
    font-weight:bold;
    font-size:24px;
}
</style>
