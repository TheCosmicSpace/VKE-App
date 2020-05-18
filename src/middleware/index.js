/**
 * 
 * @param {*} routeData 
 */
async function callMiddleware(routeData){
    const { meta } = routeData;
    for(let middleware of meta){
        let result = await importMiddleware(middleware, routeData);
        if(!result) break;
    }
}

/**
 * 
 * @param {*} fileName 
 * @param {*} routeData 
 */
async function importMiddleware(fileName, routeData){
    const module = await import(`/${fileName}`);
    const result = module.default(routeData);
    return (typeof result === undefined || result);
}


export default function(routeData){
    callMiddleware(routeData);
}