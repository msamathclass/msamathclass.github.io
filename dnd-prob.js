const init = function(event){
    event.preventDefault();

    let numDice = parseInt($("#numdice").val());
    let typeDice = parseInt($("#typedice").val());
    let mod = parseInt($("#modifier").val());
    let typeProb = parseInt($("#typeprob").val());
    let target = parseInt($("#target").val());

    let dice = [];

    for(let n = 0; n < numDice; n++){
        let outcomes = [];
        for(let d=0; d < typeDice; d++){
            outcomes.push(d+1+mod);
        }
        dice.push(outcomes);
    }

    let sampleSpace = [];

    for(let d = 0; d < dice.length; d++){
        for(let i = 0; i < dice[d].length; i++){
            
        }
    }

    $("#outputs").html
}

$("#inputButton").on("click", init);
// $(document).ready(loadOptions);

