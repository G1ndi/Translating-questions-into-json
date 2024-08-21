document.addEventListener("DOMContentLoaded", function () {
  displayQuestions();

  document
    .getElementById("questionForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const question = document.getElementById("question").value;
      const correctAnswer = document.getElementById("correctAnswer").value;
      const wrongAnswer1 = document.getElementById("wrongAnswer1").value;
      const wrongAnswer2 = document.getElementById("wrongAnswer2").value;
      const wrongAnswer3 = document.getElementById("wrongAnswer3").value;

      const newQuestion = {
        Question: question,
        CorrectAnswer: correctAnswer,
        WrongAnswers: [wrongAnswer1, wrongAnswer2, wrongAnswer3],
      };

      let questions = JSON.parse(localStorage.getItem("questions")) || [];
      questions.push(newQuestion);
      localStorage.setItem("questions", JSON.stringify(questions));

      displayQuestions();
      document.getElementById("questionForm").reset();
    });

  document
    .getElementById("downloadJson")
    .addEventListener("click", downloadJson);

  function displayQuestions() {
    const questionsList = document.getElementById("questionsList");
    questionsList.innerHTML = "";

    const questions = JSON.parse(localStorage.getItem("questions")) || [];

    questions.forEach((questionData, index) => {
      const questionCard = document.createElement("div");
      questionCard.classList.add("card");

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const questionTitle = document.createElement("h5");
      questionTitle.textContent = `Вопрос: ${questionData.Question}`;

      const toggleButton = document.createElement("button");
      toggleButton.classList.add("btn", "btn-secondary");
      toggleButton.textContent = "Показать ответы";
      toggleButton.setAttribute("data-bs-toggle", "collapse");
      toggleButton.setAttribute("data-bs-target", `#collapse-${index}`);

      const answersDiv = document.createElement("div");
      answersDiv.classList.add("collapse");
      answersDiv.id = `collapse-${index}`;

      const answersList = document.createElement("ul");
      answersList.classList.add("list-group");

      const correctAnswerItem = document.createElement("li");
      correctAnswerItem.classList.add(
        "list-group-item",
        "list-group-item-success"
      );
      correctAnswerItem.textContent = `Правильный ответ: ${questionData.CorrectAnswer}`;
      answersList.appendChild(correctAnswerItem);

      questionData.WrongAnswers.forEach((wrongAnswer) => {
        const wrongAnswerItem = document.createElement("li");
        wrongAnswerItem.classList.add(
          "list-group-item",
          "list-group-item-danger"
        );
        wrongAnswerItem.textContent = `Неправильный ответ: ${wrongAnswer}`;
        answersList.appendChild(wrongAnswerItem);
      });

      answersDiv.appendChild(answersList);

      const cardButtons = document.createElement("div");
      cardButtons.classList.add("card-buttons");

      const editButton = document.createElement("button");
      editButton.classList.add("btn", "btn-warning");
      editButton.textContent = "Редактировать";
      editButton.addEventListener("click", function () {
        editQuestion(index);
      });

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger");
      deleteButton.textContent = "Удалить";
      deleteButton.addEventListener("click", function () {
        deleteQuestion(index);
      });

      cardButtons.appendChild(editButton);
      cardButtons.appendChild(deleteButton);

      cardBody.appendChild(questionTitle);
      cardBody.appendChild(toggleButton);
      cardBody.appendChild(answersDiv);
      cardBody.appendChild(cardButtons);

      questionCard.appendChild(cardBody);
      questionsList.appendChild(questionCard);
    });
  }

  function editQuestion(index) {
    const questions = JSON.parse(localStorage.getItem("questions"));
    const questionData = questions[index];

    document.getElementById("question").value = questionData.Question;
    document.getElementById("correctAnswer").value = questionData.CorrectAnswer;
    document.getElementById("wrongAnswer1").value =
      questionData.WrongAnswers[0];
    document.getElementById("wrongAnswer2").value =
      questionData.WrongAnswers[1];
    document.getElementById("wrongAnswer3").value =
      questionData.WrongAnswers[2];

    deleteQuestion(index);
  }

  function deleteQuestion(index) {
    let questions = JSON.parse(localStorage.getItem("questions"));
    questions.splice(index, 1);
    localStorage.setItem("questions", JSON.stringify(questions));
    displayQuestions();
  }

  function downloadJson() {
    const questions = JSON.parse(localStorage.getItem("questions")) || [];
    const jsonStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "questions.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
});
