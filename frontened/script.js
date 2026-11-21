
const API = "http://localhost:3000/api";

const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authMessage = document.getElementById("authMessage");
const authButton = document.getElementById("authButton");
const authResult = document.getElementById("authResult");
const nameField = document.getElementById("nameField");
const switchAuth = document.getElementById("switchAuth");

let isSignup = false;
let selectedLanguage = "";
let selectedTopic = "";
let currentQuestions = [];

// LOGIN AUR SIGNUP SWITCH

switchAuth.addEventListener("click", () => {
    isSignup = !isSignup;

    authTitle.textContent = isSignup ? "Create Account" : "Login";

    authMessage.textContent = isSignup
        ? "Create your account to start learning."
        : "Welcome back! Login to continue learning.";

    authButton.textContent = isSignup ? "Sign Up" : "Login";
    nameField.classList.toggle("hidden", !isSignup);

    document.getElementById("name").required = isSignup;

    switchAuth.textContent = isSignup ? "Login" : "Sign Up";

    document.getElementById("switchText").firstChild.textContent =
        isSignup
            ? "Already have an account? "
            : "Don't have an account? ";

    authResult.textContent = "";
});


// SIGNUP AUR LOGIN BACKEND CONNECTION

authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    authResult.textContent = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (isSignup && !name) {
        authResult.textContent = "Please enter your name.";
        return;
    }

    if (password.length < 8) {
        authResult.textContent =
            "Password must contain at least 8 characters.";
        return;
    }

    authButton.disabled = true;

    try {
        const endpoint = isSignup ? "/signup" : "/login";

        const response = await fetch(API + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Request failed.");
        }

        const userName = result.user
            ? result.user.name
            : name;

        sessionStorage.setItem("cqUserName", userName);

        showDashboard(userName);

        authForm.reset();

    } catch (error) {
        authResult.textContent =
            error.message === "Failed to fetch"
                ? "Server se connection nahi ho raha. Backend start karo."
                : error.message;

    } finally {
        authButton.disabled = false;
    }
});


// DASHBOARD SHOW KARNA

function showDashboard(name) {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");

    document.getElementById("welcomeText").textContent =
        "Welcome, " + name + "!";

    window.scrollTo(0, 0);
}


// LOGOUT

document.getElementById("logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("cqUserName");

    authSection.classList.remove("hidden");
    appSection.classList.add("hidden");

    authForm.reset();
    authResult.textContent = "";

    isSignup = false;
    selectedLanguage = "";
    selectedTopic = "";
    currentQuestions = [];

    authTitle.textContent = "Login";
    authButton.textContent = "Login";

    nameField.classList.add("hidden");
    document.getElementById("name").required = false;

    switchAuth.textContent = "Sign Up";

    document.getElementById("switchText").firstChild.textContent =
        "Don't have an account? ";

    window.scrollTo(0, 0);
});


// LEARNING MATERIAL

const lessons = {

    Python: [
        {
            title: "Variables",
            theory: "Variables data store karne ke liye use hote hain.",
            code: 'name = "Sam"\nage = 18\nprint(name)'
        },
        {
            title: "If-Else",
            theory: "If-else conditions ke according decision leta hai.",
            code: 'age = 18\nif age >= 18:\n    print("Adult")\nelse:\n    print("Minor")'
        },
        {
            title: "Loops",
            theory: "Loops code ko baar-baar execute karte hain.",
            code: "for i in range(1, 6):\n    print(i)"
        },
        {
            title: "Functions",
            theory: "Function reusable code ka block hota hai.",
            code: 'def greet():\n    print("Hello")\n\ngreet()'
        }
    ],

    "C++": [
        {
            title: "Variables",
            theory: "Variables values store karte hain. int whole numbers ke liye use hota hai.",
            code: '#include <iostream>\nusing namespace std;\n\nint main() {\n    int age = 18;\n    cout << age;\n    return 0;\n}'
        },
        {
            title: "If-Else",
            theory: "If-else condition ke basis par code run karta hai.",
            code: 'if (age >= 18) {\n    cout << "Adult";\n} else {\n    cout << "Minor";\n}'
        },
        {
            title: "Loops",
            theory: "Loops instructions ko repeat karte hain.",
            code: 'for (int i = 1; i <= 5; i++) {\n    cout << i << endl;\n}'
        },
        {
            title: "Functions",
            theory: "Functions code ko reuse karne mein help karte hain.",
            code: 'void greet() {\n    cout << "Hello";\n}'
        }
    ]
};


// TOPIC-WISE QUIZ QUESTIONS

