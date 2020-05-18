import middleware from "@/middleware/index.js"
/**
 * 
 * @param {*} router 
 */
export default function(router){
  router.beforeEach((to, from, next) => {
    if(!to.meta.middleware) next();
    else middleware({ meta: to.meta.middleware, to, from, next });
  });  
}