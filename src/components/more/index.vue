<template>
    <!-- MORE INFO BUTTON -->
    <div id="more">


      <!--div style="margin-bottom:20px;">

        <a href="https://www.google.com/maps/d/u/0/embed?mid=1yCPR-ukAgE55sROnmBUFmtLN6riVLTu3&ll=54.019029244689136%2C-1.956174250177014&z=7" target="_blank">
          <img src="https://i.ibb.co/GnR4nCt/yessdg.png" alt="Cases explorer">
        </a>

      </div-->

      <div>

        <a href="https://www.canada.ca/en/public-health/services/diseases/2019-novel-coronavirus-infection/canadas-reponse.html" target="_blank">
          <img src="https://i.ibb.co/RNJTwnx/btn2.png" alt="to NHS official website for more help and information">
        </a>

      </div>



    </div>
</template>


<script>
export default {
    name: "more",

}
</script>


<style scoped>

#more{
  width: 92%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 50px;
  text-align: center;
}

#more img{
  width: 70%;
}

@media only screen and (max-width: 800px) {
    #more{
        width: 92%;
    }

    #more img{
        width: 100%;
    }
}
</style>
