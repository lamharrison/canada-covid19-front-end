<template>
    <div id="storelist" :style="'opacity:' + (loading ? '0.5' : '1')">

        <div id="sl-sorter">
            <div id="sl-map">
                <storemap :mapData="storeRes" :ct="mapCenter"></storemap>
            </div>

            <div id="sl-select">
                <select v-model="selected" @change="changed()">
                    <option v-for="(item, index) in stores" :key="index">{{item}}</option>
                </select>
            </div>

            <div id="sl-sinput">
                
                <div id="sl-sinput-box">
                    <input type="text" v-model="searchInput" placeholder="UK Postcode">
                    
                </div>

                <div id="sl-sinput-check">
                    <button v-on:click="checkNearbyWithPo()">Search</button>
                </div>

                <!--div id="sl-input-act sl-sinput-getnearby">
                    <button v-on:click="getCurrentLoc()">Current Location</button>
                </div-->
                
            </div>

            
        </div>

        <div id="sl-list-title">
            <h3>Nearby</h3>
        </div>

        <div id="sl-list" ref="slList" :style="'height:' + (screenHeight > 0 ? screenHeight - 365 : 300) + 'px;'">

            <div 
                class="sl-s"
                v-for="(item, index) in storeRes" 
                :key="index" 
                :style="'opacity:' + (mapSelected == index ? '1' : '0.6') + ';height:' + (listInfo.length == storeRes.length ? 95 : 77) + 'px;'" 
                :ref="'sl-'+index"
                v-on:click="selectFromList(index)">

                <div class="sl-s-info">
                    <div class="sl-s-name">
                        {{ item.sname }}
                    </div>
                        
                    <div class="sl-s-add">
                        {{ item.address }}
                    </div>

                    <div class="sl-s-mark" v-if="listInfo.length == storeRes.length">
                        <progress v-if="calOverall(listInfo[index]) != 0" :value="calOverall(listInfo[index])" max="100"></progress>
                        <div v-else style="font-size: 12px; color:#36FFAB;margin-top: 4px;">No data, add status now.</div>
                    </div>

                    <div class="sl-s-more">
                        <div class="sl-s-more-txt" v-on:click="listClicked(item)">Stock Checker</div>
                    </div>

                </div>
                
            </div>

            <div v-if="storeRes.length < 1">
                <span>Search Location By Postcode</span>
            </div>

            
        </div>
    </div>
</template>

<script>
import { genGet, getLocByPO } from '../../../request'
import { geoDistance } from '../../../utils'
import { EventBus } from '../../../bus'

import storemap from '../storemap'


import ls from 'local-storage'
import VueScrollTo from 'vue-scrollto'


