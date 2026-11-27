const QUESTION_BANK = {
  'kg-explorer': [
    { prompt: 'Which shape has three sides?', choices: ['Circle', 'Triangle', 'Square', 'Line'], correctIndex: 1, explanation: 'A triangle has three straight sides.', type: 'recall' },
    { prompt: 'Which one is a color?', choices: ['Table', 'Blue', 'Spoon', 'Shoe'], correctIndex: 1, explanation: 'Blue is a color; the others are objects.', type: 'recall' },
    { prompt: 'What comes after 4?', choices: ['3', '5', '6', '7'], correctIndex: 1, explanation: 'Counting forward, 5 comes right after 4.', type: 'number' },
    { prompt: 'Which animal can fly?', choices: ['Dog', 'Bird', 'Cow', 'Fish'], correctIndex: 1, explanation: 'Birds have wings and can fly.', type: 'observation' },
  ],
  mathematics: [
    { prompt: 'What is 18 + 27?', choices: ['35', '45', '44', '55'], correctIndex: 1, explanation: '18 + 27 = 45. Add tens and ones separately: 10 + 20 and 8 + 7.', type: 'calculation' },
    { prompt: 'Solve: 9 × 6', choices: ['54', '56', '48', '63'], correctIndex: 0, explanation: '9 × 6 means six groups of nine, which equals 54.', type: 'calculation' },
    { prompt: 'Which fraction is equal to one half?', choices: ['1/3', '2/4', '3/5', '1/4'], correctIndex: 1, explanation: '2/4 simplifies to 1/2 because both numbers divide by 2.', type: 'concept' },
    { prompt: 'A rectangle is 8 cm by 5 cm. What is its area?', choices: ['13 cm²', '26 cm²', '40 cm²', '45 cm²'], correctIndex: 2, explanation: 'Area = length × width = 8 × 5 = 40 cm².', type: 'application' },
  ],
  english: [
    { prompt: 'Choose the correct plural of “child”.', choices: ['Childs', 'Children', 'Childes', 'Child'], correctIndex: 1, explanation: 'The plural of child is children.', type: 'grammar' },
    { prompt: 'Which word is a noun?', choices: ['Quickly', 'Beautiful', 'Garden', 'Running'], correctIndex: 2, explanation: 'Garden names a place, so it is a noun.', type: 'grammar' },
    { prompt: 'What is the past tense of “go”?', choices: ['Goed', 'Went', 'Going', 'Gone'], correctIndex: 1, explanation: 'The past tense of go is went.', type: 'grammar' },
    { prompt: 'Which sentence is complete?', choices: ['Because the rain.', 'The cat under the table.', 'She reads every evening.', 'When we arrived.'], correctIndex: 2, explanation: 'A complete sentence has a subject and a verb and expresses a full thought.', type: 'sentence' },
  ],
  amharic: [
    { prompt: 'What is the English meaning of “ቤት”?', choices: ['Book', 'House', 'Water', 'School'], correctIndex: 1, explanation: 'ቤት means house in English.', type: 'vocabulary' },
    { prompt: 'Which word means “student” in Amharic?', choices: ['መማሪያ', 'ተማሪ', 'መጽሐፍ', 'አስተማሪ'], correctIndex: 1, explanation: 'ተማሪ means student.', type: 'vocabulary' },
    { prompt: 'Which word is a number?', choices: ['ሰማይ', 'ሶስት', 'ውሃ', 'እና'], correctIndex: 1, explanation: 'ሶስት means three.', type: 'number' },
    { prompt: 'Choose the correct greeting for “Good morning”.', choices: ['እንደምን አደረስ', 'ጥዋት ፈለገ', 'አምላሽ አለ', 'ደህና ሁን'], correctIndex: 1, explanation: 'ጥዋት ፈለገ is used for Good morning.', type: 'phrase' },
  ],
  'general-science': [
    { prompt: 'Which part of a plant makes food using sunlight?', choices: ['Root', 'Leaf', 'Stem', 'Flower'], correctIndex: 1, explanation: 'Leaves use sunlight to make food through photosynthesis.', type: 'concept' },
    { prompt: 'What force pulls objects toward Earth?', choices: 'Friction Magnetism Gravity Push'.split(' '), correctIndex: 2, explanation: 'Gravity pulls objects toward the center of Earth.', type: 'concept' },
    { prompt: 'Which state of matter has a fixed shape?', choices: ['Gas', 'Liquid', 'Solid', 'Plasma'], correctIndex: 2, explanation: 'Solids keep a fixed shape because their particles are tightly packed.', type: 'concept' },
    { prompt: 'Which sense helps you detect light?', choices: ['Hearing', 'Sight', 'Smell', 'Touch'], correctIndex: 1, explanation: 'Your eyes and sight detect light.', type: 'observation' },
  ],
  'career-education': [
    { prompt: 'What is a career interest?', choices: ['A school uniform', 'An activity you enjoy and may study further', 'A type of transport', 'A daily chore'], correctIndex: 1, explanation: 'Career interests are activities and subjects that attract you.', type: 'concept' },
    { prompt: 'Which skill helps you work well with others?', choices: ['Teamwork', 'Silence', 'Guessing', 'Avoidance'], correctIndex: 0, explanation: 'Teamwork helps people share ideas and complete tasks together.', type: 'skill' },
    { prompt: 'What is a smart first step when choosing a pathway?', choices: ['Copy a friend', 'Ignore strengths', 'Identify strengths and interests', 'Stop studying'], correctIndex: 2, explanation: 'Knowing your strengths and interests guides better choices.', type: 'decision' },
    { prompt: 'Why is planning useful?', choices: ['It removes all challenges', 'It helps set clear goals', 'It makes decisions instant', 'It avoids learning'], correctIndex: 1, explanation: 'Planning helps you set goals and take steady steps toward them.', type: 'concept' },
  ],
  physics: [
    { prompt: 'What is the SI unit of force?', choices: ['Joule', 'Watt', 'Newton', 'Pascal'], correctIndex: 2, explanation: 'Force is measured in newtons (N).', type: 'recall' },
    { prompt: 'An object accelerates when its what changes?', choices: ['Mass', 'Velocity', 'Color', 'Shape'], correctIndex: 1, explanation: 'Acceleration is the rate of change of velocity.', type: 'concept' },
    { prompt: 'Which energy transfer happens through a hot pan?', choices: ['Conduction', 'Radiation', 'Reflection', 'Refraction'], correctIndex: 0, explanation: 'Heat moves through direct contact in conduction.', type: 'application' },
    { prompt: 'What happens to resistance when current flows through a wire?', choices: ['It disappears', 'It opposes the current', 'It becomes light', 'It doubles the voltage'], correctIndex: 1, explanation: 'Resistance opposes the flow of electric current.', type: 'concept' },
  ],
  chemistry: [
    { prompt: 'What is the chemical symbol for water?', choices: ['CO2', 'H2O', 'O2', 'NaCl'], correctIndex: 1, explanation: 'Water is made of two hydrogen atoms and one oxygen atom: H2O.', type: 'recall' },
    { prompt: 'Which particle has a negative charge?', choices: ['Proton', 'Neutron', 'Electron', 'Nucleus'], correctIndex: 2, explanation: 'Electrons carry a negative charge.', type: 'recall' },
    { prompt: 'What is a catalyst?', choices: ['A substance that stops all reactions', 'A substance that speeds up a reaction', 'A type of container', 'A solid product'], correctIndex: 1, explanation: 'A catalyst increases reaction rate without being used up.', type: 'concept' },
    { prompt: 'Which substance is an acid?', choices: ['Vinegar', 'Baking soda', 'Pure water', 'Soap'], correctIndex: 0, explanation: 'Vinegar contains acetic acid.', type: 'application' },
  ],
  biology: [
    { prompt: 'Which organelle controls most cell activities?', choices: ['Ribosome', 'Nucleus', 'Vacuole', 'Cell wall'], correctIndex: 1, explanation: 'The nucleus contains genetic material and controls cell activities.', type: 'recall' },
    { prompt: 'What do plants release during photosynthesis?', choices: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Glucose gas'], correctIndex: 1, explanation: 'Plants release oxygen as a by-product of photosynthesis.', type: 'concept' },
    { prompt: 'Which body system pumps blood?', choices: ['Digestive', 'Respiratory', 'Circulatory', 'Nervous'], correctIndex: 2, explanation: 'The heart and blood vessels form the circulatory system.', type: 'concept' },
    { prompt: 'What is a habitat?', choices: ['A type of cell', 'The natural home of an organism', 'A food chain', 'A body organ'], correctIndex: 1, explanation: 'A habitat is the environment where an organism lives.', type: 'concept' },
  ],
  history: [
    { prompt: 'What does a historian mainly study?', choices: ['Past events', 'Weather patterns', 'Body systems', 'Computer code'], correctIndex: 0, explanation: 'Historians study and interpret past events.', type: 'concept' },
    { prompt: 'Why are primary sources useful?', choices: ['They are always short', 'They give direct evidence from a time', 'They avoid all bias', 'They replace all other evidence'], correctIndex: 1, explanation: 'Primary sources provide direct evidence from the period being studied.', type: 'reasoning' },
    { prompt: 'Which empire was centered in ancient Ethiopia?', choices: ['Roman', 'Aksumite', 'Mongol', 'Ottoman'], correctIndex: 1, explanation: 'The Aksumite Empire was centered in the Ethiopian highlands.', type: 'recall' },
    { prompt: 'What is a timeline used for?', choices: ['Comparing heights', 'Ordering events in time', 'Drawing maps', 'Counting populations'], correctIndex: 1, explanation: 'A timeline places events in chronological order.', type: 'concept' },
  ],
  geography: [
    { prompt: 'What does a map scale show?', choices: ['Colors of countries', 'Distance relationship', 'Population only', 'Weather only'], correctIndex: 1, explanation: 'A map scale relates map distance to real-world distance.', type: 'concept' },
    { prompt: 'Which feature is found on a physical map?', choices: ['Mountains', 'Road names', 'School zones', 'Company logos'], correctIndex: 0, explanation: 'Physical maps show natural features such as mountains and rivers.', type: 'observation' },
    { prompt: 'What is climate?', choices: ['Weather for one hour', 'Average weather over a long period', 'A type of soil', 'A map symbol'], correctIndex: 1, explanation: 'Climate describes average weather patterns over many years.', type: 'concept' },
    { prompt: 'Which direction does the sun rise?', choices: ['East', 'West', 'North', 'South'], correctIndex: 0, explanation: 'The sun rises in the east.', type: 'recall' },
  ],
  economics: [
    { prompt: 'What is an opportunity cost?', choices: ['Money saved in a bank', 'The next best choice given up', 'A government tax', 'The price of all goods'], correctIndex: 1, explanation: 'Opportunity cost is the value of the next best alternative forgone.', type: 'concept' },
    { prompt: 'Which of these is a service?', choices: ['A book', 'A haircut', 'An apple', 'A chair'], correctIndex: 1, explanation: 'A haircut is an action provided to a customer, so it is a service.', type: 'classification' },
    { prompt: 'When demand rises and supply stays the same, what usually happens to price?', choices: ['It falls', 'It rises', 'It stays fixed', 'It disappears'], correctIndex: 1, explanation: 'Higher demand with unchanged supply tends to raise prices.', type: 'application' },
    { prompt: 'What is inflation?', choices: ['A fall in prices', 'A general rise in prices', 'A type of business', 'A savings account'], correctIndex: 1, explanation: 'Inflation is a general increase in prices over time.', type: 'concept' },
  ],
}

const DEFAULT_QUESTIONS = [
  { prompt: 'Which answer is most reasonable?', choices: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 1, explanation: 'Review the lesson notes and try again.', type: 'concept' },
]

export function getQuestionsForUnit(context, subject, unit) {
  if (!subject || !unit) return []

  const questions = QUESTION_BANK[subject.id] || DEFAULT_QUESTIONS
  const offset = (unit.number - 1) % questions.length

  return Array.from({ length: 4 }, (_, index) => {
    const question = questions[(offset + index) % questions.length]
    return {
      ...question,
      id: `${subject.id}-${unit.id}-q-${index + 1}`,
      grade: context.grade,
      stream: context.stream,
      subjectId: subject.id,
      unitId: unit.id,
      unitNumber: unit.number,
      type: question.type || 'concept',
    }
  })
}