const quizData = {

    Python: {

        Variables: [
            {
                question: "Which symbol is used to assign a value in Python?",
                options: ["==", "=", "!=", ">"],
                correct: 1
            },
            {
                question: "Which data type is used for whole numbers in Python?",
                options: ["str", "int", "float", "bool"],
                correct: 1
            }
        ],

        "If-Else": [
            {
                question: "Which keyword is used to check a condition in Python?",
                options: ["for", "while", "if", "def"],
                correct: 2
            },
            {
                question: "Which keyword executes when the if condition is false?",
                options: ["else", "break", "continue", "return"],
                correct: 0
            }
        ],

        Loops: [
            {
                question: "Which loop is used to iterate over a sequence in Python?",
                options: ["if", "for", "switch", "def"],
                correct: 1
            },
            {
                question: "What is the output of range(1, 4)?",
                options: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3", "2, 3, 4"],
                correct: 0
            }
        ],

        Functions: [
            {
                question: "Which keyword is used to define a function in Python?",
                options: ["function", "def", "fun", "define"],
                correct: 1
            },
            {
                question: "Which keyword is used to return a value from a function?",
                options: ["print", "break", "return", "continue"],
                correct: 2
            }
        ]
    },


    "C++": {

        Variables: [
            {
                question: "Which data type is used for whole numbers in C++?",
                options: ["int", "char", "string", "bool"],
                correct: 0
            },
            {
                question: "Which symbol is used to assign a value in C++?",
                options: ["==", "=", "!=", "<"],
                correct: 1
            }
        ],

        "If-Else": [
            {
                question: "Which statement is used for decision making in C++?",
                options: ["for", "if", "cout", "return"],
                correct: 1
            },
            {
                question: "Which keyword executes when the if condition is false?",
                options: ["else", "break", "continue", "int"],
                correct: 0
            }
        ],

        Loops: [
            {
                question: "Which loop is commonly used when the number of iterations is known?",
                options: ["if", "for", "switch", "return"],
                correct: 1
            },
            {
                question: "Which keyword is used to exit a loop?",
                options: ["continue", "break", "int", "cout"],
                correct: 1
            }
        ],

        Functions: [
            {
                question: "What is a function in C++?",
                options: [
                    "A variable",
                    "A reusable block of code",
                    "A data type",
                    "A loop"
                ],
                correct: 1
            },
            {
                question: "Which keyword is used when a function does not return a value?",
                options: ["int", "char", "void", "float"],
                correct: 2
            }
        ]
    }
};


// LANGUAGE SELECT KARNE PAR TOPICS DIKHANA

document.querySelectorAll(".languageButton").forEach(button => {

    button.addEventListener("click", () => {

        selectedLanguage = button.dataset.language;
        selectedTopic = "";
        currentQuestions = [];

        document.getElementById("lessonHeading").textContent =
            selectedLanguage + " Lessons";

        document.getElementById("quizLanguage").textContent =
            selectedLanguage + " Quiz";

        const topicList = document.getElementById("topicList");
        const lessonContent = document.getElementById("lessonContent");
        const quizContent = document.getElementById("quizContent");

        topicList.replaceChildren();

        lessonContent.textContent =
            "Select a topic to read its lesson.";

        quizContent.textContent =
            "Open a lesson to start its quiz.";

        document.getElementById("quizResult").textContent = "";
        document.getElementById("submitQuiz").hidden = true;

        // Selected language ke topics show karna

        lessons[selectedLanguage].forEach(lesson => {

            const card = document.createElement("div");
            card.className = "card";

            const heading = document.createElement("h3");
            heading.textContent = lesson.title;

            const openButton = document.createElement("button");
            openButton.className = "topic-button";
            openButton.textContent = "Open Lesson";

            // OPEN LESSON BUTTON

            openButton.addEventListener("click", () => {

                selectedTopic = lesson.title;

                lessonContent.replaceChildren();

                const title = document.createElement("h3");
                title.textContent = lesson.title;

                const theory = document.createElement("p");
                theory.textContent = lesson.theory;

                const code = document.createElement("pre");
                code.textContent = lesson.code;

                lessonContent.append(title, theory, code);

                // Topic ka quiz load karna

                document.getElementById("quizLanguage").textContent =
                    selectedLanguage + " - " + selectedTopic + " Quiz";

                loadQuiz();

            });

            card.append(heading, openButton);
            topicList.appendChild(card);

        });

        document.getElementById("lessonSection").scrollIntoView({
            behavior: "smooth"
        });

    });

});


// QUIZ LOAD KARNA

function loadQuiz() {

    currentQuestions =
        quizData[selectedLanguage][selectedTopic] || [];

    const quizContent = document.getElementById("quizContent");

    quizContent.replaceChildren();

    document.getElementById("quizResult").textContent = "";
    document.getElementById("submitQuiz").hidden = true;

    if (currentQuestions.length === 0) {
        quizContent.textContent = "No questions available.";
        return;
    }

    currentQuestions.forEach((question, index) => {

        const box = document.createElement("div");
        box.className = "question";

        const heading = document.createElement("h3");

        heading.textContent =
            `${index + 1}. ${question.question}`;

        box.appendChild(heading);

        question.options.forEach((option, optionIndex) => {

            const label = document.createElement("label");
            const radio = document.createElement("input");

            radio.type = "radio";
            radio.name = "question" + index;
            radio.value = optionIndex;

            label.append(radio, document.createTextNode(option));

            box.appendChild(label);

        });

        quizContent.appendChild(box);

    });

    document.getElementById("submitQuiz").hidden = false;
}


// QUIZ SCORE CALCULATE KARNA

document.getElementById("submitQuiz").addEventListener("click", () => {

    if (!selectedLanguage || !selectedTopic || currentQuestions.length === 0) {
        return;
    }

    let score = 0;

    for (let i = 0; i < currentQuestions.length; i++) {

        const answer = document.querySelector(
            `input[name="question${i}"]:checked`
        );

        if (!answer) {

            document.getElementById("quizResult").textContent =
                "Please answer all questions.";

            return;
        }

        if (Number(answer.value) === currentQuestions[i].correct) {
            score++;
        }

    }

    document.getElementById("quizResult").textContent =
        `Your score: ${score} / ${currentQuestions.length}`;

    document.getElementById("submitQuiz").hidden = true;

});


// EXISTING SESSION CHECK KARNA

const savedName = sessionStorage.getItem("cqUserName");

if (savedName) {
    showDashboard(savedName);
}
