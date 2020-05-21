<template>
  <div class="search-room">
    <vs-input v-model="searchRoom" @input="onSearchEmit" autocomplete="off" placeholder="Enter room name">
      <template #icon>
        <i class='bx bx-search'></i>
      </template>
    </vs-input>
    <vs-select
      placeholder="Select"
      v-model="typeRooms">
      <vs-option label="MyRooms" value="scoped">
        MyRooms
      </vs-option>
      <vs-option label="GlobalRooms" value="global">
        GlobalRooms
      </vs-option>
    </vs-select>
  </div>
</template>

<script>
  export default {
    data:()=>({
      searchRoom: '',
      typeRooms: 'scoped'
    }),
    methods: {
      onSearchEmit(searchRoom){
        this.$emit('searchRoom', searchRoom)
      }
    },
    watch: {
      typeRooms(){
        this.$emit('toggleTypeRooms', this.typeRooms)
      }
    }
  }
</script>

<style lang="scss">
  @import '@/style/SearchComponent/style.scss';
</style>