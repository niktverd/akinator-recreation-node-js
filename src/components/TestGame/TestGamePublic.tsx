'use client'

import axios from "axios";
import { useState } from "react";
import Answer from "@/models/Answer";
import Question from "@/models/Question";
import { ApriorAnswerPossibilityType } from "@/common/types";

import {ReactionEnt} from '../../models/Reaction';
import Game from "@/models/Game";
import { Algorithm } from "@/common/constants";

import s from './TestGamePublic.module.css';

const apriorAnswerPossibilityType: ApriorAnswerPossibilityType = ApriorAnswerPossibilityType.Intelligent;

export const TestGamePublic = () => {
    const [userId] = useState(Math.round(Math.random() * 9999999))
    const [game, setGame] = useState<Game | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [possibleAnswers, setPossibleAnswers] = useState<Answer[]>([]);
    const [gameQuestionReactionHistoryLength, setGameQuestionReactionHistoryLength] = useState<number>(0);
    const [possibleAnswersString, setPossibleAnswersString] = useState<string>('');

    if (!game) {
        return <div>
            <div>
                <button
                    className={s.button}
                    onClick={async () => {
                        const [gameEnt] = await Promise.all([
                            axios.post('/api/games', {
                                user_id: userId,
                                is_finished: false,
                                is_succeed: false,
                            }),
                        ]);
                        setGame(gameEnt.data as Game);

                        const {data: {question, threeTopAnswers, gameQuestionReactionHistoryLength}} = await axios.post('/api/game-api', {
                            game_id: gameEnt.data.id,
                            question_id: 0,
                            reaction_id: 0,
                            apriorAnswerPossibilityType,
                            mostPossibleAnswerId: possibleAnswers?.[0]?.id,
                        });

                        setCurrentQuestion(question);
                        setPossibleAnswers(threeTopAnswers);
                        setGameQuestionReactionHistoryLength(gameQuestionReactionHistoryLength);
                        setPossibleAnswersString(threeTopAnswers.map((item: Answer) => item.text).join(', '))
                    }}
                >
                    Start
                </button>
            </div>
        </div>
    }

    return (
        <div>
            <div>
                <p>Что можно загадать:</p>
                <p>{possibleAnswersString}</p>

            </div>
            {currentQuestion && <div id="game">
                <div
                    className={s.question}
                >Question: <b>{currentQuestion.text}</b></div>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    {Object.entries(ReactionEnt).filter(([, value]) => typeof value === 'number').map(([reactionName, reactionId]) => {
                        return <button
                            className={s.button}

                            key={reactionName}
                            onClick={async () => {
                                await axios.post('/api/game-details', {
                                    game_id: game.id,
                                    question_id: currentQuestion.id,
                                    reaction_id: reactionId,
                                    algorithm: Algorithm.SaveGameDetails,
                                });

                                const {data: {question, threeTopAnswers, gameQuestionReactionHistoryLength}} = await axios.post('/api/game-api', {
                                    game_id: game.id,
                                    question_id: currentQuestion.id,
                                    reaction_id: reactionId,
                                    apriorAnswerPossibilityType,
                                    mostPossibleAnswerId: possibleAnswers?.[0]?.id,
                                });
                            setGameQuestionReactionHistoryLength(gameQuestionReactionHistoryLength);

                                setCurrentQuestion(question);
                                setPossibleAnswers(threeTopAnswers);
                            }}
                        >{reactionName}</button>
                    })}
                </div>
            </div>}
            {gameQuestionReactionHistoryLength > 7 ? <div>
                <div className={s.question}>Answers:</div>
                {/* answers */}
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {possibleAnswers.map((answ, index) => {
                    return <button
                        className={`${s.button} ${s.answer} ${s[`answer-${index}`]}`}
                        key={answ.id}
                        style={{padding: 5, margin: 5, backgroundColor: 'lightgreen'}}
                        onClick={async () => {
                            const [_gameHistory, _gameEnt] = await Promise.all([
                                axios.post('/api/games-history', {
                                    game_id: game.id,
                                    user_id: userId,
                                    answer_id: answ.id,
                                }),
                                axios.patch('/api/games', {
                                    id: game.id,
                                    user_id: userId,
                                    is_finished: true,
                                    is_succeed: true,
                                }),
                            ]);
                            setGame(null);
                        }}
                    >
                        {answ.text} {answ.possibility ? answ.possibility.toFixed(4) : null}
                    </button>
                })}
                </div>
            </div> : null}
        </div>
    );
}
