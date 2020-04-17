<template>
    <!-- PAGE TITLE BAR -->
    <div id="chead">
        <div id="chead-inner">
            <div id="chead-logo">
                <router-link to="/">
                    <img :src="'./img/logo.png'" alt="logo">
                </router-link>
                
            </div>

            <div id="chead-right">
                <div class="circle circle-c"></div>
                <div>LIVE</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "chead",
    props:{
        update: {
            type: String,
            default: "Unknown"
        }
    }
}
</script>

<style scoped>

@keyframes flashing {
    0% {opacity: 0}
    50% {opacity: 1}
    100% {opacity: 0}
}



.circle{
    width: 10px;
    height: 10px;
    border-radius: 100px;
    background:#CED3D6;
    animation-name: flashing;
    animation-duration: 2.7s;
    animation-iteration-count: infinite;
    animation-direction: normal;
}

.circle-c{
    margin-right: 8px; 
    margin-top: 3px;
}

#chead{
    position: relative;
    height: 110px;
    width: 100%;
    background-color: #17181A;
    color: #ffffff;
    font-weight: bold;
}

#chead-inner{
    width: 100%;
    display: flex;
}

#chead-logo{
    margin-top: 18px;
    margin-left: 24px;
}

#chead-right{
    position: absolute;
    right: 44px;
    display: flex;
    font-size: 14px;
    font-weight: bold;
    margin-top: 40px;
}

#chead-logo img{
    width: 160px;
}

@media only screen and (max-width: 800px) {

    #chead{
        height: 100%;
    }

    .circle{
        width: 8px;
        height: 8px;
    }

    .circle-c{
        margin-right: 6px; 
        margin-top: 2.2px;
    }

    #chead-logo {
        margin-top: 9px;
        margin-bottom: 9px;
        margin-left: 14px;
        font-size: 16px;
        right: 16px;
        margin-top: 12px;
    }

    #chead-logo img {
        width: 120px;
    }

    #chead-inner{
        padding-top: 5px;
        padding-bottom: 5px;
    }

    
    #chead-right{
        right: 24px;
        margin-top: 28px;
        font-size: 10px;
        font-weight: bold;
    }
}
</style>