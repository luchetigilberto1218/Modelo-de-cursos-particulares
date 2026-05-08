#!/usr/bin/env node
/*
 * Generate 20 confidence-level Information Technology lessons (num 1161–1180)
 * and append them to courses/czarnikow/course.json.
 *
 * Each lesson mirrors the 21-field structure of L1001 (num 1001):
 *   num, level, track, trackOrder, title, focus, character, characterName,
 *   characterAccent, grammar, objective, intro, vocab (5), situation,
 *   grammarDetail, exercises (3), wrapup, takeaways (10), teacherGuide,
 *   grammarDeepDive, extendedExercises.
 */

const fs = require('fs');
const path = require('path');

const coursePath = path.resolve(
  __dirname,
  '..',
  'courses',
  'czarnikow',
  'course.json'
);

const CHARACTER = 'james';
const CHARACTER_NAME = 'James';
const CHARACTER_ACCENT = 'RP (posh)';

// ---- 20 topic definitions --------------------------------------------------
// Each entry is a rich blueprint: we expand it into the full lesson shape.
const topics = [
  {
    num: 1161,
    order: 1,
    title: 'What Is IT?',
    grammar: 'Verbo to be — am, is, are',
    grammarShort: 'to be',
    focus: 'IT Foundations',
    objective:
      'Aprender 5 palavras básicas de TI e falar sobre o que é IT usando o verbo to be.',
    intro:
      "💛 <em>Uma dica: English comes in CAN's, not in CAN'Ts.</em><br><br>IT stands for <strong>Information Technology</strong>. It is the team and the tools that keep a company's computers, systems and data working. At Czarnikow, IT helps every office — from London to Brazil — stay connected and safe.<br><br>Today you will learn <strong>5 important words</strong> about IT and practise the verb <em>to be</em>. Let's start!",
    vocab: [
      { en: 'computer', pt: 'computador', example: 'My computer is new.' },
      { en: 'system', pt: 'sistema', example: 'The system is online.' },
      { en: 'data', pt: 'dados', example: 'The data is safe.' },
      { en: 'network', pt: 'rede', example: 'The network is fast today.' },
      { en: 'user', pt: 'usuário', example: 'I am a new user.' },
    ],
    situation:
      'James from IT welcomes a new colleague and explains, in very simple sentences, what the IT team does at Czarnikow.',
    readAloud: [
      'I am a new user.',
      'The computer is on.',
      'The system is ready.',
      'We are on the network.',
      'The data is safe.',
    ],
    ex2: {
      title: '2. Complete com am, is ou are (Fill in with am, is or are)',
      prompt:
        'Escolha a forma correta do verbo to be.<br>a) I ___ a new user.<br>b) The computer ___ on.<br>c) James ___ from IT.<br>d) We ___ on the network.<br>e) You ___ in the system.<br>f) The data ___ safe.<br>g) The system ___ ready.<br>h) The offices ___ online.<br>i) My laptop ___ slow today.<br>j) The IT team ___ here to help.',
      answers: [
        'a) am',
        'b) is',
        'c) is',
        'd) are',
        'e) are',
        'f) is',
        'g) is',
        'h) are',
        'i) is',
        'j) are',
      ],
    },
    ex3: {
      words: 'computer, system, data, network, user',
      prompt:
        'Complete com uma palavra do vocabulário: <em>computer, system, data, network, user</em>.<br>a) My ______ is on my desk.<br>b) The ______ is down for maintenance.<br>c) Every ______ has a password.<br>d) Our ______ connects London and Brazil.<br>e) The ______ is stored safely.<br>f) I am a new ______ in the system.<br>g) The ______ is slow today.<br>h) The ______ protects our ______ .<br>i) A good ______ helps the team work fast.<br>j) The ______ is ready to use.',
      answers: [
        'a) computer',
        'b) system',
        'c) user',
        'd) network',
        'e) data',
        'f) user',
        'g) network',
        'h) system / data',
        'i) computer',
        'j) system',
      ],
    },
    wrapup:
      '💛 Você já sabe 5 palavras de TI e o verbo to be. Ótimo começo! Pratique 5 minutos amanhã.',
    takeaways: [
      'I am a new user.',
      'The computer is on.',
      'The system is ready.',
      'The data is safe.',
      'We are on the network.',
      'James is from IT.',
      'The IT team is helpful.',
      'The offices are connected.',
      'My laptop is fast.',
      'IT is important for the business.',
    ],
    deepDive: {
      title: 'The verb "to be" in IT sentences',
      explanation:
        '<p>No mundo de TI, o verbo <strong>to be</strong> aparece o tempo todo: <em>The system is slow. The users are online. I am in the network.</em></p><p>Lembre: <strong>am</strong> só com <em>I</em>; <strong>is</strong> com <em>he, she, it</em> e coisas no singular (<em>the computer, the data, the system</em>); <strong>are</strong> com <em>you, we, they</em> e coisas no plural (<em>the users, the computers</em>).</p><p>💛 <em>Dica:</em> em inglês, <em>data</em> é tratado como singular na fala do dia a dia: <em>The data is safe.</em></p>',
      examples: [
        { en: 'I am a new user.', pt: 'Eu sou um novo usuário.' },
        { en: 'The system is online.', pt: 'O sistema está online.' },
        { en: 'The computer is slow today.', pt: 'O computador está lento hoje.' },
        { en: 'We are on the same network.', pt: 'Nós estamos na mesma rede.' },
        { en: 'The data is safe.', pt: 'Os dados estão seguros.' },
        { en: 'James is from IT.', pt: 'O James é do time de TI.' },
        { en: 'You are the admin of the system.', pt: 'Você é o admin do sistema.' },
        { en: 'The offices are connected.', pt: 'Os escritórios estão conectados.' },
        { en: 'I am at the help desk.', pt: 'Eu estou no help desk.' },
        { en: 'The users are happy.', pt: 'Os usuários estão felizes.' },
        { en: 'My laptop is new.', pt: 'Meu notebook é novo.' },
        { en: 'IT is important for the company.', pt: 'TI é importante para a empresa.' },
      ],
      mistakes: [
        { wrong: 'I is in the system.', right: 'I am in the system.', note: 'Com I, sempre am.' },
        { wrong: 'The data are safe.', right: 'The data is safe.', note: 'No uso corporativo do dia a dia, data costuma ser singular.' },
        { wrong: 'The users is online.', right: 'The users are online.', note: 'Users é plural — use are.' },
        { wrong: 'He are from IT.', right: 'He is from IT.', note: 'Com he/she/it, use is.' },
        { wrong: 'We is a team.', right: 'We are a team.', note: 'Com we/you/they, use are.' },
      ],
      practice: [
        { q: 'I ___ a user of the system.', a: 'am' },
        { q: 'The computer ___ new.', a: 'is' },
        { q: 'The users ___ online.', a: 'are' },
        { q: 'James ___ from the IT team.', a: 'is' },
        { q: 'We ___ on the same network.', a: 'are' },
      ],
    },
    rolePlay: {
      title: 'First day — meeting the IT team',
      setup:
        'É o seu primeiro dia. James, do IT, te recebe e explica quem é o time.',
      studentA:
        'Seja o novo funcionário. Diga seu nome e faça 2 perguntas simples (What is your name? / Where is the IT team?).',
      studentB:
        'Seja James. Responda com frases curtas usando am/is/are e dê as boas-vindas.',
      sampleDialogue: [
        'James: Hi! I am James from IT. What is your name?',
        'You: Hi James! I am Ana. I am a new user.',
        'James: Welcome, Ana. The IT team is here to help. The network is ready for you.',
        'You: Thank you! Where is the help desk?',
        'James: The help desk is on the first floor. We are a small team.',
      ],
      successCriteria:
        'Usar am/is/are corretamente pelo menos 3 vezes e usar 2 palavras do vocabulário.',
      teacherNotes:
        '💛 Celebre cada frase correta. Repita o diálogo trocando os papéis.',
    },
    audioTranscript:
      'Hi, welcome to Czarnikow. I am James from the IT team. The network is ready, your computer is on, and the system is online. We are a small team, and the users here are friendly. Your data is safe with us. See you soon!',
  },
  {
    num: 1162,
    order: 2,
    title: 'My Computer',
    grammar: 'Adjetivos possessivos — my, your',
    grammarShort: 'my / your',
    focus: 'IT Foundations',
    objective:
      'Falar sobre o seu computador usando os possessivos my e your e 5 palavras novas.',
    intro:
      '💛 <em>Learn the simple words first — the rest will follow.</em><br><br>Every person at Czarnikow has <strong>a computer</strong>, <strong>a mouse</strong> and <strong>a keyboard</strong>. Today you will learn how to talk about <em>my</em> computer and <em>your</em> computer. Short sentences, big progress!',
    vocab: [
      { en: 'laptop', pt: 'notebook', example: 'My laptop is light.' },
      { en: 'screen', pt: 'tela', example: 'Your screen is big.' },
      { en: 'mouse', pt: 'mouse', example: 'My mouse is on the desk.' },
      { en: 'keyboard', pt: 'teclado', example: 'Your keyboard is new.' },
      { en: 'charger', pt: 'carregador', example: 'My charger is black.' },
    ],
    situation:
      'James helps a new user set up their workstation and asks simple questions about their equipment.',
    readAloud: [
      'My laptop is on the desk.',
      'Your screen is very big.',
      'My mouse is new.',
      'Your keyboard is black.',
      'My charger is in the bag.',
    ],
    ex2: {
      title: '2. Complete com my ou your (Fill in with my or your)',
      prompt:
        'Escolha o possessivo correto.<br>a) ___ laptop is fast. (eu)<br>b) Is this ___ mouse? (você)<br>c) ___ screen is clean. (eu)<br>d) ___ keyboard is new. (você)<br>e) ___ charger is in the bag. (eu)<br>f) Where is ___ password? (você)<br>g) ___ computer is on. (eu)<br>h) Is ___ email open? (você)<br>i) ___ desk is small. (eu)<br>j) Is ___ laptop ready? (você)',
      answers: [
        'a) My',
        'b) your',
        'c) My',
        'd) Your',
        'e) My',
        'f) your',
        'g) My',
        'h) your',
        'i) My',
        'j) your',
      ],
    },
    ex3: {
      words: 'laptop, screen, mouse, keyboard, charger',
      prompt:
        'Complete com uma palavra do vocabulário: <em>laptop, screen, mouse, keyboard, charger</em>.<br>a) My ______ has 15 inches.<br>b) The ______ is big and bright.<br>c) I use a wireless ______ .<br>d) The ______ has all the letters.<br>e) My ______ is low on battery — I need the ______ .<br>f) Your ______ is black.<br>g) The ______ is next to the mouse pad.<br>h) Clean your ______ every week.<br>i) My ______ is on my desk.<br>j) Is this ______ yours?',
      answers: [
        'a) laptop',
        'b) screen',
        'c) mouse',
        'd) keyboard',
        'e) laptop / charger',
        'f) keyboard',
        'g) keyboard',
        'h) screen',
        'i) laptop',
        'j) mouse',
      ],
    },
    wrapup:
      '💛 Você já fala sobre o seu equipamento! Mais um passo dado.',
    takeaways: [
      'My laptop is new.',
      'Your screen is big.',
      'My mouse is wireless.',
      'Your keyboard is clean.',
      'My charger is black.',
      'Is this your laptop?',
      'My desk is small.',
      'Your computer is fast.',
      'My office is quiet.',
      'Your seat is next to mine.',
    ],
    deepDive: {
      title: 'Possessives: my and your',
      explanation:
        '<p><strong>My</strong> = meu, minha, meus, minhas (do falante).<br><strong>Your</strong> = seu, sua, seus, suas (da pessoa com quem você fala).</p><p>Em inglês, o possessivo vem <em>antes</em> do substantivo: <em>my laptop</em>, <em>your keyboard</em>. Não muda com o plural: <em>my laptops</em>, <em>your keyboards</em>.</p><p>💛 <em>Dica:</em> não confunda <em>your</em> (possessivo) com <em>you\'re</em> (you are).</p>',
      examples: [
        { en: 'My laptop is on the desk.', pt: 'Meu notebook está na mesa.' },
        { en: 'Your mouse is new.', pt: 'Seu mouse é novo.' },
        { en: 'My keyboard is black.', pt: 'Meu teclado é preto.' },
        { en: 'Your screen is bright.', pt: 'Sua tela é brilhante.' },
        { en: 'My charger is in the bag.', pt: 'Meu carregador está na bolsa.' },
        { en: 'Is this your laptop?', pt: 'Este é o seu notebook?' },
        { en: 'My office is quiet.', pt: 'Meu escritório é silencioso.' },
        { en: 'Your desk is next to mine.', pt: 'Sua mesa é ao lado da minha.' },
        { en: 'My password is strong.', pt: 'Minha senha é forte.' },
        { en: 'Your email is open.', pt: 'Seu e-mail está aberto.' },
        { en: 'My computer is fast.', pt: 'Meu computador é rápido.' },
        { en: 'Your keyboard is wireless.', pt: 'Seu teclado é sem fio.' },
      ],
      mistakes: [
        { wrong: 'The my laptop is new.', right: 'My laptop is new.', note: 'Não use artigo antes de my/your.' },
        { wrong: 'Your\'e keyboard is clean.', right: 'Your keyboard is clean.', note: 'Your = possessivo; you\'re = you are.' },
        { wrong: 'My laptops is new.', right: 'My laptop is new. / My laptops are new.', note: 'Concordância do verbo com o substantivo.' },
        { wrong: 'Me laptop is here.', right: 'My laptop is here.', note: 'Use my, não me.' },
        { wrong: 'Your mouse are on the desk.', right: 'Your mouse is on the desk.', note: 'Mouse no singular → is.' },
      ],
      practice: [
        { q: '___ laptop is new. (eu)', a: 'My' },
        { q: 'Is this ___ charger? (você)', a: 'your' },
        { q: '___ keyboard is black. (eu)', a: 'My' },
        { q: 'Where is ___ mouse? (você)', a: 'your' },
        { q: '___ screen is very big. (você)', a: 'Your' },
      ],
    },
    rolePlay: {
      title: 'Setting up your workstation',
      setup:
        'James te ajuda a montar a estação de trabalho. Você fala sobre os seus equipamentos.',
      studentA:
        'Seja o novo usuário. Use my para falar sobre seu laptop, seu mouse e seu teclado.',
      studentB:
        'Seja James. Use your para fazer perguntas simples (Is this your laptop? Where is your charger?).',
      sampleDialogue: [
        'James: Is this your laptop?',
        'You: Yes, this is my laptop. My charger is in the bag.',
        'James: Your screen is very nice. Is your keyboard new?',
        'You: Yes, my keyboard is new. My mouse is old.',
        'James: No problem. Your new mouse is here.',
      ],
      successCriteria:
        'Usar my e your corretamente pelo menos 3 vezes cada.',
      teacherNotes:
        '💛 Estimule o aluno a apontar para os objetos reais enquanto fala.',
    },
    audioTranscript:
      'Welcome to your new desk. This is your laptop. Your screen is on the right. Your keyboard is black and your mouse is wireless. My laptop is on my desk, next to yours. If your charger is missing, ask me — the IT charger box is in my office.',
  },
  {
    num: 1163,
    order: 3,
    title: 'The Keyboard and Mouse',
    grammar: 'There is / There are',
    grammarShort: 'there is / there are',
    focus: 'IT Foundations',
    objective:
      'Descrever o que existe na sua mesa usando there is e there are.',
    intro:
      '💛 <em>One word a day keeps the silence away.</em><br><br>On every desk at Czarnikow, <em>there is</em> a computer, <em>there is</em> a mouse and <em>there are</em> some cables. Today you will learn to describe what is on your desk with <strong>there is</strong> (singular) and <strong>there are</strong> (plural).',
    vocab: [
      { en: 'desk', pt: 'mesa', example: 'There is a desk in the room.' },
      { en: 'cable', pt: 'cabo', example: 'There are cables on the floor.' },
      { en: 'monitor', pt: 'monitor', example: 'There is a monitor on the desk.' },
      { en: 'button', pt: 'botão', example: 'There are two buttons on the mouse.' },
      { en: 'port', pt: 'porta (USB)', example: 'There are three USB ports.' },
    ],
    situation:
      'James shows the new user the desk and, in simple sentences, lists what is there.',
    readAloud: [
      'There is a laptop on the desk.',
      'There is a mouse next to the keyboard.',
      'There are two monitors.',
      'There are cables behind the desk.',
      'There is a charger in the drawer.',
    ],
    ex2: {
      title: '2. Complete com there is ou there are',
      prompt:
        'Escolha a forma correta.<br>a) ___ a laptop on the desk.<br>b) ___ two monitors.<br>c) ___ a mouse next to the keyboard.<br>d) ___ many cables on the floor.<br>e) ___ a charger in the drawer.<br>f) ___ three USB ports.<br>g) ___ a keyboard on every desk.<br>h) ___ some buttons on the mouse.<br>i) ___ a phone near the computer.<br>j) ___ two users in this room.',
      answers: [
        'a) There is',
        'b) There are',
        'c) There is',
        'd) There are',
        'e) There is',
        'f) There are',
        'g) There is',
        'h) There are',
        'i) There is',
        'j) There are',
      ],
    },
    ex3: {
      words: 'desk, cable, monitor, button, port',
      prompt:
        'Complete com: <em>desk, cable, monitor, button, port</em>.<br>a) The ______ is big and clean.<br>b) Plug the ______ into the wall.<br>c) The ______ shows the screen.<br>d) Press the power ______ to start.<br>e) Use the USB ______ for the mouse.<br>f) There are two ______s on my desk.<br>g) The ______ is made of wood.<br>h) The right ______ of the mouse opens the menu.<br>i) The ______ is too short.<br>j) This ______ is not working.',
      answers: [
        'a) desk',
        'b) cable',
        'c) monitor',
        'd) button',
        'e) port',
        'f) monitor',
        'g) desk',
        'h) button',
        'i) cable',
        'j) port',
      ],
    },
    wrapup:
      '💛 Agora você descreve sua mesa em inglês. Bom trabalho!',
    takeaways: [
      'There is a laptop on the desk.',
      'There are two monitors.',
      'There is a mouse next to the keyboard.',
      'There are cables behind the desk.',
      'There is a charger in the drawer.',
      'There are three USB ports.',
      'There is a phone on the desk.',
      'There are two buttons on the mouse.',
      'There is a keyboard on every desk.',
      'There are many users in the office.',
    ],
    deepDive: {
      title: '"There is" and "there are"',
      explanation:
        '<p>Use <strong>there is</strong> (há / existe) + substantivo no singular.<br>Use <strong>there are</strong> (há / existem) + substantivo no plural.</p><p>Ex.: <em>There is a mouse. There are two monitors.</em></p><p>Na negativa: <em>There isn\'t / There aren\'t</em>. Na pergunta: <em>Is there…? Are there…?</em></p><p>💛 <em>Dica:</em> em conversa, usa-se muito a contração <em>there\'s</em> para there is.</p>',
      examples: [
        { en: 'There is a laptop on the desk.', pt: 'Há um notebook na mesa.' },
        { en: 'There are two monitors.', pt: 'Há dois monitores.' },
        { en: 'There is a charger in the drawer.', pt: 'Há um carregador na gaveta.' },
        { en: 'There are many cables.', pt: 'Há muitos cabos.' },
        { en: 'Is there a printer here?', pt: 'Tem uma impressora aqui?' },
        { en: 'Are there any free ports?', pt: 'Tem alguma porta livre?' },
        { en: 'There isn\'t a mouse on this desk.', pt: 'Não há um mouse nesta mesa.' },
        { en: 'There aren\'t enough chairs.', pt: 'Não há cadeiras suficientes.' },
        { en: 'There is a meeting at 3 pm.', pt: 'Há uma reunião às 3 da tarde.' },
        { en: 'There are users in every room.', pt: 'Há usuários em cada sala.' },
        { en: 'There is a problem with the Wi-Fi.', pt: 'Tem um problema com o Wi-Fi.' },
        { en: 'There are three USB ports.', pt: 'Há três portas USB.' },
      ],
      mistakes: [
        { wrong: 'It has a laptop on the desk.', right: 'There is a laptop on the desk.', note: 'Para existência, use there is/are, não it has.' },
        { wrong: 'There is two monitors.', right: 'There are two monitors.', note: 'Plural pede there are.' },
        { wrong: 'There are a mouse.', right: 'There is a mouse.', note: 'Singular pede there is.' },
        { wrong: 'Have a problem with Wi-Fi.', right: 'There is a problem with Wi-Fi.', note: 'Em inglês não se omite o sujeito.' },
        { wrong: 'There is cables on the floor.', right: 'There are cables on the floor.', note: 'Cables é plural.' },
      ],
      practice: [
        { q: '___ a laptop on my desk.', a: 'There is' },
        { q: '___ two monitors.', a: 'There are' },
        { q: '___ a charger in the drawer.', a: 'There is' },
        { q: '___ many cables behind the desk.', a: 'There are' },
        { q: '___ three USB ports.', a: 'There are' },
      ],
    },
    rolePlay: {
      title: 'What is on your desk?',
      setup:
        'James pede para você descrever a sua nova mesa.',
      studentA:
        'Seja o usuário. Liste 5 coisas na mesa com there is/are.',
      studentB:
        'Seja James. Faça perguntas: Is there…? Are there…?',
      sampleDialogue: [
        'James: Is there a laptop on your desk?',
        'You: Yes, there is a laptop. There are two monitors.',
        'James: Are there any cables on the floor?',
        'You: Yes, there are three cables. There is also a mouse.',
        'James: Perfect. Is there a charger?',
        'You: Yes, there is a charger in the drawer.',
      ],
      successCriteria:
        'Usar there is e there are corretamente pelo menos 3 vezes cada.',
      teacherNotes:
        '💛 Peça para o aluno olhar a mesa real e descrevê-la.',
    },
    audioTranscript:
      'Let me show you the desk. There is a laptop here, and there is a mouse next to the keyboard. There are two monitors — one for email and one for reports. There are cables behind the desk, and there is a charger in the drawer. Any questions?',
  },
  {
    num: 1164,
    order: 4,
    title: 'Software and Apps',
    grammar: 'Plurais regulares — -s / -es',
    grammarShort: 'plurais',
    focus: 'IT Foundations',
    objective:
      'Falar de programas e aplicativos usando plurais regulares.',
    intro:
      '💛 <em>Small words, big world.</em><br><br>At work, you use many <strong>programs</strong> and <strong>apps</strong>: email, spreadsheets, chat, video calls. Today you will learn 5 new words and how to form simple plurals in English.',
    vocab: [
      { en: 'app', pt: 'aplicativo', example: 'I have many apps on my phone.' },
      { en: 'program', pt: 'programa', example: 'This program is easy to use.' },
      { en: 'file', pt: 'arquivo', example: 'I have three files open.' },
      { en: 'report', pt: 'relatório', example: 'The reports are ready.' },
      { en: 'tool', pt: 'ferramenta', example: 'Excel is a great tool.' },
    ],
    situation:
      'James shows a new user the main apps used at Czarnikow.',
    readAloud: [
      'I use three apps every day.',
      'The programs are on my laptop.',
      'My files are in the folder.',
      'The reports are ready.',
      'These tools are easy to use.',
    ],
    ex2: {
      title: '2. Escreva no plural (Write the plural)',
      prompt:
        'Passe para o plural.<br>a) one app → two ______<br>b) one program → five ______<br>c) one file → many ______<br>d) one report → three ______<br>e) one tool → useful ______<br>f) one email → ten ______<br>g) one message → new ______<br>h) one user → two ______<br>i) one computer → four ______<br>j) one laptop → new ______',
      answers: [
        'a) apps',
        'b) programs',
        'c) files',
        'd) reports',
        'e) tools',
        'f) emails',
        'g) messages',
        'h) users',
        'i) computers',
        'j) laptops',
      ],
    },
    ex3: {
      words: 'app, program, file, report, tool',
      prompt:
        'Complete com: <em>app, program, file, report, tool</em> (no singular ou plural).<br>a) I open the chat ______ in the morning.<br>b) Excel is a strong ______ for numbers.<br>c) The ______ is saved on my laptop.<br>d) Please send the ______ by email.<br>e) I have ten ______ in this folder.<br>f) This ______ is new on my phone.<br>g) The IT team installs every ______ .<br>h) We use three ______ every day.<br>i) The ______ shows sales per month.<br>j) Save the ______ before you close.',
      answers: [
        'a) app',
        'b) tool',
        'c) file',
        'd) report',
        'e) files',
        'f) app',
        'g) program',
        'h) tools / programs / apps',
        'i) report',
        'j) file',
      ],
    },
    wrapup:
      '💛 Agora você fala sobre programas e arquivos. Excelente!',
    takeaways: [
      'I use three apps every day.',
      'The programs are easy to use.',
      'My files are in the folder.',
      'The reports are ready.',
      'Excel is a strong tool.',
      'I have many emails today.',
      'The messages are short.',
      'Two users share this computer.',
      'We use new tools every month.',
      'My apps are on my phone.',
    ],
    deepDive: {
      title: 'Regular plurals in English',
      explanation:
        '<p>A maioria dos substantivos em inglês forma o plural com <strong>-s</strong>: <em>app → apps, program → programs, file → files</em>.</p><p>Palavras terminadas em <em>-s, -sh, -ch, -x</em> recebem <strong>-es</strong>: <em>message → messages</em> (já termina em -e, só adiciona -s), <em>box → boxes</em>.</p><p>Palavras em consoante + <em>-y</em> trocam y por <strong>-ies</strong>: <em>company → companies</em>.</p><p>💛 <em>Dica:</em> no começo, foque em simplesmente adicionar -s. Isso já resolve 90% dos casos.</p>',
      examples: [
        { en: 'I use many apps.', pt: 'Eu uso muitos aplicativos.' },
        { en: 'These programs are new.', pt: 'Estes programas são novos.' },
        { en: 'My files are safe.', pt: 'Meus arquivos estão seguros.' },
        { en: 'The reports are long.', pt: 'Os relatórios são longos.' },
        { en: 'Excel has great tools.', pt: 'O Excel tem ótimas ferramentas.' },
        { en: 'I have ten emails.', pt: 'Eu tenho dez e-mails.' },
        { en: 'The messages are short.', pt: 'As mensagens são curtas.' },
        { en: 'Two users share one laptop.', pt: 'Dois usuários compartilham um notebook.' },
        { en: 'We use four computers.', pt: 'Nós usamos quatro computadores.' },
        { en: 'The companies are global.', pt: 'As empresas são globais.' },
        { en: 'The boxes are heavy.', pt: 'As caixas são pesadas.' },
        { en: 'My charger is new, but my cables are old.', pt: 'Meu carregador é novo, mas meus cabos são velhos.' },
      ],
      mistakes: [
        { wrong: 'I have many app.', right: 'I have many apps.', note: 'Many pede plural.' },
        { wrong: 'Two file.', right: 'Two files.', note: 'Sempre que o número for > 1, use plural.' },
        { wrong: 'Three companys.', right: 'Three companies.', note: 'Consoante + y → ies.' },
        { wrong: 'Many messagees.', right: 'Many messages.', note: 'Message termina em -e: só adicione -s.' },
        { wrong: 'The reports is long.', right: 'The reports are long.', note: 'Plural pede are.' },
      ],
      practice: [
        { q: 'I use three (app) ______ daily.', a: 'apps' },
        { q: 'These (program) ______ are new.', a: 'programs' },
        { q: 'My (file) ______ are on the server.', a: 'files' },
        { q: 'We have ten (report) ______ .', a: 'reports' },
        { q: 'Excel has many (tool) ______ .', a: 'tools' },
      ],
    },
    rolePlay: {
      title: 'Which apps do you use?',
      setup:
        'James quer saber quais apps e programas você usa no trabalho.',
      studentA:
        'Liste 3 apps e 3 programas. Use plurais.',
      studentB:
        'Seja James. Faça perguntas sobre os apps e programas.',
      sampleDialogue: [
        'James: Which apps do you use every day?',
        'You: I use three apps: email, chat and calendar.',
        'James: And programs?',
        'You: I use Excel, Word and a reports tool.',
        'James: Great. The IT team has more tools for your team.',
      ],
      successCriteria:
        'Usar pelo menos 5 plurais corretamente.',
      teacherNotes:
        '💛 Peça para o aluno mostrar o celular / tela e nomear os apps.',
    },
    audioTranscript:
      'At Czarnikow, every employee uses a few key apps and programs. Our main tools are email, chat, video calls, spreadsheets and the reports system. The files are stored on the server and the reports are shared with the team. If you need more apps for your work, just ask the IT team.',
  },
  {
    num: 1165,
    order: 5,
    title: 'Turning On and Off',
    grammar: 'Imperativos simples',
    grammarShort: 'imperativos',
    focus: 'IT Foundations',
    objective:
      'Dar instruções simples de como ligar e desligar equipamentos com o imperativo.',
    intro:
      '💛 <em>Instructions win against guessing every time.</em><br><br>Before you work, you must <strong>turn on</strong> your computer. At the end of the day, you must <strong>turn off</strong> the screen. Today you will learn simple instructions in the imperative — the form we use for commands.',
    vocab: [
      { en: 'turn on', pt: 'ligar', example: 'Turn on your laptop.' },
      { en: 'turn off', pt: 'desligar', example: 'Turn off the monitor.' },
      { en: 'plug in', pt: 'conectar na tomada', example: 'Plug in the charger.' },
      { en: 'unplug', pt: 'desconectar', example: 'Unplug the cable.' },
      { en: 'restart', pt: 'reiniciar', example: 'Restart the computer.' },
    ],
    situation:
      'James explains, step by step, how to turn on and off the workstation safely.',
    readAloud: [
      'Turn on your laptop.',
      'Plug in the charger.',
      'Restart the computer, please.',
      'Turn off the monitor at 6 pm.',
      'Unplug the cable before you leave.',
    ],
    ex2: {
      title: '2. Complete com o imperativo certo',
      prompt:
        'Use: <em>turn on, turn off, plug in, unplug, restart</em>.<br>a) ______ your laptop in the morning.<br>b) ______ the monitor before you go home.<br>c) ______ the charger into the wall.<br>d) ______ the cable carefully.<br>e) If the system is slow, ______ the computer.<br>f) ______ the printer if you need to print.<br>g) ______ the screen at 6 pm.<br>h) ______ the mouse if it doesn\'t work.<br>i) ______ the laptop to save battery.<br>j) ______ the Wi-Fi if it stops.',
      answers: [
        'a) Turn on',
        'b) Turn off',
        'c) Plug in',
        'd) Unplug',
        'e) restart',
        'f) Turn on',
        'g) Turn off',
        'h) Unplug (or Restart)',
        'i) Turn off',
        'j) Restart',
      ],
    },
    ex3: {
      words: 'turn on, turn off, plug in, unplug, restart',
      prompt:
        'Complete com o verbo correto.<br>a) Please ______ the printer.<br>b) ______ the charger now, the battery is 5%.<br>c) ______ the Wi-Fi router — it is frozen.<br>d) At night, ______ your screen.<br>e) ______ the old mouse and try a new one.<br>f) ______ the laptop when you start work.<br>g) ______ the system to apply the update.<br>h) ______ the cable from the wall.<br>i) ______ the computer before maintenance.<br>j) ______ all the monitors on Monday.',
      answers: [
        'a) turn on',
        'b) Plug in',
        'c) Restart',
        'd) turn off',
        'e) Unplug',
        'f) Turn on',
        'g) Restart',
        'h) Unplug',
        'i) Turn off',
        'j) Turn on',
      ],
    },
    wrapup:
      '💛 Você já dá instruções em inglês. Pequenas frases, grande efeito.',
    takeaways: [
      'Turn on your laptop.',
      'Turn off the monitor.',
      'Plug in the charger.',
      'Unplug the old cable.',
      'Restart the computer.',
      'Turn on the printer, please.',
      'Turn off the screen at 6 pm.',
      'Plug in the new device.',
      'Restart the system after the update.',
      'Unplug the mouse if it is broken.',
    ],
    deepDive: {
      title: 'The imperative — giving simple instructions',
      explanation:
        '<p>O <strong>imperativo</strong> em inglês é simples: use o verbo no infinitivo, <em>sem</em> sujeito.<br>Ex.: <em>Turn on the laptop. Restart the system. Plug in the charger.</em></p><p>Para a forma educada, adicione <strong>please</strong> no começo ou no fim: <em>Please turn off the monitor. Turn off the monitor, please.</em></p><p>Para a forma negativa, use <strong>Don\'t</strong>: <em>Don\'t unplug the cable.</em></p><p>💛 <em>Dica:</em> o imperativo é direto, mas <em>please</em> faz toda a diferença no tom.</p>',
      examples: [
        { en: 'Turn on your laptop.', pt: 'Ligue seu notebook.' },
        { en: 'Turn off the monitor.', pt: 'Desligue o monitor.' },
        { en: 'Plug in the charger.', pt: 'Conecte o carregador.' },
        { en: 'Unplug the cable.', pt: 'Desconecte o cabo.' },
        { en: 'Restart the computer.', pt: 'Reinicie o computador.' },
        { en: 'Please turn on the printer.', pt: 'Por favor, ligue a impressora.' },
        { en: 'Don\'t turn off the server.', pt: 'Não desligue o servidor.' },
        { en: 'Save your files before you go.', pt: 'Salve seus arquivos antes de sair.' },
        { en: 'Close the program and restart it.', pt: 'Feche o programa e reinicie-o.' },
        { en: 'Check the cable, please.', pt: 'Verifique o cabo, por favor.' },
        { en: 'Don\'t unplug the router.', pt: 'Não desconecte o roteador.' },
        { en: 'Update your password today.', pt: 'Atualize sua senha hoje.' },
      ],
      mistakes: [
        { wrong: 'You turn on the laptop.', right: 'Turn on the laptop.', note: 'No imperativo, não usamos o sujeito you.' },
        { wrong: 'To turn off the screen.', right: 'Turn off the screen.', note: 'Não usamos to no imperativo.' },
        { wrong: 'No unplug the cable.', right: 'Don\'t unplug the cable.', note: 'Forma negativa: Don\'t + verbo.' },
        { wrong: 'Please to restart the system.', right: 'Please restart the system.', note: 'Please + verbo, sem to.' },
        { wrong: 'Turns on the laptop.', right: 'Turn on the laptop.', note: 'O imperativo não recebe -s.' },
      ],
      practice: [
        { q: '___ on the laptop.', a: 'Turn' },
        { q: '___ off the monitor, please.', a: 'Turn' },
        { q: '___ in the charger.', a: 'Plug' },
        { q: '___ the computer after the update.', a: 'Restart' },
        { q: '___ unplug the server.', a: 'Don\'t' },
      ],
    },
    rolePlay: {
      title: 'Step by step with James',
      setup:
        'James te guia, passo a passo, para ligar e configurar o laptop.',
      studentA:
        'Seja o usuário. Siga as instruções e confirme cada passo.',
      studentB:
        'Seja James. Dê 5 instruções no imperativo.',
      sampleDialogue: [
        'James: Turn on your laptop.',
        'You: OK, the laptop is on.',
        'James: Plug in the charger, please.',
        'You: Done.',
        'James: Now open your email and restart the chat app if it is slow.',
        'You: OK. Thank you, James.',
      ],
      successCriteria:
        'Entender e seguir 5 imperativos diferentes.',
      teacherNotes:
        '💛 Faça o aluno repetir os comandos e executar no laptop real.',
    },
    audioTranscript:
      'Every morning, turn on your laptop and plug in the charger if the battery is low. Open your email and your chat app. If the system is slow, restart the computer — it often solves the problem. At the end of the day, turn off the monitor and, please, don\'t unplug the cables from the wall.',
  },
  {
    num: 1166,
    order: 6,
    title: 'Password Please',
    grammar: 'Polite requests + can',
    grammarShort: 'polite can',
    focus: 'IT Foundations',
    objective:
      'Pedir e oferecer ajuda com senhas usando can e polite expressions.',
    intro:
      '💛 <em>Polite English opens more doors than fast English.</em><br><br>Every user at Czarnikow has a <strong>password</strong>. Sometimes, you forget it — it happens! Today you will learn how to ask politely for help with <em>Can you…?</em> and <em>Can I…?</em>',
    vocab: [
      { en: 'password', pt: 'senha', example: 'My password is secret.' },
      { en: 'username', pt: 'nome de usuário', example: 'What is your username?' },
      { en: 'login', pt: 'login / entrar', example: 'I can\'t login today.' },
      { en: 'reset', pt: 'redefinir', example: 'Can you reset my password?' },
      { en: 'help', pt: 'ajuda / ajudar', example: 'Can you help me?' },
    ],
    situation:
      'A user forgot her password. She calls James politely to ask for help.',
    readAloud: [
      'Can you help me, please?',
      'Can I have a new password?',
      'Can you reset my login?',
      'Can you check my username?',
      'Can I call you later?',
    ],
    ex2: {
      title: '2. Complete com Can I ou Can you',
      prompt:
        'Escolha a forma correta.<br>a) ______ help me with my password?<br>b) ______ have a new login?<br>c) ______ reset the system, please?<br>d) ______ ask a question?<br>e) ______ check my email?<br>f) ______ send me the new password?<br>g) ______ try again?<br>h) ______ come to my desk, please?<br>i) ______ call you in 5 minutes?<br>j) ______ update my username?',
      answers: [
        'a) Can you',
        'b) Can I',
        'c) Can you',
        'd) Can I',
        'e) Can you',
        'f) Can you',
        'g) Can I',
        'h) Can you',
        'i) Can I',
        'j) Can you',
      ],
    },
    ex3: {
      words: 'password, username, login, reset, help',
      prompt:
        'Complete com: <em>password, username, login, reset, help</em>.<br>a) I forgot my ______ .<br>b) Please ______ my account.<br>c) My ______ is not working today.<br>d) What is your ______?<br>e) Can you ______ me, please?<br>f) The IT team can ______ the system.<br>g) Write a strong ______ .<br>h) Your ______ is your email address.<br>i) The ______ screen is open.<br>j) James can ______ you.',
      answers: [
        'a) password',
        'b) reset',
        'c) login',
        'd) username',
        'e) help',
        'f) reset',
        'g) password',
        'h) username',
        'i) login',
        'j) help',
      ],
    },
    wrapup:
      '💛 Pedir ajuda é parte de aprender. Use can + please sempre.',
    takeaways: [
      'Can you help me, please?',
      'Can I have a new password?',
      'Can you reset my login?',
      'I forgot my password.',
      'What is my username?',
      'Can you check the system?',
      'Thank you for your help.',
      'Can I ask a question?',
      'Please reset my account.',
      'The IT team can help.',
    ],
    deepDive: {
      title: 'Polite requests with "can"',
      explanation:
        '<p><strong>Can</strong> é um verbo modal muito usado para pedidos educados.</p><p>• <em>Can you …?</em> — pedindo para a outra pessoa fazer algo: <em>Can you help me?</em><br>• <em>Can I …?</em> — pedindo permissão para você fazer algo: <em>Can I use your laptop?</em></p><p>Sempre adicione <strong>please</strong> para soar mais educado.<br>Para responder: <em>Yes, of course. / Sure. / No problem.</em></p><p>💛 <em>Dica:</em> <em>Could you…?</em> é ainda mais formal, mas no começo, <em>Can you…?</em> é perfeito.</p>',
      examples: [
        { en: 'Can you help me, please?', pt: 'Você pode me ajudar, por favor?' },
        { en: 'Can I have a new password?', pt: 'Posso pegar uma nova senha?' },
        { en: 'Can you reset my login?', pt: 'Você pode redefinir meu login?' },
        { en: 'Can I ask a question?', pt: 'Posso fazer uma pergunta?' },
        { en: 'Can you check the system?', pt: 'Você pode verificar o sistema?' },
        { en: 'Can I call you later?', pt: 'Posso te ligar depois?' },
        { en: 'Can you send me the password?', pt: 'Você pode me enviar a senha?' },
        { en: 'Can I try again?', pt: 'Posso tentar de novo?' },
        { en: 'Can you come to my desk?', pt: 'Você pode vir até minha mesa?' },
        { en: 'Can I use your charger?', pt: 'Posso usar seu carregador?' },
        { en: 'Can you update my username?', pt: 'Você pode atualizar meu nome de usuário?' },
        { en: 'Can I have more information?', pt: 'Posso ter mais informação?' },
      ],
      mistakes: [
        { wrong: 'Can you to help me?', right: 'Can you help me?', note: 'Depois de can, o verbo vem sem to.' },
        { wrong: 'Can I helps you?', right: 'Can I help you?', note: 'Depois de can, o verbo fica no infinitivo sem -s.' },
        { wrong: 'You can helps me?', right: 'Can you help me?', note: 'Em pedidos, inverta: Can + you.' },
        { wrong: 'Please can reset my password?', right: 'Can you reset my password, please?', note: 'Please normalmente vai no fim ou antes de can.' },
        { wrong: 'I can have a new password?', right: 'Can I have a new password?', note: 'Em perguntas, can vem antes do sujeito.' },
      ],
      practice: [
        { q: '___ you help me, please?', a: 'Can' },
        { q: '___ I have a new password?', a: 'Can' },
        { q: 'Can you ___ my login?', a: 'reset' },
        { q: 'Can I ___ a question?', a: 'ask' },
        { q: 'Can you ___ me the password?', a: 'send' },
      ],
    },
    rolePlay: {
      title: 'I forgot my password',
      setup:
        'Você esqueceu a senha de manhã e precisa da ajuda do James.',
      studentA:
        'Seja o usuário. Peça ajuda educadamente com can + please.',
      studentB:
        'Seja James. Ajude, faça uma pergunta e redefina a senha.',
      sampleDialogue: [
        'You: Hi James. Can you help me, please? I forgot my password.',
        'James: Sure. Can I have your username?',
        'You: Yes, it is ana.silva.',
        'James: OK. Can you try again in one minute? I am resetting the password now.',
        'You: Thank you very much, James!',
        'James: You are welcome.',
      ],
      successCriteria:
        'Usar Can you…? e Can I…? corretamente com please.',
      teacherNotes:
        '💛 Foque na entonação educada. Repita 2 vezes.',
    },
    audioTranscript:
      'Good morning, IT help desk, James speaking. Can I help you? I see — you forgot your password. No problem, it happens every week. Can you give me your username, please? Thank you. Can you try to login in one minute? I am resetting your password now.',
  },
  {
    num: 1167,
    order: 7,
    title: 'Email Basics',
    grammar: 'Have / Has',
    grammarShort: 'have / has',
    focus: 'IT Foundations',
    objective:
      'Falar sobre e-mails e caixa de entrada usando have e has.',
    intro:
      '💛 <em>A little every day is better than a lot once.</em><br><br>At Czarnikow, every employee <strong>has</strong> an email address. Today you will learn to talk about your inbox using <em>have</em> (I/you/we/they) and <em>has</em> (he/she/it).',
    vocab: [
      { en: 'email', pt: 'e-mail', example: 'I have five new emails.' },
      { en: 'inbox', pt: 'caixa de entrada', example: 'My inbox is full.' },
      { en: 'subject', pt: 'assunto', example: 'The subject is clear.' },
      { en: 'attachment', pt: 'anexo', example: 'The email has an attachment.' },
      { en: 'reply', pt: 'resposta / responder', example: 'I have three replies.' },
    ],
    situation:
      'James asks about the user\'s inbox and shows how to use email at Czarnikow.',
    readAloud: [
      'I have five new emails.',
      'She has one attachment.',
      'We have a full inbox today.',
      'The email has a clear subject.',
      'He has two replies to send.',
    ],
    ex2: {
      title: '2. Complete com have ou has',
      prompt:
        'Escolha a forma correta.<br>a) I ______ ten emails.<br>b) She ______ a new inbox.<br>c) The email ______ an attachment.<br>d) We ______ many replies.<br>e) He ______ one message.<br>f) They ______ two meetings today.<br>g) My laptop ______ fast email.<br>h) You ______ a clear subject line.<br>i) The team ______ a shared inbox.<br>j) I ______ no time to reply now.',
      answers: [
        'a) have',
        'b) has',
        'c) has',
        'd) have',
        'e) has',
        'f) have',
        'g) has',
        'h) have',
        'i) has',
        'j) have',
      ],
    },
    ex3: {
      words: 'email, inbox, subject, attachment, reply',
      prompt:
        'Complete com: <em>email, inbox, subject, attachment, reply</em>.<br>a) My ______ is full this morning.<br>b) Write a clear ______ for every ______ .<br>c) Please send a quick ______ .<br>d) The ______ has the report.<br>e) I have twenty ______ today.<br>f) Open the ______ with care.<br>g) Her ______ is short and polite.<br>h) The IT ______ address is help@czarnikow.com.<br>i) Clean your ______ every week.<br>j) The ______ line is important.',
      answers: [
        'a) inbox',
        'b) subject / email',
        'c) reply',
        'd) attachment',
        'e) emails',
        'f) attachment',
        'g) reply',
        'h) email',
        'i) inbox',
        'j) subject',
      ],
    },
    wrapup:
      '💛 Você já domina o básico do e-mail em inglês. Mande bem!',
    takeaways: [
      'I have five new emails.',
      'She has one attachment.',
      'We have a full inbox today.',
      'The email has a clear subject.',
      'He has two replies to send.',
      'Do you have a minute?',
      'The team has a shared inbox.',
      'My email has no attachments.',
      'You have a new message.',
      'James has an urgent reply.',
    ],
    deepDive: {
      title: '"Have" and "has" — possession in the present',
      explanation:
        '<p><strong>Have</strong> e <strong>has</strong> são usados para dizer o que alguém tem.</p><p>• <em>I / you / we / they</em> → <strong>have</strong><br>• <em>He / she / it</em> → <strong>has</strong></p><p>Na negativa: <em>don\'t have / doesn\'t have</em>.<br>Na pergunta: <em>Do you have …? / Does she have …?</em></p><p>💛 <em>Dica:</em> no inglês falado, também usamos <em>have got / has got</em>: <em>I\'ve got five emails.</em></p>',
      examples: [
        { en: 'I have ten emails.', pt: 'Eu tenho dez e-mails.' },
        { en: 'She has one attachment.', pt: 'Ela tem um anexo.' },
        { en: 'We have a full inbox.', pt: 'Nós temos uma caixa de entrada cheia.' },
        { en: 'The email has a clear subject.', pt: 'O e-mail tem um assunto claro.' },
        { en: 'He has two replies.', pt: 'Ele tem duas respostas.' },
        { en: 'Do you have a minute?', pt: 'Você tem um minuto?' },
        { en: 'Does she have my email?', pt: 'Ela tem o meu e-mail?' },
        { en: 'I don\'t have any attachments.', pt: 'Eu não tenho nenhum anexo.' },
        { en: 'He doesn\'t have the new password.', pt: 'Ele não tem a nova senha.' },
        { en: 'The team has a shared inbox.', pt: 'O time tem uma caixa compartilhada.' },
        { en: 'My laptop has a fast email client.', pt: 'Meu notebook tem um cliente de e-mail rápido.' },
        { en: 'You have a new message.', pt: 'Você tem uma nova mensagem.' },
      ],
      mistakes: [
        { wrong: 'She have a new email.', right: 'She has a new email.', note: 'Com he/she/it, use has.' },
        { wrong: 'I has ten emails.', right: 'I have ten emails.', note: 'Com I, use have.' },
        { wrong: 'He don\'t have the password.', right: 'He doesn\'t have the password.', note: 'Com he/she/it, use doesn\'t.' },
        { wrong: 'Do she have my email?', right: 'Does she have my email?', note: 'Com he/she/it, use does.' },
        { wrong: 'We has a meeting.', right: 'We have a meeting.', note: 'Com we, use have.' },
      ],
      practice: [
        { q: 'I ___ five new emails.', a: 'have' },
        { q: 'She ___ one attachment.', a: 'has' },
        { q: 'We ___ a full inbox today.', a: 'have' },
        { q: 'He ___ two replies to send.', a: 'has' },
        { q: 'The email ___ a clear subject.', a: 'has' },
      ],
    },
    rolePlay: {
      title: 'How is your inbox today?',
      setup:
        'James pergunta como está a caixa de entrada e se há e-mails urgentes.',
      studentA:
        'Seja o usuário. Diga quantos e-mails e anexos você tem.',
      studentB:
        'Seja James. Use Do you have…? e Does she have…?',
      sampleDialogue: [
        'James: Good morning. Do you have many new emails?',
        'You: Yes, I have fifteen emails. Three have attachments.',
        'James: Does Maria have the report?',
        'You: Yes, she has it. She has a reply ready too.',
        'James: Perfect. I have one more question for you.',
      ],
      successCriteria:
        'Usar have e has corretamente pelo menos 4 vezes.',
      teacherNotes:
        '💛 Peça para o aluno abrir o e-mail real e descrever.',
    },
    audioTranscript:
      'Good morning! Let me check my inbox. I have twenty new emails today. The CEO has one urgent email for the team, and Maria has a reply waiting for us. Every email has a clear subject, and three of them have attachments. Please reply to the urgent email first.',
  },
  {
    num: 1168,
    order: 8,
    title: 'Internet and Wi-Fi',
    grammar: 'Preposições — at, in, on',
    grammarShort: 'preposições',
    focus: 'IT Foundations',
    objective:
      'Falar sobre a internet e o Wi-Fi usando preposições básicas.',
    intro:
      '💛 <em>Small words, big meaning.</em><br><br>At Czarnikow, we work <strong>on</strong> the internet and <strong>on</strong> Wi-Fi every day. The network is <strong>in</strong> the office. You are <strong>at</strong> your desk. Today you will learn the 3 most useful prepositions: <em>at</em>, <em>in</em>, <em>on</em>.',
    vocab: [
      { en: 'internet', pt: 'internet', example: 'I am on the internet.' },
      { en: 'Wi-Fi', pt: 'Wi-Fi', example: 'The Wi-Fi is in the office.' },
      { en: 'connection', pt: 'conexão', example: 'My connection is slow.' },
      { en: 'router', pt: 'roteador', example: 'The router is on the wall.' },
      { en: 'speed', pt: 'velocidade', example: 'The speed is very good today.' },
    ],
    situation:
      'James explains where the Wi-Fi works and helps a user connect.',
    readAloud: [
      'I am at my desk.',
      'The router is on the wall.',
      'The Wi-Fi is in the office.',
      'We are on the internet.',
      'The speed is good today.',
    ],
    ex2: {
      title: '2. Complete com at, in ou on',
      prompt:
        'Escolha a preposição certa.<br>a) I am ___ my desk.<br>b) The router is ___ the wall.<br>c) The Wi-Fi is ___ the office.<br>d) We are ___ the internet.<br>e) The meeting is ___ 3 pm.<br>f) Your laptop is ___ the desk.<br>g) The team is ___ London.<br>h) There is a problem ___ the network.<br>i) I work ___ the second floor.<br>j) The password is ___ the paper.',
      answers: [
        'a) at',
        'b) on',
        'c) in',
        'd) on',
        'e) at',
        'f) on',
        'g) in',
        'h) on',
        'i) on',
        'j) on',
      ],
    },
    ex3: {
      words: 'internet, Wi-Fi, connection, router, speed',
      prompt:
        'Complete com: <em>internet, Wi-Fi, connection, router, speed</em>.<br>a) The ______ is down today.<br>b) The ______ password is on the wall.<br>c) My ______ is very slow.<br>d) Please restart the ______ .<br>e) The ______ of the network is good.<br>f) I use the ______ every minute.<br>g) The ______ is in every meeting room.<br>h) A strong ______ helps video calls.<br>i) The ______ is green — everything works.<br>j) Fast ______ is important for work.',
      answers: [
        'a) internet',
        'b) Wi-Fi',
        'c) connection',
        'd) router',
        'e) speed',
        'f) internet',
        'g) Wi-Fi',
        'h) connection',
        'i) router',
        'j) speed',
      ],
    },
    wrapup:
      '💛 Agora você fala sobre internet com as preposições certas. Mais um passo!',
    takeaways: [
      'I am at my desk.',
      'The router is on the wall.',
      'The Wi-Fi is in the office.',
      'We are on the internet.',
      'The meeting is at 3 pm.',
      'My connection is slow today.',
      'The speed is very good.',
      'The team is in London.',
      'There is a problem on the network.',
      'I work on the second floor.',
    ],
    deepDive: {
      title: 'Prepositions: at, in, on',
      explanation:
        '<p>Estas 3 preposições são as mais usadas em inglês:</p><p>• <strong>at</strong> — ponto específico: <em>at the desk, at 3 pm, at home</em>.<br>• <strong>in</strong> — dentro de: <em>in the office, in London, in the morning</em>.<br>• <strong>on</strong> — em cima / sobre uma superfície: <em>on the wall, on the desk, on the internet</em>.</p><p>💛 <em>Dica:</em> no começo, memorize blocos inteiros: <em>at work, in the office, on the internet</em>.</p>',
      examples: [
        { en: 'I am at my desk.', pt: 'Eu estou na minha mesa.' },
        { en: 'The router is on the wall.', pt: 'O roteador está na parede.' },
        { en: 'The Wi-Fi is in the office.', pt: 'O Wi-Fi está no escritório.' },
        { en: 'We are on the internet.', pt: 'Nós estamos na internet.' },
        { en: 'The meeting is at 3 pm.', pt: 'A reunião é às 3 da tarde.' },
        { en: 'James is in London.', pt: 'James está em Londres.' },
        { en: 'The laptop is on the desk.', pt: 'O notebook está na mesa.' },
        { en: 'I work on the second floor.', pt: 'Eu trabalho no segundo andar.' },
        { en: 'There is a note on the screen.', pt: 'Há uma nota na tela.' },
        { en: 'The password is on the paper.', pt: 'A senha está no papel.' },
        { en: 'She is at home today.', pt: 'Ela está em casa hoje.' },
        { en: 'We are in a video call.', pt: 'Nós estamos em uma videochamada.' },
      ],
      mistakes: [
        { wrong: 'I am in my desk.', right: 'I am at my desk.', note: 'No lugar específico do trabalho, use at.' },
        { wrong: 'The meeting is in 3 pm.', right: 'The meeting is at 3 pm.', note: 'Com horário, use at.' },
        { wrong: 'The router is in the wall.', right: 'The router is on the wall.', note: 'Na superfície, use on.' },
        { wrong: 'I live at London.', right: 'I live in London.', note: 'Cidades e países, use in.' },
        { wrong: 'We are in internet.', right: 'We are on the internet.', note: 'On the internet é expressão fixa.' },
      ],
      practice: [
        { q: 'I am ___ my desk.', a: 'at' },
        { q: 'The Wi-Fi is ___ the office.', a: 'in' },
        { q: 'The router is ___ the wall.', a: 'on' },
        { q: 'The meeting is ___ 3 pm.', a: 'at' },
        { q: 'We are ___ the internet.', a: 'on' },
      ],
    },
    rolePlay: {
      title: 'Wi-Fi is not working',
      setup:
        'Você não consegue se conectar. James pergunta onde você está e o que vê.',
      studentA:
        'Seja o usuário. Descreva sua localização e o problema usando at, in, on.',
      studentB:
        'Seja James. Faça perguntas curtas e peça ações.',
      sampleDialogue: [
        'James: Where are you now?',
        'You: I am at my desk, in the London office, on the second floor.',
        'James: OK. Is your laptop on the network?',
        'You: No, I am not on the Wi-Fi. The connection is down.',
        'James: Please restart the router on the wall.',
        'You: OK, done. I am on the internet now. Thank you!',
      ],
      successCriteria:
        'Usar at, in, on corretamente pelo menos 2 vezes cada.',
      teacherNotes:
        '💛 Peça para o aluno apontar para objetos reais ao dizer as preposições.',
    },
    audioTranscript:
      'Let me describe our office network. The main router is on the wall, in the IT room, on the second floor. The Wi-Fi works in every meeting room. Every employee is on the internet all day. If your connection is slow, check that you are at your desk and not in the basement, where the signal is weak.',
  },
  {
    num: 1169,
    order: 9,
    title: 'A Simple IT Problem',
    grammar: 'Adjetivos — ordem e uso básico',
    grammarShort: 'adjetivos',
    focus: 'IT Foundations',
    objective:
      'Descrever problemas simples de TI usando adjetivos básicos.',
    intro:
      '💛 <em>Name the problem and half of it is solved.</em><br><br>Every day, users report small problems: the laptop is <strong>slow</strong>, the screen is <strong>dark</strong>, the connection is <strong>bad</strong>. Today you will learn 5 adjetivos úteis e como usá-los em frases curtas.',
    vocab: [
      { en: 'slow', pt: 'lento', example: 'My laptop is slow today.' },
      { en: 'broken', pt: 'quebrado', example: 'The mouse is broken.' },
      { en: 'frozen', pt: 'travado', example: 'The screen is frozen.' },
      { en: 'dark', pt: 'escuro', example: 'The screen is dark.' },
      { en: 'bad', pt: 'ruim', example: 'The connection is bad.' },
    ],
    situation:
      'A user reports simple problems. James listens and asks short questions.',
    readAloud: [
      'My laptop is slow.',
      'The mouse is broken.',
      'The screen is frozen.',
      'The connection is bad.',
      'The room is dark.',
    ],
    ex2: {
      title: '2. Complete com o adjetivo certo',
      prompt:
        'Use: <em>slow, broken, frozen, dark, bad</em>.<br>a) My laptop is very ______ this morning.<br>b) The mouse is ______ — it doesn\'t click.<br>c) The screen is ______ again.<br>d) The meeting room is ______ , please turn on the light.<br>e) The connection is ______ in the basement.<br>f) This program is really ______ .<br>g) The keyboard is ______ — 3 keys don\'t work.<br>h) The system is ______ — I need to restart.<br>i) My Wi-Fi speed is ______ today.<br>j) The monitor is ______ , I can\'t see.',
      answers: [
        'a) slow',
        'b) broken',
        'c) frozen',
        'd) dark',
        'e) bad',
        'f) slow',
        'g) broken',
        'h) frozen',
        'i) bad',
        'j) dark',
      ],
    },
    ex3: {
      words: 'slow, broken, frozen, dark, bad',
      prompt:
        'Escreva o oposto ou complete com o adjetivo correto.<br>a) Fast ↔ ______<br>b) New ↔ ______ (quebrado)<br>c) Working ↔ ______<br>d) Bright ↔ ______<br>e) Good ↔ ______<br>f) The ______ computer needs repair.<br>g) A ______ connection is frustrating.<br>h) The ______ screen is hard to read.<br>i) A ______ mouse is useless.<br>j) A ______ laptop wastes time.',
      answers: [
        'a) slow',
        'b) broken',
        'c) frozen (or broken)',
        'd) dark',
        'e) bad',
        'f) broken',
        'g) bad (or slow)',
        'h) dark',
        'i) broken',
        'j) slow',
      ],
    },
    wrapup:
      '💛 Descrever problemas ajuda a resolver problemas. Ótimo trabalho!',
    takeaways: [
      'My laptop is slow.',
      'The mouse is broken.',
      'The screen is frozen.',
      'The connection is bad.',
      'The room is dark.',
      'The program is very slow.',
      'The keyboard is broken.',
      'The system is frozen again.',
      'The Wi-Fi is bad today.',
      'The monitor is too dark.',
    ],
    deepDive: {
      title: 'Adjectives: describing things simply',
      explanation:
        '<p>Em inglês, os <strong>adjetivos</strong> são simples:</p><p>• Vêm <em>antes</em> do substantivo: <em>a slow laptop, a broken mouse</em>.<br>• Ou depois de <em>to be</em>: <em>The laptop is slow. The mouse is broken.</em></p><p>Os adjetivos <strong>não mudam</strong> no plural: <em>a slow laptop / two slow laptops</em>.</p><p>💛 <em>Dica:</em> use adjetivos curtos e frequentes no começo: <em>good, bad, fast, slow, new, old</em>.</p>',
      examples: [
        { en: 'My laptop is slow.', pt: 'Meu notebook está lento.' },
        { en: 'The mouse is broken.', pt: 'O mouse está quebrado.' },
        { en: 'The screen is frozen.', pt: 'A tela está travada.' },
        { en: 'The connection is bad.', pt: 'A conexão está ruim.' },
        { en: 'The room is dark.', pt: 'A sala está escura.' },
        { en: 'This is a slow computer.', pt: 'Este é um computador lento.' },
        { en: 'A broken cable is dangerous.', pt: 'Um cabo quebrado é perigoso.' },
        { en: 'The frozen system needs a restart.', pt: 'O sistema travado precisa reiniciar.' },
        { en: 'Bad Wi-Fi ruins meetings.', pt: 'Wi-Fi ruim estraga reuniões.' },
        { en: 'A dark screen is hard to read.', pt: 'Uma tela escura é difícil de ler.' },
        { en: 'Two slow laptops.', pt: 'Dois notebooks lentos.' },
        { en: 'The new laptop is fast.', pt: 'O notebook novo é rápido.' },
      ],
      mistakes: [
        { wrong: 'A laptop slow.', right: 'A slow laptop.', note: 'Em inglês, adjetivo vem antes.' },
        { wrong: 'The laptop is slows.', right: 'The laptop is slow.', note: 'Adjetivos não recebem -s.' },
        { wrong: 'Two slows laptops.', right: 'Two slow laptops.', note: 'Adjetivos não mudam no plural.' },
        { wrong: 'The mouse broken.', right: 'The mouse is broken.', note: 'Use o verbo to be antes do adjetivo.' },
        { wrong: 'The screen very slow.', right: 'The screen is very slow.', note: 'Não esqueça de is.' },
      ],
      practice: [
        { q: 'My laptop is very ___ (lento).', a: 'slow' },
        { q: 'The mouse is ___ (quebrado).', a: 'broken' },
        { q: 'The screen is ___ (travada).', a: 'frozen' },
        { q: 'The Wi-Fi is ___ (ruim).', a: 'bad' },
        { q: 'The room is ___ (escura).', a: 'dark' },
      ],
    },
    rolePlay: {
      title: 'Reporting a problem',
      setup:
        'Você relata 3 pequenos problemas para o James.',
      studentA:
        'Seja o usuário. Use 3 adjetivos para descrever os problemas.',
      studentB:
        'Seja James. Confirme com short questions: Is it …? How …?',
      sampleDialogue: [
        'You: Hi James, my laptop is very slow today.',
        'James: Is the program frozen?',
        'You: Yes, and the connection is bad.',
        'James: OK. Is the screen dark too?',
        'You: No, the screen is fine, but the mouse is broken.',
        'James: Thank you. I am on my way.',
      ],
      successCriteria:
        'Usar 3 adjetivos diferentes em frases completas.',
      teacherNotes:
        '💛 Faça o aluno praticar a entonação: problema + adjetivo + pausa.',
    },
    audioTranscript:
      'I get reports like this every morning: the laptop is slow, the mouse is broken, the screen is frozen, the connection is bad, the room is dark. Most problems are small and easy to fix. The important thing is to describe the problem clearly: one short sentence, one adjective. That helps the IT team a lot.',
  },
  {
    num: 1170,
    order: 10,
    title: 'Calling IT Support',
    grammar: 'Can you…? — polite requests at work',
    grammarShort: 'can you',
    focus: 'IT Foundations',
    objective:
      'Ligar para o suporte de TI e pedir ajuda com frases educadas.',
    intro:
      '💛 <em>Asking for help is a power, not a weakness.</em><br><br>When you have a problem, <strong>call IT support</strong>. Today you will practise a short, polite phone call: hello, name, problem, thank you. Simple and effective.',
    vocab: [
      { en: 'support', pt: 'suporte', example: 'I need IT support.' },
      { en: 'issue', pt: 'problema', example: 'I have an issue with my laptop.' },
      { en: 'ticket', pt: 'chamado', example: 'Open a ticket, please.' },
      { en: 'urgent', pt: 'urgente', example: 'This is urgent.' },
      { en: 'fix', pt: 'consertar', example: 'Can you fix this?' },
    ],
    situation:
      'The user calls the IT help desk. James answers, takes the ticket and gives a simple instruction.',
    readAloud: [
      'Hello, I need IT support.',
      'I have an issue with my laptop.',
      'Can you open a ticket?',
      'This is urgent, please.',
      'Can you fix this today?',
    ],
    ex2: {
      title: '2. Organize a ligação (Order the call)',
      prompt:
        'Coloque em ordem do 1 ao 10 as frases de uma ligação típica.<br>a) Hello, IT support. How can I help you?<br>b) My laptop is very slow today.<br>c) Hi, this is Ana from the finance team.<br>d) Can you restart the laptop, please?<br>e) Is the problem urgent?<br>f) OK, I am opening a ticket now.<br>g) Yes, I have a meeting in 20 minutes.<br>h) I am restarting now.<br>i) Can you call me back in 5 minutes?<br>j) Thank you very much, James.',
      answers: [
        '1) a',
        '2) c',
        '3) b',
        '4) e',
        '5) g',
        '6) f',
        '7) d',
        '8) h',
        '9) i',
        '10) j',
      ],
    },
    ex3: {
      words: 'support, issue, ticket, urgent, fix',
      prompt:
        'Complete com: <em>support, issue, ticket, urgent, fix</em>.<br>a) I have an ______ with my email.<br>b) Please open a ______ .<br>c) This problem is ______ .<br>d) The IT ______ team is very fast.<br>e) Can you ______ the printer?<br>f) Your ______ number is 1234.<br>g) The ______ is small, not urgent.<br>h) Thank you for the ______ .<br>i) If it is ______ , call me now.<br>j) A good ______ saves a whole day.',
      answers: [
        'a) issue',
        'b) ticket',
        'c) urgent',
        'd) support',
        'e) fix',
        'f) ticket',
        'g) issue',
        'h) support',
        'i) urgent',
        'j) fix',
      ],
    },
    wrapup:
      '💛 Você já sabe ligar para o suporte em inglês. Muito bom!',
    takeaways: [
      'Hello, I need IT support.',
      'I have an issue with my laptop.',
      'Can you open a ticket?',
      'This is urgent, please.',
      'Can you fix this today?',
      'My ticket number is 1234.',
      'Thank you for your help.',
      'Can you call me back?',
      'The issue is small.',
      'IT support is fast here.',
    ],
    deepDive: {
      title: 'Polite language on a support call',
      explanation:
        '<p>Uma ligação educada em inglês segue um padrão simples:</p><p>1. <strong>Cumprimento:</strong> <em>Hello / Good morning.</em><br>2. <strong>Identificação:</strong> <em>This is Ana from finance.</em><br>3. <strong>Problema:</strong> <em>I have an issue with my laptop.</em><br>4. <strong>Pedido:</strong> <em>Can you help / fix / open a ticket, please?</em><br>5. <strong>Agradecimento:</strong> <em>Thank you very much.</em></p><p>💛 <em>Dica:</em> use <em>please</em> e <em>thank you</em> sempre. Soa mais profissional.</p>',
      examples: [
        { en: 'Hello, I need IT support.', pt: 'Olá, eu preciso do suporte de TI.' },
        { en: 'This is Ana from finance.', pt: 'Aqui é a Ana do financeiro.' },
        { en: 'I have an issue with my laptop.', pt: 'Eu tenho um problema com meu notebook.' },
        { en: 'Can you open a ticket, please?', pt: 'Você pode abrir um chamado, por favor?' },
        { en: 'This is urgent.', pt: 'Isto é urgente.' },
        { en: 'Can you fix this today?', pt: 'Você pode consertar isto hoje?' },
        { en: 'My ticket number is 1234.', pt: 'Meu número de chamado é 1234.' },
        { en: 'Can you call me back?', pt: 'Você pode me retornar a ligação?' },
        { en: 'Thank you for your help.', pt: 'Obrigado pela sua ajuda.' },
        { en: 'I appreciate the quick support.', pt: 'Agradeço o suporte rápido.' },
        { en: 'The issue is with the Wi-Fi.', pt: 'O problema é com o Wi-Fi.' },
        { en: 'Is the ticket already open?', pt: 'O chamado já está aberto?' },
      ],
      mistakes: [
        { wrong: 'I need help urgent.', right: 'I need urgent help. / This is urgent.', note: 'Adjetivo antes do substantivo.' },
        { wrong: 'Open ticket.', right: 'Can you open a ticket, please?', note: 'Imperativos curtos soam rudes ao telefone.' },
        { wrong: 'I have issue.', right: 'I have an issue.', note: 'Use o artigo a/an com issue singular.' },
        { wrong: 'Can you fixes this?', right: 'Can you fix this?', note: 'Depois de can, o verbo vem no infinitivo.' },
        { wrong: 'Please you help me?', right: 'Can you help me, please?', note: 'Order: Can + you + verbo + please.' },
      ],
      practice: [
        { q: 'Hello, I need IT ___ .', a: 'support' },
        { q: 'I have an ___ with my laptop.', a: 'issue' },
        { q: 'Can you open a ___ , please?', a: 'ticket' },
        { q: 'This is ___ .', a: 'urgent' },
        { q: 'Can you ___ this today?', a: 'fix' },
      ],
    },
    rolePlay: {
      title: 'The support call',
      setup:
        'Você liga para o help desk. Problema: laptop travado antes de uma reunião.',
      studentA:
        'Seja o usuário. Use os 5 passos: cumprimento, identificação, problema, pedido, agradecimento.',
      studentB:
        'Seja James. Abra o ticket e dê uma instrução curta.',
      sampleDialogue: [
        'James: Hello, IT support. How can I help you?',
        'You: Hi James, this is Ana from finance. I have an issue with my laptop. The screen is frozen.',
        'James: Is it urgent?',
        'You: Yes, I have a meeting in 15 minutes. Can you fix this, please?',
        'James: Of course. I am opening a ticket. Can you restart the laptop?',
        'You: OK, it is restarting now. Thank you very much, James.',
      ],
      successCriteria:
        'Seguir os 5 passos em ordem e usar please e thank you.',
      teacherNotes:
        '💛 Foco na entonação polida. Grave o áudio e ouça juntos.',
    },
    audioTranscript:
      'IT support, James speaking. How can I help you? I see — your laptop is frozen. Can you tell me your name and team, please? Thank you, Ana. I am opening a ticket now. Your ticket number is 1234. Can you restart the laptop while we stay on the call? Perfect. If it is still frozen in two minutes, call me back.',
  },
  {
    num: 1171,
    order: 11,
    title: 'Files and Folders',
    grammar: 'Substantivos contáveis — a / an / some',
    grammarShort: 'contáveis',
    focus: 'IT Foundations',
    objective:
      'Organizar arquivos usando a, an, some com substantivos contáveis.',
    intro:
      '💛 <em>Organized files, organized mind.</em><br><br>On your computer, there is <strong>a folder</strong>, <strong>a file</strong> and <strong>some documents</strong>. Today you will learn when to use <em>a</em>, <em>an</em> e <em>some</em>.',
    vocab: [
      { en: 'folder', pt: 'pasta', example: 'I have a new folder.' },
      { en: 'document', pt: 'documento', example: 'I read a document.' },
      { en: 'copy', pt: 'cópia', example: 'I have a copy of the file.' },
      { en: 'backup', pt: 'backup', example: 'Make a backup every week.' },
      { en: 'version', pt: 'versão', example: 'This is the new version.' },
    ],
    situation:
      'James helps a user organize files and folders on the server.',
    readAloud: [
      'I have a new folder.',
      'This is a copy of the file.',
      'I read some documents.',
      'Make a backup, please.',
      'This is an old version.',
    ],
    ex2: {
      title: '2. Complete com a, an ou some',
      prompt:
        'Escolha a forma correta.<br>a) I have ___ new folder.<br>b) This is ___ old version.<br>c) I read ___ documents.<br>d) Make ___ backup, please.<br>e) I have ___ copy of the file.<br>f) Open ___ email from the CEO.<br>g) Send ___ files by email.<br>h) It is ___ urgent issue.<br>i) He has ___ laptop and ___ phone.<br>j) She has ___ emails to reply.',
      answers: [
        'a) a',
        'b) an',
        'c) some',
        'd) a',
        'e) a',
        'f) an',
        'g) some',
        'h) an',
        'i) a / a',
        'j) some',
      ],
    },
    ex3: {
      words: 'folder, document, copy, backup, version',
      prompt:
        'Complete com: <em>folder, document, copy, backup, version</em>.<br>a) Save the ______ in the shared ______ .<br>b) Make a ______ of the contract.<br>c) Make a weekly ______ of your work.<br>d) This is the latest ______ of the report.<br>e) Keep a ______ of important emails.<br>f) The old ______ is still on the drive.<br>g) Create a ______ for each client.<br>h) The ______ is in PDF format.<br>i) This ______ is smaller than last year.<br>j) The ______ saved our project.',
      answers: [
        'a) document / folder',
        'b) copy',
        'c) backup',
        'd) version',
        'e) copy',
        'f) version',
        'g) folder',
        'h) document',
        'i) version',
        'j) backup',
      ],
    },
    wrapup:
      '💛 Arquivos organizados em inglês. Muito bem!',
    takeaways: [
      'I have a new folder.',
      'This is an old version.',
      'I read some documents.',
      'Make a backup every week.',
      'I have a copy of the file.',
      'Open an email from the CEO.',
      'Send some files by email.',
      'It is an urgent issue.',
      'Keep some copies in the folder.',
      'The backup saved the day.',
    ],
    deepDive: {
      title: 'Countable nouns: a, an, some',
      explanation:
        '<p>Substantivos contáveis podem ser contados (1, 2, 3 folders).</p><p>• <strong>a</strong> — antes de palavra começando em consoante: <em>a folder, a file</em>.<br>• <strong>an</strong> — antes de palavra começando em vogal ou som vocálico: <em>an email, an issue, an urgent case</em>.<br>• <strong>some</strong> — plural ou sem quantidade definida: <em>some files, some documents</em>.</p><p>💛 <em>Dica:</em> a regra é pelo <strong>som</strong>, não pela letra: <em>an hour</em> (h mudo), <em>a user</em> (som de "iu").</p>',
      examples: [
        { en: 'I have a new folder.', pt: 'Eu tenho uma pasta nova.' },
        { en: 'This is an old version.', pt: 'Esta é uma versão antiga.' },
        { en: 'I read some documents.', pt: 'Eu li alguns documentos.' },
        { en: 'Make a backup.', pt: 'Faça um backup.' },
        { en: 'I have a copy of the file.', pt: 'Eu tenho uma cópia do arquivo.' },
        { en: 'Open an email from the CEO.', pt: 'Abra um e-mail do CEO.' },
        { en: 'Send some files by email.', pt: 'Envie alguns arquivos por e-mail.' },
        { en: 'It is an urgent issue.', pt: 'É um problema urgente.' },
        { en: 'He has a laptop and a phone.', pt: 'Ele tem um notebook e um telefone.' },
        { en: 'She has some emails to reply.', pt: 'Ela tem alguns e-mails para responder.' },
        { en: 'I need an hour to finish.', pt: 'Eu preciso de uma hora para terminar.' },
        { en: 'He is a user of the system.', pt: 'Ele é um usuário do sistema.' },
      ],
      mistakes: [
        { wrong: 'I have an folder.', right: 'I have a folder.', note: 'Folder começa com consoante → a.' },
        { wrong: 'This is a old version.', right: 'This is an old version.', note: 'Old começa com vogal → an.' },
        { wrong: 'I read some document.', right: 'I read some documents.', note: 'Some com contáveis pede plural.' },
        { wrong: 'It is urgent issue.', right: 'It is an urgent issue.', note: 'Não esqueça a/an com substantivos contáveis singulares.' },
        { wrong: 'A email.', right: 'An email.', note: 'Email começa com vogal → an.' },
      ],
      practice: [
        { q: 'I have ___ new folder.', a: 'a' },
        { q: 'This is ___ old version.', a: 'an' },
        { q: 'I have ___ documents.', a: 'some' },
        { q: 'Make ___ backup, please.', a: 'a' },
        { q: 'It is ___ urgent issue.', a: 'an' },
      ],
    },
    rolePlay: {
      title: 'Organizing the drive',
      setup:
        'James te ajuda a organizar os arquivos em pastas.',
      studentA:
        'Seja o usuário. Descreva seus arquivos com a, an, some.',
      studentB:
        'Seja James. Sugira pastas e backups.',
      sampleDialogue: [
        'James: Do you have a main folder?',
        'You: Yes, I have a folder for finance and some documents in it.',
        'James: Good. Make a copy of each important document.',
        'You: OK. And a backup?',
        'James: Yes, make a backup every week. And keep an old version just in case.',
      ],
      successCriteria:
        'Usar a, an e some corretamente pelo menos 2 vezes cada.',
      teacherNotes:
        '💛 Peça para o aluno mostrar as pastas reais no computador.',
    },
    audioTranscript:
      'Let\'s talk about files. On your drive, you should have a main folder for your team, a folder for each client, and an archive folder for old projects. Keep a backup every week. Make a copy of any document you share. And always keep an older version — if something breaks, you have a way back.',
  },
  {
    num: 1172,
    order: 12,
    title: "Today's Update",
    grammar: 'Concordância is / are no presente',
    grammarShort: 'is / are',
    focus: 'IT Foundations',
    objective:
      'Descrever atualizações de sistema usando is e are corretamente.',
    intro:
      '💛 <em>A small update today saves a big problem tomorrow.</em><br><br>Every Tuesday, the IT team runs <strong>updates</strong> on the system. Today you will practise <em>is</em> and <em>are</em> to describe what is being updated and what is ready.',
    vocab: [
      { en: 'update', pt: 'atualização', example: 'The update is ready.' },
      { en: 'install', pt: 'instalar', example: 'The team is installing the update.' },
      { en: 'version', pt: 'versão', example: 'The new version is fast.' },
      { en: 'ready', pt: 'pronto', example: 'The system is ready.' },
      { en: 'available', pt: 'disponível', example: 'Updates are available now.' },
    ],
    situation:
      'James announces today\'s updates and walks through which systems are ready and which are still updating.',
    readAloud: [
      'The update is ready.',
      'The new version is fast.',
      'Two updates are available.',
      'The apps are installing now.',
      'The system is ready for you.',
    ],
    ex2: {
      title: '2. Complete com is ou are',
      prompt:
        'Escolha a forma correta.<br>a) The update ______ ready.<br>b) Two updates ______ available.<br>c) The new version ______ fast.<br>d) The apps ______ installing now.<br>e) The system ______ ready for you.<br>f) The servers ______ online.<br>g) The email system ______ working again.<br>h) All laptops ______ updated.<br>i) The IT team ______ busy this morning.<br>j) The backups ______ done.',
      answers: [
        'a) is',
        'b) are',
        'c) is',
        'd) are',
        'e) is',
        'f) are',
        'g) is',
        'h) are',
        'i) is',
        'j) are',
      ],
    },
    ex3: {
      words: 'update, install, version, ready, available',
      prompt:
        'Complete com: <em>update, install, version, ready, available</em>.<br>a) Please ______ the new app.<br>b) The system ______ is monthly.<br>c) The new ______ is faster.<br>d) The laptop is ______ to use.<br>e) New updates are ______ today.<br>f) ______ the software overnight.<br>g) This ______ fixes many bugs.<br>h) Is the report ______?<br>i) ______ are important for security.<br>j) The download is ______ .',
      answers: [
        'a) install',
        'b) update',
        'c) version',
        'd) ready',
        'e) available',
        'f) Install',
        'g) update / version',
        'h) ready',
        'i) Updates',
        'j) available / ready',
      ],
    },
    wrapup:
      '💛 Updates em inglês, sem medo. Mais uma aula conquistada!',
    takeaways: [
      'The update is ready.',
      'Two updates are available.',
      'The new version is fast.',
      'The apps are installing now.',
      'The system is ready for you.',
      'The servers are online.',
      'The email system is working again.',
      'All laptops are updated.',
      'The IT team is busy today.',
      'The backups are done.',
    ],
    deepDive: {
      title: 'Subject–verb agreement with "is" and "are"',
      explanation:
        '<p>A regra é simples: <strong>sujeito singular → is</strong>, <strong>sujeito plural → are</strong>.</p><p>• <em>The update is ready.</em> (singular)<br>• <em>The updates are ready.</em> (plural)</p><p>Cuidado com palavras como <em>team</em>, <em>data</em>, <em>software</em>, que são tratadas no singular no inglês do dia a dia:<br><em>The team is busy. The data is safe.</em></p><p>💛 <em>Dica:</em> quando houver dúvida, pergunte: <em>é um ou são vários?</em></p>',
      examples: [
        { en: 'The update is ready.', pt: 'A atualização está pronta.' },
        { en: 'The updates are ready.', pt: 'As atualizações estão prontas.' },
        { en: 'The system is slow.', pt: 'O sistema está lento.' },
        { en: 'The servers are online.', pt: 'Os servidores estão online.' },
        { en: 'The team is busy.', pt: 'O time está ocupado.' },
        { en: 'The laptops are updated.', pt: 'Os notebooks estão atualizados.' },
        { en: 'The new version is fast.', pt: 'A nova versão é rápida.' },
        { en: 'Two updates are available.', pt: 'Duas atualizações estão disponíveis.' },
        { en: 'The backup is done.', pt: 'O backup está feito.' },
        { en: 'The backups are done.', pt: 'Os backups estão feitos.' },
        { en: 'The email system is working.', pt: 'O sistema de e-mail está funcionando.' },
        { en: 'Our users are happy.', pt: 'Nossos usuários estão felizes.' },
      ],
      mistakes: [
        { wrong: 'The update are ready.', right: 'The update is ready.', note: 'Update no singular pede is.' },
        { wrong: 'The servers is online.', right: 'The servers are online.', note: 'Servers no plural pede are.' },
        { wrong: 'The team are busy.', right: 'The team is busy.', note: 'Team costuma ser tratado no singular (inglês dos EUA).' },
        { wrong: 'Two updates is available.', right: 'Two updates are available.', note: 'Two + plural → are.' },
        { wrong: 'The data are safe.', right: 'The data is safe.', note: 'No uso corporativo, data é tratado como singular.' },
      ],
      practice: [
        { q: 'The update ___ ready.', a: 'is' },
        { q: 'Two updates ___ available.', a: 'are' },
        { q: 'The team ___ busy today.', a: 'is' },
        { q: 'The laptops ___ updated.', a: 'are' },
        { q: 'The new version ___ fast.', a: 'is' },
      ],
    },
    rolePlay: {
      title: 'Today\'s update briefing',
      setup:
        'James faz o informe diário sobre atualizações. Você faz 3 perguntas.',
      studentA:
        'Seja o usuário. Pergunte sobre o status (Is the system ready? Are the updates done?).',
      studentB:
        'Seja James. Responda com is/are e detalhes curtos.',
      sampleDialogue: [
        'You: Is the system ready?',
        'James: Yes, the main system is ready. Two small updates are installing.',
        'You: Are the laptops updated?',
        'James: All laptops in finance are updated. Some laptops in sales are still pending.',
        'You: Is the email working?',
        'James: Yes, the email system is working again. Thank you for waiting.',
      ],
      successCriteria:
        'Usar is e are corretamente pelo menos 4 vezes.',
      teacherNotes:
        '💛 Foque na concordância sujeito–verbo. Use um quadrinho visual.',
    },
    audioTranscript:
      'Good morning, everyone. Here is today\'s update. The main system is ready. Two small updates are installing now and will finish by noon. All laptops in the London office are updated. The Brazil office is pending — their version is older. Our backups are done, and the email system is working again after yesterday\'s issue. Thank you.',
  },
  {
    num: 1173,
    order: 13,
    title: 'Meeting Online',
    grammar: 'Preposições de tempo — at + horas',
    grammarShort: 'at + time',
    focus: 'IT Foundations',
    objective:
      'Marcar reuniões online usando at + horas.',
    intro:
      '💛 <em>Be on time, be on brand.</em><br><br>At Czarnikow, we have many online meetings: <strong>at 9 am</strong>, <strong>at 3 pm</strong>, <strong>at noon</strong>. Today you will practise <em>at + time</em> to schedule and confirm online meetings.',
    vocab: [
      { en: 'meeting', pt: 'reunião', example: 'The meeting is at 10 am.' },
      { en: 'call', pt: 'ligação / chamada', example: 'The call is at 2 pm.' },
      { en: 'link', pt: 'link', example: 'The link is in the invite.' },
      { en: 'camera', pt: 'câmera', example: 'Turn on the camera.' },
      { en: 'mute', pt: 'mudo / silenciar', example: 'Please mute your microphone.' },
    ],
    situation:
      'James schedules an online meeting and sends the link. The user confirms the time.',
    readAloud: [
      'The meeting is at 10 am.',
      'The call is at 3 pm.',
      'The link is in the invite.',
      'Please turn on your camera.',
      'Please mute your microphone.',
    ],
    ex2: {
      title: '2. Complete com a preposição e o horário certo',
      prompt:
        'Use at + horário. Ex.: "The meeting is at 10 am."<br>a) The call is ______ 9 am.<br>b) The meeting is ______ 2 pm.<br>c) Lunch is ______ noon.<br>d) The team call is ______ 3:30 pm.<br>e) The standup is ______ 9:15 am.<br>f) The IT briefing is ______ 4 pm.<br>g) The review is ______ 5 pm.<br>h) The London call is ______ 11 am.<br>i) The Brazil call is ______ 1 pm.<br>j) The weekly meeting is ______ 10 am.',
      answers: [
        'a) at',
        'b) at',
        'c) at',
        'd) at',
        'e) at',
        'f) at',
        'g) at',
        'h) at',
        'i) at',
        'j) at',
      ],
    },
    ex3: {
      words: 'meeting, call, link, camera, mute',
      prompt:
        'Complete com: <em>meeting, call, link, camera, mute</em>.<br>a) The ______ is at 10 am.<br>b) Please click the ______ in the invite.<br>c) Turn on your ______ , please.<br>d) Please ______ when you are not speaking.<br>e) The quick ______ is at 3 pm.<br>f) The client ______ is at 11:30 am.<br>g) Check the ______ before 9 am.<br>h) My ______ is not working today.<br>i) Always ______ if there is noise.<br>j) The ______ starts in 5 minutes.',
      answers: [
        'a) meeting',
        'b) link',
        'c) camera',
        'd) mute',
        'e) call',
        'f) meeting',
        'g) link',
        'h) camera',
        'i) mute',
        'j) meeting / call',
      ],
    },
    wrapup:
      '💛 Reuniões online, marcadas e confirmadas. Nice work!',
    takeaways: [
      'The meeting is at 10 am.',
      'The call is at 3 pm.',
      'The link is in the invite.',
      'Turn on your camera.',
      'Please mute your microphone.',
      'Lunch is at noon.',
      'The standup is at 9:15 am.',
      'The review is at 5 pm.',
      'The London call is at 11 am.',
      'The weekly meeting is at 10 am.',
    ],
    deepDive: {
      title: 'Prepositions of time: "at" with clock times',
      explanation:
        '<p>Use <strong>at</strong> com horários específicos:<br>• <em>at 9 am, at 10:30, at noon, at midnight</em>.</p><p>Outras preposições úteis:<br>• <strong>on</strong> + dias: <em>on Monday, on May 10</em>.<br>• <strong>in</strong> + partes do dia / meses / anos: <em>in the morning, in May, in 2026</em>.</p><p>💛 <em>Dica:</em> decore a frase inteira: <em>the meeting is at 10 am on Monday</em>.</p>',
      examples: [
        { en: 'The meeting is at 10 am.', pt: 'A reunião é às 10 da manhã.' },
        { en: 'The call is at 3 pm.', pt: 'A ligação é às 3 da tarde.' },
        { en: 'Lunch is at noon.', pt: 'O almoço é ao meio-dia.' },
        { en: 'The standup is at 9:15.', pt: 'A standup é às 9:15.' },
        { en: 'The meeting is on Monday.', pt: 'A reunião é na segunda.' },
        { en: 'The event is in May.', pt: 'O evento é em maio.' },
        { en: 'I work in the morning.', pt: 'Eu trabalho de manhã.' },
        { en: 'The call is at 11 am on Friday.', pt: 'A ligação é às 11 da manhã na sexta.' },
        { en: 'Turn on your camera at 10 am.', pt: 'Ligue sua câmera às 10 da manhã.' },
        { en: 'The weekly meeting is at 4 pm.', pt: 'A reunião semanal é às 4 da tarde.' },
        { en: 'The IT briefing is at 5 pm.', pt: 'O informe de TI é às 5 da tarde.' },
        { en: 'See you at 2 pm.', pt: 'Até às 2 da tarde.' },
      ],
      mistakes: [
        { wrong: 'The meeting is in 10 am.', right: 'The meeting is at 10 am.', note: 'Horário → at.' },
        { wrong: 'At Monday.', right: 'On Monday.', note: 'Dia da semana → on.' },
        { wrong: 'At morning.', right: 'In the morning.', note: 'Parte do dia → in the.' },
        { wrong: 'The call at 3 pm is.', right: 'The call is at 3 pm.', note: 'Ordem: sujeito + verbo + complemento.' },
        { wrong: 'The meeting is to 10 am.', right: 'The meeting is at 10 am.', note: 'Não se usa to para horário de início.' },
      ],
      practice: [
        { q: 'The meeting is ___ 10 am.', a: 'at' },
        { q: 'Lunch is ___ noon.', a: 'at' },
        { q: 'The call is ___ 3 pm.', a: 'at' },
        { q: 'I work ___ the morning.', a: 'in' },
        { q: 'The event is ___ Monday.', a: 'on' },
      ],
    },
    rolePlay: {
      title: 'Scheduling a quick call',
      setup:
        'James quer marcar uma reunião rápida com você para hoje.',
      studentA:
        'Seja o usuário. Confirme horário e link.',
      studentB:
        'Seja James. Proponha dois horários e peça câmera ligada.',
      sampleDialogue: [
        'James: Can we have a quick call at 2 pm or at 4 pm?',
        'You: 4 pm is good for me. Where is the link?',
        'James: The link is in the calendar invite. Please turn on your camera.',
        'You: OK. Do I need to mute at the start?',
        'James: Yes, please mute when you are not speaking.',
      ],
      successCriteria:
        'Usar at + horário pelo menos 3 vezes.',
      teacherNotes:
        '💛 Use relógio real ou calendário para apontar os horários.',
    },
    audioTranscript:
      'Quick briefing on today\'s calls. The team standup is at 9:15 am. The client call is at 11 am. Lunch is at noon. The IT review is at 3 pm, and the weekly meeting with London is at 4 pm. The link for every call is in the calendar invite. Please turn on your camera, and mute your microphone when you are not speaking.',
  },
  {
    num: 1174,
    order: 14,
    title: 'Save and Send',
    grammar: 'Imperativos em fluxos de trabalho',
    grammarShort: 'imperativos',
    focus: 'IT Foundations',
    objective:
      'Descrever fluxos simples (salvar, enviar, fechar) usando imperativos.',
    intro:
      '💛 <em>Save before you send. Send before you forget.</em><br><br>At work, the golden rule is: <strong>save</strong> the file, <strong>check</strong> the file, and only then <strong>send</strong> it. Today you will practise imperatives for common workflows.',
    vocab: [
      { en: 'save', pt: 'salvar', example: 'Save your file.' },
      { en: 'send', pt: 'enviar', example: 'Send the email now.' },
      { en: 'open', pt: 'abrir', example: 'Open the document.' },
      { en: 'close', pt: 'fechar', example: 'Close the program.' },
      { en: 'share', pt: 'compartilhar', example: 'Share the folder.' },
    ],
    situation:
      'James explains a safe workflow: save first, check, share and send.',
    readAloud: [
      'Save your file.',
      'Open the document.',
      'Send the email.',
      'Close the program.',
      'Share the folder with the team.',
    ],
    ex2: {
      title: '2. Complete com o imperativo correto',
      prompt:
        'Use: <em>save, send, open, close, share</em>.<br>a) ______ the file before you close it.<br>b) ______ the email to the client.<br>c) ______ the report in the shared folder.<br>d) ______ the program after work.<br>e) ______ the document in the morning.<br>f) ______ the folder with the new team.<br>g) ______ the email with the report attached.<br>h) ______ the link in a new tab.<br>i) ______ the laptop lid at the end of the day.<br>j) ______ the file as PDF.',
      answers: [
        'a) Save',
        'b) Send',
        'c) Save (or Share)',
        'd) Close',
        'e) Open',
        'f) Share',
        'g) Send',
        'h) Open',
        'i) Close',
        'j) Save',
      ],
    },
    ex3: {
      words: 'save, send, open, close, share',
      prompt:
        'Complete com: <em>save, send, open, close, share</em>.<br>a) Please ______ the attachment.<br>b) ______ the file in PDF.<br>c) ______ the email to the whole team.<br>d) ______ the app when you finish.<br>e) ______ the folder with James.<br>f) Always ______ before you ______ .<br>g) Don\'t forget to ______ the final version.<br>h) ______ the invite with the new client.<br>i) ______ the program and try again.<br>j) ______ the document — it is ready.',
      answers: [
        'a) open',
        'b) save',
        'c) send',
        'd) close',
        'e) share',
        'f) save / send',
        'g) send',
        'h) share',
        'i) close',
        'j) send',
      ],
    },
    wrapup:
      '💛 Salvar, enviar, compartilhar — tudo em inglês. Nice!',
    takeaways: [
      'Save your file.',
      'Send the email now.',
      'Open the document.',
      'Close the program.',
      'Share the folder.',
      'Save before you send.',
      'Send the report by 5 pm.',
      'Close all programs at night.',
      'Share the link with the team.',
      'Open the invite to see the link.',
    ],
    deepDive: {
      title: 'Imperatives for workflows',
      explanation:
        '<p>O imperativo é o verbo puro, sem sujeito, usado para instruções.<br>Ex.: <em>Save. Send. Open. Close. Share.</em></p><p>Para sequências, use vírgulas ou <em>and</em>:<br><em>Save the file, check the subject, and send the email.</em></p><p>Para educar o tom: <em>please</em>. Para o tom negativo: <em>don\'t</em>.</p><p>💛 <em>Dica:</em> workflows ficam mais claros em frases curtas, uma ação por frase.</p>',
      examples: [
        { en: 'Save your file.', pt: 'Salve seu arquivo.' },
        { en: 'Send the email.', pt: 'Envie o e-mail.' },
        { en: 'Open the document.', pt: 'Abra o documento.' },
        { en: 'Close the program.', pt: 'Feche o programa.' },
        { en: 'Share the folder.', pt: 'Compartilhe a pasta.' },
        { en: 'Save, check and send.', pt: 'Salve, confira e envie.' },
        { en: 'Please save your work every hour.', pt: 'Por favor, salve seu trabalho a cada hora.' },
        { en: 'Don\'t close without saving.', pt: 'Não feche sem salvar.' },
        { en: 'Send the report by 5 pm.', pt: 'Envie o relatório até às 5 da tarde.' },
        { en: 'Share the link with the team.', pt: 'Compartilhe o link com o time.' },
        { en: 'Open the invite first.', pt: 'Abra o convite primeiro.' },
        { en: 'Close all programs at night.', pt: 'Feche todos os programas à noite.' },
      ],
      mistakes: [
        { wrong: 'You save the file.', right: 'Save the file.', note: 'No imperativo, não se usa sujeito.' },
        { wrong: 'Sends the email.', right: 'Send the email.', note: 'O imperativo não tem -s.' },
        { wrong: 'Save and to send.', right: 'Save and send.', note: 'Sem to depois de and.' },
        { wrong: 'Don\'t to close without saving.', right: 'Don\'t close without saving.', note: 'Depois de don\'t, verbo sem to.' },
        { wrong: 'Please to share the folder.', right: 'Please share the folder.', note: 'Please + verbo direto.' },
      ],
      practice: [
        { q: '___ your file. (salvar)', a: 'Save' },
        { q: '___ the email. (enviar)', a: 'Send' },
        { q: '___ the program. (fechar)', a: 'Close' },
        { q: '___ the document. (abrir)', a: 'Open' },
        { q: '___ the folder. (compartilhar)', a: 'Share' },
      ],
    },
    rolePlay: {
      title: 'The safe workflow',
      setup:
        'James te ensina o fluxo seguro para enviar um relatório.',
      studentA:
        'Seja o usuário. Siga cada passo e confirme em voz alta.',
      studentB:
        'Seja James. Dê 5 imperativos em ordem.',
      sampleDialogue: [
        'James: Open the document.',
        'You: Open the document, done.',
        'James: Save as PDF.',
        'You: Save as PDF, done.',
        'James: Share the file with the team, then send the email to the client.',
        'You: Share, send — all done. Thank you!',
      ],
      successCriteria:
        'Seguir 5 imperativos em ordem.',
      teacherNotes:
        '💛 Reforce a ordem lógica: save → check → send.',
    },
    audioTranscript:
      'Here is the golden workflow for any important report. Open the file. Save a new version. Check the numbers, the subject and the attachment. Save again. Share the folder with the team for review. Finally, send the email to the client. Simple, safe, professional. Never send before you save.',
  },
  {
    num: 1175,
    order: 15,
    title: 'The Help Desk Team',
    grammar: 'Pronomes pessoais — he, she, it, they',
    grammarShort: 'pronomes',
    focus: 'IT People',
    objective:
      'Descrever a equipe de help desk usando pronomes pessoais.',
    intro:
      '💛 <em>Good teams speak in short, clear sentences.</em><br><br>The help desk team has many people. <strong>He</strong> works on networks. <strong>She</strong> works on software. <strong>They</strong> work on security. Today you will practise pronomes pessoais para falar do time.',
    vocab: [
      { en: 'technician', pt: 'técnico', example: 'He is a technician.' },
      { en: 'analyst', pt: 'analista', example: 'She is an analyst.' },
      { en: 'manager', pt: 'gerente', example: 'He is the IT manager.' },
      { en: 'colleague', pt: 'colega', example: 'She is my colleague.' },
      { en: 'shift', pt: 'turno', example: 'They work the morning shift.' },
    ],
    situation:
      'James introduces the IT help desk team, member by member.',
    readAloud: [
      'He is the manager.',
      'She is an analyst.',
      'They are technicians.',
      'It is a small team.',
      'He and she work together.',
    ],
    ex2: {
      title: '2. Complete com he, she, it ou they',
      prompt:
        'Use o pronome certo.<br>a) James is the manager. ______ is from London.<br>b) Maria is an analyst. ______ is from Brazil.<br>c) The laptop is old. ______ is slow.<br>d) The technicians are new. ______ are fast learners.<br>e) Ana is my colleague. ______ is very kind.<br>f) Peter is a technician. ______ works on networks.<br>g) The team is small. ______ is strong.<br>h) The servers are online. ______ are ready.<br>i) Lucas and João are on the night shift. ______ are tired.<br>j) The new app is great. ______ is easy to use.',
      answers: [
        'a) He',
        'b) She',
        'c) It',
        'd) They',
        'e) She',
        'f) He',
        'g) It',
        'h) They',
        'i) They',
        'j) It',
      ],
    },
    ex3: {
      words: 'technician, analyst, manager, colleague, shift',
      prompt:
        'Complete com: <em>technician, analyst, manager, colleague, shift</em>.<br>a) He is the IT ______ .<br>b) She is a data ______ .<br>c) They are network ______ s.<br>d) My ______ works next to me.<br>e) The night ______ starts at 10 pm.<br>f) The ______ organizes the team.<br>g) A good ______ solves problems fast.<br>h) A support ______ talks to users.<br>i) I work with 5 ______ s.<br>j) Each ______ has 8 hours.',
      answers: [
        'a) manager',
        'b) analyst',
        'c) technician',
        'd) colleague',
        'e) shift',
        'f) manager',
        'g) technician',
        'h) analyst',
        'i) colleague',
        'j) shift',
      ],
    },
    wrapup:
      '💛 Agora você descreve times inteiros em inglês. Brilhante!',
    takeaways: [
      'He is the manager.',
      'She is an analyst.',
      'They are technicians.',
      'It is a small team.',
      'She is my colleague.',
      'He works on networks.',
      'They work the morning shift.',
      'The team is strong.',
      'The servers are online.',
      'The app is easy to use.',
    ],
    deepDive: {
      title: 'Personal pronouns: he, she, it, they',
      explanation:
        '<p>Os pronomes pessoais substituem o sujeito para não repetir o nome:</p><p>• <strong>He</strong> — homem: <em>James → He</em><br>• <strong>She</strong> — mulher: <em>Maria → She</em><br>• <strong>It</strong> — coisa/animal/sistema: <em>the laptop → It</em><br>• <strong>They</strong> — plural (pessoas ou coisas): <em>James and Maria → They</em></p><p>💛 <em>Dica:</em> para falar do time sem saber o gênero, <em>they</em> também pode ser usado no singular no inglês moderno.</p>',
      examples: [
        { en: 'James is the manager. He is from London.', pt: 'James é o gerente. Ele é de Londres.' },
        { en: 'Maria is an analyst. She is from Brazil.', pt: 'Maria é uma analista. Ela é do Brasil.' },
        { en: 'The laptop is old. It is slow.', pt: 'O notebook é velho. Ele é lento.' },
        { en: 'The technicians are new. They are fast learners.', pt: 'Os técnicos são novos. Eles aprendem rápido.' },
        { en: 'Ana is my colleague. She is kind.', pt: 'Ana é minha colega. Ela é gentil.' },
        { en: 'Peter works on networks. He is expert.', pt: 'Peter trabalha com redes. Ele é expert.' },
        { en: 'The team is small. It is strong.', pt: 'O time é pequeno. Ele é forte.' },
        { en: 'The servers are online. They are ready.', pt: 'Os servidores estão online. Eles estão prontos.' },
        { en: 'Lucas and João are on the night shift. They are tired.', pt: 'Lucas e João estão no turno da noite. Eles estão cansados.' },
        { en: 'The new app is great. It is easy.', pt: 'O novo app é ótimo. Ele é fácil.' },
        { en: 'She is the IT manager.', pt: 'Ela é a gerente de TI.' },
        { en: 'They are the help desk team.', pt: 'Eles são o time de help desk.' },
      ],
      mistakes: [
        { wrong: 'Maria is analyst. He is kind.', right: 'Maria is an analyst. She is kind.', note: 'Maria é mulher → she.' },
        { wrong: 'The laptop is slow. He is old.', right: 'The laptop is slow. It is old.', note: 'Coisa → it.' },
        { wrong: 'James and Ana. It is kind.', right: 'James and Ana. They are kind.', note: 'Mais de uma pessoa → they.' },
        { wrong: 'She are my colleague.', right: 'She is my colleague.', note: 'She pede is.' },
        { wrong: 'They is ready.', right: 'They are ready.', note: 'They pede are.' },
      ],
      practice: [
        { q: 'James is the manager. ___ is from London.', a: 'He' },
        { q: 'Maria is an analyst. ___ is from Brazil.', a: 'She' },
        { q: 'The laptop is old. ___ is slow.', a: 'It' },
        { q: 'The technicians are new. ___ are fast.', a: 'They' },
        { q: 'Ana is kind. ___ is my colleague.', a: 'She' },
      ],
    },
    rolePlay: {
      title: 'Meet the help desk team',
      setup:
        'James apresenta 3 membros do time para você.',
      studentA:
        'Seja o usuário. Responda com he, she, it, they.',
      studentB:
        'Seja James. Apresente 3 pessoas.',
      sampleDialogue: [
        'James: This is Peter. He is a technician.',
        'You: Hello Peter! Is he from London?',
        'James: Yes, he is. And this is Maria.',
        'You: Is she an analyst?',
        'James: Yes, she is. They work together on network issues.',
        'You: Nice to meet all of you!',
      ],
      successCriteria:
        'Usar he, she, they corretamente pelo menos 2 vezes cada.',
      teacherNotes:
        '💛 Use fotos ou cartões com nomes para treinar os pronomes.',
    },
    audioTranscript:
      'Let me introduce the IT help desk team. James is the manager. He is from London. Maria is an analyst. She works on software. Peter is a technician. He handles networks. They all work together, and we also have Ana and Lucas on the night shift. They are on duty from 10 pm to 6 am. It is a small, strong team.',
  },
  {
    num: 1176,
    order: 16,
    title: 'Fast and Slow Connection',
    grammar: 'Adjetivos — fast, slow e contrários',
    grammarShort: 'adjetivos',
    focus: 'IT Operations',
    objective:
      'Descrever a conexão como rápida, lenta, forte ou fraca.',
    intro:
      '💛 <em>Fast today, faster tomorrow.</em><br><br>At Czarnikow, the Wi-Fi is sometimes <strong>fast</strong>, sometimes <strong>slow</strong>, and sometimes <strong>bad</strong>. Today you will learn adjetivos para descrever conexão e velocidade.',
    vocab: [
      { en: 'fast', pt: 'rápido', example: 'The Wi-Fi is fast.' },
      { en: 'slow', pt: 'lento', example: 'The connection is slow.' },
      { en: 'strong', pt: 'forte', example: 'The signal is strong.' },
      { en: 'weak', pt: 'fraco', example: 'The signal is weak.' },
      { en: 'stable', pt: 'estável', example: 'The connection is stable.' },
    ],
    situation:
      'James and a user troubleshoot a slow video call together.',
    readAloud: [
      'The Wi-Fi is fast.',
      'The connection is slow.',
      'The signal is strong.',
      'The signal is weak.',
      'The connection is stable.',
    ],
    ex2: {
      title: '2. Escolha o adjetivo certo',
      prompt:
        'Complete com: <em>fast, slow, strong, weak, stable</em>.<br>a) The Wi-Fi is very ______ today.<br>b) The signal is ______ in the basement.<br>c) The connection is ______ — perfect for video calls.<br>d) The Wi-Fi is ______ in the meeting room, like a rocket.<br>e) The network is ______ this morning.<br>f) A ______ Wi-Fi is important for remote work.<br>g) The signal is ______ here — 5 bars.<br>h) My laptop is ______ because it is new.<br>i) My old laptop is very ______ .<br>j) The call is fine — the connection is ______ .',
      answers: [
        'a) fast',
        'b) weak',
        'c) stable',
        'd) fast',
        'e) slow',
        'f) stable / fast / strong',
        'g) strong',
        'h) fast',
        'i) slow',
        'j) stable',
      ],
    },
    ex3: {
      words: 'fast, slow, strong, weak, stable',
      prompt:
        'Complete com o oposto ou o adjetivo adequado.<br>a) Fast ↔ ______<br>b) Strong ↔ ______<br>c) The opposite of unstable is ______ .<br>d) A ______ connection makes work easy.<br>e) A ______ signal drops the call.<br>f) My laptop is ______ , not slow.<br>g) A ______ network doesn\'t move.<br>h) Wi-Fi with 5 bars is ______ .<br>i) The connection is ______ , not changing.<br>j) A very ______ connection is frustrating.',
      answers: [
        'a) slow',
        'b) weak',
        'c) stable',
        'd) fast / strong / stable',
        'e) weak',
        'f) fast',
        'g) slow',
        'h) strong',
        'i) stable',
        'j) slow',
      ],
    },
    wrapup:
      '💛 Você agora descreve internet com precisão. Ótimo!',
    takeaways: [
      'The Wi-Fi is fast.',
      'The connection is slow.',
      'The signal is strong.',
      'The signal is weak.',
      'The connection is stable.',
      'The Wi-Fi is weak in the basement.',
      'A fast Wi-Fi helps video calls.',
      'A strong signal is important.',
      'The network is stable today.',
      'My laptop is fast because it is new.',
    ],
    deepDive: {
      title: 'Describing connection quality',
      explanation:
        '<p>Os pares mais comuns:</p><p>• <strong>fast ↔ slow</strong> — velocidade<br>• <strong>strong ↔ weak</strong> — força do sinal<br>• <strong>stable ↔ unstable</strong> — estabilidade</p><p>Use <em>very</em> para intensificar: <em>very fast, very weak</em>.<br>Use <em>too</em> para algo excessivo: <em>too slow</em> (lento demais).</p><p>💛 <em>Dica:</em> em reuniões, diga <em>my connection is unstable today</em> para se justificar educadamente.</p>',
      examples: [
        { en: 'The Wi-Fi is fast.', pt: 'O Wi-Fi é rápido.' },
        { en: 'The connection is slow.', pt: 'A conexão está lenta.' },
        { en: 'The signal is strong.', pt: 'O sinal é forte.' },
        { en: 'The signal is weak.', pt: 'O sinal é fraco.' },
        { en: 'The connection is stable.', pt: 'A conexão está estável.' },
        { en: 'My Wi-Fi is too slow today.', pt: 'Meu Wi-Fi está lento demais hoje.' },
        { en: 'The network is very fast.', pt: 'A rede está muito rápida.' },
        { en: 'The signal is weak in the basement.', pt: 'O sinal é fraco no subsolo.' },
        { en: 'Video calls need a stable connection.', pt: 'Videochamadas precisam de conexão estável.' },
        { en: 'A fast laptop helps a lot.', pt: 'Um notebook rápido ajuda muito.' },
        { en: 'The signal is strong near the router.', pt: 'O sinal é forte perto do roteador.' },
        { en: 'My connection is unstable right now.', pt: 'Minha conexão está instável agora.' },
      ],
      mistakes: [
        { wrong: 'The Wi-Fi is fasts.', right: 'The Wi-Fi is fast.', note: 'Adjetivos não recebem -s.' },
        { wrong: 'The signal are strong.', right: 'The signal is strong.', note: 'Singular → is.' },
        { wrong: 'Connection slow.', right: 'The connection is slow.', note: 'Não esqueça de to be.' },
        { wrong: 'My Wi-Fi is very too slow.', right: 'My Wi-Fi is too slow. / My Wi-Fi is very slow.', note: 'Use very OU too, não os dois.' },
        { wrong: 'The network unstable.', right: 'The network is unstable.', note: 'Sempre use o verbo is.' },
      ],
      practice: [
        { q: 'The Wi-Fi is ___ today. (rápido)', a: 'fast' },
        { q: 'The signal is ___ here. (fraco)', a: 'weak' },
        { q: 'The connection is ___ . (estável)', a: 'stable' },
        { q: 'My laptop is ___ . (lento)', a: 'slow' },
        { q: 'The signal is ___ near the router.', a: 'strong' },
      ],
    },
    rolePlay: {
      title: 'Why is my video call choppy?',
      setup:
        'Sua videochamada travou. Você e James analisam a conexão.',
      studentA:
        'Seja o usuário. Descreva a conexão com adjetivos.',
      studentB:
        'Seja James. Proponha um teste simples.',
      sampleDialogue: [
        'You: James, the video call is bad. The connection is slow.',
        'James: Is the signal strong where you are?',
        'You: No, the signal is weak. I am in the basement.',
        'James: Please go to the second floor. The signal is strong there.',
        'You: OK. Now the connection is stable and fast.',
        'James: Perfect!',
      ],
      successCriteria:
        'Usar 3 adjetivos (fast, slow, weak, strong, stable) corretamente.',
      teacherNotes:
        '💛 Use um mapa do escritório para falar sobre força do sinal.',
    },
    audioTranscript:
      'If your call is bad, think about three things: speed, signal and stability. Is the connection fast or slow? Is the signal strong or weak? Is the network stable or unstable? A slow connection is sometimes just a weak signal. Move closer to the router and try again. If the signal is strong but the connection is still slow, call the IT team.',
  },
  {
    num: 1177,
    order: 17,
    title: 'Laptop vs Desktop',
    grammar: 'Comparações básicas — bigger, faster, smaller',
    grammarShort: 'comparativos',
    focus: 'IT Equipment',
    objective:
      'Comparar laptops e desktops usando comparativos básicos.',
    intro:
      '💛 <em>Bigger, faster, better — step by step.</em><br><br>At the office, some users have a <strong>laptop</strong> and others have a <strong>desktop</strong>. One is <em>bigger</em>, the other is <em>lighter</em>. Today you will learn simple comparisons.',
    vocab: [
      { en: 'desktop', pt: 'desktop', example: 'The desktop is bigger.' },
      { en: 'laptop', pt: 'notebook', example: 'The laptop is lighter.' },
      { en: 'bigger', pt: 'maior', example: 'The screen is bigger.' },
      { en: 'smaller', pt: 'menor', example: 'The keyboard is smaller.' },
      { en: 'faster', pt: 'mais rápido', example: 'The desktop is faster.' },
    ],
    situation:
      'James explains the differences between a desktop and a laptop to help a user choose.',
    readAloud: [
      'The desktop is bigger.',
      'The laptop is smaller.',
      'The desktop is faster.',
      'The laptop is lighter.',
      'The screen is bigger on the desktop.',
    ],
    ex2: {
      title: '2. Complete com o comparativo',
      prompt:
        'Use: <em>bigger, smaller, faster, slower, lighter</em>.<br>a) The desktop is ______ than the laptop.<br>b) The laptop is ______ than the desktop.<br>c) The new laptop is ______ than the old one.<br>d) My old desktop is ______ than the new laptop.<br>e) The laptop is ______ to carry.<br>f) The desktop screen is ______ than the laptop screen.<br>g) A tablet is ______ than a laptop.<br>h) SSD is ______ than HDD.<br>i) My phone is ______ than my tablet.<br>j) This server is ______ than the old one.',
      answers: [
        'a) bigger',
        'b) smaller',
        'c) faster',
        'd) slower',
        'e) lighter',
        'f) bigger',
        'g) smaller',
        'h) faster',
        'i) smaller',
        'j) faster',
      ],
    },
    ex3: {
      words: 'desktop, laptop, bigger, smaller, faster',
      prompt:
        'Complete com: <em>desktop, laptop, bigger, smaller, faster</em>.<br>a) A ______ stays on a desk.<br>b) A ______ is easy to carry.<br>c) The desktop is ______ .<br>d) The laptop is ______ .<br>e) The new machine is ______ than the old one.<br>f) A ______ is better for travelling.<br>g) A ______ is better for big screens.<br>h) The ______ screen is better for spreadsheets.<br>i) A ______ is usually ______ than a desktop.<br>j) A ______ is usually ______ than a laptop.',
      answers: [
        'a) desktop',
        'b) laptop',
        'c) bigger',
        'd) smaller',
        'e) faster',
        'f) laptop',
        'g) desktop',
        'h) bigger',
        'i) laptop / smaller',
        'j) desktop / bigger',
      ],
    },
    wrapup:
      '💛 Comparações simples, inglês claro. Nice work!',
    takeaways: [
      'The desktop is bigger.',
      'The laptop is smaller.',
      'The desktop is faster.',
      'The laptop is lighter.',
      'The screen is bigger on the desktop.',
      'The new laptop is faster than the old one.',
      'A tablet is smaller than a laptop.',
      'SSD is faster than HDD.',
      'My phone is smaller than my tablet.',
      'The new server is faster than the old one.',
    ],
    deepDive: {
      title: 'Basic comparatives',
      explanation:
        '<p>Para comparar duas coisas em inglês, use <strong>adjetivo + -er + than</strong>:<br>• <em>fast → faster than</em><br>• <em>big → bigger than</em> (duplica a consoante)<br>• <em>small → smaller than</em><br>• <em>light → lighter than</em></p><p>Adjetivos longos usam <em>more</em>: <em>more expensive, more powerful</em>.</p><p>💛 <em>Dica:</em> o padrão básico é <em>A is ___er than B</em>.</p>',
      examples: [
        { en: 'The desktop is bigger than the laptop.', pt: 'O desktop é maior que o notebook.' },
        { en: 'The laptop is smaller than the desktop.', pt: 'O notebook é menor que o desktop.' },
        { en: 'The new laptop is faster than the old one.', pt: 'O notebook novo é mais rápido que o antigo.' },
        { en: 'My laptop is lighter than yours.', pt: 'Meu notebook é mais leve que o seu.' },
        { en: 'A tablet is smaller than a laptop.', pt: 'Um tablet é menor que um notebook.' },
        { en: 'SSD is faster than HDD.', pt: 'SSD é mais rápido que HDD.' },
        { en: 'This server is more powerful than the old one.', pt: 'Este servidor é mais potente que o antigo.' },
        { en: 'A phone is smaller than a tablet.', pt: 'Um celular é menor que um tablet.' },
        { en: 'The new screen is bigger than the old one.', pt: 'A nova tela é maior que a antiga.' },
        { en: 'The London office is bigger than the Brazil office.', pt: 'O escritório de Londres é maior que o do Brasil.' },
        { en: 'A docking station is better than many cables.', pt: 'Uma docking station é melhor que muitos cabos.' },
        { en: 'A wired connection is more stable than Wi-Fi.', pt: 'Uma conexão com fio é mais estável que Wi-Fi.' },
      ],
      mistakes: [
        { wrong: 'The laptop is more small.', right: 'The laptop is smaller.', note: 'Adjetivos curtos → -er, não more.' },
        { wrong: 'The desktop is bigger that the laptop.', right: 'The desktop is bigger than the laptop.', note: 'Use than, não that.' },
        { wrong: 'Faster than more.', right: 'Faster than.', note: 'Escolha apenas uma forma comparativa.' },
        { wrong: 'The laptop is more faster.', right: 'The laptop is faster.', note: 'Não use more com -er.' },
        { wrong: 'The desktop bigger.', right: 'The desktop is bigger.', note: 'Use o verbo to be.' },
      ],
      practice: [
        { q: 'The desktop is ___ than the laptop. (grande)', a: 'bigger' },
        { q: 'The laptop is ___ than the desktop. (pequeno)', a: 'smaller' },
        { q: 'The new laptop is ___ than the old one. (rápido)', a: 'faster' },
        { q: 'My laptop is ___ than yours. (leve)', a: 'lighter' },
        { q: 'SSD is ___ than HDD. (rápido)', a: 'faster' },
      ],
    },
    rolePlay: {
      title: 'Choosing a new machine',
      setup:
        'Você precisa de um equipamento novo. James te ajuda a escolher.',
      studentA:
        'Seja o usuário. Compare laptop e desktop com 3 comparativos.',
      studentB:
        'Seja James. Faça perguntas sobre uso e preferência.',
      sampleDialogue: [
        'James: Do you travel for work?',
        'You: Yes, often. A laptop is smaller and lighter.',
        'James: And for the office?',
        'You: A desktop is bigger and faster. The screen is bigger too.',
        'James: OK. Let\'s order a laptop and a second monitor — best of both.',
        'You: Perfect!',
      ],
      successCriteria:
        'Usar 3 comparativos com than corretamente.',
      teacherNotes:
        '💛 Faça o aluno comparar dois objetos reais na mesa.',
    },
    audioTranscript:
      'Here\'s the simple truth about laptops and desktops. A desktop is usually bigger, faster and more powerful. A laptop is smaller, lighter and easier to carry. A desktop is better for spreadsheets and data work. A laptop is better for travel and meetings. The best solution for most people is a laptop plus a second monitor. That way, you get the best of both.',
  },
  {
    num: 1178,
    order: 18,
    title: 'A Safe Password',
    grammar: 'Should (conselho básico)',
    grammarShort: 'should',
    focus: 'IT Security',
    objective:
      'Dar conselhos simples de segurança usando should.',
    intro:
      '💛 <em>A strong password is a small effort and a big defence.</em><br><br>Every user <strong>should</strong> have a strong password. You <strong>should not</strong> share it. Today you will learn to dar conselhos com <em>should</em> e <em>shouldn\'t</em>.',
    vocab: [
      { en: 'safe', pt: 'seguro', example: 'The password is safe.' },
      { en: 'strong', pt: 'forte', example: 'Use a strong password.' },
      { en: 'share', pt: 'compartilhar', example: 'Do not share your password.' },
      { en: 'change', pt: 'trocar', example: 'Change your password every month.' },
      { en: 'remember', pt: 'lembrar', example: 'Remember your password.' },
    ],
    situation:
      'James explains to a new user the rules for a safe password.',
    readAloud: [
      'You should use a strong password.',
      'You should not share your password.',
      'You should change your password often.',
      'You should remember your password.',
      'A safe password is important.',
    ],
    ex2: {
      title: '2. Complete com should ou shouldn\'t',
      prompt:
        'Escolha should ou shouldn\'t.<br>a) You ______ use a strong password.<br>b) You ______ share your password.<br>c) You ______ change your password every 3 months.<br>d) You ______ write your password on a paper on the desk.<br>e) You ______ use "1234" as a password.<br>f) You ______ lock your laptop when you leave.<br>g) You ______ click on strange links.<br>h) You ______ update your system.<br>i) You ______ open emails from unknown people.<br>j) You ______ keep a backup.',
      answers: [
        'a) should',
        'b) shouldn\'t',
        'c) should',
        'd) shouldn\'t',
        'e) shouldn\'t',
        'f) should',
        'g) shouldn\'t',
        'h) should',
        'i) shouldn\'t',
        'j) should',
      ],
    },
    ex3: {
      words: 'safe, strong, share, change, remember',
      prompt:
        'Complete com: <em>safe, strong, share, change, remember</em>.<br>a) Use a ______ password.<br>b) Do not ______ your password.<br>c) ______ your password every 3 months.<br>d) A ______ password keeps your data safe.<br>e) ______ your password in your head, not on paper.<br>f) Your data is ______ with us.<br>g) Keep the office ______ — lock the door.<br>h) You should ______ the password today.<br>i) A ______ password has letters, numbers and symbols.<br>j) Do not ______ your laptop with strangers.',
      answers: [
        'a) strong',
        'b) share',
        'c) Change',
        'd) strong / safe',
        'e) Remember',
        'f) safe',
        'g) safe',
        'h) change',
        'i) strong',
        'j) share',
      ],
    },
    wrapup:
      '💛 Segurança é hábito. Você já dá conselhos em inglês!',
    takeaways: [
      'You should use a strong password.',
      'You shouldn\'t share your password.',
      'You should change your password often.',
      'You should remember your password.',
      'A safe password is important.',
      'You should lock your laptop.',
      'You shouldn\'t click on strange links.',
      'You should update your system.',
      'You shouldn\'t open unknown emails.',
      'You should keep a backup.',
    ],
    deepDive: {
      title: '"Should" — giving simple advice',
      explanation:
        '<p><strong>Should</strong> é um verbo modal usado para dar conselhos:<br>• <em>You should use a strong password.</em> (Você deveria usar uma senha forte.)</p><p>Negativa: <strong>shouldn\'t</strong> (should not).<br>Pergunta: <em>Should I change my password?</em></p><p>Depois de should, o verbo vem sempre no infinitivo sem <em>to</em>.</p><p>💛 <em>Dica:</em> <em>should</em> é mais suave que <em>must</em>. Use should para conselhos, must para obrigações.</p>',
      examples: [
        { en: 'You should use a strong password.', pt: 'Você deveria usar uma senha forte.' },
        { en: 'You shouldn\'t share your password.', pt: 'Você não deveria compartilhar sua senha.' },
        { en: 'You should change your password.', pt: 'Você deveria trocar sua senha.' },
        { en: 'You should remember your password.', pt: 'Você deveria lembrar sua senha.' },
        { en: 'You should lock your laptop.', pt: 'Você deveria bloquear seu notebook.' },
        { en: 'You shouldn\'t click on strange links.', pt: 'Você não deveria clicar em links estranhos.' },
        { en: 'You should update your system.', pt: 'Você deveria atualizar seu sistema.' },
        { en: 'You shouldn\'t open unknown emails.', pt: 'Você não deveria abrir e-mails desconhecidos.' },
        { en: 'You should keep a backup.', pt: 'Você deveria manter um backup.' },
        { en: 'Should I change my password today?', pt: 'Eu deveria mudar minha senha hoje?' },
        { en: 'You should ask the IT team.', pt: 'Você deveria perguntar ao time de TI.' },
        { en: 'You shouldn\'t write your password on paper.', pt: 'Você não deveria escrever sua senha no papel.' },
      ],
      mistakes: [
        { wrong: 'You should to use a strong password.', right: 'You should use a strong password.', note: 'Depois de should, verbo sem to.' },
        { wrong: 'You shoulds lock the laptop.', right: 'You should lock the laptop.', note: 'Should não recebe -s.' },
        { wrong: 'You no should share your password.', right: 'You shouldn\'t share your password.', note: 'Negativa: shouldn\'t.' },
        { wrong: 'Should I to change my password?', right: 'Should I change my password?', note: 'Sem to depois de should.' },
        { wrong: 'You should used a strong password.', right: 'You should use a strong password.', note: 'Sempre infinitivo depois de should.' },
      ],
      practice: [
        { q: 'You ___ use a strong password.', a: 'should' },
        { q: 'You ___ share your password.', a: 'shouldn\'t' },
        { q: 'You ___ change your password often.', a: 'should' },
        { q: 'You ___ click on strange links.', a: 'shouldn\'t' },
        { q: '___ I update my system today?', a: 'Should' },
      ],
    },
    rolePlay: {
      title: 'Security 101',
      setup:
        'James te dá 5 conselhos de segurança. Você ouve e confirma.',
      studentA:
        'Seja o usuário. Responda com "I should…" para cada conselho.',
      studentB:
        'Seja James. Dê 5 conselhos com should / shouldn\'t.',
      sampleDialogue: [
        'James: You should use a strong password.',
        'You: OK, I should use a strong password.',
        'James: You shouldn\'t share it.',
        'You: Right, I shouldn\'t share it.',
        'James: You should change it every 3 months.',
        'You: Got it. I should change it every 3 months.',
      ],
      successCriteria:
        'Usar should e shouldn\'t pelo menos 3 vezes cada.',
      teacherNotes:
        '💛 Transforme em jogo: cada conselho vale 1 ponto.',
    },
    audioTranscript:
      'Five simple rules for a safe password. One: you should use at least 12 characters. Two: you should mix letters, numbers and symbols. Three: you shouldn\'t use your birthday or "1234". Four: you should change your password every 3 months. Five: you shouldn\'t write it on a sticky note. A safe password is a small effort and a big defence.',
  },
  {
    num: 1179,
    order: 19,
    title: "Yesterday's IT Issue",
    grammar: 'Was / Were — simple past of to be',
    grammarShort: 'was / were',
    focus: 'IT Operations',
    objective:
      'Descrever problemas de TI do passado usando was e were.',
    intro:
      '💛 <em>Yesterday is the best teacher for today.</em><br><br>Yesterday, the system <strong>was</strong> down. The users <strong>were</strong> tired. The team <strong>was</strong> busy. Today you will learn <em>was</em> e <em>were</em>, o passado do verbo <em>to be</em>.',
    vocab: [
      { en: 'yesterday', pt: 'ontem', example: 'Yesterday the system was down.' },
      { en: 'down', pt: 'fora do ar', example: 'The server was down.' },
      { en: 'tired', pt: 'cansado', example: 'The team was tired.' },
      { en: 'busy', pt: 'ocupado', example: 'The IT team was busy.' },
      { en: 'problem', pt: 'problema', example: 'There was a problem yesterday.' },
    ],
    situation:
      'James reviews yesterday\'s IT incident with the user.',
    readAloud: [
      'Yesterday, the system was down.',
      'The users were tired.',
      'The IT team was busy.',
      'The problem was serious.',
      'We were ready to help.',
    ],
    ex2: {
      title: '2. Complete com was ou were',
      prompt:
        'Use was (singular) ou were (plural).<br>a) Yesterday, the system ______ down.<br>b) The users ______ tired.<br>c) The IT team ______ busy.<br>d) The problem ______ serious.<br>e) We ______ ready to help.<br>f) I ______ at the office at 8 am.<br>g) The servers ______ offline for one hour.<br>h) Maria ______ on the night shift.<br>i) The laptops ______ updated last night.<br>j) It ______ a long day for everyone.',
      answers: [
        'a) was',
        'b) were',
        'c) was',
        'd) was',
        'e) were',
        'f) was',
        'g) were',
        'h) was',
        'i) were',
        'j) was',
      ],
    },
    ex3: {
      words: 'yesterday, down, tired, busy, problem',
      prompt:
        'Complete com: <em>yesterday, down, tired, busy, problem</em>.<br>a) ______ was a long day.<br>b) The server was ______ for two hours.<br>c) The team was very ______ at 6 pm.<br>d) The IT desk was ______ with many tickets.<br>e) The ______ was with the Wi-Fi.<br>f) ______ afternoon, the email was slow.<br>g) We fixed the ______ in the evening.<br>h) After the long shift, everyone was ______ .<br>i) A quiet day follows a ______ day.<br>j) The update was ______ on Monday but works now.',
      answers: [
        'a) Yesterday',
        'b) down',
        'c) tired',
        'd) busy',
        'e) problem',
        'f) Yesterday',
        'g) problem',
        'h) tired',
        'i) busy',
        'j) down',
      ],
    },
    wrapup:
      '💛 Passado em inglês, sem drama. Muito bem!',
    takeaways: [
      'Yesterday, the system was down.',
      'The users were tired.',
      'The IT team was busy.',
      'The problem was serious.',
      'We were ready to help.',
      'I was at the office at 8 am.',
      'The servers were offline.',
      'Maria was on the night shift.',
      'The laptops were updated last night.',
      'It was a long day.',
    ],
    deepDive: {
      title: 'Simple past of "to be": was / were',
      explanation:
        '<p>O passado do verbo <strong>to be</strong>:</p><p>• <em>I, he, she, it</em> → <strong>was</strong><br>• <em>you, we, they</em> → <strong>were</strong></p><p>Negativa: <em>wasn\'t / weren\'t</em>.<br>Pergunta: <em>Was he…? Were they…?</em></p><p>💛 <em>Dica:</em> o passado do to be é o primeiro passado útil do inglês — use-o muito para ganhar confiança.</p>',
      examples: [
        { en: 'Yesterday, the system was down.', pt: 'Ontem, o sistema estava fora do ar.' },
        { en: 'The users were tired.', pt: 'Os usuários estavam cansados.' },
        { en: 'The IT team was busy.', pt: 'O time de TI estava ocupado.' },
        { en: 'The problem was serious.', pt: 'O problema era sério.' },
        { en: 'We were ready to help.', pt: 'Nós estávamos prontos para ajudar.' },
        { en: 'I was at the office at 8 am.', pt: 'Eu estava no escritório às 8 da manhã.' },
        { en: 'The servers were offline.', pt: 'Os servidores estavam offline.' },
        { en: 'Maria was on the night shift.', pt: 'Maria estava no turno da noite.' },
        { en: 'The laptops were updated last night.', pt: 'Os notebooks foram atualizados ontem à noite.' },
        { en: 'It was a long day.', pt: 'Foi um dia longo.' },
        { en: 'Were you at the meeting yesterday?', pt: 'Você estava na reunião ontem?' },
        { en: 'The Wi-Fi wasn\'t stable.', pt: 'O Wi-Fi não estava estável.' },
      ],
      mistakes: [
        { wrong: 'Yesterday the system were down.', right: 'Yesterday the system was down.', note: 'Singular → was.' },
        { wrong: 'The users was tired.', right: 'The users were tired.', note: 'Plural → were.' },
        { wrong: 'I were at the office.', right: 'I was at the office.', note: 'Com I, use was.' },
        { wrong: 'We was ready.', right: 'We were ready.', note: 'Com we, use were.' },
        { wrong: 'Was you at the meeting?', right: 'Were you at the meeting?', note: 'Com you, sempre were.' },
      ],
      practice: [
        { q: 'Yesterday, the system ___ down.', a: 'was' },
        { q: 'The users ___ tired.', a: 'were' },
        { q: 'I ___ at the office at 8 am.', a: 'was' },
        { q: 'We ___ ready to help.', a: 'were' },
        { q: '___ you at the meeting?', a: 'Were' },
      ],
    },
    rolePlay: {
      title: 'The post-incident review',
      setup:
        'James revisa o incidente de ontem com você.',
      studentA:
        'Seja o usuário. Responda perguntas com was/were.',
      studentB:
        'Seja James. Faça perguntas sobre ontem.',
      sampleDialogue: [
        'James: Were you at the office yesterday?',
        'You: Yes, I was there all day.',
        'James: Was the Wi-Fi down?',
        'You: Yes, the connection was bad and the server was offline.',
        'James: Were the users tired?',
        'You: Yes, everyone was tired. It was a long day.',
      ],
      successCriteria:
        'Usar was e were corretamente pelo menos 3 vezes cada.',
      teacherNotes:
        '💛 Use uma linha do tempo no quadro para situar o aluno no passado.',
    },
    audioTranscript:
      'Let\'s review yesterday. At 10 am, the email system was slow. At 11 am, the Wi-Fi was unstable. By noon, two servers were offline. The IT team was very busy, and many users were tired and frustrated. It was a difficult day, but we were ready. By 6 pm, everything was back to normal. Thank you for your patience.',
  },
  {
    num: 1180,
    order: 20,
    title: 'My First IT Task',
    grammar: 'Revisão geral do nível Confidence (IT)',
    grammarShort: 'review',
    focus: 'IT Foundations',
    objective:
      'Revisar os principais pontos do nível Confidence em TI num mini-projeto prático.',
    intro:
      '💛 <em>You did it. Twenty lessons, one new voice.</em><br><br>Today is a <strong>review</strong>. You will bring together everything you learned: to be, possessivos, there is/are, imperativos, can, have/has, preposições, pronomes, comparativos, should, was/were. One small task, many wins.',
    vocab: [
      { en: 'task', pt: 'tarefa', example: 'My first task is to login.' },
      { en: 'setup', pt: 'configuração', example: 'The setup is ready.' },
      { en: 'test', pt: 'teste', example: 'This is a test email.' },
      { en: 'confirm', pt: 'confirmar', example: 'Please confirm the ticket.' },
      { en: 'finish', pt: 'terminar', example: 'I finish my task at 5 pm.' },
    ],
    situation:
      'James guides you through your very first IT task: login, send a test email, save a file, share a folder, and close the laptop safely.',
    readAloud: [
      'My first task is to login.',
      'The setup is ready.',
      'I should send a test email.',
      'Please confirm the ticket.',
      'I finish my task at 5 pm.',
    ],
    ex2: {
      title: '2. Complete cada frase com a palavra certa',
      prompt:
        'Revisão: escolha a opção correta entre parênteses.<br>a) I ______ (am / is) a new user.<br>b) There ______ (is / are) two monitors on the desk.<br>c) ______ (My / Your) password is strong.<br>d) You ______ (should / shouldn\'t) share your password.<br>e) The meeting is ______ (in / at) 10 am.<br>f) Yesterday, the server ______ (was / were) down.<br>g) The laptop is ______ (fast / faster) than the old one.<br>h) She ______ (have / has) a new laptop.<br>i) The apps ______ (is / are) installed.<br>j) ______ (Save / To save) the file before you close it.',
      answers: [
        'a) am',
        'b) are',
        'c) My',
        'd) shouldn\'t',
        'e) at',
        'f) was',
        'g) faster',
        'h) has',
        'i) are',
        'j) Save',
      ],
    },
    ex3: {
      words: 'task, setup, test, confirm, finish',
      prompt:
        'Complete com: <em>task, setup, test, confirm, finish</em>.<br>a) My first ______ is to login.<br>b) The ______ is ready on your desk.<br>c) Send a ______ email to James.<br>d) Please ______ the ticket in the system.<br>e) I ______ my work at 5 pm.<br>f) The ______ takes 10 minutes.<br>g) A small ______ avoids big problems.<br>h) ______ the backup before lunch.<br>i) Every new user has a ______ phase.<br>j) Please ______ the meeting time.',
      answers: [
        'a) task',
        'b) setup',
        'c) test',
        'd) confirm',
        'e) finish',
        'f) setup / task',
        'g) test',
        'h) Finish',
        'i) setup',
        'j) confirm',
      ],
    },
    wrapup:
      '💛 Você concluiu 20 lições de TI em inglês. Respire fundo e celebre. You did it.',
    takeaways: [
      'My first task is to login.',
      'The setup is ready.',
      'I should send a test email.',
      'I can ask the IT team for help.',
      'My password is strong.',
      'The meeting is at 10 am.',
      'Yesterday, the server was down.',
      'The new laptop is faster than the old one.',
      'I have a shared folder.',
      'I finish my task at 5 pm.',
    ],
    deepDive: {
      title: 'Confidence Level review — IT essentials',
      explanation:
        '<p>Nesta jornada você aprendeu:</p><p>• <strong>to be</strong> — am / is / are<br>• <strong>possessives</strong> — my / your<br>• <strong>there is / are</strong><br>• <strong>plurals</strong> — apps, files<br>• <strong>imperatives</strong> — save, send, restart<br>• <strong>can</strong> para pedidos educados<br>• <strong>have / has</strong><br>• <strong>prepositions</strong> — at, in, on<br>• <strong>adjectives</strong> — slow, fast, strong<br>• <strong>comparatives</strong> — bigger, faster<br>• <strong>should</strong> para conselhos<br>• <strong>was / were</strong> — passado básico</p><p>💛 <em>Dica final:</em> fale pouco, fale certo, fale todo dia. Isso constrói confiança real.</p>',
      examples: [
        { en: 'I am a new user.', pt: 'Eu sou um novo usuário.' },
        { en: 'My laptop is fast.', pt: 'Meu notebook é rápido.' },
        { en: 'There are two monitors on my desk.', pt: 'Há dois monitores na minha mesa.' },
        { en: 'I have many files in the folder.', pt: 'Eu tenho muitos arquivos na pasta.' },
        { en: 'Save the file before you close.', pt: 'Salve o arquivo antes de fechar.' },
        { en: 'Can you help me with my password?', pt: 'Você pode me ajudar com minha senha?' },
        { en: 'The meeting is at 10 am on Monday.', pt: 'A reunião é às 10 da manhã na segunda.' },
        { en: 'You should use a strong password.', pt: 'Você deveria usar uma senha forte.' },
        { en: 'Yesterday, the system was down.', pt: 'Ontem, o sistema estava fora do ar.' },
        { en: 'The new laptop is faster than the old one.', pt: 'O notebook novo é mais rápido que o antigo.' },
        { en: 'She is the IT manager.', pt: 'Ela é a gerente de TI.' },
        { en: 'I finish my first task at 5 pm.', pt: 'Eu termino minha primeira tarefa às 5 da tarde.' },
      ],
      mistakes: [
        { wrong: 'I is a user.', right: 'I am a user.', note: 'Com I, use am.' },
        { wrong: 'There is two monitors.', right: 'There are two monitors.', note: 'Plural → there are.' },
        { wrong: 'You should to save the file.', right: 'You should save the file.', note: 'Depois de should, sem to.' },
        { wrong: 'The laptop is more fast.', right: 'The laptop is faster.', note: 'Adjetivos curtos → -er.' },
        { wrong: 'Yesterday the server were down.', right: 'Yesterday the server was down.', note: 'Singular passado → was.' },
      ],
      practice: [
        { q: 'I ___ a new user. (to be)', a: 'am' },
        { q: 'Can you ___ my password? (redefinir)', a: 'reset' },
        { q: 'The meeting is ___ 10 am.', a: 'at' },
        { q: 'You ___ use a strong password.', a: 'should' },
        { q: 'Yesterday the server ___ down.', a: 'was' },
      ],
    },
    rolePlay: {
      title: 'Day one — the full loop',
      setup:
        'Seu primeiro dia. James te guia numa tarefa completa.',
      studentA:
        'Seja o novo usuário. Use pelo menos 5 tópicos das 20 lições.',
      studentB:
        'Seja James. Guie o aluno com perguntas e instruções.',
      sampleDialogue: [
        'James: Good morning! How are you?',
        'You: I am fine, thank you. I am a new user. My laptop is ready.',
        'James: Great. Can you login with your password?',
        'You: Yes, I can. My password is strong.',
        'James: Now, open your email and send a test email to me.',
        'You: Done. I should save the file first, right?',
        'James: Perfect. You should save, then send. Welcome to Czarnikow!',
      ],
      successCriteria:
        'Usar pelo menos 5 estruturas das lições anteriores em uma conversa natural.',
      teacherNotes:
        '💛 Celebre muito. Esta é a aula da virada: o aluno vê o próprio progresso.',
    },
    audioTranscript:
      'Welcome to your first IT task at Czarnikow. Step one: login with your new password. Step two: open your email and send a test message to the IT team. Step three: save a simple document on your computer and share it with James. Step four: close all programs properly at the end of the day. You can do this. Twenty lessons ago, you were a beginner. Today, you are a confident user. Well done.',
  },
];

