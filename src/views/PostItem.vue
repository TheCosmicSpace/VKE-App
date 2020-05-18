<template>
<div class="item">
<GoBackRoute class="back-btn"/>
<article class="card">
   <div class="card__frame" :style="{backgroundImage: getPostBackground}">
   </div>
   <div class="card__footer">
    <div class="card-info">
      <vs-avatar class="card-info__avatar">
        <img v-if="getAuthor.photoURL" :src="getAuthor.photoURL" alt="">
        <i v-else class='bx bx-user'></i>
      </vs-avatar>
      <div class="card-info__meta">
        <h2 class="card-info__author-name">{{getAuthor.displayName}}</h2>
        <p class="card-info__date">{{getDataPost}}</p>
      </div>
    </div>
    <div class="card__fitback">
      <div class="like">
        <Like :idPost="getPostData.id" :likeCounter="getPostData.likeCounter"/>
      </div>
    </div>
  </div> 
 </article>
 <div class="text-block">
    <div class="title">{{postData.postTitle}}</div>
    <div class="text">{{postData.postText}}</div>
   </div>     
 </div>
</template>

<script>
import Like from '@/components/Like.vue'
import GoBackRoute from '@/components/GoBackRoute.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'PostItem',
  components: {
    Like,
    GoBackRoute
  },
  methods: {
  },
  computed: {
    ...mapGetters([
      'getSomePost'
    ]),
    getAuthor(){
      return this.postData.author
    },
    getDataPost(){
      return new Date(this.postData.createAt).toLocaleDateString()
    },
    getPostBackground(){
      const { postPhotoURL } = this.postData
      if(postPhotoURL) return `url(${postPhotoURL})`
      // return 'url(../assets/postImgDefault.jpg)'
    },
    getPostData(){
      return this.postData
    }
  },
  data:()=>({
    postData: null
  }),
  created(){
    const { postId } = this.$route.params
    console.log(this.$route.params);
    console.log(this.getSomePost(postId));
    this.postData = {...this.getSomePost(postId)}
    console.log(this.postData);
    
  }
}
</script>

<style lang="scss" scoped>
@mixin showEl($duration, $delay){
  animation: show $duration forwards $delay;
}
.item{
  position: relative;
  min-height: inherit;
  display: flex;
  flex-direction: column;
}
.card{
  padding: 10px 0px;
  margin-bottom: 0; 
  flex: 0;
  position: relative;
  &::before{
    content: '';
    position: absolute;
    right: 0px;
    bottom: 0;
    background: transparent;
    width: 0%;
    height: 0%;
    border-radius: 10px;
    transition: .3s;
  }
  &__frame{
    margin: 0px 5px 0 5px;
    @include showEl(1.5s, 0s);
    &::before{
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.3) 5%, rgba(255, 255, 255, 0.05));
    }
  }
  &__title{
    color: #000;
    position: static;
    font-size: 18px;
    font-weight: 600;
    padding: 5px;
  }
    &__footer{
    padding: 13px;
    position: relative;
    opacity: 0;
    @include showEl(1.5s, .3s);
    margin-top: -30px;
    z-index: 5;
  }
}
body{
}

.text-block{
  flex: 1;
  opacity: 0;
  color: #EAEAEA;
  // background: #38373C;
  background: #202125;
  width: 100%;
  // padding: 40px 10px 100px 10px;
  border-radius: 30px 30px 0px 0px;
  position: relative;
  overflow: auto;
  top: 0; right: 0; bottom: 0; left: 0; 
  @include showEl(1.5s, .5s);
  &::before{
    content: '';
    position: absolute;
    width: 50px;
    height: 4px;
    border-radius: 10px;
    background: #D8D9DD; 
    left: 50%;
    top: 10px; 
    transform: translateX(-50%);
    box-shadow: 0px 0px 45px -25px rgba(255, 255, 255, 1);
  }
}
.card-info{
}
.title{
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  background: #38373C;
  padding: 30px 10px;
  border-bottom: 2px solid #3E3F43;
  color: #FBFBFC;
}
.text{
  padding: 20px 10px 100px 10px;
  word-break: break-word;
}
.back-btn{
  top: 20px;
  left: 15px;
  opacity: 0;
  z-index: 99;
  position: absolute;
  animation: showBtnBack 1.5s forwards 1.5s;
}
@keyframes showBtnBack {
  0% {opacity: 0;}
  100% {opacity: 1;}
}
@keyframes show{
  0% {
    opacity: 0;
    top: 35vh;
    // transform: translateY(100vh);
  }
  100% {
    top: 0;
    // transform: translateY(0vh); 
    opacity: 1;
  }
}
</style>
