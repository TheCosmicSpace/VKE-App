import store from '@/store/index.js'
const { getBrowser } = store.getters

export default function({next}){
  if(getBrowser !== 'Chrome Mobile'){
    next({name: 'ViewMiddleware', params: {typeMiddleware: 'browser'}})
    return false
  }
  else return true
}