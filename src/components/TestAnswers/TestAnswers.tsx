'use client'

import Db from "@/logic/db";
import Answer from "@/models/Answer";
import { useState } from "react";

export const TestAnswers = ({db}: {db: Db}) => {
    const [answers, setAnswers] = useState<Answer[]>([])
    
    return (
    <div>
        <div>
            <button
                onClick={async () => {
                    const answrs = await db.AnswersGetAll();
                    setAnswers(answers);
                }}
            >show questions</button>
        </div>
        <pre>{JSON.stringify(answers, null, 3)}</pre>
    </div>
    );
}