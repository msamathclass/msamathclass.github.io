
let data = [];
let runningMean = [];

const loadOptions = function(event){

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
}

const roll = function(event){
    event.preventDefault();

    let typeDice = parseInt($("#typedice").val());
    let hitVal = parseInt($("#hitval").val());
    let pool = parseInt($("#num").val());
    let trials = parseInt($("#trials").val());

    for(let n = 0; n < trials; n++){
        let hits = 0;
        for(let i=0; i < pool; i++){
            let result = randBetween(1,typeDice+1);
            result > hitVal ? hits += 1 : hits += 0;
        }

        let outObj = {
            dice: typeDice,
            hit: hitVal,
            pool: pool,
            hits: hits
        };

        data.push(outObj);

        runningMean.push(mean(data.map((x)=>{return x.hits})));
    }

    let hits = data[data.length-1].hits;
    const outString = `<p> Out of ${pool} ${typeDice}-sided dice, you rolled <b>${hits} hits</b> <p><br>`;
    $("#outputs").html(outString);

    // updateHistory();
    updateHistogram();
    updateMean();
    updateStatistics();
}

const updateHistogram = function(){
    
    let results = data.map((x)=> {return x.hits});

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

const updateStatistics = function(){

    let results = data.map((x)=>{return parseInt(x.hits);});
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