// ---- Builder ---------------------------------------------------------------
function buildExercise1(readAloud) {
  const lines = readAloud
    .map((s) => `<em>"${s}"</em>`)
    .join('<br>');
  return {
    title: '1. Leia em voz alta (Read aloud)',
    content: `<p><strong>Instrução:</strong> Leia estas 5 frases em voz alta. Ouça o áudio e repita devagar.<br><br>${lines}</p>`,
  };
}

function buildExercise2(ex2) {
  return {
    title: ex2.title,
    content: `<p><strong>Instrução:</strong> ${ex2.prompt}</p>`,
    answers: ex2.answers,
  };
}

function buildExercise3(ex3) {
  return {
    title: '3. Escreva a palavra certa (Vocabulary Practice)',
    content: `<p><strong>Instrução:</strong> ${ex3.prompt}</p>`,
    answers: ex3.answers,
  };
}

function buildGrammarDetail(t) {
  return `<p><strong>${t.grammar}.</strong><br>${gramExplain(t.grammarShort)}</p><p>💛 <em>Sem medo de errar. Cada erro é uma aula grátis!</em></p>`;
}

function gramExplain(short) {
  switch (short) {
    case 'to be':
      return 'Use am com I, is com he/she/it (singular), are com you/we/they (plural). Em IT: <em>The system is online. The users are ready. I am a new user.</em>';
    case 'my / your':
      return 'My = meu/minha; Your = seu/sua. Vem antes do substantivo: <em>my laptop, your screen</em>.';
    case 'there is / there are':
      return 'There is + singular; There are + plural. <em>There is a laptop. There are two monitors.</em>';
    case 'plurais':
      return 'A maioria dos substantivos forma o plural com -s: app → apps, file → files, report → reports.';
    case 'imperativos':
      return 'Imperativo = verbo puro, sem sujeito. <em>Save the file. Turn on the laptop. Please restart the system.</em>';
    case 'polite can':
      return 'Can you…? (pedir ação) / Can I…? (pedir permissão). Adicione please para soar educado.';
    case 'have / has':
      return 'I/you/we/they → have. He/she/it → has. <em>I have ten emails. She has one attachment.</em>';
    case 'preposições':
      return 'At = ponto específico (at 10 am, at my desk). In = dentro (in the office, in London). On = em cima/sobre (on the wall, on the internet).';
    case 'adjetivos':
      return 'Adjetivos vêm antes do substantivo ou depois de to be. Não mudam no plural. <em>The slow laptop. The laptop is slow.</em>';
    case 'can you':
      return 'Can you + verbo + please? é a fórmula do pedido educado por telefone. <em>Can you open a ticket, please?</em>';
    case 'contáveis':
      return 'A (consoante), an (vogal), some (plural/indefinido). <em>a folder, an email, some documents.</em>';
    case 'is / are':
      return 'Singular → is; plural → are. Cuidado com team, data, software (singular no uso corporativo).';
    case 'at + time':
      return 'At + horário: at 10 am, at noon, at 3:30. Para dias use on, para partes do dia use in the.';
    case 'comparativos':
      return 'Adjetivo curto + -er + than: faster than, bigger than, smaller than. Adjetivo longo: more + adjetivo + than.';
    case 'pronomes':
      return 'He (homem), she (mulher), it (coisa), they (plural). Substituem o sujeito para não repetir o nome.';
    case 'should':
      return 'Should = conselho. Depois de should, o verbo vem no infinitivo sem to. Negativa: shouldn\'t.';
    case 'was / were':
      return 'Passado de to be: I/he/she/it → was; you/we/they → were. <em>Yesterday the system was down.</em>';
    case 'review':
      return 'Este é o momento de integrar tudo. Use frases curtas, uma estrutura por vez, com confiança.';
    default:
      return '';
  }
}

