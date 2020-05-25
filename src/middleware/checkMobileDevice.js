import store from '@/store/index.js'

const { getDevice } = store.getters
console.log(getDevice);

// alert(device.device.type)
export default function({next}){
    // device.device.type === "desktop"
    if(getDevice === "desktop") {
      next({name: 'ViewMiddleware', params: {typeMiddleware: 'device'}})
      return false
    }
    else return true
}