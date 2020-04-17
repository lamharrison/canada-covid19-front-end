<template>
    <div id="storesingle" v-if="loaded">

        <div id="ss-info-cont">
            <div id="ss-title">
                <p>{{ sdata.sname }}</p>
            </div>

            <div id="ss-add">
                <p>{{ sdata.address }}</p>
            </div>

            <div id="ss-notice">
                <p>The following content contributed collectively by internet users. We encourage everyone to share the stock information to avoid the mass flow in the shipping area and unnecessary exposure.</p>
            </div>

            <div v-if="need" style="background: #FB3D48; color: #fff; font-weight:bold; padding: 4px; border-radius:2px; font-size:14px;" v-on:click="toUp()">
                <span>Data out dated. Update it</span>
            </div>
        </div>
        

        

        <div id="ss-store-cont">
            <div class="ss-store-s">
                <p>Vegetable &amp; Fruit:</p> 
                <progress v-if="checkAva(sdata.d_vegfru) != 0" id="file" :value="checkAva(sdata.d_vegfru)" max="5"></progress>
                <div v-else class="ss-store-s-na">Not Available</div>
            </div>

            <div class="ss-store-s">
                <p>Meat &amp; Fish:</p> 
                <progress v-if="checkAva(sdata.d_meatfish) != 0" id="file" :value="checkAva(sdata.d_meatfish)" max="5"></progress>
                <div v-else class="ss-store-s-na">Not Available</div>
            </div>

            <div class="ss-store-s">
                <p>Bread &amp; Rice:</p> 
                <progress v-if="checkAva(sdata.d_bread) != 0" id="file" :value="checkAva(sdata.d_bread)" max="5"></progress>
                <div v-else class="ss-store-s-na">Not Available</div>
            </div>

            <div class="ss-store-s">
                <p>Milk:</p> 
                <progress v-if="checkAva(sdata.d_milk) != 0" id="file" :value="checkAva(sdata.d_milk)" max="5"></progress>
                <div v-else class="ss-store-s-na">Not Available</div>
            </div>

            <div class="ss-store-s">
                <p>Eggs:</p> 
                <progress v-if="checkAva(sdata.d_egg) != 0" id="file" :value="checkAva(sdata.d_egg)" max="5"></progress>
                <div v-else class="ss-store-s-na">Not Available</div>
            </div>

            <div class="ss-store-s">
                <p>Toilet Paper: </p> 
                <progress v-if="checkAva(sdata.d_paper) != 0" id="file" :value="checkAva(sdata.d_paper)" max="5"></progress>
                <div v-else class="ss-store-s-na">Not Available</div>
            </div>

            <div class="ss-store-s">
                <p>Hand sanitizer:</p> 
                <progress v-if="checkAva(sdata.d_handgel) != 0" id="file" :value="checkAva(sdata.d_handgel)" max="5"></progress>
                <div v-else class="ss-store-s-na">Not Available</div>
            </div>

            <div id="ss-store-s" style="font-size: 14px;">
                <p>Update by: {{ sdata.user }}</p>
                <p>Update Time: {{ parseTs(sdata.ts) }}</p>
            </div>

        </div>


        <div id="ss-update" v-on:click="toUp()">
            <div id="ss-update-inner">
                <span>UPDATE</span>
            </div>
        </div>
    </div>
</template>

<script>
import { genGet } from '../../request'
import { getDateFromTs } from '../../utils'
export default {
    name: "storesingle",
    data(){
        return{
            loaded: false,
            api: "https://store.covid19uk.live/storesingle/",
            sid: "",
            sname: "",
            store: "",
            sdata: {},
            need: false
        }
    },
    created(){
        this.sname = this.$route.query.n
        this.sid = this.$route.query.id
        this.store = this.$route.query.s
        this.getData(this.store, this.sid)
    },
    methods:{
        getData(name, id){

            genGet(this.api, [
                {
                    name: "n",
                    val: name
                },
                {
                    name: "sid",
                    val: id
                },
            ], true, (res)=>{
                this.sdata = res.data.data[0]
                this.loaded = true

                // 6 Hour
                if(!this.sdata.ts || Math.abs(this.sdata.ts - Date.now()) > 6*60*60*1000){
                    this.need = true
                }
            })
        },

        toUp(){
            this.$router.push({ path: "/storeup", query: {
                sname: this.sdata.sname,
                sid: this.sdata.id,
                store: this.store,
                add: this.sdata.address
            }})
        },

        parseTs(ts){
            return getDateFromTs(ts)
        },

        checkAva(val){
            return val ? val : 0
        }
    }
}
</script>


<style scoped>
#storesingle{
    height: 100%;
}

#ss-info-cont{
    
    width: 92%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    margin-bottom: 20px;
}

#ss-title{
    font-size: 20px;
    font-weight: bold;
}

#ss-add{
    font-size: 14px;
    font-weight: normal;
    opacity: 0.7;
}

#ss-notice{
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 10px;
    opacity: 0.5;
}

#ss-store-cont{
    width: 92%;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 40px;
}

.ss-store-s{
    font-size: 18px;
    font-weight: bold;
    margin-top:20px;
    margin-bottom: 20px;
}

.ss-store-s-na{
    font-size: 14px;
    opacity: 0.5;
    font-weight: normal;
}

#ss-update{
    position: relative;
    background: #FFC634;
    width: 100%;
    bottom: 0px;
    height: 40px;
    padding-top: 2px;
    text-align: center;
    cursor: pointer;
}

#ss-update-inner{
    width: 100%;
    margin-top: 12px;
    font-weight: bold;
    color: #000;
}
</style>