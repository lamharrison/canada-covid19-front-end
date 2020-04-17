<template>

    <div id="sources">
      <span>{{getLang("References")}}</span>
      <li v-for="(item, index) in list" :key="index">
          <a :href="item.url" target="_blank">{{ item.name }}</a>
      </li>
    </div>

</template>


<script>
import { putCN } from '../../translate'
export default {
    name: "sources",
    data(){
        return{
            list:[
                {
                    name: "[API] Coronvirus Figure UK - isjeffcom",
                    url: "https://github.com/isjeffcom/coronvirusFigureUK"
                },
            ]
        }
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
#sources{
  width: 92%;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  color: #CED3D6;
  line-height: 30px;
  font-weight: bold;
}

#sources img{
  opacity: 0.8;
  width: 300px;
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

#sources img:hover{
  opacity: 1;
}

#sources img:active{
  opacity: 0.6;
}




#sources a:active{
  background: #FEB547;
}

@media only screen and (max-width: 800px) {
    #sources img{
        opacity: 1;
        width: 50%;
    }
}
</style>
