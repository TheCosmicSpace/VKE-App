<template>
<article class="card">
  <div class="card__frame" :style="{backgroundImage: getPostBackground}" :data-identify="postData.id">
    <h2 class="card__title">{{postData.postTitle}}</h2>
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
        <Like 
          :idPost="postData.id"
          :likeCounter="postData.likeCounter"/>
      </div>
    </div>
  </div>
</article>
</template>

<script>
import Like from '@/components/Like.vue'
export default {
  name: 'Post',
  components: {
    Like
  },
  props: ['postData'],
  computed: {
    getAuthor(){
      return this.postData.author
    },
    getDataPost(){
      return new Date(this.postData.createAt).toLocaleDateString()
    },
    getPostBackground(){
      const { postPhotoURL } = this.postData
      if(postPhotoURL) return `url(${postPhotoURL})`
    }
  },  
  data:()=>({
  }),
  methods: {
  }
}
</script>

<style lang="scss">
  @import '@/style/PostComponent/style.scss';
</style>