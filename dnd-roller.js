
let data = [];
let runningMean = [];
let runningTotal = 0;
let runningRate = []

const loadOptions = function(event){

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

const roll = function(event){
    event.preventDefault();

    let num = parseInt($("#numdice").val());
    let type = parseInt($("#typedice").val());
    let mod = parseInt($("#modifier").val());
    let trials = parseInt($("#trials").val());
    let dc = parseInt($("#dc").val());

    for(let n = 0; n < trials; n++){
        let unmodded = 0;
        for(let i=0; i < num; i++){
            unmodded += randBetween(1,type+1);
        }

        let result = false;

        if((unmodded+mod) >= dc){ 
            result = true; 
            runningTotal++
        }

        let outObj = {
            n: num,
            d: type,
            m: mod,
            u: unmodded,
            r: unmodded+mod,
            s: result
        };

        data.push(outObj);

        runningMean.push(mean(data.map((x)=>{return (x.u+x.m)})));

        runningRate.push(data.filter(x => x.s===true).length/data.length);
    }

    let pct = runningTotal/data.length*100;

    const outstring = `<b>${runningTotal} successes</b> out of ${+data.length.toFixed(2)} rolls (${pct}%) <p><br>`;
    $("#outputs").html(outstring);

    // updateHistory();
    updateHistogram(dc);
    updateMean();
    updateRate();
    updateStatistics();
}

const updateHistogram = function(dc){
    
    let results = data.map((x)=> {return x.r});
    // console.log(results);
    // let colors = results.map( r => {return (r >= dc) ? 'rgba(222,45,38,0.8)' : 'rgba(204,204,204,1)'});
    // console.log(colors);
    let histogram = {
        x: results,
        type: 'histogram',
        histnorm: 'count',
        
        xbins: { size: 1 }
    };

    let div = document.getElementById('histogram');      // for some reason this doesn't work as JQuery???

    let layout = { 

        title: 'Frequency of outcomes',
        bargap: 0.01,
        font: {size: 18}
        // marker: {color: colors},
      };
      
      
    let config = {responsive: true};

    Plotly.newPlot(div, [histogram], layout, config);
}

const updateHistory = function(){
    $("#histlist").html("");

    let count = 0;
    for(let entry of data){
        let output = `<li id="item${count}"> On a ${entry.n}d${entry.d}+${entry.m}, you rolled a <b>${entry.r}</b> (${entry.u})  </li>`;
        $("#histlist").append(output);
        count++;
    }
}

const updateMean = function(){

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

const updateRate = function(){

    let trials = [];
    for(let i=0; i < runningRate.length; i++){
        trials.push(i);
    }
    console.log("Test -- updateRate running");
    
    let trace = {
        x: trials,
        y: runningRate,
        type: 'scatter'
    }

    let div = document.getElementById('rate-graph');

    let layout = { 

        title: 'Running success rate by trial',
      
        font: {size: 18}
      
      };
      
      
    let config = {responsive: true};

    Plotly.newPlot(div, [trace], layout, config);
}

const updateStatistics = function(){

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


// MAIN ACTIONS
$("#inputButton").on("click", roll);
$(document).ready(loadOptions);

