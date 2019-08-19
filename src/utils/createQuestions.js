import {shuffle} from './';

const createQuestions = (questionList) => {
  questionList = shuffle(questionList);
  const ques = [];
  let qs = shuffle(questionList);
  for(let i = 0; i < questionList.length -3; i++) {
    const selected = qs.shift();
    const remaining = [...qs];
    const random_index = () => Math.floor(Math.random(qs.length));
    const otherChoices = [...remaining.splice(random_index(), 1),...remaining.splice(random_index(), 1),...remaining.splice(random_index(), 1)];
    const question = {
      id: i,
      flag: selected.flag,
      choices: shuffle([{name: selected.name, correct: true},...otherChoices.map(el => ({name: el.name, correct: false}))])
    };
    ques.push(question);
  }
  return ques;
}

export default createQuestions;