<template>
    <div id="store">
        <storelist></storelist>
        <alert :title="alt.tit" :content="alt.content" :submit="alt.submit"></alert>
    </div>
</template>


<script>
import storelist from '../../components/widgets/storelist'
import { EventBus } from '../../bus'

import alert from '../../components/widgets/alert'

export default {
    name: "store",
    components: {
        storelist,
        alert
    },
    data(){
        return{
            alt: {
                tit: "What is stock checker?",
                content: "This pilot feature allows the users to share the stock information - Everyone is encouraged to share the shelf conditions and stock insights from their local supermarket visits. While the onsite crowdsourcing data aims to help people better plan their grocery activity, we do appreciate there might be lack of update or entry error. Please use your genuine data contribution to help your neighbourhood stay safe.",
                submit: "Agree"
            }
        }
    },
    created(){
        EventBus.$on("slclick", (res)=>{
            //console.log(res)
            this.$router.push({path: "/storesingle", query: {n: res.sname, id: res.id, s: res.store}})
        })
    }
}
</script>