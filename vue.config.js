module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/common.scss";`
      }
    }
  }
};