export default {
    name: "storelist",
    components:{
        storemap
    },
    data(){
        return{
            loading: false,
            api: "https://store.covid19uk.live/store/",
            api_single: "https://store.covid19uk.live/storesingle/",
            la: false,
            lo: false,
            stores: [
                "Tesco",
                "Sainsbury",
                "Coop",
                "ASDA",
                "Lidl",
                "Aldi",
                "Boots",
                "Waitrose"
            ],
            selected: "Tesco",
            mapSelected: 0,
            tryTime: 0,
            currentStore: [],
            storeRes: [],
            listInfo: [],
            searchInput: "",
            mapCenter: [],
            screenHeight: 0,
            output: "",

        }
    },
    
    created(){

        this.getCurrentLoc()

        this.autoByLast()
        
        
    },

    mounted(){

        let scrollLock = false

        let VSoptions = {
            container: '#sl-list',
            easing: 'ease-in',
            offset: 0,
            force: true,
            cancelable: false,
            onStart: function(element) {
            // scrolling started
            },
            onDone: function(element) {
                scrollLock = false
            },
            onCancel: function() {
            // scrolling has been interrupted
            },
            x: false,
            y: true
        }

        this.screenHeight = screen.height
        let list = this.$refs.slList
        let sh = 100

        list.addEventListener("scroll", (evt)=>{
            if(scrollLock == false){
                this.selectFromList(Math.floor(list.scrollTop / sh))
            }
            
        })

        window.addEventListener("resize", ()=>{
            this.screenHeight = screen.height
        })

        EventBus.$on("storemap", (res)=>{
            this.mapSelected = res
            scrollLock = true
            VueScrollTo.scrollTo(this.$refs["sl-"+res][0], 300, VSoptions)
        })
    },

    methods:{

        autoByLast(){
            // If has last query
            if(ls.get('cuk19-location') && ls.get('cuk19-store')){
                let lsLoc = ls.get('cuk19-location')
                let lsStore = ls.get('cuk19-store')
                let po = ls.get('cuk19-po') ? ls.get('cuk19-po') : ""
                this.la = lsLoc.la
                this.lo = lsLoc.lo
                this.searchInput = po
                this.selected = lsStore
                this.checkNearby()
            }
        },


        getCurrentLoc(){
            this.loading = true
            if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((geo)=>{

                    this.la = geo.coords.latitude
                    this.lo = geo.coords.longitude
                    this.checkNearby()
                    this.loading = false

                }), (err)=>{
                    if(err.code == 1){
                        alert("You didn't give location access to your bowser. Please try input postcode")
                    }
                    this.loading = false
                }
            } else {
                this.loading = false
            }
            

            setTimeout(()=>{
                this.loading = false
            }, 3000)
        },

        selectFromList(idx){
            if(idx < this.storeRes.length - 1){
                this.mapSelected = idx
                EventBus.$emit("storemaprs", idx)
            }
            
        },

        checkNearby(){
            this.loading = true

            if(this.la && this.la){

                ls.set('cuk19-location', {la: this.la, lo: this.lo})
                ls.set('cuk19-store', this.selected)

                genGet(this.api, [
                    {
                        name: "n",
                        val: this.selected.toLowerCase()
                    }
                ], true, (res)=>{
                    this.currentStore = res.data.data
                    this.findStoreByGeo(this.la, this.lo)
                    this.loading = false
                    this.listBarStatus()
                })
            } else {
                alert("Please input Postcode")
                this.loading = false
            }
            
        },


        listClicked(d){
            d.store = this.selected.toLowerCase()
            EventBus.$emit("slclick", d)
        },

        changed(){
            if(this.la && this.lo){
                this.checkNearby()
            }
        },

        calOverall(obj){
            let all = (obj.d_vegfru * 2) + (obj.d_meatfish * 2) + (obj.d_bread * 2) + (obj.d_milk * 2) + (obj.d_egg * 2)
            return ((all / 100).toFixed(2)) * 100
        },

        checkNearbyWithPo(){

            if(this.searchInput.length > 0){
                this.loading = true

                getLocByPO(this.searchInput, (res)=>{
                    if(res.status){
                        this.la = res.data.result.latitude
                        this.lo = res.data.result.longitude
                        this.checkNearby()
                        ls.set('cuk19-po', this.searchInput)
                    } else {
                        alert("Invalid postcode")
                    }

                    this.loading = false
                    
                })
            } else {
                alert("no input")
            }

            
        },

        findStoreByGeo(la, lo, dis){

            let res = []

            dis = dis ? dis : 5
            
            for(let i=0;i<this.currentStore.length;i++){
                
                let tmpDis = geoDistance(la, lo, this.currentStore[i].latitude, this.currentStore[i].longitude)
                
                if(tmpDis < dis){
                    res.push(this.currentStore[i])
                }
            }

            if(res.length > 0 || dis > 100){
                this.storeRes = res
                this.mapCenter = [la, lo]
                return
            } else {
                if(this.tryTime > 10){
                    this.tryTime = 0
                    return
                } else {
                    this.findStoreByGeo(name, la, lo, dis+10)
                    this.tryTime = this.tryTime + 1
                    return
                }
                
            }
            
        },

        listBarStatus(){
            let query = []
            for(let i=0;i<this.storeRes.length;i++){
                query.push(this.storeRes[i]["id"])
            }

            genGet(this.api_single, [
                { name: "n", val: this.selected.toLowerCase() },
                { name: "sid", val: String(query)}
            ], true, (res)=>{
                this.listInfo = res.data.data
            })

            
        },
    }
}
</script>


<style scoped>

::-webkit-scrollbar {
  width: 4px;
}

#sl-map{
    height: 150px;
    width: 100%;
}

#sl-sorter{
    position: relative;
    width: 92%;
    margin-left: auto;
    margin-right: auto;
    height: 250px;
}

#sl-list{
    color: #fff;
    width: 92%;
    margin-left: auto;
    margin-right: auto;
    height: 500px;
    overflow-y:scroll; 
}


#sl-select{
    height: 32px;
    margin-top: 10px;
    margin-bottom:6px;
}

#sl-sinput{
    width: 100%;
    display: flex;
    margin-bottom:6px;
}

#sl-sinput button{
    height: 32px;
    padding-top: 2px;
}

#sl-sinput-box{
    width: 80%;
}

#sl-sinput-check{
    width: 10%;
}

.sl-input-act{
    margin-left: 6px;
    margin-right: 6px;
}

#sl-list-title{
    width: 92%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 10px;
}

.sl-s{
    width: 90%;
    margin-top: 12px;
    margin-bottom: 12px;
    background: #2C3134;
    border: 1px solid rgba(255,255,255,0);
    -webkit-transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
    padding: 12px;
}

.sl-s-info{
    width: 100%;
}

.sl-s-name{
    font-size: 16px;
    font-weight: bold;
    margin-top: 4px;
}

.sl-s-add{
    font-size: 12px;
    font-weight: normal;
    opacity: 0.5;
}

.sl-s-more{
    width: calc(100% + 24px);
    height: 36px;
    margin-left: -12px;
    margin-top: 17px;
    background: #262D30;
    text-align: center;
    cursor: pointer;
}

.sl-s-more:active{
    background: #262B2D;
}

.sl-s-more-txt{
    padding-top: 10px;
    font-weight: bold;
    font-size: 14px;
}


</style>