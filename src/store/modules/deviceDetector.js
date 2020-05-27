import DeviceDetector from "device-detector-js";
 
const deviceDetector = new DeviceDetector();
const deviceParse = deviceDetector.parse(window.navigator.userAgent);
console.log(deviceParse);

export default {
  state: {
    device: null,
    os: null,
    browser: null
  },
  mutations: {
    setDeviseDetector: state => {
      state.device = deviceParse.device.type
      state.os = deviceParse.os.name
      state.browser = deviceParse.client.name
    }
  },
  actions: {
  },
  getters: {
    getDevice: state => state.device,
    getOS: state => state.os,
    getBrowser: state => state.browser
  }
}
