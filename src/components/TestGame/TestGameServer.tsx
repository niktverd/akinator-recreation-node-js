'use client'

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Answer from "@/models/Answer";
import Question from "@/models/Question";
import { Debug } from "../Debug/Debug";
import { ApriorAnswerPossibilityType } from "@/common/types";

import {ReactionEnt} from '../../models/Reaction';
import Game from "@/models/Game";
import { Algorithm } from "@/common/constants";

const apriorAnswerPossibilityType: ApriorAnswerPossibilityType = ApriorAnswerPossibilityType.Intelligent;

export const TestGameServer = () => {
    const [userId] = useState(Math.round(Math.random() * 9999999))
    const [game, setGame] = useState<Game | null>(null)
    const [reactions, setReactions] = useState<any[]>([])
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    // const [questionsAll, setQuestionsAll] = useState<Question[]>([]);
    // const [questionsNotAsked, setQuestionsNotAsked] = useState<Question[]>([]);
    const [answersAll, setAnswersAll] = useState<Answer[]>([]);
    // const [questionAndReactionHistory, setQuestionAndReactionHistory] = useState<GameHistory>({});
    // const [gamesCount, setGamesCount] = useState(0);
    const [possibleAnswers, setPossibleAnswers] = useState<Answer[]>([]);

    const debugElement = useMemo(()=> {
        return (
            <div>
                <h3>Debug</h3>
                <Debug title="Current question" object={{currentQuestion}} />
                <Debug title="possibleAnswers" object={possibleAnswers} />
            </div>
        ) as JSX.Element;
    }, [
        currentQuestion,
        possibleAnswers,
    ]);


    useEffect(() => {
        const f = async () => {
        }

        f();
    }, [answersAll]);


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
                        // setQuestionsAll([]);
                        // setAnswersAll([]);
                        const [answs, gameEnt] = await Promise.all([
                            axios.get('/api/answers'),
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
                        // setQuestionsAll(quests.data as Question[]);
                        // setCurrentQuestion(quests.data[0] as Question);
                        setAnswersAll(answs.data as Answer[]);
                        // setGamesCount(gh.data.gamesCount);

                        const {data: {question, threeTopAnswers, reactions}} = await axios.post('/api/game-api', {
                            game_id: gameEnt.data.id,
                            question_id: 0,
                            reaction_id: 0,
                            apriorAnswerPossibilityType,
                            mostPossibleAnswerId: possibleAnswers?.[0]?.id,
                        });

                        setCurrentQuestion(question);
                        setPossibleAnswers(threeTopAnswers);
                        setReactions(reactions);
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
                    {reactions.map((reaction) => {
                        return <button
                            key={reaction.id}
                            onClick={async () => {
                                await axios.post('/api/game-details', {
                                    game_id: game.id,
                                    question_id: currentQuestion.id,
                                    reaction_id: reaction.id,
                                    algorithm: Algorithm.SaveGameDetails,
                                });

                                const {data: {question, threeTopAnswers, reactions}} = await axios.post('/api/game-api', {
                                    game_id: game.id,
                                    question_id: currentQuestion.id,
                                    reaction_id: reaction.id,
                                    apriorAnswerPossibilityType,
                                    mostPossibleAnswerId: possibleAnswers?.[0]?.id,
                                });

                                setCurrentQuestion(question);
                                setPossibleAnswers(threeTopAnswers);
                                setReactions(reactions);
                            }}
                        >{reaction.slug}</button>
                    })}
                </div>
            </div>}
            <div>
            {/* answers */}
            <div style={{display: 'flex', flexWrap: 'wrap'}}>
            {possibleAnswers.map((answ) => {
                return <div key={answ.id} style={{padding: 5, margin: 5, backgroundColor: 'lightgreen'}}>
                    {answ.text} {answ.possibility ? answ.possibility.toFixed(4) : null}
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
