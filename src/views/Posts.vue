<template>
  <div class="home">
    <div class="container">
      
      <h2 class="home-title page-title">
        <span class="page-title__text">News</span>
        <vs-button
          v-if="checkByAdmin"
          @click="comeToAddPost"
          circle
          icon
          floating
          class="add-btn">
        <i class='bx bx-plus' ></i>
        </vs-button>
      </h2>
      <div v-if="!isEmpty" @click="comeToPost" ref="posts" class="posts">
        
        <Post v-for="(post, key) in getPostsCollection" 
          :key="key"
          :postData="post"
          ref="post"/>
      </div>
      <!-- Tmp -v -->
      <Loading v-if="!getIsEmptyResponse && loading"/>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// @ is an alias to /src
import Post from '@/components/Post.vue'
import Loading from '@/components/Loading.vue'

  let init = true;
export default {
  name: 'Home',
  components: {
    Post,
    Loading
  },
  computed: {
    ...mapGetters([
      'getPostsCollection',
      'getIsEmptyResponse',
      'checkByAdmin'
    ]),
    isEmpty(){
      return this.getPostsCollection == null
    }
  },
  methods:{
    ...mapActions([
      'callPostsCollection',
      'addEventOnSnapshot'
    ]),
    createCirlcePath({x, y}){
      const circle = document.createElement("div");
      circle.classList.add("circle")
      circle.style.clipPath = `circle(0vh at ${x}px ${y}px)`
      setTimeout(()=>circle.style.clipPath = `circle(100vh at ${x}px ${y}px)`, 0)
      this.$el.append(circle)
      console.log(this.$el);
    },
    comeToAddPost(){
      this.$router.push({name: "AddPost"})
    },
    comeToPost(e){
      const { identify } = e.target.dataset; 
      if(!identify) return false;
      // Get position
      this.createCirlcePath(e)
      // Push to post
      setTimeout(()=>{
        this.$router.push({name: 'PostItem', params: {postId: identify}});
        console.log("ELLL", this.$el);
      }, 500)
    },
    loadMore(entries, observer){
      this.loading  = true;
      console.log(entries, observer);
      entries.forEach(entry => {
        if(entry.isIntersecting){
          this.observer.unobserve(entry.target)
          this.callPostsCollection()
          console.log("SEE");
        }
      })
      // alert("SEE")
      
      // this.LoadMore()
    },
    addNewTarget(){
      this.loading = false;
      console.log(this.$refs.posts.lastChild);
      // console.log(nodes);
      this.observer.observe(this.$refs.posts.lastChild);
    }
  },
  data:()=>({
    init: true,
    loading: true,
    options: {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    },
    observer: null
  }),
  mounted(){
    console.log(this.$el);
    const targetNode = this.$refs.posts;
    const config = { attributes: true, childList: true, subtree: false };
    const observer = new MutationObserver(this.addNewTarget);
    observer.observe(targetNode, config);
    console.log(this.$el);
    
    // Parent all posts
    this.observer = new IntersectionObserver(this.loadMore, this.options)
    if(init) (this.callPostsCollection(),this.addEventOnSnapshot(), init = false)
    else this.observer.observe(this.$refs.posts.lastChild)
  },
  destroyed() {
    this.observer.disconnect();
  }
}
</script>

<style lang="scss">
   @import '@/style/PostsPage/style.scss';
</style>