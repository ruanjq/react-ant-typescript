
export function queryString(name:string,str:string):string{
    /* eslint-disable-next-line */
    var pattern = new RegExp(`[\?&]${name}=([^&]+)`, 'g');
    str = str || window.location.search;
    var arr, match = '';
    while ((arr = pattern.exec(str)) !== null) {
        match = arr[1];
    }

    return match;
}

export function throttle(fn:object,delay:number){
    let canRun = true;
    return function(this:any){
        if(!canRun) return;
        let ctx = this,
        args = arguments;
        if(typeof fn === "function"){
            canRun = false;
            setTimeout(function(){
                fn.call(ctx,args);
                canRun = true;
            },delay);
        }
    }
}

