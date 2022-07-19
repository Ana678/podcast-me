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

const renderQuestion = (text) => {
    const questionElement = document.createElement('button');
    questionElement.classList.add('question-div');

    const questionContent = document.createElement('p');
    questionContent.classList.add('question-content');
    questionContent.textContent = text;

    questionElement.appendChild(questionContent);

    questionsArea.appendChild(questionElement);
};

questionsRef.on('child_added', data => {
    renderQuestion(data.val().content);
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