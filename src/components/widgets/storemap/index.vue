<template>

  <div style="height: 100%; width: 100%">

    
    <l-map
      v-if="showMap"
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
    >

      <l-tile-layer
        :url="url"
        :detectRetina="true"
        :attribution="attribution"
      ></l-tile-layer>

      <l-marker 
        v-for="(item, index) in mapData"
        :key="index"
        :icon="currentSelected == index ? setIcon(32) : setIcon(20)"
        :lat-lng="setLatLng(item.latitude, item.longitude)" 
        v-on:click="markerClicked(index)">


        <!--l-popup>
          <div>
            {{item.sname}}
          </div>
        </l-popup-->
      </l-marker>

    </l-map>
  </div>
</template>

<script>
import L from "leaflet"
import { LMap, LTileLayer, LMarker, LPopup } from "vue2-leaflet"
import { genGet } from '../../../request'
import { EventBus } from '../../../bus'

export default {
  name: "storemap",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    //LPopup
  },
  props:{
    mapData: {
        type: Array,
        value: []
    },
    ct: {
      type: Array,
      value: []
    }
  },
  data() {
    return {
        api_geoToPo: "https://api.postcodes.io/postcodes/",
        currentSelected: 0,
        iconResize: 0.15,
        minSize: 16,
        zoom: 5,
        center: L.latLng(54.275967, -3.234891),
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a href="http://osm.org/copyright">OSM</a>',
        currentZoom: 5,
        currentCenter: L.latLng(54.275967, -3.234891),
        showParagraph: false,
        icon: L.icon({
            iconUrl: './img/marker.svg',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        }),
        mapOptions: {
            zoomSnap: 0.5,
            easeLinearity: true,
            zoomAnimation: true,
            fadeAnimation: true,
            markerZoomAnimation: true
        },
        showMap: true
    };
  },

  watch:{
    ct: function (data) {
      this.cucc(data[0], data[1])
    }
  },

  created(){
    EventBus.$on("storemaprs", (res)=>[
      this.currentSelected = res
    ])
  },

  methods: {

    cucc(la, lo){
      let c = L.latLng(la, lo)
      this.center = c
      this.currentCenter = c

      // Do this otherwise center udpate will be overwrite
      setTimeout(()=>{
        this.zoom = 11
      }, 500)
    },

    markerClicked(val){
      this.currentSelected = val
      EventBus.$emit("storemap", val)
    },

    zoomUpdate(zoom) {
      this.currentZoom = zoom
    },
    centerUpdate(center) {
      this.currentCenter = center
    },
    showLongText() {
      this.showParagraph = !this.showParagraph
    },
    setLatLng(lo, la){
        return L.latLng(lo, la)
    },
    setIcon(size){
      return L.icon({
          iconUrl: 'https://i.ibb.co/yPnJyxS/cds.png',
          iconSize: [size, size],
          iconAnchor: [size/2, size/2]
      })
    }
  }
};
</script>
