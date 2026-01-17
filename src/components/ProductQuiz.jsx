import { useState } from 'react';

const quizQuestions = [
  {
    id: 1,
    question: "What is your primary health goal?",
    options: [
      { value: "energy", label: "Boost Energy & Vitality", tags: ["energy", "vitality", "b-vitamins"] },
      { value: "balance", label: "Hormonal Balance & Wellness", tags: ["balance", "hormonal", "women", "libido"] },
      { value: "immunity", label: "Immune System Support", tags: ["immunity", "vitamin-c", "zinc"] },
      { value: "stress", label: "Stress & Anxiety Relief", tags: ["stress", "ashwagandha", "adaptogen"] },
      { value: "sleep", label: "Better Sleep Quality", tags: ["sleep", "melatonin", "magnesium"] }
    ]
  },
  {
    id: 2,
    question: "What is your age range?",
    options: [
      { value: "18-30", label: "18-30 years", tags: ["young-adult"] },
      { value: "31-45", label: "31-45 years", tags: ["adult"] },
      { value: "46-60", label: "46-60 years", tags: ["mature"] },
      { value: "60+", label: "60+ years", tags: ["senior"] }
    ]
  },
  {
    id: 3,
    question: "What is your gender?",
    options: [
      { value: "female", label: "Female", tags: ["women", "female"] },
      { value: "male", label: "Male", tags: ["men", "male"] },
      { value: "other", label: "Prefer not to say", tags: [] }
    ]
  },
  {
    id: 4,
    question: "Do you have any specific concerns?",
    multiple: true,
    options: [
      { value: "low-energy", label: "Low Energy/Fatigue", tags: ["energy", "fatigue", "b-vitamins"] },
      { value: "poor-sleep", label: "Poor Sleep", tags: ["sleep", "melatonin"] },
      { value: "stress", label: "High Stress", tags: ["stress", "ashwagandha"] },
      { value: "libido", label: "Low Libido", tags: ["libido", "arousal", "maca"] },
      { value: "focus", label: "Lack of Focus", tags: ["focus", "cognitive", "ginseng"] },
      { value: "immunity", label: "Weak Immunity", tags: ["immunity", "vitamin-c"] }
    ]
  },
  {
    id: 5,
    question: "What is your activity level?",
    options: [
      { value: "sedentary", label: "Sedentary (little to no exercise)", tags: ["sedentary"] },
      { value: "light", label: "Lightly Active (1-3 days/week)", tags: ["light-active"] },
      { value: "moderate", label: "Moderately Active (3-5 days/week)", tags: ["moderate-active"] },
      { value: "very", label: "Very Active (6-7 days/week)", tags: ["very-active"] }
    ]
  }
];

export default function ProductQuiz({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multiSelectAnswers, setMultiSelectAnswers] = useState([]);

  const question = quizQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === quizQuestions.length - 1;

  const handleAnswer = (value, tags) => {
    if (question.multiple) {
      const newAnswers = multiSelectAnswers.includes(value)
        ? multiSelectAnswers.filter(v => v !== value)
        : [...multiSelectAnswers, value];
      setMultiSelectAnswers(newAnswers);
    } else {
      setAnswers({ ...answers, [question.id]: { value, tags } });
    }
  };

  const handleNext = () => {
    if (question.multiple) {
      const selectedOptions = question.options.filter(opt => 
        multiSelectAnswers.includes(opt.value)
      );
      const allTags = selectedOptions.flatMap(opt => opt.tags);
      setAnswers({ ...answers, [question.id]: { value: multiSelectAnswers, tags: allTags } });
      setMultiSelectAnswers([]);
    }

    if (isLastQuestion) {
      const allTags = Object.values(answers).flatMap(a => a.tags);
      onComplete({ answers, tags: allTags });
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const canProceed = question.multiple 
    ? multiSelectAnswers.length > 0 
    : answers[question.id];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </span>
          <span className="text-sm text-blue-600 font-medium">
            {Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">{question.question}</h2>

      <div className="space-y-3 mb-8">
        {question.options.map((option) => {
          const isSelected = question.multiple 
            ? multiSelectAnswers.includes(option.value)
            : answers[question.id]?.value === option.value;

          return (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value, option.tags)}
              className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  isSelected ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className="font-medium">{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {question.multiple && (
        <p className="text-sm text-gray-500 mb-4">Select all that apply</p>
      )}

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestion === 0}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLastQuestion ? 'Get Recommendations' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
