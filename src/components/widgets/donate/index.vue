<template>
    <div id="donate">
        <div id="donate-inner">

            <div id="donate-title">
                {{ getLang("THANK YOU") }}
            </div>
            <div id="donate-subtitle">
                {{ getLang("Donation will be use for server maintenance, pay for data services(eg. Map), and team members health protection.") }}
            </div>
            
            <div id="donate-cont">
                <div id="paypal">
                
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                        <input type="hidden" name="cmd" value="_s-xclick" />
                        <input type="hidden" name="hosted_button_id" value="EY7QJMGB24VBQ" />
                        <input type="image" :src="'./img/csd.png'" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" style="height: 100%;background: none;border: none;" />
                        <img alt="" border="0" src="https://www.paypal.com/en_GB/i/scr/pixel.gif" width="1" height="1" />
                    </form>

                </div>

                <div id="wechat">

                    <div id="wechat-cont" v-on:click="openWCQR">
                        <img :src="'./img/wec.png'" alt="donate by wechat pay">
                    </div>

                </div>
            </div>
            

            <div id="donate-close" v-on:click="close">
                <div>{{getLang("CLOSE")}}</div>
            </div>
        </div>

        


    </div>
</template>

<script>

import { EventBus } from '../../../bus'
import { putCN } from '../../../translate'

export default {
    name:"donate",
    data(){
        return{
            wcqr: false
        }
    },
    methods:{
        openWCQR(){
            window.open("https://i.ibb.co/4RwtP7p/cc.jpg")
            //this.wcqr = true
        },
        close(){
            EventBus.$emit('donate-close', true)
        },
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

    img{
        width: 25%;
    }

    #donate{
        position:fixed;
        top: 0px;
        left: 0px;
        height: 100%;
        width: 100%;
        background: rgba(0,0,0,0.98);
        text-align: center;
        font-weight: bold;
        color: #fff;
        z-index: 9999;
    }

    #donate-inner{
        margin-top: 90px;
    }

    #donate-cont{
        text-align: center;
    }

    #donate-title{
        font-size: 24px;
    }

    #donate-subtitle{
        font-size: 16px;
        opacity: 0.5;
        margin-top: 12px;
    }

    #paypal{
        width: 25%;
        margin-top: 60px;
        margin-left: auto;
        margin-right: auto;
    }

    #paypal input{
        width: 100%;
    }

    #wechat{
        margin-top: 10px;
    }

    #donate-close{
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: 80px;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
    }

    #donate-close:hover{
        color: #FFC634;
    }

    @media only screen and (max-width: 800px) {
        img{
            width: 70%;
        }
        #paypal{
            width: 70%;
        }
    }
</style>


