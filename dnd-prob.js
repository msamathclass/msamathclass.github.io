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
    
    switch(typeProb){
        case "lt": 
            for(let [key, value] of Object.entries(pdf)){
                (parseInt(key) < target) ? prob += value : prob += 0;
            }
            break;
        case "lte":
            for(let [key, value] of Object.entries(pdf)){
                (parseInt(key) <= target) ? prob += value : prob += 0;
            }
            break;
        case "gt": 
            for(let [key, value] of Object.entries(pdf)){
                (parseInt(key) > target) ? prob += value : prob += 0;
            }
            break;
        case "gte":
            for(let [key, value] of Object.entries(pdf)){
                (parseInt(key) >= target) ? prob += value : prob += 0;
            }
            break;
        case "eq": 
            for(let [key, value] of Object.entries(pdf)){
                (parseInt(key) == target) ? prob += value : prob += 0;
            }
            break;
    }

    let outstring = `<p>The probability of rolling ${typeProb} ${target} on a ${numDice}d${typeDice}+${mod} is <b>${prob}</b></p>`;

    $("#output").html(outstring);

    updateHistogram(pdf);
}

const updateHistogram = function(pdf){
    let event = Object.keys(pdf).map(x => {return (x)})
    let data = {
        x: parseInt(Object.keys(pdf)),
        y: Object.values(pdf),
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

$("#inputButton").on("click", calcProb);
$(document).ready(loadOptions);

