import React, {useState} from 'react'
import {decode} from 'html-entities'

export default function Question(
    {question, answers, correct, selected, selectAnswer, gradeQuiz}) {
    
    
    let answersHtml = answers.map((item, index) => {
        let styles 
        
        if (!gradeQuiz) {
            styles = {backgroundColor: item.isPicked ? '#caf0f8' : 'transparent'}
        } else {
            styles = {backgroundColor: 
                (item.answer === correct && selected === correct) ? '#94D7A2' : 
                (item.answer !== correct && item.isPicked) ?  '#94D7A2' : 
                (item.answer === correct) ? '#F8BCBC' : ''}
        }
        
        return (
            <span 
                className="answer"
                key={index}
                id={item.id}
                onClick={selectAnswer}
                style={styles}
                data-answer={item.answer}
                >
                {item.answer}
            </span>
        )
    })
    
    return (
        <div className="question-card">
            <h3>{decode(question)}</h3>
            {answersHtml}
        </div>
    )
}