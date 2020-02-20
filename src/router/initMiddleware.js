import middleware from "@/middleware/index.js"

export default function(router){
    router.beforeEach((to, from, next) =>{
      if(typeof to.meta.middleware === 'undefined') 
        next();
      else 
        middleware({
          meta: to.meta.middleware,
          to,
          from,
          next
        })
    });  
}