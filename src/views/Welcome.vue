<template>
   <div class="clearfix" style="height: 100vh;">
      <Header style="height: 64px;"/>
      <div class="client-body">
         <div class="main">
            <Search class="search"/>
         </div>
         <div class="content">
            <div class="left-content-wrap">
               <div class="left-content">
                  left
               </div>
            </div>
            <div class="right-content-wrap">
               <div class="right-content">
                  right
               </div>
            </div>
         </div>
      </div>
   </div>
</template>
<script setup>
import Header from "../components/Header/index.vue"
import Search from "../components/SearchInput/Search.vue";
</script>
<style lang="scss" scoped>
.clearfix::before,
.clearfix::after{
   content: '';
   display: table;
   clear: both;
}

.client-body {
   margin-top: 64px;
   height: calc(100vh - 64px);
}
.main{
   height:75vh;
   background-color: #eeeeee;
   background-image: url("../assets/images/login_bg.svg");
	background-size: cover;
   position: sticky;
   top: 64px;
   z-index: 1;
   .search {
      position: absolute;
      left: 5vw;
      top: 30vh;
      width: 40vw;
   }
   @media screen and (max-width:992px) {
   .search{
      width: 88vw;
   }
   }  
}

.content{
   position: relative;
   background-color: whitesmoke;
   height: 100vh;
   display: flex;
   .left-content-wrap{
      flex: 1;
      .left-content{
         background-color: aqua;
         margin:0 5vw;
         height: 100%;
      }
   }
   .right-content-wrap{
      width: 30vw;
      .right-content{
         height: 100%;
         background-color: bisque;
      }
   }
   @media screen and (max-width: 768px) {
      .right-content-wrap{
         display: none;
      }
   }
}
</style>