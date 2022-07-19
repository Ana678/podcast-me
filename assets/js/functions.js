const { initializeApp, database } = firebase;

const app = initializeApp({
    databaseURL: 'https://podcast-me-default-rtdb.firebaseio.com',
});

const db = database();
const questionsRef = db.ref('/questions');

const questionsSection = document.getElementById('FAQ');
const questionAlert = document.getElementById('question-alert');
const questionAlertWrapper = document.getElementById('question-alert-wrapper');
const questionsArea = document.getElementById('questions');
const questionButton = document.getElementById('question-button');
const questionInput = document.getElementById('question-input');
const submitQuestionButton = document.getElementById('submit-question-button');
const answerAlert = document.getElementById('answer-alert');
const answerAlertWrapper = document.getElementById('answer-alert-wrapper');
const answerAlertQuestion = document.getElementById('question');
const answerContent = document.getElementById('answer');
const readAnswerButton = document.getElementById('read-answer-button');

const renderQuestion = (id, data) => {
    const questionElement = document.createElement('button');
    questionElement.id = id;
    questionElement.classList.add('question-div');
    questionElement.onclick = () => {
        answerAlertQuestion.textContent = data.content;
        answerContent.textContent = data.answer;
        answerAlert.classList.add('open');
    };

    const questionContent = document.createElement('p');
    questionContent.classList.add('question-content');
    questionContent.textContent = data.content;

    if (data.answer === '') {
        questionElement.classList.add('hidden');
    }

    questionElement.appendChild(questionContent);

    questionsArea.appendChild(questionElement);
};

const updateQuestion = (id, data) => {
    const questionElement = document.getElementById(id);
    questionElement.onclick = () => {
        answerAlertQuestion.textContent = data.content;
        answerContent.textContent = data.answer;
        answerAlert.classList.add('open');
    };

    const questionContent = questionElement.childNodes.item(0);
    questionContent.textContent = data.content;
    

    if (data.answer === '') {
        questionElement.classList.add('hidden');
    } else {
        questionElement.classList.remove('hidden');
    }
};

const deleteQuestion = (id) => {
    const questionElement = document.getElementById(id);

    questionsSection.removeChild(questionElement);
}

questionsRef.on('child_added', data => {
    renderQuestion(data.key, data.val());
});

questionsRef.on('child_changed', data => {
    updateQuestion(data.key, data.val());
});

questionsRef.on('child_removed', data => {
    deleteQuestion(data.key);
});

questionButton.addEventListener('click', () => {
    questionAlert.classList.add('open');
});

questionAlertWrapper.addEventListener('click', e => {
    e.stopPropagation();
});

questionAlert.addEventListener('click', () => {
    questionAlert.classList.remove('open');
});

submitQuestionButton.addEventListener('click', () => {
    const question = questionInput.value.trim();

    
    if (question !== '') {
        questionInput.value = '';

        questionAlert.classList.remove('open');

        const newQuestion = questionsRef.push();

        newQuestion.set({
            content: question,
            answer: '',
        });
    }
});

readAnswerButton.addEventListener('click', () => {
    answerAlert.classList.remove('open');
});

answerAlertWrapper.addEventListener('click', e => {
    e.stopPropagation();
});

answerAlert.addEventListener('click', () => {
    answerAlert.classList.remove('open');
});


$('.header a[href^="#"]').on('click', function(e) {
    e.preventDefault();
    var id = $(this).attr('href'),
    targetOffset = $(id).offset().top;
      
    $('html, body').animate({ 
      scrollTop: targetOffset
    }, 500);
});

$('.page-up').on('click', function(e) {
    e.preventDefault();
    var id = $(this).attr('href'),
    targetOffset = $(id).offset().top;
      
    $('html, body').animate({ 
      scrollTop: targetOffset
    }, 500);
});

$(window).scroll(function () {
	if ($(this).scrollTop() > $(window).height()) {
		$(".page-up > span").attr("style", "display: block");
	} else {
        $(".page-up > span").attr("style", "display: none");
	}      
});