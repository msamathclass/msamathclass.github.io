function mean(arr){
    return arr.reduce((sum, val)=>{return sum+val;}, 0) / arr.length;
}

function stdevp(arr){
    let m = mean(arr);

    let stdev = Math.sqrt(arr.reduce((sum, val)=>{return sum + (val-m)*(val-m);}, 0)/arr.length);
    return stdev;   
}

function stdevs(arr){
    let m = mean(arr);

    let stdev = Math.sqrt(arr.reduce((sum, val)=>{return sum + (val-m)*(val-m);}, 0)/(arr.length-1));
    return stdev;   
}

function median(arr){
    let sorted = arr;
    sorted.sort((a,b)=>{return a-b});

    if(sorted.length % 2 == 0){
        let index = sorted.length/2;
        return [mean([sorted[index-1], sorted[index]]), index];
    } else{
        let index = Math.floor(sorted.length/2);
        return [sorted[index], index];
    } 
}

function quartiles(arr){
    let sorted = arr;
    sorted.sort((a,b)=>{return a-b});

    let q0 = sorted[0];
    let q4 = sorted[sorted.length-1];

    let [q2, q2index] = median(sorted);
    console.log(sorted);

    let lower = sorted.slice(0,q2index);
    let upper = sorted.slice(q2index);
    console.log(lower);
    console.log(upper);

    let [q1, q1index] = median(lower);
    console.log(q1);
    let [q3, q3index] = median(upper);

    return [q0, q1, q2, q3, q4];
}

// generate a random integer between min (inc) and max (exc)
function randBetween(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

