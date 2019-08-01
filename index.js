//Add an infinite game mode.

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
let wrongAns = "<div class='end'><h3 class='question'>Wrong answer!<br>Better luck next time</h3>" +
               "<div class='container end-btns'><button class='yes-button'>Play Again</button></div></div>";
let rightAns = "<h3 class='question end'>You Won!</h3><div class='container end-btns'><button class='yes-button'>Play Again</button></div>";

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
            $("#helper").fadeOut(400,function(){
                   setQuestion(data, 0);
            });
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
//resets Game
$("body").on('click', '.yes-button' ,(function(){
    score = 0;
    i = 0;
    $(".end").fadeOut(300, function(){
        $(".score").text("Score: "+ score);
        $("#helper").fadeIn(400);
        $(".end").remove();
    });
}));

//functions
function random() {
    return Math.floor(Math.random() * 4);
}
//Set the question with 4 answers on the HTML page.
function setQuestion(questionsBank, i) {
    let answerButtons = $(".answers");
    //Display the question on the HTML
    let question = questionsBank[i].question;
    let answers = [];
    question = regexFix(question);
    //$(".question").text(question);//

    //Set correct answer button and assign the other 3 buttons the incorrect answers.
    correctIndex = random();
    answers[correctIndex] = regexFix(questionsBank[i].correct_answer);
    //answerButtons[correctIndex].textContent = regexFix(questionsBank[i].correct_answer);//
    for (let j = 0, k = 0; j <= 3, k<3; j++) {
        if (j === correctIndex) {
            j++;
        }
        //answerButtons[j].textContent = regexFix(questionsBank[i].incorrect_answers[k]);//
        answers[j] = regexFix(questionsBank[i].incorrect_answers[k]);
        k++;
    }
    boardFade(question, answers);
}
//End Game scenario
function endGame(state){
    if(state){
        $("#Game").fadeOut("300", function(){
            $(".bg").after(rightAns);
        });
    } else {
        $("#Game").fadeOut("300", function(){
            $(".bg").after(wrongAns);
        });
    }
}
//assign regex
function regexFix(sentence){
    return sentence.replace(regB, '"').replace(regA, "'").replace(regB, '"')
        .replace(regC, '&').replace(regD, 'é').replace(regE, 'ö');
}
//Fade question and answers
function boardFade(question, answers){
    $("#Game").fadeOut("400", function(){
        let answerButtons = $(".answers");
        $(".question").text(question);
        for (let i = 0; i < 4; i++){
            answerButtons[i].textContent =answers[i];
        }
        $("#Game").fadeIn("400");
    });
}