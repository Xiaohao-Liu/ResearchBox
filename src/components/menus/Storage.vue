<template>
<el-main style="position:absolute;height:100%;width:100%;top:0px;left:0px;">
    <el-header class="top_bar">
    <el-row style="margin:0px;"> 
            <!-- <el-col class="user_bar" :span="4">
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            </el-col> -->
            <el-col class="title_bar" :span="24" ><i class="el-icon-files"></i> 文件存储 </el-col>
        </el-row>
    </el-header>
    <file-browser :axiosConfig="{'baseURL': baseURL}" />
</el-main>
</template>

<script>
import FileBrowser from "../FM/index";
const config = require("../../utils/config");

import Vue from 'vue';
import Vuetify from 'vuetify'
import '../../assets/googlemd.css'
import '../../assets/materialdesignicons.css'
import 'vuetify/dist/vuetify.css'
import 'vuetify/dist/vuetify.js'

Vue.use(Vuetify);

export default {
    inject:['reload'],
    vuetify:new Vuetify(),
    data:function(){
        return {
            baseURL:config.server_host
        }
    },
    components: {
        FileBrowser
    },
    mounted:function(){
        document.getElementsByTagName('title')[0].innerText = "文件";
    }
};
</script>