import middleware from "@/middleware/index.js"

export default function(router){
    router.beforeEach((to, from, next) =>{
        middleware({
          meta: to.meta.middleware,
          to,
          from,
          next
        })
    });  
}