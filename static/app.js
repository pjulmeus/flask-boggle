tBody = document.querySelector('tbody')
tr = document.querySelectorAll('tr')
td = document.querySelectorAll('td')
arrTr = [Array.from(tr)]
let word = []
let score = 0 

$( document ).ready(function() {
    gameTimer()
    givingGameboardIds()
  })

function givingGameboardIds(){ 
table = document.getElementById("gameboard")
for (let x = 0, row; row = table.rows[x]; x++){
    console.log(row);
    for (let y = 0, col; col = row.cells[y]; y++) {
    col.setAttribute("ID", `${x}-${y}`)
    col.setAttribute("name", "letter")
  }  
}
}

tBody.addEventListener('click', function(e){
    e.preventDefault()
   word.push(e.target.innerText)
   console.log(word);
})

async function sendDate(){
        const rep = await axios.post("/game/check", {words : word, scores : score})
        let guess = rep.config.data.words;
        return guess
    }

async function getWordResult(){
    const rep = await axios.get("/game/json")
    const wordResult = rep.data
    console.log(wordResult.result)
    if (wordResult.result === "not-on-board"){
        return alert("Word not found on the boggle board")
    }
    if (wordResult.result === "not-word"){
        return prompt("THATS NOT A WORD")
    }
    if(wordResult.result === "ok") {
        let word = wordResult.result
        score += word.length
        console.log(score);
        return alert("Success!!! Word found on board!!!")
    }
}

$('form').on("submit" , function(e){
    e.preventDefault();
    sendDate()
    getWordResult()
    $('h2#score').text(`SCORE : ${score}`)
    word = [] 
});

let counter = 60;
function gameTimer(){
setInterval(function(){
  console.log(counter);
  $('h2#timer').text(`Timer : ${counter--}`)
  if (counter === 0) {
    console.log("GAMEOVER");
  }
}, 1000)
}