export function randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}
export function boostProbability(chanceToClicks: number) {
    // 1/clicks chance of getting a boost
    return randomIntFromInterval(1, chanceToClicks) === 1;
}

export const inputDebounce = (callback: Function, delay: number) => {
    //run the callback once after input stops for the given delay
    let timeoutId: any;
    return function (...args: any[]) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            // @ts-ignore
            callback.apply(this, args);
        }, delay);
    };
};

export const apiRetry = async (apiCall: Function, retries: number, delay: number, loadingStageCallback: (x:number)=>void) => {
    let error;
    for (let i = 0; i < retries; i++) {
        try {
            loadingStageCallback(1);
            const res = await apiCall();
            // console.log('res', res);
            if (res.code === 500 || res.code === 502) throw new Error(res.message);
            loadingStageCallback(retries-i+1)
            setTimeout(()=>loadingStageCallback(0), 1000)
            return res;
        } catch (e) {
            error = e;
            console.log('error', e);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw error;
};


export const wait = async (minimalMS: number, asyncFunction?: any) => {
    //wait for async function to finish, but at least for minimalMS
    const start = Date.now();
    const res = !asyncFunction? true : await asyncFunction();
    const end = Date.now();
    const timePassed = end - start;
    if (timePassed < minimalMS) {
        await new Promise((resolve) => setTimeout(resolve, minimalMS - timePassed));
    }
    return res
}
