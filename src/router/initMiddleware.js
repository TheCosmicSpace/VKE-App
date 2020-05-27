import middleware from '@/middleware/index.js'
import equalRoute from './equalRoute.js'
/**
 * 
 * @param {*} router 
 */
export default function(router){
  router.beforeEach((to, from, next) => {
    if(!to.meta.middleware) next();
    else middleware({ meta: to.meta.middleware, to, from, next });
    equalRoute(to.name)
  });  
}