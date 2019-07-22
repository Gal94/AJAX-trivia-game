//Variables
let score = 0;
let data, i = 0, correctIndex;
let regA = /(?:\&\#039\;)/g;
let regB = /(?:\&quot\;)/g;
let regC = /(?:\&amp\;)/g;
let regD = /(?:\&eacute\;)/g;
let regE = /(?:\&ouml\;)/g;//ö
let dict = {
    "General Knowledge": 9,
    "Entertainment: Video Games": 15,
    "Science: Computers": 18,
    "Celebrities": 26,
    "Art": 25,
    "Animals": 27
};
let categories = $(".category");
let difficulties = {
    "easy": 0,
    "medium": 1,
    "hard": 2
};

//DOM
categories.click(function () {
    let text = this.textContent;
    $.getJSON("https://opentdb.com/api.php?amount=10&category=" + dict[text] + "&type=multiple")
        .done(function (res) {
            data = res.results;
            /* Sort the questions by difficulty and set display for game mode*/
            data.sort(function (a, b) {
                let difA = difficulties[a.difficulty];
                let difB = difficulties[b.difficulty];

                if (difA > difB) {
                    return 1;
                } else if (difB > difA) {
                    return -1
                } else {
                    return 0;
                }
            });
            $("#helper").fadeOut("400",function(){
               $("#Game").fadeIn("500");
            });

            setQuestion(data, 0);
        })
        .catch(function () {
            console.log("Error");
        });
});
$(".answers").click(function () {
    if (this.textContent === $(".answers")[correctIndex].textContent) {
        score+=1;
        $(".score").text("Score: "+ score);
        i+=1;
        if (i !==10) {
            setQuestion(data, i);
        } else {
            endGame(true)
        }
    } else {
        console.log("Wrong answer");
        endGame(false)
    }
});

//functions
function random() {
    return Math.floor(Math.random() * 4);
}

//Set the question with 4 answers on the HTML page.
function setQuestion(questionsBank, i) {
    let answerButtons = $(".answers");
    //Display the question on the HTML
    let question = questionsBank[i].question;
    question = regexFix(question);
    $(".question").text(question);

    //Set correct answer button and assign the other 3 buttons the incorrect answers.
    correctIndex = random();
    answerButtons[correctIndex].textContent = regexFix(questionsBank[i].correct_answer);
    for (let j = 0, k = 0; j <= 3, k<3; j++) {
        if (j === correctIndex) {
            j++;
        }
        answerButtons[j].textContent = regexFix(questionsBank[i].incorrect_answers[k]);
        k++;
    }
}
//End Game scenario
function endGame(state){
    if(state){
        alert("You have won!")
    } else {
        alert(":(")
    }
}
//assign regex
function regexFix(sentence){
    return sentence.replace(regB, '"').replace(regA, "'").replace(regB, '"')
        .replace(regC, '&').replace(regD, 'é').replace(regE, 'ö');
}