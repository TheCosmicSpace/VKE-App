/**
 * 
 * @param {*} routeData 
 */
async function callMiddleware(routeData){
    const { meta } = routeData
    for(let middleware of meta){
        let result = await importMiddleware(middleware, routeData)
        if(!result) return
    }
    routeData.next()
}

/**
 * 
 * @param {*} fileName 
 * @param {*} routeData 
 */
async function importMiddleware(fileName, routeData){
    const module = await import(`/${fileName}`)
    const moduleResult = await module.default(routeData)
    return moduleResult
    // return result
    // return (typeof result === undefined || result);
}


export default function(routeData){
    callMiddleware(routeData);
}