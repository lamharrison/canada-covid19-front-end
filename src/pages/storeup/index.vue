<template>
    <div id="storeup">
        <div id="ss-info-cont">
            <div id="ss-title">
                <p>{{ sname }}</p>
            </div>

            <div id="ss-add">
                <p>{{ add }}</p>
            </div>

            <div id="ss-notice">
                <p>We have no resource to check every submission so we can only hope one is a honest man/woman.</p>
            </div>

        </div>

        <div id="su-ques">
            <div class="su-ques-s" v-for="(item, index) in ques" :key="index">
                <div>
                    <p>{{item.name}}</p>
                </div>

                <div class="su-ques-s-m">
                    <star-rating v-model="item.val" :star-size="24" :padding="10" inactive-color="#333" active-color="#fff"></star-rating>
                    
                </div>

                <button v-on:click="item.val = item.val != 0 ? 0 : 3">{{ item.val != 0 ? "Unavailable" : "Available" }}</button>
            </div>

            <div class="su-ques-s">
                <div>Contributor: </div>
                <input type="text" placeholder="Anonymous" v-model="user">
            </div>
        </div>

        <div id="ss-update" v-on:click="submit()">
            <div id="ss-update-inner">
                <span>SUBMIT</span>
            </div>
        </div>

    </div>
</template>


<script> 

import StarRating from 'vue-star-rating'
import { genPost } from '../../request'
import { clean } from '../../utils'
// https://www.npmjs.com/package/vue-star-rating

export default {
    name: "storeup",
    components:{
        StarRating
    },
    data(){
        return{
            api: "https://store.covid19uk.live/up/",
            sid: null,
            sname: null,
            add: null,
            store: null,
            markUp: true,
            user: "",
            ques: [
                {
                    name: "Vegetable & Fruit",
                    key: "d_vegfru",
                    val: 3,
                },
                {
                    name: "Meat & Fish",
                    key: "d_meatfish",
                    val: 3,
                },
                {
                    name: "Bread & Rice",
                    key: "d_bread",
                    val: 3,
                },
                {
                    name: "Milk",
                    key: "d_milk",
                    val: 3,
                },
                {
                    name: "Eggs",
                    key: "d_egg",
                    val: 3,
                },
                {
                    name: "Toilet Paper",
                    key: "d_paper",
                    val: 3,
                },
                {
                    name: "Hand sanitizer",
                    key: "d_handgel",
                    val: 3,
                }
            ],
            marks: [1,3,5]
        }
    },
    created(){

        if(!this.$route.query.sid && !this.$route.query.sname){
            return
        }

        this.sid = this.$route.query.sid
        this.sname = this.$route.query.sname
        this.store = this.$route.query.store
        this.add = this.$route.query.add
    },

    methods:{

        submit(){
            let postReady = {
                sname: this.store,
                sid: this.sid,
                data: this.constPD(),
            }

            postReady.data.user = this.user ? this.user : "Anonymous" 
            postReady.data.user = clean(this.user)

            genPost(this.api, postReady, true, (res)=>{
                if(res.status){
                    alert("Successfully updated. You've done a grate help!")
                    this.$router.replace({path: "/store"})
                } else {
                    alert("unknow error")
                }
            })
        },

        constPD(){
            let res = {}
            for(let i=0;i<this.ques.length;i++){
                res[this.ques[i]["key"]] = this.ques[i]["val"]
            }

            return res
        }
    }
}
</script>

<style scoped>

button{
    margin-top: 14px;
    margin-left: 0px; 
    margin-right: 0px;
    padding-top: 7px;
    padding-bottom: 7px;
}

#storeup{
    width: 92%;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    padding-bottom: 40px;
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

.su-ques-s{
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: bold;
}

.su-ques-s-m{
    margin-top: 10px;
    display: flex;
}

.su-ques-s-m-s{
    width: 30px;
    height: 30px;
    border-radius: 100px;
    border: 2px solid #fff;
}

#ss-update{
    position: relative;
    background: #36FFAB;
    margin-top: 40px;
    margin-bottom: 20px;
    border-radius: 100px;
    width: 100%;
    height: 40px;
    text-align: center;
    cursor: pointer;

}

#ss-update-inner{
    width: 100%;
    padding-top: 13px;
    font-weight: bold;
    color: #000;
}

#ss-update:active{
    background: #046F42;
}

</style>