<template>
    <div id="alert" v-show="alertShow">
        <div id="alert-bg" :class="bgCName"></div>

        <div 
            id="alert-window" 
            :class="windowCName"
            :style="'background:' + bgColor + ';border-top: 16px solid' + topColor + ';'">
            <div id="alert-inner">
                <div id="alert-title">
                    <span>{{title}}</span>
                </div>

                <div id="alert-content">
                    <div v-html="content"></div>
                </div>
            </div>
            

            <div id="alert-submit">
                <button v-on:click="go()">{{submit}}</button>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from '../../../bus'

const ls = require('local-storage')

export default {
    name: "alert",
    props:{
        title: {
            type: String,
            default: "Title"
        },
        content: {
            type: String,
            default: "Content"
        },
        submit: {
            type: String,
            default: "submit"
        },
        bgColor: {
            type: String,
            default: "#FFC634"
        },
        topColor: {
            type: String,
            default: "#152DFF"
        }
    },
    data(){
        return{
            alertShow: true,
            bgCName: "",
            windowCName: ""
        }
        
    },

    mounted(){
        this.show(true)
    },
    methods:{
        show(bol){
            var that = this
            if(bol){
                this.alertShow = bol
                this.$nextTick(()=>{
                    that.windowCName = "wShow"
                    that.bgCName = "bShow"
                })

                
            } else {
                this.windowCName = "wClose"
                this.bgCName = "bClose"
                setTimeout(()=>{
                    
                    that.alertShow = bol
                }, 500)
            }
            
        },

        go(){
            EventBus.$emit("alert-clicked", this.submit)
            //ls.set("first", "1")
            this.show(false)
        }
    },
    
}
</script>


<style scoped>

@keyframes bgOpen {
    0% { opacity:0;}
    100% { opacity:1;}
}

@keyframes bgClose {
    0% { opacity:1;}
    100% { opacity:0;}
}

@keyframes windowOpen {
    0% { opacity:0.5; transform: translateY(1000px);}
    100% { opacity:1; transform: translateY(0px);}
}

@keyframes windowClose {
    0% { opacity:1; transform: translateY(0px);}
    100% { opacity:0.5; transform: translateY(1000px);}
}

a{
    color: #3F8BBE;
    text-decoration: none;
}

a:active{
    color: #3F8BBE;
}

.wShow{
    animation-name: windowOpen;
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.wClose{
    animation-name: windowClose;
    animation-duration: 0.5s;
    animation-fill-mode: forwards;
}

.bShow{
    animation-name: bgOpen;
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

.bClose{
animation-name: bgClose;
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

#alert{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 99999;
    color: #111111;
}

#alert-bg{
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    opacity: 0;
}

#alert-window{
    position: fixed;
    bottom: 0px;
    width: 100%;
    max-width: 800px;
    height: 640px;
    animation-duration: 0.5s;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
}

#alert-inner{
    width: 92%;
    margin-top: 40px;
    margin-left: auto;
    margin-right: auto;
}

#alert-title{
    font-size: 48px;
    font-weight: bold;
    text-transform: uppercase;
}

#alert-content{
    font-size: 26px;
    font-weight: normal;
}

#alert-submit{
    width: 100%;
    position: absolute;
    bottom: 30px;
    text-align: center;
}

#alert-submit button{
    height: 80px;
    background: #111;
    color: #fff;
    width: 92%;
    border:none;
    border-radius: 8px;
    font-size: 24px;
    font-weight: bold;;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
}


#alert-submit button:hover{
    background: #000;
}

@media (max-height:900px) and (min-height:667px) {

    #alert-inner{
        margin-top: 20px;
        height: 540px;
        overflow-y:scroll;
    }

    #alert-window{
        height: 84%;
    }

    #alert-title{
        font-size: 36px;
    }

    #alert-content{
        font-size: 18px;
    }

    #alert-submit button{
        height: 64px;
        font-size: 20px;
    }
}

@media only screen and (max-height: 667px) {

    #alert-window{
        height: 90%;
    }

    #alert-inner{
        margin-top: 20px;
        height: 400px;
        overflow-y:scroll;
    }


    #alert-title{
        font-size: 18px;
    }

    #alert-content{
        font-size: 16px;
    }

    #alert-submit button{
        height: 44px;
        font-size: 14px;
    }
}




</style>