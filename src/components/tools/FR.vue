<template>
  <el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;"  v-loading="loading">
    <el-row style="text-align:center;">
        <video id="fr_v"></video>
        <div id="cover"></div>
    </el-row>
    <el-row  style="text-align:center;">
        <el-button id="fr_b">打开摄像头</el-button>
    </el-row>
    <el-row  style="text-align:center;">
        <canvas id="fr_img"/>
    </el-row>
  </el-main>
</template>

<script>
const $ = require("jquery");
const config = require("../../utils/config");
// const axios = require("axios");
// const md5 = require("../../utils/md5")
import * as faceapi from "face-api.js";


export default {
  name: 'FR',

  data(){
    return {
        loading:false,
        cameraFlag:false,
        paused:false,
        camerastream:null,

    }
  },
  mounted:function(){

      
      navigator.getMedia = navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia ||
                            navigator.msGetUserMedia;
        this.video = document.getElementById("fr_v");
        this.photo_ = document.getElementById("fr_img");
        var that = this;
        document.getElementById("fr_b").onclick=function(){
            if(!that.cameraFlag)
            {
                
                navigator.getUserMedia({video:true,audio: false }, that.onSuccess, function(e){console.log(e)});
                that.cameraFlag=true;
            }
            that.paused=true;
            that.openCam();
        }
        console.log(faceapi.nets)
        faceapi.nets.tinyFaceDetector.loadFromUri(config.server_host + '/weights')
        .then(()=>{
            console.log("tinyFaceDetector loadded!")
            // faceapi.nets.faceRecognitionNet.loadFromUri(config.server_host + '/weights')
            // .then(()=>{
            //     console.log("faceRecognitionNet loadded!")
            // })
            faceapi.loadFaceLandmarkModel(config.server_host + '/weights').then(()=>{
                faceapi.loadFaceRecognitionModel(config.server_host + '/weights').then(()=>{
                    console.log("loadded...")
                })
            })
        })
        
        // faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        // .then(()=>{
        //     console.log("loadded!")
        // })
        
  },
  methods:{
      onSuccess:function(stream) {
        this.video.srcObject=stream;
        this.camerastream = stream;
    },
    getFaceDetectorOptions:function() {

        // tiny_face_detector options
        let inputSize = 512
        let scoreThreshold = 0.5
        return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
        },
      openCam:function()
        {
            var that=this;
            if(that.paused)
            {
                that.video.play();
                that.video.style.display="block";
                //get right of camera & call function and recieve stream
                $(that.video).css("filter","blur(0px)")
                setTimeout(function(){
                        that.getPic()
                    },2000)
            }
            else
            {
                that.video.pause();
                $(that.video).css("filter","blur(10px)")
            }
        },
        getPic: async function()
        {
            // var that = this;
            if(this.video.paused)
            {
                alert("Please open The Camera first!")
                return;
            }
            else
            {
                this.photo_.height =this.video.videoHeight;
                this.photo_.width = this.video.videoWidth;

                var MIME_TYPE = "image/png";
                this.photo_.toDataURL(MIME_TYPE).split(",")[1];
                
                var ctx = this.photo_.getContext('2d');
                ctx.drawImage(this.video, 0, 0);

                 const fullFaceDescriptions = await faceapi
                    .detectSingleFace(this.photo_,this.getFaceDetectorOptions())
                    .withFaceLandmarks()
                    .withFaceDescriptor()

                if (!fullFaceDescriptions.length) {
                    return
                }

                // create FaceMatcher with automatically assigned labels
                // from the detection results for the reference image
                var faceMatcher = new faceapi.FaceMatcher(fullFaceDescriptions)
                console.log(faceMatcher)
                
                // setTimeout(function(){
                //         that.getPic()
                //     },2000)
            }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss">
@import "../../assets/theme";
#fr_v{
    display: inline-block !important;
    filter: blur(0px);
    height: 480px;
    width: 640px;
    border-radius: 10px;
}
#cover{
    position: absolute;
    background: transparent;
    height: 200px;
    width: 200px;
    top: 0px;
    left: calc(50% - 320px);
    border-left: 220px solid rgba(255,255,255,.95);
    border-top: 140px solid rgba(255,255,255,.95);
    border-right: 220px solid rgba(255,255,255,.95);
    border-bottom: 140px solid rgba(255,255,255,0.95);
}
</style>
