<template>
    <!-- GROUP INFO -->
    <div id="groupup">
      <span>{{getLang("Group Up")}}</span>

      <div id="groupup-inner">
        <div class="groupup-s">
          <a href="https://www.facebook.com/groups/2944338405655888" target="_blank">
            <img :src="'./img/facebook.png'" alt="join by Facebook">
          </a>
          
        </div>

        <div class="groupup-s">
          <a href="https://twitter.com/JIANFENGWU9" target="_blank">
            <img :src="'./img/twitter.png'" alt="Open Twitter">
          </a>
        </div>

        <div class="groupup-s">
          <a href="https://jq.qq.com/?_wv=1027&k=5Ajnx1w" target="_blank">
            <img :src="'./img/qq.png'" alt="join by Tencent QQ">
          </a>
        </div>
      </div>
      
      
      <!--li><a href="https://spectrum.chat/covid-19-uk-update" target="_blank">{{getLang("By")}} Spectrum.chat</a></li>
      <li><a href="https://jq.qq.com/?_wv=1027&k=5Ajnx1w" target="_blank">{{getLang("By")}} QQ</a></li-->
    </div>
</template>

<script>
import { putCN } from '../../translate'
export default {
    name: "groupup",
    methods:{
        // 翻译，由translate.js提供字典
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
#groupup{
  width: 92%;
  margin-top: 40px;
  margin-left: auto;
  margin-right: auto;
  color: #CED3D6;
  line-height: 30px;
  font-weight: bold;
}

#groupup-inner{
  display: flex;
  margin-top: 10px;
}

.groupup-s{
  margin-right: 10px;
}

#groupup img{
  opacity: 0.8;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
}

#groupup img:hover{
  opacity: 1;
}

#groupup img:active{
  opacity: 0.6;
}


#groupup a{
  color: #3F8BBE;
  text-decoration: underline;
  font-size: 10px;
  font-weight: bold;
}

#groupup a:active{
  background: #FEB547;
}

@media only screen and (max-width: 800px) {
    #groupup img{
        opacity: 1;
        width: 100%;
    }
}
</style>

