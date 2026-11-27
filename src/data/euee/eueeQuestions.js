const question = (id, subjectId, topic, difficulty, type, text, options, answer, explanation, image = null) => ({
  id,
  subjectId,
  topic,
  difficulty,
  type,
  text,
  options,
  answer,
  explanation,
  image,
})

export const EUEE_QUESTIONS = [
  question('math-001', 'mathematics', 'Arithmetic', 'easy', 'multiple-choice', 'What is 18 × 4?', ['62', '72', '74', '82'], '72', '18 × 4 means four groups of 18, which equals 72.'),
  question('math-002', 'mathematics', 'Arithmetic', 'medium', 'numerical', 'A shop item costs 250 birr after a 20% discount. What was the original price?', ['275 birr', '300 birr', '312.5 birr', '320 birr'], '312.5 birr', 'If 80% of the price is 250, the original price is 250 ÷ 0.8 = 312.5 birr.'),
  question('math-003', 'mathematics', 'Algebra', 'easy', 'multiple-choice', 'Solve for x: 3x + 6 = 21', ['3', '5', '7', '9'], '5', 'Subtract 6 from both sides to get 3x = 15, then divide by 3.'),
  question('math-004', 'mathematics', 'Algebra', 'medium', 'conceptual', 'Which expression is equivalent to 2(a + 3) - 4?', ['2a + 2', '2a + 6', '2a - 1', '2a + 10'], '2a + 2', 'Distribute 2 to get 2a + 6, then subtract 4 to get 2a + 2.'),
  question('math-005', 'mathematics', 'Algebra', 'hard', 'numerical', 'If 2x - y = 10 and x + y = 5, what is x?', ['3', '4', '5', '6'], '5', 'Add the equations: 3x = 15, so x = 5.'),
  question('math-006', 'mathematics', 'Geometry', 'easy', 'multiple-choice', 'What is the area of a rectangle 8 cm by 5 cm?', ['13 cm²', '26 cm²', '40 cm²', '80 cm²'], '40 cm²', 'Area = length × width = 8 × 5 = 40 cm².'),
  question('math-007', 'mathematics', 'Geometry', 'medium', 'numerical', 'A triangle has angles 50° and 65°. What is the third angle?', ['45°', '55°', '65°', '75°'], '65°', 'Angles in a triangle total 180°, so 180 - 50 - 65 = 65°.'),
  question('math-008', 'mathematics', 'Geometry', 'hard', 'conceptual', 'Which statement about a circle is always true?', ['The diameter is half the radius', 'The circumference is π × diameter', 'The radius is twice the diameter', 'The area is π × diameter'], 'The circumference is π × diameter', 'Circumference equals 2πr, which is the same as πd.'),
  question('math-009', 'mathematics', 'Statistics', 'easy', 'multiple-choice', 'Find the mean of 4, 6, 8, and 10.', ['6', '7', '8', '28'], '7', 'The sum is 28 and there are 4 values, so the mean is 7.'),
  question('math-010', 'mathematics', 'Statistics', 'medium', 'numerical', 'What is the median of 12, 15, 18, 21, and 24?', ['15', '18', '19', '21'], '18', 'With five ordered values, the median is the middle value: 18.'),
  question('math-011', 'mathematics', 'Statistics', 'hard', 'conceptual', 'Which measure is most affected by one extremely large value?', ['Mean', 'Median', 'Mode', 'Range'], 'Mean', 'The mean includes every value, so an outlier pulls it strongly.'),
  question('math-012', 'mathematics', 'Arithmetic', 'hard', 'numerical', 'What is 3/5 of 250?', ['125', '140', '150', '175'], '150', '250 ÷ 5 = 50, and 50 × 3 = 150.'),

  question('eng-001', 'english', 'Grammar', 'easy', 'multiple-choice', 'Choose the correct verb: She ___ to school every day.', ['go', 'goes', 'going', 'gone'], 'goes', 'A singular subject in the present simple takes the -s form.'),
  question('eng-002', 'english', 'Grammar', 'medium', 'conceptual', 'Which sentence uses the past participle correctly?', ['I have wrote the report', 'I have written the report', 'I have writing the report', 'I have write the report'], 'I have written the report', 'The perfect tense uses have plus the past participle: written.'),
  question('eng-003', 'english', 'Grammar', 'hard', 'multiple-choice', 'Which sentence is punctuated correctly?', ["Its a beautiful day, isn't it?", "It's a beautiful day, isn't it?", "It's a beautiful day isn't it?", "Its' a beautiful day, isn't it?"], "It's a beautiful day, isn't it?", "It's means it is, and the question tag needs a comma."),
  question('eng-004', 'english', 'Vocabulary', 'easy', 'multiple-choice', 'What does "abundant" mean?', ['Very small', 'Plentiful', 'Hidden', 'Difficult'], 'Plentiful', 'Abundant means existing in large quantities.'),
  question('eng-005', 'english', 'Vocabulary', 'medium', 'conceptual', 'Which word is closest in meaning to "reluctant"?', ['Eager', 'Unwilling', 'Careful', 'Rapid'], 'Unwilling', 'Reluctant means unwilling or hesitant to do something.'),
  question('eng-006', 'english', 'Vocabulary', 'hard', 'multiple-choice', 'Choose the correct word: The new policy had a significant ___ on attendance.', ['affect', 'effect', 'affects', 'effects'], 'effect', 'As a noun meaning result, the correct word is effect.'),
  question('eng-007', 'english', 'Reading', 'easy', 'multiple-choice', 'A passage says: "Because the rain stopped, the match continued." Why did the match continue?', ['The crowd arrived', 'The rain stopped', 'The teams rested', 'The field closed'], 'The rain stopped', 'The word because directly gives the reason.'),
  question('eng-008', 'english', 'Reading', 'medium', 'conceptual', 'What is the main idea of a paragraph?', ['The first sentence only', 'The central point the paragraph develops', 'The longest sentence', 'The final word'], 'The central point the paragraph develops', 'A main idea is the focus that all supporting details explain.'),
  question('eng-009', 'english', 'Reading', 'hard', 'multiple-choice', 'A writer states that homework "can reinforce learning when it is brief and purposeful." What is the writer\'s view?', ['Homework is always harmful', 'Homework has no value', 'Short, purposeful homework can help', 'Homework should be long'], 'Short, purposeful homework can help', 'The phrase "can reinforce learning" shows qualified support.'),
  question('eng-010', 'english', 'Writing', 'easy', 'multiple-choice', 'Which is a complete sentence?', ['Because the bus was late', 'The bus was late', 'When the bus arrived', 'Late bus'], 'The bus was late', 'It has a subject and a verb and expresses a complete thought.'),
  question('eng-011', 'english', 'Writing', 'medium', 'conceptual', 'What is the purpose of a topic sentence?', ['To end the essay', 'To state the main point of a paragraph', 'To list references', 'To add decoration'], 'To state the main point of a paragraph', 'A topic sentence announces what the paragraph will develop.'),
  question('eng-012', 'english', 'Writing', 'hard', 'multiple-choice', 'Which sentence uses a semicolon correctly?', ['I studied hard; I passed the test.', 'I studied hard; and I passed the test.', 'I studied hard; because I passed.', 'I studied hard; the test.'], 'I studied hard; I passed the test.', 'A semicolon joins two complete, closely related independent clauses.'),

  question('phy-001', 'physics', 'Mechanics', 'easy', 'multiple-choice', 'What is the SI unit of force?', ['Joule', 'Watt', 'Newton', 'Pascal'], 'Newton', 'Force is measured in newtons, named after Isaac Newton.'),
  question('phy-002', 'physics', 'Mechanics', 'medium', 'numerical', 'A 10 kg object accelerates at 3 m/s². What force acts on it?', ['13 N', '30 N', '33 N', '103 N'], '30 N', 'Using F = ma, force = 10 × 3 = 30 N.'),
  question('phy-003', 'physics', 'Mechanics', 'hard', 'conceptual', 'Why does a heavier object not fall faster in a vacuum?', ['Gravity is weaker on heavy objects', 'Air resistance is absent and acceleration is independent of mass', 'Heavy objects have less inertia', 'Mass changes gravity direction'], 'Air resistance is absent and acceleration is independent of mass', 'In a vacuum, all objects accelerate at the same rate under gravity.'),
  question('phy-004', 'physics', 'Electricity', 'easy', 'multiple-choice', 'What is the unit of electric current?', ['Volt', 'Ohm', 'Ampere', 'Watt'], 'Ampere', 'Current is measured in amperes.'),
  question('phy-005', 'physics', 'Electricity', 'medium', 'numerical', 'A resistor has 12 V across it and 3 A flowing through it. What is its resistance?', ['4 Ω', '9 Ω', '15 Ω', '36 Ω'], '4 Ω', 'Using R = V/I, resistance = 12 ÷ 3 = 4 Ω.'),
  question('phy-006', 'physics', 'Electricity', 'hard', 'conceptual', 'In a series circuit, what happens when one bulb burns out?', ['All bulbs stay lit', 'Only that bulb goes out', 'The circuit opens and all bulbs go out', 'The voltage doubles'], 'The circuit opens and all bulbs go out', 'Series circuits have one path, so a break stops all current.'),
  question('phy-007', 'physics', 'Waves', 'easy', 'multiple-choice', 'Which wave needs a medium to travel?', ['Light wave', 'Sound wave', 'Radio wave', 'X-ray'], 'Sound wave', 'Sound is a mechanical wave and needs a material medium.'),
  question('phy-008', 'physics', 'Waves', 'medium', 'numerical', 'A wave has frequency 20 Hz and wavelength 3 m. What is its speed?', ['23 m/s', '60 m/s', '17 m/s', '6 m/s'], '60 m/s', 'Wave speed = frequency × wavelength = 20 × 3 = 60 m/s.'),
  question('phy-009', 'physics', 'Waves', 'hard', 'conceptual', 'What happens when wave frequency increases while speed stays constant?', ['Wavelength increases', 'Wavelength decreases', 'Wavelength stays the same', 'Amplitude becomes zero'], 'Wavelength decreases', 'From v = fλ, if v is constant and f increases, λ must decrease.'),
  question('phy-010', 'physics', 'Thermodynamics', 'easy', 'multiple-choice', 'What is the SI unit of temperature?', ['Celsius', 'Fahrenheit', 'Kelvin', 'Calorie'], 'Kelvin', 'The SI base unit for thermodynamic temperature is the kelvin.'),
  question('phy-011', 'physics', 'Thermodynamics', 'medium', 'numerical', 'How much heat is needed to raise 2 kg of water by 5°C? Use c = 4200 J/kg°C.', ['21,000 J', '42,000 J', '4,200 J', '210,000 J'], '42,000 J', 'Q = mcΔT = 2 × 4200 × 5 = 42,000 J.'),
  question('phy-012', 'physics', 'Thermodynamics', 'hard', 'conceptual', 'What does the first law of thermodynamics state?', ['Heat cannot be created', 'Energy is conserved when heat and work transfer energy', 'Temperature always rises', 'Entropy never changes'], 'Energy is conserved when heat and work transfer energy', 'The first law is the conservation of energy for thermodynamic systems.'),

  question('chem-001', 'chemistry', 'Atomic Structure', 'easy', 'multiple-choice', 'What is the charge of an electron?', ['Positive', 'Negative', 'Neutral', 'Variable'], 'Negative', 'Electrons carry a negative electric charge.'),
  question('chem-002', 'chemistry', 'Atomic Structure', 'medium', 'numerical', 'An atom has 8 protons and 10 electrons. What is its net charge?', ['2+', '2-', 'Neutral', '18-'], '2-', 'Two more electrons than protons gives a net charge of 2-.'),
  question('chem-003', 'chemistry', 'Atomic Structure', 'hard', 'conceptual', 'What determines the chemical identity of an element?', ['Number of neutrons', 'Number of protons', 'Number of electrons only', 'Atomic mass only'], 'Number of protons', 'The atomic number, or proton count, identifies an element.'),
  question('chem-004', 'chemistry', 'Bonding', 'easy', 'multiple-choice', 'What type of bond forms by sharing electrons?', ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], 'Covalent', 'Covalent bonds involve shared electron pairs.'),
  question('chem-005', 'chemistry', 'Bonding', 'medium', 'conceptual', 'Why does NaCl form an ionic bond?', ['Both atoms share electrons equally', 'Sodium transfers an electron to chlorine', 'Chlorine transfers an electron to sodium', 'Neither atom changes'], 'Sodium transfers an electron to chlorine', 'Sodium loses one electron and chlorine gains one, forming oppositely charged ions.'),
  question('chem-006', 'chemistry', 'Bonding', 'hard', 'multiple-choice', 'Which molecule is polar?', ['O₂', 'CO₂', 'H₂O', 'CH₄'], 'H₂O', 'Water has a bent shape and unequal charge distribution.'),
  question('chem-007', 'chemistry', 'Reactions', 'easy', 'multiple-choice', 'What is a catalyst?', ['A reactant that is used up', 'A substance that speeds a reaction without being consumed', 'A solid product', 'A type of solvent'], 'A substance that speeds a reaction without being consumed', 'Catalysts lower activation energy and are regenerated.'),
  question('chem-008', 'chemistry', 'Reactions', 'medium', 'numerical', 'Balance: H₂ + O₂ → H₂O. What coefficient is needed for H₂O?', ['1', '2', '3', '4'], '2', 'The balanced equation is 2H₂ + O₂ → 2H₂O.'),
  question('chem-009', 'chemistry', 'Reactions', 'hard', 'conceptual', 'Which change is chemical rather than physical?', ['Melting ice', 'Cutting paper', 'Iron rusting', 'Boiling water'], 'Iron rusting', 'Rusting forms new substances through a chemical reaction.'),
  question('chem-010', 'chemistry', 'Acids and Bases', 'easy', 'multiple-choice', 'What is the pH of a neutral solution?', ['0', '5', '7', '14'], '7', 'At 25°C, pH 7 is neutral.'),
  question('chem-011', 'chemistry', 'Acids and Bases', 'medium', 'conceptual', 'A solution has pH 3. How does its acidity compare with pH 5?', ['100 times less acidic', '10 times more acidic', '100 times more acidic', 'The same'], '100 times more acidic', 'Each pH unit is a tenfold change, so two units means 100 times.'),
  question('chem-012', 'chemistry', 'Acids and Bases', 'hard', 'multiple-choice', 'Which substance is a strong base?', ['Vinegar', 'Sodium hydroxide', 'Lemon juice', 'Carbonated water'], 'Sodium hydroxide', 'Sodium hydroxide dissociates fully to produce hydroxide ions.'),

  question('bio-001', 'biology', 'Cells', 'easy', 'multiple-choice', 'Which organelle controls most cell activities?', ['Ribosome', 'Nucleus', 'Cell wall', 'Vacuole'], 'Nucleus', 'The nucleus contains genetic material and directs cell activities.'),
  question('bio-002', 'biology', 'Cells', 'medium', 'conceptual', 'What is the main function of mitochondria?', ['Photosynthesis', 'Protein synthesis', 'Energy release through respiration', 'Storage of water'], 'Energy release through respiration', 'Mitochondria produce ATP during cellular respiration.'),
  question('bio-003', 'biology', 'Cells', 'hard', 'multiple-choice', 'Which feature distinguishes plant cells from animal cells?', ['Nucleus', 'Cell membrane', 'Chloroplast', 'Mitochondrion'], 'Chloroplast', 'Chloroplasts carry out photosynthesis in plant cells.'),
  question('bio-004', 'biology', 'Genetics', 'easy', 'multiple-choice', 'What is a gene?', ['A cell organelle', 'A segment of DNA that carries inherited information', 'A protein only', 'A type of tissue'], 'A segment of DNA that carries inherited information', 'Genes are DNA units that influence traits.'),
  question('bio-005', 'biology', 'Genetics', 'medium', 'numerical', 'Cross AA with aa. What percentage of offspring are heterozygous?', ['0%', '25%', '50%', '100%'], '100%', 'All offspring receive A from one parent and a from the other, so all are Aa.'),
  question('bio-006', 'biology', 'Genetics', 'hard', 'conceptual', 'Why are dominant alleles not always the most common in a population?', ['Dominant always means strongest', 'Allele frequency depends on inheritance and selection, not dominance alone', 'Recessive alleles cannot be passed on', 'Dominant alleles disappear quickly'], 'Allele frequency depends on inheritance and selection, not dominance alone', 'Dominance describes expression, not how common an allele is.'),
  question('bio-007', 'biology', 'Ecology', 'easy', 'multiple-choice', 'What is a producer in an ecosystem?', ['An organism that makes its own food', 'An animal that eats plants', 'A decomposer', 'A predator'], 'An organism that makes its own food', 'Producers, such as plants, make food by photosynthesis.'),
  question('bio-008', 'biology', 'Ecology', 'medium', 'conceptual', 'What happens to energy as it moves through a food chain?', ['It increases at each level', 'It stays the same', 'Much is lost as heat at each transfer', 'It is created by consumers'], 'Much is lost as heat at each transfer', 'Energy transfer is inefficient, so less energy is available at higher levels.'),
  question('bio-009', 'biology', 'Ecology', 'hard', 'multiple-choice', 'Which relationship benefits both organisms?', ['Parasitism', 'Commensalism', 'Mutualism', 'Predation'], 'Mutualism', 'In mutualism, both organisms benefit.'),
  question('bio-010', 'biology', 'Human Body', 'easy', 'multiple-choice', 'Which organ pumps blood?', ['Lung', 'Liver', 'Heart', 'Kidney'], 'Heart', 'The heart is the muscular pump of the circulatory system.'),
  question('bio-011', 'biology', 'Human Body', 'medium', 'conceptual', 'What is the main role of red blood cells?', ['Fighting infection', 'Carrying oxygen', 'Clotting blood', 'Producing hormones'], 'Carrying oxygen', 'Red blood cells contain hemoglobin, which binds oxygen.'),
  question('bio-012', 'biology', 'Human Body', 'hard', 'numerical', 'If the heart beats 72 times per minute, how many beats is that in 10 minutes?', ['620', '720', '740', '820'], '720', '72 × 10 = 720 beats.'),
]

export function getEueeQuestions({
  subjectIds = [],
  topics = [],
  difficulties = [],
  types = [],
  count = 10,
} = {}) {
  const subjectSet = new Set(subjectIds)
  const topicSet = new Set(topics)
  const difficultySet = new Set(difficulties)
  const typeSet = new Set(types)

  const filtered = EUEE_QUESTIONS.filter((item) => {
    if (subjectSet.size && !subjectSet.has(item.subjectId)) return false
    if (topicSet.size && !topicSet.has(item.topic)) return false
    if (difficultySet.size && !difficultySet.has(item.difficulty)) return false
    if (typeSet.size && !typeSet.has(item.type)) return false
    return true
  })

  const shuffled = [...filtered].sort(() => Math.random() - 0.5)
  const safeCount = Math.max(1, Math.min(Number(count) || 10, 30))
  return shuffled.slice(0, safeCount)
}

export function getTopicsForSubjects(subjectIds = []) {
  const set = new Set(subjectIds)
  return [...new Set(EUEE_QUESTIONS.filter((item) => !set.size || set.has(item.subjectId)).map((item) => item.topic))].sort()
}

export function countQuestionsForSubject(subjectId) {
  return EUEE_QUESTIONS.filter((item) => item.subjectId === subjectId).length
}
