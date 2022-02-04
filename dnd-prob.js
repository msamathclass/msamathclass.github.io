const loadOptions = function(event){
    // event.preventDefault();

    let defaultNum = 1;
    for(let i=1; i < 50; i++){
        let selected = "";
        if(i == defaultNum){
            selected = "selected";
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

const calcProb = function(event){
    event.preventDefault();

    let numDice = parseInt($("#numdice").val());
    let typeDice = parseInt($("#typedice").val());
    let mod = parseInt($("#modifier").val());
    let typeProb = $("#typeprob").val();
    let target = parseInt($("#target").val());

    let pdf = getUniformPdf(numDice, typeDice, mod);

    let prob = 0;

    for(let [key, value] of Object.entries(pdf)){
        inequality(key, target, typeProb) ? prob += value : prob += 0;
    }

    prob = Math.round(prob*1000)/10;

    let inequalities = {
        "lt": "<",
        "lte": "≤",
        "gt": ">",
        "gte": "≥",
        "eq": "="
    };

    let outstring = `<p>The probability of rolling ${inequalities[typeProb]} ${target} on a ${numDice}d${typeDice}+${mod} is <b>${prob}%</b></p>`;

    $("#output").html(outstring);

    updateHistogram(pdf, target, typeProb);

    updateStatistics(pdf, target, typeProb);
}

const updateHistogram = function(pdf, boundary, ineq){

    let colors = Object.keys(pdf).map( result => {return (inequality(result, boundary, ineq) ? 'rgba(222,45,38,0.8)' : 'rgba(204,204,204,1)')});

    let data = {
        x: Object.keys(pdf),
        y: Object.values(pdf),
        marker: {color: colors},
        type: 'bar'
    };

    let div = document.getElementById('histogram');      // for some reason this doesn't work as JQuery???

    let layout = { 

        title: 'Probability distribution of roll',
        bargap: 0.01,
        font: {size: 18}
      
      };
      
      
    let config = {responsive: true};

    Plotly.newPlot(div, [data], layout, config);
}

const updateStatistics = function(pdf, boundary, ineq){

    // let outString = "<tr><th>Result</th><th>Prob</th></tr>";
    let outString = "";

    for(let [x, p] of Object.entries(pdf)){
        let color = inequality(x, boundary, ineq) ? "table-primary" : "table-active";
        outString += `<tr class="${color}"><td>${x}</td><td>${p}</td></tr>`;
    }

    console.log(outString);

    $("#stats-data").html(outString);
}

$("#inputButton").on("click", calcProb);
$(document).ready(loadOptions);

