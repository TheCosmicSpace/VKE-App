
/**
 * 
 * @param {*} routeData 
 */
async function callMiddleware(routeData){
    let {meta} = routeData;
    for(let middleware of meta){
        console.log(middleware);
        let result = await importMiddleware(middleware, routeData);
        console.log(result);
        if(!result) break;
    }
}

/**
 * 
 * @param {*} fileName 
 * @param {*} routeData 
 */
async function importMiddleware(fileName, routeData){
    let module = await import(`/${fileName}`);
    let result = module.default(routeData);
    return (typeof result === 'undefined' || result);
}


export default function(routeData){
    callMiddleware(routeData);
}