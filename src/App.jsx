import React, { useState, useEffect } from "react"
import uuid4 from "uuid4"
import {decode} from 'html-entities'
import Question from './components/Question.jsx'
import Blob_blue from './components/blob-blue'
import Blob_yellow from './components/blob-yellow'


export default function App() {
    const [questionsData, setQuestionsData] = useState([])
    const [gameSetup, setGameSetup] = useState(false)
    const [checkAnswer, setCheckAnswer] = useState(false)
    const [resetGame, setResetGame] = useState(0)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    
    useEffect(() => {
        fetch('https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple')
            .then(res => res.json())
            .then(data => {
                return setQuestionsData(data.results.map(item => {
                    let {question, correct_answer, incorrect_answers} = item 
                    
                    let answers = [...incorrect_answers, correct_answer]

                    shuffleAnswers(answers)    
    
                    let answersObj = answers.map((item, index) => {
                        return {
                            answer: decode(item),
                            isPicked: false,
                            id: index
                        }
                    })

                    return {
                        id: uuid4(),
                        question: question,
                        correct: correct_answer,
                        answers: answersObj,
                        selected: ''
                    }
                }))
            })
    },[resetGame])
    
    
    function shuffleAnswers(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    function clickAnswer(e, itemId) {
        let newQData = [...questionsData]
        let target = newQData.find(item => item.id == itemId)
        
        let newTarget = target.answers.map(answers => answers.id == e.target.id ? 
            {...answers, isPicked: !answers.isPicked} : {...answers, isPicked: false})
        
        target.answers = newTarget
        
        setQuestionsData(prevQuestions => prevQuestions.map(question => {
            return target.id == question.id ? 
                {...target, selected: `${e.target.dataset.answer}`} : question
        }))
    }
    
    function startGame() {
        setGameSetup(true)
    }
    
    function countCorrectAnswers() {
        setCheckAnswer(true)
        
        questionsData.map(item => item.correct === item.selected ? 
            setCorrectAnswers(prev => prev + 1) : '')
        console.log(questionsData)
        console.log(correctAnswers)
    }
    
    function reset() {
        setGameSetup(false)
        setCheckAnswer(false)
        setCorrectAnswers(0)
        setResetGame(prev => prev + 1)
    }
    
    let questionsHtml = questionsData.map((item, index) => {
        return (
            <Question 
                key={index}
                {...item}
                gradeQuiz={checkAnswer}
                selectAnswer={(e) => clickAnswer(e, item.id)}
            />
        )
    })
    
    return (
        <div>
            <Blob_yellow />
            <h1 className='title'>Quizzical</h1>
            {gameSetup ? 
                (
                    <div className='main'>
                        {questionsHtml}
                        { checkAnswer ? 
                            <div>
                                <p className='score'>Scored {correctAnswers} out of 5</p>
                                <button className='play-again-btn' onClick={reset}>Play Again?</button>
                            </div>
                             : 
                            (<button onClick={countCorrectAnswers}>Submit Answers!</button>)
                        }
                    </div>
                ) : 
                (
                    <button onClick={startGame}>Start Quiz!</button>
                )
            }
            <Blob_blue />
        </div>
    )
}