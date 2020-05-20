<template>
  <svg viewBox="0 0 36 36">
    <path
      d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
      fill="none"
      :stroke="colorOnLimit"
      stroke-width="3"
      :stroke-dasharray="getDasharray"
    />
  </svg>
</template>

<script>
  export default {
    props: ['getLengthPostTitle', 'titleLimit'],
    computed: {
    getDasharray(){
      return `${this.getLengthPostTitle / this.titleLimit * 100}, 100`
    },
    colorOnLimit(){
      return this.getLengthPostTitle ===  this.titleLimit ? "#FF4757" : "#195BFF"
    },
  }
  }
</script>

<style lang="sass" scoped>
</style>