function buildLesson(t) {
  return {
    num: t.num,
    level: 'confidence',
    track: 'information-technology',
    trackOrder: t.order,
    title: t.title,
    focus: t.focus,
    character: CHARACTER,
    characterName: CHARACTER_NAME,
    characterAccent: CHARACTER_ACCENT,
    grammar: t.grammar,
    objective: t.objective,
    intro: t.intro,
    vocab: t.vocab,
    situation: t.situation,
    grammarDetail: buildGrammarDetail(t),
    exercises: [
      buildExercise1(t.readAloud),
      buildExercise2(t.ex2),
      buildExercise3(t.ex3),
    ],
    wrapup: t.wrapup,
    takeaways: t.takeaways,
    teacherGuide: {
      duration: '90 minutes',
      lessonFlow: [],
      commonChallenges: [
        'Medo de falar — comece sempre com repetição antes de produção livre.',
        'Tradução mental palavra por palavra — encoraje o aluno a pensar em blocos curtos.',
        'Confusão com estruturas novas — use quadros visuais e exemplos do dia a dia de TI.',
      ],
    },
    grammarDeepDive: {
      title: t.deepDive.title,
      explanation: t.deepDive.explanation,
      references: [
        'Murphy, R. — English Grammar in Use (Cambridge).',
        'Eastwood, J. — Oxford Practice Grammar.',
        'Cambridge Dictionary — online reference.',
      ],
      examples: t.deepDive.examples,
      commonMistakes: t.deepDive.mistakes,
      quickPractice: t.deepDive.practice,
    },
    extendedExercises: {
      rolePlays: [
        {
          title: t.rolePlay.title,
          setup: t.rolePlay.setup,
          studentA: t.rolePlay.studentA,
          studentB: t.rolePlay.studentB,
          sampleDialogue: t.rolePlay.sampleDialogue,
          successCriteria: t.rolePlay.successCriteria,
          teacherNotes: t.rolePlay.teacherNotes,
        },
      ],
      additionalAudios: [
        {
          title: `Audio 1 — ${t.title} with James`,
          speaker: CHARACTER,
          transcript: t.audioTranscript,
          tasks: [
            'Ouça o áudio uma vez e anote 3 palavras do vocabulário que você ouviu.',
            `Ouça de novo. Quantas vezes aparece uma estrutura com "${t.grammarShort}"?`,
            'Repita em voz alta a frase que você mais gostou do áudio.',
          ],
        },
      ],
      qAndA: [
        {
          type: 'básica',
          question: `What is the topic of lesson ${t.num}?`,
          sampleAnswer: `The topic is: ${t.title}.`,
        },
        {
          type: 'básica',
          question: `Who is the character of this lesson?`,
          sampleAnswer: `The character is ${CHARACTER_NAME}, from the IT team.`,
        },
        {
          type: 'pessoal',
          question: `Do you use this in your real work?`,
          sampleAnswer: 'Yes, I use it when [describe a real situation].',
        },
        {
          type: 'pessoal',
          question: `What is one new word you learned today?`,
          sampleAnswer: 'One new word is [vocab word]. It means [meaning in PT].',
        },
        {
          type: 'pessoal',
          question: `Can you use the grammar of this lesson in a short sentence?`,
          sampleAnswer: 'Yes: [short sentence using the grammar].',
        },
      ],
      contextualization: [
        `Escreva 3 frases sobre o seu dia de trabalho usando pelo menos 2 palavras do vocabulário.`,
        `Imagine uma situação em que você precisa usar a estrutura de "${t.grammarShort}". Descreva em 2 frases.`,
        '💛 Diga em voz alta: "I am learning English for IT. I can do it."',
      ],
      productionTasks: [],
      pairWork: [
        {
          title: `Pair practice — ${t.title}`,
          description: `Em pares: um aluno usa 3 frases com ${t.grammarShort} sobre o trabalho real. O outro responde com 3 frases. Depois, trocam os papéis.`,
          duration: '8 minutos',
        },
      ],
    },
  };
}

