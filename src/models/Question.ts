// class Question {
//     id: Question;
//     text: string;

//     /// <summary>
//     /// Enropee
//     /// </summary>
//     public float PossibilityOfThisIsNext = 0.001f;
    
//     public int TimesAskedWhenThinkAbout(Db db, Answer answer)
//     {
//         return db.QuestionAskedWhenThinkAboutAnswer(this, answer);
//     }
    
//     public int ReactionCountWhenThinkAboutAnswer(Db db, Answer answer, Reaction reaction)
//     {
//         return db.QuestionReactionCountWhenThinkAboutAnswer(this,reaction, answer);
//     }

//     public bool HiddenFromUi = false;

//     public bool ShownOnlyForDoctors = false; 
// }

type Question = {
    id: number;
    text: string;
    hidden_from_ui?: boolean;
    show_only_for_doctors?: boolean;
    possibilityOfThisIsNext: number;
}

export default Question;