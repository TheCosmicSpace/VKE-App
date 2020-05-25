import store from '@/store/index.js'

const { getBrowser } = store.getters
console.log("MID RES", getBrowser === 'Chrome Mobile');

export default function({next}){
  if(getBrowser !== 'Chrome Mobile'){
    next({name: 'ViewMiddleware', params: {typeMiddleware: 'browser'}})
    return false
  }
  else return true
}