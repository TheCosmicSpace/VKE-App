<template>
  <div class="chats">
    <!-- Title -->
    <h2 class="chats-title page-title">
      <span class="page-title__text">Chats</span>
    </h2>
    <!-- Toggle Rooms -->
    <Search/>
  </div>
</template>

<script>
import Search from '@/components/Search.vue'
  export default {
    name: 'Chats',
    components: {
      Search
    },
    data:()=>({
      active: 0,
    })
  }
</script>


<style lang="scss" >
  @import '@/style/ChatsPage/style.scss';
</style>

<style lang="scss" scoped>
  @import '@/style/ChatsPage/style_scoped.scss';
</style>