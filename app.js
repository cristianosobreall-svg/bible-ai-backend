const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="theme-color" content="#112e26">
  <meta name="description" content="Ask Bible questions and receive clear, Scripture-grounded answers with cited passages.">
  <title>Scripture AI Bible</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23112e26'/%3E%3Cpath d='M14 14h25c7 0 11 4 11 11v29H23c-6 0-9-3-9-9z' fill='%23f4e8c8'/%3E%3Cpath d='M32 16v35M37 25h10M42 20v16' stroke='%23c39136' stroke-width='4'/%3E%3C/svg%3E">
  <style>
    :root{--ink:#18211e;--muted:#66716d;--forest:#112e26;--green:#1c5947;--gold:#c39136;--cream:#f8f4e9;--paper:#fffdf7;--line:#ded8c8;--danger:#a23d31;font-family:Georgia,"Times New Roman",serif;color:var(--ink);background:var(--cream)}
    *{box-sizing:border-box}body{margin:0;min-height:100vh;background:linear-gradient(180deg,#e7efe9 0,#f8f4e9 28rem);font-size:16px}button,input,textarea,select{font:inherit}button{cursor:pointer}
    header{background:var(--forest);color:white;padding:max(16px,env(safe-area-inset-top)) 20px 18px;box-shadow:0 8px 30px #0a201a33}.top{max-width:920px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:14px}.brand{display:flex;align-items:center;gap:12px}.book{width:44px;height:44px;display:grid;place-items:center;border:1px solid #ffffff44;border-radius:12px;background:#ffffff14;font-size:25px}.brand h1{font-size:clamp(20px,5vw,28px);margin:0;letter-spacing:.01em}.brand small{display:block;color:#d7e6df;font:14px system-ui,sans-serif;margin-top:2px}.lang{border:1px solid #ffffff55;background:#ffffff12;color:white;border-radius:999px;padding:9px 11px;font:700 14px system-ui,sans-serif}.lang option{color:#111}
    main{max-width:920px;margin:auto;padding:24px 16px 90px}.welcome{display:flex;justify-content:space-between;align-items:end;gap:18px;margin-bottom:18px}.welcome h2{font-size:clamp(29px,7vw,46px);line-height:1.05;margin:0;color:var(--forest)}.welcome p{font:16px/1.5 system-ui,sans-serif;color:var(--muted);max-width:480px;margin:8px 0 0}
    .tabs{display:flex;gap:8px;margin:18px 0 12px}.tab{border:1px solid var(--line);background:#fffaf0;color:var(--green);border-radius:999px;padding:10px 16px;font:800 15px system-ui,sans-serif}.tab.active{background:var(--green);color:white;border-color:var(--green)}
    .panel{background:var(--paper);border:1px solid var(--line);border-radius:22px;padding:clamp(16px,4vw,28px);box-shadow:0 16px 45px #183a2d14}.field-label{display:block;font:800 14px system-ui,sans-serif;color:var(--forest);margin:0 0 8px}.askbox{position:relative}.askbox textarea,.lookup-row input{width:100%;border:2px solid #cbc6b8;background:white;color:var(--ink);border-radius:15px;padding:15px 54px 15px 15px;outline:none;font:18px/1.45 system-ui,sans-serif}.askbox textarea{min-height:122px;resize:vertical}.askbox textarea:focus,.lookup-row input:focus{border-color:var(--gold);box-shadow:0 0 0 4px #c3913622}.mic{position:absolute;right:10px;bottom:11px;width:42px;height:42px;border:0;border-radius:50%;background:#efe8d8;font-size:20px}.primary{border:0;border-radius:14px;background:var(--green);color:white;padding:14px 20px;font:850 17px system-ui,sans-serif;box-shadow:0 5px 0 #0d382c;min-height:52px}.primary:active{transform:translateY(3px);box-shadow:0 2px 0 #0d382c}.primary:disabled{opacity:.6;cursor:wait}.actions{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:13px}.hint{color:var(--muted);font:13px/1.4 system-ui,sans-serif}
    .suggestions{display:flex;gap:8px;overflow:auto;padding:12px 1px 4px;scrollbar-width:none}.suggestion{white-space:nowrap;border:1px solid #d8d0bb;background:#fff9e9;color:#4b4a3f;border-radius:999px;padding:9px 13px;font:700 14px system-ui,sans-serif}
    #result{margin-top:18px}.answer-card{background:white;border-left:5px solid var(--gold);border-radius:16px;padding:20px;box-shadow:0 10px 30px #1d362c12}.answer-card h3{margin:0 0 12px;color:var(--forest);font-size:23px}.answer-text{white-space:pre-wrap;font:17px/1.65 system-ui,sans-serif}.answer-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:16px}.secondary{border:1px solid var(--line);background:#faf7ee;color:var(--green);border-radius:10px;padding:9px 12px;font:750 14px system-ui,sans-serif}.status{padding:18px;text-align:center;color:var(--muted);font:16px system-ui,sans-serif}.error{color:var(--danger);background:#fff1ef;border:1px solid #efc1bb;border-radius:12px;padding:14px;font:15px/1.45 system-ui,sans-serif}.setup{color:#694e15;background:#fff7d8;border:1px solid #ead07d;border-radius:12px;padding:14px;font:15px/1.45 system-ui,sans-serif}
    .lookup-row{display:grid;grid-template-columns:1fr auto;gap:10px}.lookup-row input{padding-right:15px}.passage{font-size:18px;line-height:1.75}.passage strong{color:var(--green)}
    .saved-head{display:flex;align-items:center;justify-content:space-between;margin:24px 2px 10px}.saved-head h2{font-size:25px;color:var(--forest);margin:0}.saved-list{display:grid;gap:10px}.saved-item{background:#fffdf8;border:1px solid var(--line);border-radius:14px;padding:15px}.saved-item strong{display:block;color:var(--forest);margin-bottom:7px}.saved-item p{font:14px/1.5 system-ui,sans-serif;color:#4c5552;margin:0}.empty{color:var(--muted);font:15px system-ui,sans-serif;padding:12px 2px}
    .hidden{display:none!important}.spinner{display:inline-block;width:18px;height:18px;border:3px solid #ffffff55;border-top-color:white;border-radius:50%;animation:spin .8s linear infinite;vertical-align:-3px;margin-right:8px}@keyframes spin{to{transform:rotate(360deg)}}
    footer{text-align:center;color:#77817d;font:13px/1.5 system-ui,sans-serif;margin-top:28px}.verse{color:var(--gold);font-weight:800}
    @media(max-width:620px){.welcome{display:block}.brand small{display:none}.lookup-row{grid-template-columns:1fr}.actions{align-items:stretch;flex-direction:column}.primary{width:100%}.panel{border-radius:18px}.saved-head{margin-top:20px}}
  </style>
</head>
<body>
  <header><div class="top"><div class="brand"><div class="book">✝</div><div><h1>Scripture AI Bible</h1><small>Answers grounded in the Bible</small></div></div><select id="language" class="lang" aria-label="Language"><option value="en">English</option><option value="es">Español</option></select></div></header>
  <main>
    <section class="welcome"><div><h2 id="welcome-title">Ask. Read. Understand.</h2><p id="welcome-copy">Ask any Bible question and receive a clear answer supported by cited Scripture.</p></div></section>
    <div class="tabs" role="tablist"><button class="tab active" id="ask-tab" role="tab">Ask AI</button><button class="tab" id="lookup-tab" role="tab">Find a verse</button></div>
    <section class="panel" id="ask-panel">
      <label class="field-label" id="question-label" for="question">What would you like to ask?</label>
      <div class="askbox"><textarea id="question" maxlength="500" placeholder="What does the Bible say about fear?"></textarea><button id="mic" class="mic" type="button" aria-label="Speak question">🎙️</button></div>
      <div class="suggestions" id="suggestions"><button class="suggestion">What does the Bible say about fear?</button><button class="suggestion">How should I pray?</button><button class="suggestion">What is salvation?</button><button class="suggestion">How can I forgive someone?</button></div>
      <div class="actions"><span class="hint" id="answer-note">Answers include Bible references so you can verify them.</span><button class="primary" id="ask" type="button">Ask the Bible</button></div>
      <div id="result" aria-live="polite"></div>
    </section>
    <section class="panel hidden" id="lookup-panel">
      <label class="field-label" id="lookup-label" for="reference">Enter a Bible reference</label>
      <div class="lookup-row"><input id="reference" placeholder="John 3:16 or Psalm 23"><button class="primary" id="lookup" type="button">Find passage</button></div>
      <div id="passage-result" aria-live="polite"></div>
    </section>
    <section><div class="saved-head"><h2 id="saved-title">Saved answers</h2><button class="secondary" id="clear-saved" type="button">Clear</button></div><div class="saved-list" id="saved-list"></div></section>
    <footer id="footer-copy">World English Bible passages. AI answers may contain mistakes—always check the cited Scripture.</footer>
  </main>
  <script>
  (function(){
    var q=document.getElementById('question'),ask=document.getElementById('ask'),result=document.getElementById('result'),lang=document.getElementById('language');
    var askTab=document.getElementById('ask-tab'),lookupTab=document.getElementById('lookup-tab'),askPanel=document.getElementById('ask-panel'),lookupPanel=document.getElementById('lookup-panel');
    var ref=document.getElementById('reference'),lookup=document.getElementById('lookup'),passageResult=document.getElementById('passage-result'),savedList=document.getElementById('saved-list');
    var lastAnswer=null;
    var copy={en:{welcomeTitle:'Ask. Read. Understand.',welcomeCopy:'Ask any Bible question and receive a clear answer supported by cited Scripture.',askTab:'Ask AI',lookupTab:'Find a verse',questionLabel:'What would you like to ask?',placeholder:'What does the Bible say about fear?',note:'Answers include Bible references so you can verify them.',ask:'Ask the Bible',lookupLabel:'Enter a Bible reference',refPlaceholder:'John 3:16 or Psalm 23',lookup:'Find passage',saved:'Saved answers',clear:'Clear',footer:'World English Bible passages. AI answers may contain mistakes—always check the cited Scripture.',thinking:'Searching Scripture and preparing your answer…',saving:'Save answer',speak:'Read aloud',savedOk:'Saved',empty:'No saved answers yet.',setup:'The app is ready, but the private AI key still needs to be connected. Verse lookup already works.',error:'I could not prepare an answer. Please try again.'},es:{welcomeTitle:'Pregunta. Lee. Comprende.',welcomeCopy:'Haz cualquier pregunta bíblica y recibe una respuesta clara respaldada por las Escrituras.',askTab:'Preguntar a la IA',lookupTab:'Buscar versículo',questionLabel:'¿Qué te gustaría preguntar?',placeholder:'¿Qué dice la Biblia sobre el temor?',note:'Las respuestas incluyen referencias bíblicas para que puedas verificarlas.',ask:'Preguntar a la Biblia',lookupLabel:'Escribe una referencia bíblica',refPlaceholder:'Juan 3:16 o Salmo 23',lookup:'Buscar pasaje',saved:'Respuestas guardadas',clear:'Borrar',footer:'Pasajes de la World English Bible. La IA puede equivocarse; verifica siempre las Escrituras citadas.',thinking:'Buscando en las Escrituras y preparando tu respuesta…',saving:'Guardar respuesta',speak:'Leer en voz alta',savedOk:'Guardada',empty:'No hay respuestas guardadas.',setup:'La aplicación está lista, pero todavía falta conectar la clave privada de IA. La búsqueda de versículos ya funciona.',error:'No pude preparar una respuesta. Inténtalo otra vez.'}};
    function t(){return copy[lang.value]}
    function esc(s){return String(s).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]})}
    function setLanguage(){var a=t();document.documentElement.lang=lang.value;document.getElementById('welcome-title').textContent=a.welcomeTitle;document.getElementById('welcome-copy').textContent=a.welcomeCopy;askTab.textContent=a.askTab;lookupTab.textContent=a.lookupTab;document.getElementById('question-label').textContent=a.questionLabel;q.placeholder=a.placeholder;document.getElementById('answer-note').textContent=a.note;ask.textContent=a.ask;document.getElementById('lookup-label').textContent=a.lookupLabel;ref.placeholder=a.refPlaceholder;lookup.textContent=a.lookup;document.getElementById('saved-title').textContent=a.saved;document.getElementById('clear-saved').textContent=a.clear;document.getElementById('footer-copy').textContent=a.footer;renderSaved()}
    function switchTab(which){var isAsk=which==='ask';askTab.classList.toggle('active',isAsk);lookupTab.classList.toggle('active',!isAsk);askPanel.classList.toggle('hidden',!isAsk);lookupPanel.classList.toggle('hidden',isAsk)}
    askTab.onclick=function(){switchTab('ask')};lookupTab.onclick=function(){switchTab('lookup')};lang.onchange=setLanguage;
    document.querySelectorAll('.suggestion').forEach(function(b){b.onclick=function(){q.value=b.textContent;q.focus()}});
    function answerHtml(text){return esc(text)}
    async function askQuestion(){var question=q.value.trim();if(!question)return;q.blur();ask.disabled=true;ask.innerHTML='<span class="spinner"></span>'+t().thinking;result.innerHTML='<div class="status">'+t().thinking+'</div>';try{var r=await fetch('/api/ask',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({question:question,language:lang.value})});var data=await r.json();if(!r.ok){if(data.code==='ai_not_configured')result.innerHTML='<div class="setup">'+t().setup+'</div>';else throw new Error(data.error||'Request failed');return}lastAnswer={question:question,answer:data.answer,language:lang.value,createdAt:new Date().toISOString()};result.innerHTML='<article class="answer-card"><h3>'+esc(question)+'</h3><div class="answer-text">'+answerHtml(data.answer)+'</div><div class="answer-actions"><button class="secondary" id="save-answer">'+t().saving+'</button><button class="secondary" id="speak-answer">🔊 '+t().speak+'</button></div></article>';document.getElementById('save-answer').onclick=saveCurrent;document.getElementById('speak-answer').onclick=function(){speechSynthesis.cancel();speechSynthesis.speak(new SpeechSynthesisUtterance(data.answer))}}catch(e){result.innerHTML='<div class="error">'+t().error+'</div>'}finally{ask.disabled=false;ask.textContent=t().ask}}
    ask.onclick=askQuestion;q.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&e.key==='Enter')askQuestion()});
    async function lookupPassage(){var reference=ref.value.trim();if(!reference)return;lookup.disabled=true;passageResult.innerHTML='<div class="status">Loading…</div>';try{var r=await fetch('/api/passage?reference='+encodeURIComponent(reference));var d=await r.json();if(!r.ok)throw new Error();passageResult.innerHTML='<article class="answer-card passage"><h3>'+esc(d.reference)+'</h3><div>'+esc(d.text)+'</div></article>'}catch(e){passageResult.innerHTML='<div class="error">Passage not found. Try a reference like John 3:16.</div>'}finally{lookup.disabled=false}}
    lookup.onclick=lookupPassage;ref.addEventListener('keydown',function(e){if(e.key==='Enter')lookupPassage()});
    function getSaved(){try{return JSON.parse(localStorage.getItem('scripture-ai-saved')||'[]')}catch(e){return []}}
    function saveCurrent(){if(!lastAnswer)return;var items=getSaved();items.unshift(lastAnswer);localStorage.setItem('scripture-ai-saved',JSON.stringify(items.slice(0,30)));document.getElementById('save-answer').textContent=t().savedOk;renderSaved()}
    function renderSaved(){var items=getSaved();savedList.innerHTML=items.length?items.map(function(i){return '<article class="saved-item"><strong>'+esc(i.question)+'</strong><p>'+answerHtml(i.answer.slice(0,260))+(i.answer.length>260?'…':'')+'</p></article>'}).join(''):'<div class="empty">'+t().empty+'</div>'}
    document.getElementById('clear-saved').onclick=function(){localStorage.removeItem('scripture-ai-saved');renderSaved()};
    var SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SpeechRecognition)document.getElementById('mic').classList.add('hidden');else document.getElementById('mic').onclick=function(){var rec=new SpeechRecognition();rec.lang=lang.value==='es'?'es-US':'en-US';rec.onresult=function(e){q.value=e.results[0][0].transcript};rec.start()};
    if(document.modelContext&&document.modelContext.registerTool){var life=new AbortController();Promise.resolve(document.modelContext.registerTool({name:'ask_bible_question',title:'Ask Bible question',description:'Ask a question and display a Scripture-grounded answer with Bible citations.',inputSchema:{type:'object',properties:{question:{type:'string'},language:{type:'string',enum:['en','es']}},required:['question'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:async function(input){if(!input||typeof input.question!=='string'||!input.question.trim())throw new Error('A question is required');lang.value=input.language==='es'?'es':'en';setLanguage();switchTab('ask');q.value=input.question.trim();await askQuestion();return {question:q.value,answer:lastAnswer?lastAnswer.answer:null}}},{signal:life.signal})).catch(function(){});Promise.resolve(document.modelContext.registerTool({name:'look_up_bible_passage',title:'Look up Bible passage',description:'Look up an exact Bible reference in the World English Bible and display it.',inputSchema:{type:'object',properties:{reference:{type:'string'}},required:['reference'],additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute:async function(input){if(!input||typeof input.reference!=='string'||!input.reference.trim())throw new Error('A reference is required');switchTab('lookup');ref.value=input.reference.trim();await lookupPassage();return {reference:ref.value}}},{signal:life.signal})).catch(function(){})}
    setLanguage();renderSaved();
  })();
  </script>
</body>
</html>`;

function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}})}

function extractText(data){
  if(typeof data?.output_text==="string"&&data.output_text.trim())return data.output_text.trim();
  for(const item of data?.output||[])for(const content of item?.content||[])if(content?.type==="output_text"&&content.text)return content.text.trim();
  return "";
}

async function callOpenAI(apiKey,body){
  const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"authorization":"Bearer "+apiKey,"content-type":"application/json"},body:JSON.stringify(body)});
  const data=await response.json();
  if(!response.ok)throw new Error(data?.error?.message||"OpenAI request failed");
  return extractText(data);
}

function cleanReferences(text){
  const candidates=String(text).replace(/[\[\]"']/g,"").split(/[,;\n]+/).map(s=>s.replace(/^[-*\d.\s]+/,"").trim()).filter(Boolean);
  return [...new Set(candidates.filter(s=>/^[1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)*\s+\d{1,3}:\d{1,3}(?:-\d{1,3})?$/.test(s)))].slice(0,7);
}

async function getPassage(reference){
  const url="https://bible-api.com/"+encodeURIComponent(reference)+"?translation=web";
  const response=await fetch(url,{headers:{"accept":"application/json"}});
  if(!response.ok)throw new Error("Passage not found");
  const data=await response.json();
  return {reference:data.reference||reference,text:String(data.text||"").trim(),translation:data.translation_name||"World English Bible"};
}

async function handleAsk(request,env){
  if(!env.OPENAI_API_KEY)return json({error:"AI key is not configured",code:"ai_not_configured"},503);
  let body;try{body=await request.json()}catch{return json({error:"Invalid request"},400)}
  const question=String(body?.question||"").trim().slice(0,500),language=body?.language==="es"?"es":"en";
  if(question.length<3)return json({error:"Question is required"},400);
  const refPrompt=(language==="es"?"Pregunta en español: ":"Question: ")+question+"\nReturn only 4 to 7 precise Bible references that directly help answer this question. Use English Bible book names so an API can retrieve them. Format: John 3:16, Romans 8:1-2. No explanation.";
  const rawRefs=await callOpenAI(env.OPENAI_API_KEY,{model:"gpt-5.4-mini",instructions:"You select relevant Bible passages accurately. Never invent a reference. Return only the requested comma-separated references.",input:refPrompt,max_output_tokens:160});
  let references=cleanReferences(rawRefs);if(!references.length)references=["2 Timothy 3:16-17","Psalm 119:105","John 3:16"];
  const settled=await Promise.allSettled(references.map(getPassage));
  const passages=settled.filter(r=>r.status==="fulfilled").map(r=>r.value);
  if(!passages.length)throw new Error("Could not retrieve Scripture");
  const context=passages.map(p=>"["+p.reference+"]\n"+p.text).join("\n\n");
  const languageInstruction=language==="es"?"Respond in clear, natural Spanish.":"Respond in clear, natural English.";
  const answer=await callOpenAI(env.OPENAI_API_KEY,{model:"gpt-5.4-mini",instructions:"You are a careful Bible study assistant. "+languageInstruction+" Answer only from the supplied World English Bible passages. Cite claims with square-bracket references such as [John 3:16]. Distinguish what the text directly says from interpretation. Do not claim one denomination's interpretation is the only possible view. If the passages do not fully answer the question, say so plainly. Be warm, concise, and helpful.",input:"User question:\n"+question+"\n\nBible passages:\n"+context,max_output_tokens:700});
  return json({answer,references:passages.map(p=>p.reference),translation:"World English Bible"});
}

export default {
  async fetch(request,env,ctx){
    void ctx;const url=new URL(request.url);
    try{
      if(request.method==="GET"&&url.pathname==="/")return new Response(page,{headers:{"content-type":"text/html; charset=utf-8","cache-control":"no-store"}});
      if(request.method==="GET"&&url.pathname==="/api/health")return json({ok:true,aiConfigured:Boolean(env.OPENAI_API_KEY)});
      if(request.method==="GET"&&url.pathname==="/api/passage"){const reference=String(url.searchParams.get("reference")||"").trim().slice(0,80);if(!reference)return json({error:"Reference required"},400);return json(await getPassage(reference))}
      if(request.method==="POST"&&url.pathname==="/api/ask")return await handleAsk(request,env);
      return new Response("Not found",{status:404});
    }catch(error){return json({error:"The request could not be completed."},500)}
  }
};