// ---- Validation ------------------------------------------------------------
function validateLesson(l) {
  const required = [
    'num',
    'level',
    'track',
    'trackOrder',
    'title',
    'focus',
    'character',
    'characterName',
    'characterAccent',
    'grammar',
    'objective',
    'intro',
    'vocab',
    'situation',
    'grammarDetail',
    'exercises',
    'wrapup',
    'takeaways',
    'teacherGuide',
    'grammarDeepDive',
    'extendedExercises',
  ];
  const keys = Object.keys(l);
  for (const k of required) {
    if (!(k in l)) throw new Error(`Lesson ${l.num} missing field: ${k}`);
  }
  if (keys.length !== 21)
    throw new Error(
      `Lesson ${l.num} has ${keys.length} fields, expected 21. Keys: ${keys.join(', ')}`
    );
  if (l.vocab.length !== 5)
    throw new Error(`Lesson ${l.num} must have 5 vocab entries, has ${l.vocab.length}`);
  if (l.exercises.length !== 3)
    throw new Error(`Lesson ${l.num} must have 3 exercises, has ${l.exercises.length}`);
  if (l.takeaways.length !== 10)
    throw new Error(`Lesson ${l.num} must have 10 takeaways, has ${l.takeaways.length}`);
  if (l.level !== 'confidence')
    throw new Error(`Lesson ${l.num} wrong level: ${l.level}`);
  if (l.track !== 'information-technology')
    throw new Error(`Lesson ${l.num} wrong track: ${l.track}`);
  // Heart emoji check
  const blob = JSON.stringify(l);
  if (!blob.includes('💛'))
    throw new Error(`Lesson ${l.num} missing 💛 emoji`);
  // grammarDeepDive sub-fields
  const gdd = l.grammarDeepDive;
  for (const k of ['title', 'explanation', 'references', 'examples', 'commonMistakes', 'quickPractice']) {
    if (!(k in gdd)) throw new Error(`Lesson ${l.num} grammarDeepDive missing: ${k}`);
  }
}

// ---- Main ------------------------------------------------------------------
function main() {
  if (topics.length !== 20)
    throw new Error(`Expected 20 topics, got ${topics.length}`);

  const lessons = topics.map(buildLesson);
  lessons.forEach(validateLesson);

  const raw = fs.readFileSync(coursePath, 'utf8');
  const course = JSON.parse(raw);

  // Remove any existing lessons with num in 1161–1180 (idempotent)
  const before = course.lessons.length;
  course.lessons = course.lessons.filter(
    (l) => !(l.num >= 1161 && l.num <= 1180)
  );
  const removed = before - course.lessons.length;

  course.lessons.push(...lessons);

  const out = JSON.stringify(course, null, 2) + '\n';
  fs.writeFileSync(coursePath, out, 'utf8');

  // Re-parse to be sure
  JSON.parse(fs.readFileSync(coursePath, 'utf8'));

  console.log(
    `OK. Removed ${removed} previous, added ${lessons.length}. Total lessons now: ${course.lessons.length}.`
  );
  lessons.forEach((l) =>
    console.log(
      `  - num ${l.num} | trackOrder ${l.trackOrder} | ${l.title}`
    )
  );
}

main();
