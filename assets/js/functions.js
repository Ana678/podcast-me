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

const avaliationsRef = db.ref('/avaliations');

const avaliationsValue = {};

avaliationsRef.on('value', snapshot => {
    const data = snapshot.val();

    Object.assign(avaliationsValue, data);

    Object.entries(data).forEach(([key, value]) => {
        if (key === 'total') {
            return;
        }

        const avaliation = document.getElementById(`${key}-avaliation`);

        avaliation.setAttribute('style', `width: ${value * 10}%;`);
    });
});

const avaliateButton = document.getElementById('avaliate-button');
const avaliateAlert = document.getElementById('avaliate-alert');
const avaliateAlertWrapper = document.getElementById('avaliate-alert-wrapper');

avaliateButton.addEventListener('click', () => {
    avaliateAlert.classList.add('open');
});

avaliateAlertWrapper.addEventListener('click', e => {
    e.stopPropagation();
});

avaliateAlert.addEventListener('click', () => {
    avaliateAlert.classList.remove('open');
});

const avaliationSteps = avaliateAlertWrapper.getElementsByClassName('avaliation-step');

const avaliation = JSON.parse(localStorage.getItem('avaliation')) || {};

for (let i = 0; i < avaliationSteps.length; i++) {
    const step = avaliationSteps.item(i);

    const grades = step.getElementsByClassName('grades').item(0);

    for (let j = 0; j <= 10; j++) {
        const gradeButton = document.createElement('button');
        gradeButton.id = `${step.id}-${j}`;
        gradeButton.textContent = j;
        gradeButton.classList.add('grade-button');

        if (avaliation[step.id] === j) {
            gradeButton.classList.add('selected');
        }

        gradeButton.addEventListener('click', () => {
            const prev = document.getElementById(`${step.id}-${avaliation[step.id]}`);

            if (prev) {
                prev.classList.remove('selected');
            }

            avaliation[step.id] = j;
            
            gradeButton.classList.add('selected');
        });

        grades.appendChild(gradeButton);
    }
}

const sendAvaliationButton = document.getElementById('send-avaliation-button');

sendAvaliationButton.addEventListener('click', () => {
    if (
        avaliation.methodology !== undefined &&
        avaliation.dificulty !== undefined &&
        avaliation.general !== undefined
    ) {
        const oldAvaliation = JSON.parse(localStorage.getItem('avaliation'));

        if (oldAvaliation) {
            Object.entries(avaliation).forEach(([key, value]) => {
                const prev = avaliationsValue[key]*avaliationsValue.total;

                avaliationsValue[key] = (prev - oldAvaliation[key] + avaliation[key])/avaliationsValue.total;
            });
        } else {
            Object.entries(avaliation).forEach(([key, value]) => {
                const prev = avaliationsValue[key]*avaliationsValue.total;
    
                avaliationsValue[key] = (prev + value)/(avaliationsValue.total + 1);
            });
    
            avaliationsValue.total = avaliationsValue.total + 1;
        }

        avaliationsRef.set(avaliationsValue);

        localStorage.setItem('avaliation', JSON.stringify(avaliation));

        avaliateAlert.classList.remove('open');
    }
});