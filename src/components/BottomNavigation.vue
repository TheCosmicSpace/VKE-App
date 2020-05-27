<template>
<footer v-if="!isHidden" class="bottom-nav">
  <nav class="nav nav--icons">
    <ul>
      <li>
        <router-link :to="{name: 'Posts'}" active-class="is-active" exact >
        <svg class="icon icon-home" viewBox="0 0 24 24" width="20" height="20">
          <g fill="currentColor">
            <path d="M19.875,3H4.125C2.953,3,2,3.897,2,5v14c0,1.103,0.953,2,2.125,2h15.75C21.047,21,22,20.103,22,19V5 C22,3.897,21.047,3,19.875,3z M19.875,19H4.125c-0.057,0-0.096-0.016-0.113-0.016c-0.007,0-0.011,0.002-0.012,0.008L3.988,5.046 C3.995,5.036,4.04,5,4.125,5h15.75C19.954,5.001,19.997,5.028,20,5.008l0.012,13.946C20.005,18.964,19.96,19,19.875,19z"/>
            <path d="M6 7H12V13H6zM13 15L6 15 6 17 13 17 14 17 18 17 18 15 14 15zM14 11H18V13H14zM14 7H18V9H14z"/>
          </g>
        </svg>
          <span>News</span>
        </router-link>
      </li>
      <li>
        <router-link :to="{name: 'Chats'}" active-class="is-active" exact>
        <svg class="icon icon-news" viewBox="0 0 24 24" width="20" height="20">
          <g fill="currentColor"> 
            <path d="M5,18v3.766l1.515-0.909l0,0L11.277,18H16c1.103,0,2-0.897,2-2V8c0-1.103-0.897-2-2-2H4C2.897,6,2,6.897,2,8v8 c0,1.103,0.897,2,2,2H5z M4,8h12v8h-5.277L7,18.234V16H4V8z"/>
            <path d="M20,2h-1h-2.002H8C6.897,2,6,2.897,6,4h10.586H18c1.103,0,2,0.897,2,2v1.414V12v2c1.103,0,2-0.897,2-2V7V5V4 C22,2.897,21.103,2,20,2z"/>
          </g>
        </svg>
          <span>Chats</span>
        </router-link>
      </li>
      <!-- <li>
        <router-link to="/" exact>
          <svg class="icon icon-search" viewBox="0 0 24 24" width="20" height="20">
           <path fill="currentColor" d="M21.7 20.3l-3.7-3.7c1.2-1.5 2-3.5 2-5.6 0-5-4-9-9-9s-9 4-9 9c0 5 4 9 9 9 2.1 0 4.1-0.7 5.6-2l3.7 3.7c0.2 0.2 0.5 0.3 0.7 0.3s0.5-0.1 0.7-0.3c0.4-0.4 0.4-1 0-1.4zM4 11c0-3.9 3.1-7 7-7s7 3.1 7 7c0 1.9-0.8 3.7-2 4.9 0 0 0 0 0 0s0 0 0 0c-1.3 1.3-3 2-4.9 2-4 0.1-7.1-3-7.1-6.9z"></path>
          </svg>
          <span>Search</span>    
        </router-link>
      </li> -->
      <li>
        <router-link :to="{name: 'Profile'}" active-class="is-active" exact>
          <svg class="icon icon-profile" viewBox="0 0 24 24" width="20" height="20">
            <g fill="currentColor">
              <path d="M16 14h-8c-2.8 0-5 2.2-5 5v2c0 0.6 0.4 1 1 1s1-0.4 1-1v-2c0-1.7 1.3-3 3-3h8c1.7 0 3 1.3 3 3v2c0 0.6 0.4 1 1 1s1-0.4 1-1v-2c0-2.8-2.2-5-5-5z"></path>
              <path d="M12 12c2.8 0 5-2.2 5-5s-2.2-5-5-5-5 2.2-5 5 2.2 5 5 5zM12 4c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z"></path>
            </g>
          </svg>
          <span>Profile</span>    
        </router-link>
      </li>
    </ul>
  </nav>
</footer>
</template>

<script>
  export default {
    name: 'BottomNavigation',
    computed: {
      isHidden(){
        return this.hidden
      }
    },
    methods: {
      toggleHidden(state){
        this.hidden = state
      }
    },
    data:()=>({
      hidden: false
    })
  }
</script>


<style lang="scss" scoped>
  @import '@/style/BottomNavigation/style_scoped.scss';
</style>