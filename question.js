const questions = [
    {
        title: "Commonly used data types DO NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        title: "The condition in an if / else statement is enclosed within ____.",
        choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
        answer: "parentheses"
    },
    {
        title: "Arrays in Javascript can be used to store _____.",
        choices: ["numbers and strings", "other arrays", "booleans","all of the above"],
        answer : "all of the above"
    }
];


$(function () {

    let score = $('#score');
    let end = $('#end');
    let time = $('#time');
    let start = $('#start');
    let question = $('#question');
    let startBtn = $('#start-btn');
    let final = $('#final');
    let finalSubmit = $('#finalSubmit');
    let finalInput = $('#finalInput');
    let timeCount = questions.length * 10;
    let curentQuestion = 0;
    let interval;


    //history

    let history = $('#history');
    let back = $('#back');
    let clearHistory = $('#clearHistory');
    let historyArray = [];
    localStorage.setItem('score', JSON.stringify([]));
    getHistory = ()=>{
        $('#score-box').empty();
        if (localStorage.getItem('score')){
            historyArray = JSON.parse(localStorage.getItem('score'));
            historyArray.sort((a, b) => b.score - a.score);
        }
        historyArray.forEach((item, index) => {
            let itemscore = $(`<div class="score-item">${index + 1}. ${item.name} <span class="s-score">${item.score}</span></div>`);
            $('#score-box').append(itemscore);
        })
    };

    getHistory();

    score.on('click', function () {
        history.addClass('active');
    });

    back.on('click', function () {
        history.removeClass('active');
    });

    clearHistory.on('click', function () {
        localStorage.setItem('score', JSON.stringify([]));
        getHistory();
    });


    //end history


    //start quiz

    function startQuiz() {
        start.addClass('fade');
        question.addClass('active');
        nextQuestion(curentQuestion);
    }

    function nextQuestion(number) {
        if (number <= questions.length-1){
            $('#question-title').text(questions[number].title);
            $('#answer-btn').empty();

            questions[number].choices.forEach((item,index) => {
                let answer = $(`<button class="answer">${index + 1}. ${item}</button>`);
                $('#answer-btn').append(answer);
            });
        } else {
            question.removeClass('active');
            end.addClass('active');
            clearInterval(interval);
            if (timeCount < 0) {
                time.text(0);
                final.text(0);
            } else {
                final.text(timeCount);
                time.text(timeCount)
            }
        }
    }

    $(document).on('click','.answer', function () {
        if (this.innerText.slice(3,this.innerText.length) === questions[curentQuestion].answer){
            succsessSound();
        } else {
            errorSound();
            timeCount -= 10;
            if (timeCount < 0) {
                time.text(0);
                final.text(0);
            }
        }
        curentQuestion++;
        nextQuestion(curentQuestion);
    });
    startBtn.on('click', function () {
        startQuiz();
        interval = setInterval(function () {
            if (timeCount <= 0) {
                timeCount = 0;
                return
            }
            timeCount--;
            time.text(timeCount);
        }, 1000)
    });

    //end start quiz


    //finish

    finalSubmit.on('click', function () {
        if (timeCount < 0) {
            timeCount = 0
        }
        if (finalInput.val()){
            historyArray.push({name: finalInput.val(), score: timeCount});
            finalInput.val('');
            localStorage.setItem('score', JSON.stringify(historyArray));
            history.addClass('active');
            getHistory();
        }
        end.removeClass('active');
        start.removeClass('fade');
        curentQuestion = 0;
        time.text(0);
        timeCount = questions.length * 10;
    });
    //   end finish

    sound

    function succsessSound() {
        var audio = new Audio('./audio/325112__fisch12345__success.wav');
        audio.play();
    }
    function errorSound() { 
        var audio = new Audio('./audio/478191__jonnyruss01__beep-error-1.wav');
        audio.play();
    }

    //end sound
});
