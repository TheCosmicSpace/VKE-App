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
    if(!this.getSomePost(postId)) this.$router.replace({name: 'Posts'})
    this.postData = {...this.getSomePost(postId)}
    console.log(this.postData);
  }
}
</script>

<style lang="scss" scoped>
  @import '@/style/PostItem/style_scoped.scss';
</style>
