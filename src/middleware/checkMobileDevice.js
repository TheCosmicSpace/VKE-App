import store from '@/store/index.js'
const { getDevice } = store.getters

export default function({next}){
  if(getDevice === "desktop") {
    next({name: 'ViewMiddleware', params: {typeMiddleware: 'device'}})
    return false
  }
  else return true
}