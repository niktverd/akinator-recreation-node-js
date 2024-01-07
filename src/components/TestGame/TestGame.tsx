'use client'

import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import Answer from "@/models/Answer";
import Question from "@/models/Question";
import { Debug } from "../Debug/Debug";
import { GameHistory } from "@/logic/db";
import { ApriorAnswerPossibilityType } from "@/common/types";

import {ReactionEnt} from '../../models/Reaction';
import { Algorithm, calcPossibilities } from "@/logic/common";
import Game from "@/models/Game";

const apriorAnswerPossibilityType: ApriorAnswerPossibilityType = ApriorAnswerPossibilityType.Intelligent;
// const fuzz = new Fuzz();


export const TestGame = () => {
    const [userId] = useState(Math.round(Math.random() * 9999999))
    const [game, setGame] = useState<Game | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [questionsAll, setQuestionsAll] = useState<Question[]>([]);
    const [questionsNotAsked, setQuestionsNotAsked] = useState<Question[]>([]);
    const [answersAll, setAnswersAll] = useState<Answer[]>([]);
    const [questionAndReactionHistory, setQuestionAndReactionHistory] = useState<GameHistory>({});
    const [gamesCount, setGamesCount] = useState(0);
    const [possibleAnswers, setPossibleAnswers] = useState<Answer[]>([]);
    // console.log(Object.keys(ReactionEnt));

    const debugElement = useMemo(()=> {
        return (
            <div>
                <h3>Debug</h3>
                <Debug title="Questions" object={questionsAll} />
                <Debug title="Answers" object={answersAll} />
                <Debug title="Question And Reaction History" object={questionAndReactionHistory} />
                <Debug title="Current question" object={{currentQuestion}} />
                <Debug title="questionsNotAsked" object={questionsNotAsked} />
                <Debug title="possibleAnswers" object={possibleAnswers} />
            </div>
        ) as JSX.Element;
    }, [
        answersAll,
        currentQuestion,
        questionAndReactionHistory,
        questionsAll,
        questionsNotAsked,
        possibleAnswers,
    ]);

    useEffect(() => {
        // console.log('setQuestionsNotAsked', questionsAll, questionAndReactionHistory);
        setQuestionsNotAsked(questionsAll.filter((question) => {
            // console.log('questionAndReactionHistory[question.id]', questionAndReactionHistory[question.id], question.id);
            return !(question.id in questionAndReactionHistory);
        }));
    }, [questionAndReactionHistory, questionsAll]);

    useEffect(() => {
        if (questionsNotAsked.length) {
            setCurrentQuestion(questionsNotAsked[0]);
        }
    }, [questionsNotAsked]);

    useEffect(() => {
        const f = async () => {
            const [questions, answers] = await calcPossibilities({
                answersAll,
                questionsNotAsked,
                apriorAnswerPossibilityType,
                gamesCount,
                questionsAll,
                questionAndReactionHistory,
            });
            const mostPossibleQuestion = questions?.sort((a, b) => b.possibility_of_this_is_next - a.possibility_of_this_is_next)[0];
            setCurrentQuestion(mostPossibleQuestion as Question);
            const mostPossibleAnswers = answers?.sort((a, b) => b.possibility - a.possibility);
            setPossibleAnswers((mostPossibleAnswers?.slice(0,3) || []) as Answer[]);
        }

        f();
    }, [answersAll, gamesCount, questionAndReactionHistory, questionsAll, questionsNotAsked]);

    const answerOnQuestion = useCallback((question: Question, reaction_id: number) => {
        setQuestionAndReactionHistory({
            ...questionAndReactionHistory,
            [question.id]: reaction_id,
        });
    }, [questionAndReactionHistory]);

    console.log(currentQuestion);
    if (!game) {
        return <div>
            <div>
                {/* Game type selector */}
                {/* 
                    public apriorAnswerPossibilityType: ApriorAnswerPossibilityType = ApriorAnswerPossibilityType.Intelligent;
                 */}
            </div>
            <div>
                <button
                    onClick={async () => {
                        setQuestionsAll([]);
                        setAnswersAll([]);
                        const [quests, answs, gh, gameEnt] = await Promise.all([
                            axios.get('/api/questions'),
                            axios.get('/api/answers'),
                            axios.get('/api/games-history?game_count=1'),
                            axios.post('/api/games', {
                                user_id: userId,
                                is_finished: false,
                                is_succeed: false,
                            }),
                        ]);
                        // const quests = await axios.get('/api/questions');
                        // const answs = await axios.get('/api/answers');
                        // axios.get('/api/questions');
                        setGame(gameEnt.data as Game);
                        setQuestionsAll(quests.data as Question[]);
                        setCurrentQuestion(quests.data[0] as Question);
                        setAnswersAll(answs.data as Answer[]);
                        setGamesCount(gh.data.gamesCount);
                    }}
                >
                    Start
                </button>
            </div>
            {debugElement}
        </div>
    }

    return (
        <div>
            {currentQuestion && <div id="game">
                <div>Question: <b>{currentQuestion.text}</b></div>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    {Object.entries(ReactionEnt).filter(([, value]) => typeof value === 'number').map(([reactionName, reactionId]) => {
                        return <button
                            key={reactionName}
                            onClick={async () => {
                                await axios.post('/api/game-details', {
                                    game_id: game.id,
                                    question_id: currentQuestion.id,
                                    reaction_id: reactionId,
                                    algorithm: Algorithm.SaveGameDetails,
                                });
                                answerOnQuestion(currentQuestion, reactionId as number)
                            }}
                        >{reactionName}</button>
                    })}
                </div>
            </div>}
            <div>
            {/* answers */}
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {possibleAnswers.map((answ) => {
                return <div key={answ.id} style={{padding: 5, margin: 5, backgroundColor: 'lightgreen'}}>
                    {answ.text} {answ.possibility.toFixed(4)}
                </div>
            })}
            </div>
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                {answersAll.sort((a, b) => (a.possibility || 0) - (b.possibility || 0) ).map((answ) => {
                    return <div
                        key={answ.id}
                        style={{
                            margin: 3,
                            padding: 5,
                            border: '1px solid grey',
                        }}
                    >
                        {/* <div>{answ.text} {answ.possibility}</div> */}
                        <button
                            onClick={async () => {
                                // finish game
                                // save game
                                // save answer
                                const [gameHistory, gameEnt] = await Promise.all([
                                    // axios.get('/api/questions'),
                                    // axios.get('/api/answers'),
                                    // axios.get('/api/games-history'),
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
                                console.log({
                                    title: 'Завершение игры',
                                    gameEnt,
                                    gameHistory,
                                })
                                setGame(null);
                            }}
                        >
                            {answ.text} ({answ.possibility})
                        </button>
                    </div>
                })}
            </div>

            </div>
            {debugElement}
        </div>
    );
    // return <div>
    //     empty
    // </div>
}
