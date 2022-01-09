
// document.getElementById("inputButton").addEventListener()

var data = [];
var runningMean = [];

let loadOptions = function(event){

    let defaultNum = 1;
    for(let i=1; i < 50; i++){
        let selected = "";
        if(i == defaultNum){
            let selected = "selected";
        }

        let option = `<option value="${i}" id="num${i}" ${selected}> ${i} </option>`;
        $("#numdice").append(option);
    }

    let dice = [2, 4, 6, 8, 10, 12, 20, 100];
    let defaultDie = 6;
    
    for(let die of dice){
        let selected = "";

        if(die == defaultDie){
            selected = "selected";
        }

        let option = `<option value="${die}" id="d${die}" ${selected}> ${die} </option>`;
        $("#typedice").append(option);
    }

    let defaultMod = 0;
    for(let i=-20; i <= 20; i++){
        let selected = "";

        if(i == defaultMod){
            selected = "selected";
        }
        let option = `<option value="${i}" id="mod${i}" ${selected}> ${i} </option>`;
        $("#modifier").append(option);
    }

}

let roll = function(event){
    event.preventDefault();

    let num = parseInt($("#numdice").val());
    let type = parseInt($("#typedice").val());
    let mod = parseInt($("#modifier").val());
    let trials = parseInt($("#trials").val());

    for(let n = 0; n < trials; n++){
        let unmodded = 0;
        for(let i=0; i < num; i++){
            unmodded += randBetween(1,type+1);
        }

        let outObj = {
            n: num,
            d: type,
            m: mod,
            u: unmodded,
            r: unmodded + mod
        };

        data.push(outObj);

        runningMean.push(mean(data.map((x)=>{return x.r})));
    }

    let unmodded = data[data.length-1].r;
    const outstring = `<p> On a ${num}d${type}+${mod}, you rolled a <b>${unmodded+mod}</b> (${unmodded}) <p><br>`;
    $("#outputs").html(outstring);

    // updateHistory();
    updateHistogram();
    updateMean();
    updateStatistics();
}

let updateHistogram = function(){
    
    let results = data.map((x)=> {return x.r});

    let histogram = {
        x: results,
        type: 'histogram',
        histnorm: 'probability',
        xbins: { size: 1 }
    };

    let div = document.getElementById('histogram');      // for some reason this doesn't work as JQuery???

    let layout = { 

        title: 'Frequency of outcomes',
        bargap: 0.01,
        font: {size: 18}
      
      };
      
      
    let config = {responsive: true};

    Plotly.newPlot(div, [histogram], layout, config);
}

let updateHistory = function(){
    $("#histlist").html("");

    let count = 0;
    for(let entry of data){
        let output = `<li id="item${count}"> On a ${entry.n}d${entry.d}+${entry.m}, you rolled a <b>${entry.r}</b> (${entry.u})  </li>`;
        $("#histlist").append(output);
        count++;
    }
}

let updateMean = function(){
    // let results = data.map((x)=>{return x.r});

    let trials = [];
    for(let i=0; i < runningMean.length; i++){
        trials.push(i);
    }

    let trace = {
        x: trials,
        y: runningMean,
        type: 'scatter'
    }

    let div = document.getElementById('mean-graph');

    let layout = { 

        title: 'Running mean by trial',
      
        font: {size: 18}
      
      };
      
      
    let config = {responsive: true};

    Plotly.newPlot(div, [trace], layout, config);
}

let updateStatistics = function(){

    let results = data.map((x)=>{return parseInt(x.r);});
    let m = mean(results);
    let s = stdevp(results);
    let quarts = quartiles(results);
    console.log(quarts);
    let iqr = quarts[3]-quarts[1];

    //mean
    $("#mean").html(m.toFixed(3));

    $("#stdev").html(s.toFixed(3));

    $("#q0").html(quarts[0].toFixed(3));
    $("#q1").html(quarts[1].toFixed(3));
    $("#q2").html(quarts[2].toFixed(3));
    $("#q3").html(quarts[3].toFixed(3));
    $("#q4").html(quarts[4].toFixed(3));

    $("#iqr").html(iqr.toFixed(3));
}

// MATH FUNCITONS

let mean = function(arr){
    return arr.reduce((sum, val)=>{return sum+val;}, 0) / arr.length;
}

let stdevp = function(arr){
    let m = mean(arr);

    let stdev = Math.sqrt(arr.reduce((sum, val)=>{return sum + (val-m)*(val-m);}, 0)/arr.length);
    return stdev;   
}

let stdevs = function(arr){
    let m = mean(arr);

    let stdev = Math.sqrt(arr.reduce((sum, val)=>{return sum + (val-m)*(val-m);}, 0)/(arr.length-1));
    return stdev;   
}

let median = function(arr){
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

let quartiles = function(arr){
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
let randBetween = function(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}


// MAIN ACTIONS
$("#inputButton").on("click", roll);
$(document).ready(loadOptions);

