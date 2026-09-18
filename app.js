import { readFileSync } from "node:fs";

const bibles = {
  en:JSON.parse(
    readFileSync(new URL("./web.json", import.meta.url), "utf8")
  ),
  es:JSON.parse(
    readFileSync(new URL("./rv1909.json", import.meta.url), "utf8")
  )
};

const staticAssets = new Map([
  ["/manifest.webmanifest",{
    body:readFileSync(new URL("./manifest.webmanifest",import.meta.url)),
    contentType:"application/manifest+json; charset=utf-8",
    cacheControl:"public, max-age=3600"
  }],
  ["/sw.js",{
    body:readFileSync(new URL("./sw.js",import.meta.url)),
    contentType:"text/javascript; charset=utf-8",
    cacheControl:"no-cache"
  }],
  ["/apple-touch-icon.png",{
    body:readFileSync(new URL("./apple-touch-icon.png",import.meta.url)),
    contentType:"image/png",
    cacheControl:"public, max-age=604800"
  }],
  ["/icon-192.png",{
    body:readFileSync(new URL("./icon-192.png",import.meta.url)),
    contentType:"image/png",
    cacheControl:"public, max-age=604800"
  }],
  ["/icon-512.png",{
    body:readFileSync(new URL("./icon-512.png",import.meta.url)),
    contentType:"image/png",
    cacheControl:"public, max-age=604800"
  }]
]);

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#112e26">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Scripture AI">
<meta name="format-detection" content="telephone=no">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png">
<title>Scripture AI Bible</title>

<style>
:root{
  --forest:#112e26;
  --green:#1c5947;
  --gold:#c39136;
  --cream:#f8f4e9;
  --paper:#fffdf7;
  --line:#ded8c8;
  --ink:#18211e;
  --muted:#66716d;
}

*{box-sizing:border-box}

body{
  margin:0;
  min-height:100vh;
  background:linear-gradient(180deg,#e7efe9 0,#f8f4e9 28rem);
  color:var(--ink);
  font-family:Arial,sans-serif;
}

header{
  background:var(--forest);
  color:white;
  padding:calc(18px + env(safe-area-inset-top)) 18px 18px;
}

.top{
  max-width:920px;
  margin:auto;
  display:flex;
  justify-content:space-between;
  align-items:center;
}

.brand{
  display:flex;
  gap:12px;
  align-items:center;
}

.book{
  font-size:30px;
}

h1{
  margin:0;
  font-family:Georgia,serif;
}

.subtitle{
  color:#d7e6df;
  font-size:14px;
}

select{
  padding:9px;
  border-radius:20px;
}

main{
  max-width:920px;
  margin:auto;
  padding:25px 16px;
}

h2{
  color:var(--forest);
  font-family:Georgia,serif;
  font-size:38px;
  margin-bottom:5px;
}

.intro{
  color:var(--muted);
}

.tabs{
  display:flex;
  gap:10px;
  margin:20px 0 12px;
}

.tab{
  padding:10px 16px;
  border-radius:20px;
  border:1px solid var(--line);
  background:white;
  color:var(--green);
  font-weight:bold;
}

.tab.active{
  background:var(--green);
  color:white;
}

.panel{
  background:var(--paper);
  border:1px solid var(--line);
  border-radius:20px;
  padding:20px;
}

.hidden{
  display:none;
}

label{
  display:block;
  font-weight:bold;
  margin-bottom:8px;
}

textarea,input{
  width:100%;
  border:2px solid #cbc6b8;
  border-radius:14px;
  padding:14px;
  font-size:17px;
}

textarea{
  min-height:120px;
}

.primary{
  background:var(--green);
  color:white;
  border:0;
  border-radius:13px;
  padding:14px 20px;
  font-size:17px;
  font-weight:bold;
  margin-top:12px;
}

.primary:disabled{
  opacity:.6;
}

.suggestions{
  display:flex;
  gap:8px;
  overflow:auto;
  margin-top:12px;
}

.suggestion{
  white-space:nowrap;
  border:1px solid #d8d0bb;
  background:#fff9e9;
  border-radius:20px;
  padding:9px 12px;
}

#result,#passage-result{
  margin-top:18px;
}

.answer{
  background:white;
  border-left:5px solid var(--gold);
  border-radius:14px;
  padding:18px;
  white-space:pre-wrap;
  line-height:1.6;
}

.error{
  background:#fff1ef;
  border:1px solid #efc1bb;
  padding:14px;
  border-radius:12px;
}

.loading{
  padding:15px;
  color:var(--muted);
}

footer{
  margin-top:30px;
  text-align:center;
  color:var(--muted);
  font-size:13px;
}
</style>
</head>

<body>

<header>
<div class="top">

<div class="brand">
<div class="book">✝</div>
<div>
<h1>Scripture AI Bible</h1>
<div class="subtitle">Answers grounded in the Bible</div>
</div>
</div>

<select id="language">
<option value="en">English</option>
<option value="es">Español</option>
</select>

</div>
</header>

<main>

<h2 id="title">Ask. Read. Understand.</h2>

<p class="intro" id="intro">
Ask any Bible question and receive a clear answer supported by cited Scripture.
</p>

<div class="tabs">
<button type="button" class="tab active" id="askTab">Ask AI</button>
<button type="button" class="tab" id="verseTab">Find a verse</button>
</div>

<div class="panel" id="askPanel">

<label id="questionLabel">What would you like to ask?</label>

<textarea
id="question"
placeholder="What does the Bible say about fear?"
></textarea>

<div class="suggestions">
<button type="button" class="suggestion">What does the Bible say about fear?</button>
<button type="button" class="suggestion">How should I pray?</button>
<button type="button" class="suggestion">What is salvation?</button>
<button type="button" class="suggestion">Who is Jesus?</button>
</div>

<button type="button" class="primary" id="askButton">
Ask the Bible
</button>

<div id="result"></div>

</div>

<div class="panel hidden" id="versePanel">

<label id="referenceLabel">Enter a Bible reference</label>

<input
id="reference"
placeholder="John 3:16"
/>

<button type="button" class="primary" id="verseButton">
Find passage
</button>

<div id="passage-result"></div>

</div>

<footer id="footerText">
Scripture texts: World English Bible (WEB) and Reina-Valera 1909 (RV1909)—Public Domain. AI answers may contain mistakes—always check the cited Scripture.
</footer>

</main>

<script>

var askTab = document.getElementById("askTab");
var verseTab = document.getElementById("verseTab");

var askPanel = document.getElementById("askPanel");
var versePanel = document.getElementById("versePanel");

var question = document.getElementById("question");
var askButton = document.getElementById("askButton");
var result = document.getElementById("result");

var reference = document.getElementById("reference");
var verseButton = document.getElementById("verseButton");
var passageResult = document.getElementById("passage-result");

var language = document.getElementById("language");
var footerText = document.getElementById("footerText");


askTab.addEventListener("click", function(){

  askPanel.classList.remove("hidden");
  versePanel.classList.add("hidden");

  askTab.classList.add("active");
  verseTab.classList.remove("active");

});


verseTab.addEventListener("click", function(){

  versePanel.classList.remove("hidden");
  askPanel.classList.add("hidden");

  verseTab.classList.add("active");
  askTab.classList.remove("active");

});


document.querySelectorAll(".suggestion").forEach(function(button){

  button.addEventListener("click", function(){

    question.value = button.textContent;

  });

});


askButton.addEventListener("click", async function(){

  var text = question.value.trim();

  if(!text){
    result.innerHTML =
      '<div class="error">Please type a Bible question first.</div>';
    return;
  }

  askButton.disabled = true;
  askButton.textContent = "Searching Scripture...";

  result.innerHTML =
    '<div class="loading">Preparing your Bible answer...</div>';

  try{

    var response = await fetch("/api/ask", {

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        question:text,
        language:language.value
      })

    });

    var data = await response.json();

    if(!response.ok){

      throw new Error(
        data.error || "The Bible AI request failed."
      );

    }

    result.innerHTML = "";

    var answerBox = document.createElement("div");
    answerBox.className = "answer";
    answerBox.textContent = data.answer || "No answer was returned.";

    result.appendChild(answerBox);

  }
  catch(error){

    console.error(error);

    result.innerHTML = "";

    var errorBox = document.createElement("div");
    errorBox.className = "error";
    errorBox.textContent =
      error.message === "AI key is not configured"
        ? "The AI connection is not configured yet."
        : "The AI could not answer right now. Please try again.";

    result.appendChild(errorBox);

  }
  finally{

    askButton.disabled = false;
    askButton.textContent = "Ask the Bible";

  }

});


verseButton.addEventListener("click", async function(){

  var text = reference.value.trim();

  if(!text){

    passageResult.innerHTML =
      '<div class="error">Type a reference such as John 3:16.</div>';

    return;

  }

  verseButton.disabled = true;
  verseButton.textContent = "Finding...";

  passageResult.innerHTML =
    '<div class="loading">Finding passage...</div>';

  try{

    var response =
      await fetch(
        "/api/passage?reference=" + encodeURIComponent(text) +
        "&language=" + encodeURIComponent(language.value)
      );

    var data = await response.json();

    if(!response.ok){

      throw new Error("Passage not found");

    }

    passageResult.innerHTML = "";

    var answerBox = document.createElement("div");
    answerBox.className = "answer";

    var heading = document.createElement("strong");
    heading.textContent = data.reference;

    var passage = document.createElement("div");
    passage.style.marginTop = "10px";
    passage.textContent = data.text;

    answerBox.appendChild(heading);
    answerBox.appendChild(passage);

    passageResult.appendChild(answerBox);

  }
  catch(error){

    console.error(error);

    passageResult.innerHTML =
      '<div class="error">Passage not found. Try John 3:16.</div>';

  }
  finally{

    verseButton.disabled = false;
    verseButton.textContent = "Find passage";

  }

});


language.addEventListener("change", function(){

  if(language.value === "es"){

    document.getElementById("title").textContent =
      "Pregunta. Lee. Comprende.";

    document.getElementById("intro").textContent =
      "Haz cualquier pregunta bíblica y recibe una respuesta basada en las Escrituras.";

    askTab.textContent = "Preguntar a la IA";
    verseTab.textContent = "Buscar versículo";

    document.getElementById("questionLabel").textContent =
      "¿Qué te gustaría preguntar?";

    askButton.textContent =
      "Preguntar a la Biblia";

    document.getElementById("referenceLabel").textContent =
      "Escribe una referencia bíblica";

    question.placeholder =
      "¿Qué dice la Biblia sobre el temor?";

    reference.placeholder =
      "Juan 3:16";

    verseButton.textContent =
      "Buscar pasaje";

    footerText.textContent =
      "Texto bíblico: Reina-Valera 1909 (RV1909)—Dominio Público. Las respuestas de IA pueden contener errores; comprueba siempre las Escrituras citadas.";

  }
  else{

    document.getElementById("title").textContent =
      "Ask. Read. Understand.";

    document.getElementById("intro").textContent =
      "Ask any Bible question and receive a clear answer supported by cited Scripture.";

    askTab.textContent = "Ask AI";
    verseTab.textContent = "Find a verse";

    document.getElementById("questionLabel").textContent =
      "What would you like to ask?";

    askButton.textContent =
      "Ask the Bible";

    document.getElementById("referenceLabel").textContent =
      "Enter a Bible reference";

    question.placeholder =
      "What does the Bible say about fear?";

    reference.placeholder =
      "John 3:16";

    verseButton.textContent =
      "Find passage";

    footerText.textContent =
      "Scripture texts: World English Bible (WEB) and Reina-Valera 1909 (RV1909)—Public Domain. AI answers may contain mistakes—always check the cited Scripture.";

  }

});


if("serviceWorker" in navigator){

  window.addEventListener("load", function(){

    navigator.serviceWorker.register("/sw.js").catch(function(error){
      console.error("App installation setup failed:",error);
    });

  });

}

</script>

</body>
</html>`;


function json(data,status=200){

  return new Response(
    JSON.stringify(data),
    {
      status,
      headers:{
        "content-type":"application/json; charset=utf-8",
        "cache-control":"no-store"
      }
    }
  );

}


function extractText(data){

  if(
    typeof data?.output_text === "string" &&
    data.output_text.trim()
  ){
    return data.output_text.trim();
  }

  for(const item of data?.output || []){

    for(const content of item?.content || []){

      if(
        content?.type === "output_text" &&
        content.text
      ){
        return content.text.trim();
      }

    }

  }

  return "";

}


async function callOpenAI(apiKey,body){

  const response =
    await fetch(
      "https://api.openai.com/v1/responses",
      {
        method:"POST",

        headers:{
          "authorization":"Bearer " + apiKey,
          "content-type":"application/json"
        },

        body:JSON.stringify(body)
      }
    );

  const data = await response.json();

  if(!response.ok){

    console.error("OpenAI error:", data);

    throw new Error(
      data?.error?.message ||
      "OpenAI request failed"
    );

  }

  return extractText(data);

}


function cleanReferences(text){

  const candidates =
    String(text)
      .replace(/[\[\]"']/g,"")
      .split(/[,;\n]+/)
      .map(function(s){
        return s
          .replace(/^\s*(?:[-*]\s*|\d+[.)]\s*)/,"")
          .trim();
      })
      .filter(Boolean);

  return [
    ...new Set(
      candidates.filter(function(s){

        return /^[1-3]?\s?[A-Za-z]+(?:\s+[A-Za-z]+)*\s+\d{1,3}:\d{1,3}(?:-\d{1,3})?$/.test(s);

      })
    )
  ].slice(0,7);

}


const bookAliases = new Map();

const spanishBookNames = {
  Genesis:"Génesis", Exodus:"Éxodo", Leviticus:"Levítico", Numbers:"Números",
  Deuteronomy:"Deuteronomio", Joshua:"Josué", Judges:"Jueces", Ruth:"Rut",
  "1 Samuel":"1 Samuel", "2 Samuel":"2 Samuel", "1 Kings":"1 Reyes",
  "2 Kings":"2 Reyes", "1 Chronicles":"1 Crónicas", "2 Chronicles":"2 Crónicas",
  Ezra:"Esdras", Nehemiah:"Nehemías", Esther:"Ester", Job:"Job",
  Psalms:"Salmos", Proverbs:"Proverbios", Ecclesiastes:"Eclesiastés",
  "Song of Solomon":"Cantares", Isaiah:"Isaías", Jeremiah:"Jeremías",
  Lamentations:"Lamentaciones", Ezekiel:"Ezequiel", Daniel:"Daniel",
  Hosea:"Oseas", Joel:"Joel", Amos:"Amós", Obadiah:"Abdías", Jonah:"Jonás",
  Micah:"Miqueas", Nahum:"Nahúm", Habakkuk:"Habacuc", Zephaniah:"Sofonías",
  Haggai:"Hageo", Zechariah:"Zacarías", Malachi:"Malaquías", Matthew:"Mateo",
  Mark:"Marcos", Luke:"Lucas", John:"Juan", Acts:"Hechos", Romans:"Romanos",
  "1 Corinthians":"1 Corintios", "2 Corinthians":"2 Corintios",
  Galatians:"Gálatas", Ephesians:"Efesios", Philippians:"Filipenses",
  Colossians:"Colosenses", "1 Thessalonians":"1 Tesalonicenses",
  "2 Thessalonians":"2 Tesalonicenses", "1 Timothy":"1 Timoteo",
  "2 Timothy":"2 Timoteo", Titus:"Tito", Philemon:"Filemón", Hebrews:"Hebreos",
  James:"Santiago", "1 Peter":"1 Pedro", "2 Peter":"2 Pedro",
  "1 John":"1 Juan", "2 John":"2 Juan", "3 John":"3 Juan",
  Jude:"Judas", Revelation:"Apocalipsis"
};

function normalizeBookName(name){

  return String(name)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g,"")
    .toLowerCase()
    .replace(/[^a-z0-9]/g,"");

}

for(const name of Object.keys(bibles.en.books)){

  bookAliases.set(normalizeBookName(name),name);

}

for(const [englishName,spanishName] of Object.entries(spanishBookNames)){

  bookAliases.set(normalizeBookName(spanishName),englishName);

}

const extraBookAliases = {
  gen:"Genesis", exo:"Exodus", ex:"Exodus", lev:"Leviticus",
  num:"Numbers", deut:"Deuteronomy", dt:"Deuteronomy", josh:"Joshua",
  judg:"Judges", ruth:"Ruth", "1sam":"1 Samuel", "2sam":"2 Samuel",
  "1kgs":"1 Kings", "2kgs":"2 Kings", "1chr":"1 Chronicles",
  "2chr":"2 Chronicles", neh:"Nehemiah", esth:"Esther", ps:"Psalms",
  psa:"Psalms", psalm:"Psalms", prov:"Proverbs", eccl:"Ecclesiastes",
  ecc:"Ecclesiastes", song:"Song of Solomon", songs:"Song of Solomon",
  sos:"Song of Solomon", isa:"Isaiah", jer:"Jeremiah", lam:"Lamentations",
  ezek:"Ezekiel", ezk:"Ezekiel", dan:"Daniel", hos:"Hosea", obad:"Obadiah",
  jon:"Jonah", mic:"Micah", nah:"Nahum", hab:"Habakkuk", zeph:"Zephaniah",
  hag:"Haggai", zech:"Zechariah", mal:"Malachi", matt:"Matthew",
  mk:"Mark", mrk:"Mark", lk:"Luke", jn:"John", joh:"John", act:"Acts",
  rom:"Romans", "1cor":"1 Corinthians", "2cor":"2 Corinthians",
  gal:"Galatians", eph:"Ephesians", phil:"Philippians", col:"Colossians",
  "1thess":"1 Thessalonians", "2thess":"2 Thessalonians",
  "1tim":"1 Timothy", "2tim":"2 Timothy", tit:"Titus", philem:"Philemon",
  heb:"Hebrews", jas:"James", "1pet":"1 Peter", "2pet":"2 Peter",
  "1jn":"1 John", "2jn":"2 John", "3jn":"3 John", rev:"Revelation",
  gn:"Genesis", ex:"Exodus", lv:"Leviticus", nm:"Numbers", dt:"Deuteronomy",
  jos:"Joshua", jue:"Judges", "1re":"1 Kings", "2re":"2 Kings",
  "1cr":"1 Chronicles", "2cr":"2 Chronicles", esd:"Ezra", ne:"Nehemiah",
  sal:"Psalms", salmo:"Psalms", pr:"Proverbs", ec:"Ecclesiastes",
  cantares:"Song of Solomon", cantardeloscantares:"Song of Solomon",
  is:"Isaiah", jr:"Jeremiah", lm:"Lamentations", ez:"Ezekiel",
  os:"Hosea", abd:"Obadiah", jonas:"Jonah", mi:"Micah", sof:"Zephaniah",
  zac:"Zechariah", mt:"Matthew", mc:"Mark", lc:"Luke", juan:"John",
  hch:"Acts", ro:"Romans", "1co":"1 Corinthians", "2co":"2 Corinthians",
  ga:"Galatians", ef:"Ephesians", fil:"Philippians", "1ts":"1 Thessalonians",
  "2ts":"2 Thessalonians", "1ti":"1 Timothy", "2ti":"2 Timothy",
  flm:"Philemon", stg:"James", "1pe":"1 Peter", "2pe":"2 Peter",
  "1ju":"1 John", "2ju":"2 John", "3ju":"3 John", ap:"Revelation"
};

for(const [alias,name] of Object.entries(extraBookAliases)){

  bookAliases.set(alias,name);

}

async function getPassage(reference,language="en"){

  const selectedLanguage = language === "es" ? "es" : "en";
  const bible = bibles[selectedLanguage];

  const match = String(reference)
    .trim()
    .match(/^((?:[1-3]\s*)?[\p{L}]+(?:\s+[\p{L}]+)*)\s+(\d{1,3})(?::(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?)?$/u);

  if(!match){

    throw new Error("Passage not found");

  }

  const bookName = bookAliases.get(normalizeBookName(match[1]));
  const chapterNumber = Number(match[2]);
  const startVerse = match[3] ? Number(match[3]) : null;
  const endVerse = match[4] ? Number(match[4]) : startVerse;
  const chapter = bookName && bible.books[bookName]?.[chapterNumber];

  if(!chapter){

    throw new Error("Passage not found");

  }

  const first = startVerse || 1;
  const last = endVerse || chapter.length - 1;

  if(
    first < 1 ||
    last < first ||
    last >= chapter.length ||
    (startVerse !== null && last - first > 49)
  ){

    throw new Error("Passage not found");

  }

  const includeVerseNumbers = first !== last;
  const lines = [];

  for(let verseNumber=first; verseNumber<=last; verseNumber++){

    const verse = chapter[verseNumber];

    if(!verse){

      if(first === last){

        throw new Error("Passage not found");

      }

      continue;

    }

    lines.push(
      includeVerseNumbers
        ? verseNumber + " " + verse
        : verse
    );

  }

  const displayBookName =
    selectedLanguage === "es"
      ? spanishBookNames[bookName]
      : bookName;

  const normalizedReference =
    displayBookName +
    " " +
    chapterNumber +
    (startVerse
      ? ":" + startVerse + (last !== first ? "-" + last : "")
      : "");

  return {
    reference:normalizedReference,
    text:lines.join("\n"),
    translation:bible.translation
  };

}


async function handleAsk(request,env){

  if(!env.OPENAI_API_KEY){

    return json(
      {
        error:"AI key is not configured",
        code:"ai_not_configured"
      },
      503
    );

  }

  let body;

  try{

    body = await request.json();

  }
  catch{

    return json(
      {error:"Invalid request"},
      400
    );

  }

  const question =
    String(body?.question || "")
      .trim()
      .slice(0,500);

  const language =
    body?.language === "es"
      ? "es"
      : "en";

  if(question.length < 3){

    return json(
      {error:"Question is required"},
      400
    );

  }


  const refPrompt =
    (language === "es"
      ? "Pregunta en español: "
      : "Question: "
    ) +
    question +
    "\\nReturn only 4 to 7 precise Bible references that directly help answer this question. Use English Bible book names. Example: John 3:16, Romans 8:1-2.";


  const rawRefs =
    await callOpenAI(
      env.OPENAI_API_KEY,
      {
        model:env.OPENAI_MODEL || "gpt-5-mini",

        reasoning:{effort:"low"},

        instructions:
          "Select accurate Bible passages. Never invent Bible references. Return only comma-separated Bible references.",

        input:refPrompt,

        max_output_tokens:400
      }
    );


  let references =
    cleanReferences(rawRefs);


  if(!references.length){

    references = [
      "John 3:16",
      "2 Timothy 3:16-17",
      "Psalm 119:105"
    ];

  }


  const settled =
    await Promise.allSettled(
      references.map(function(reference){
        return getPassage(reference,language);
      })
    );


  const passages =
    settled
      .filter(function(r){
        return r.status === "fulfilled";
      })
      .map(function(r){
        return r.value;
      });


  if(!passages.length){

    throw new Error(
      "Could not retrieve Scripture"
    );

  }


  const context =
    passages
      .map(function(p){

        return (
          "[" +
          p.reference +
          "]\\n" +
          p.text
        );

      })
      .join("\\n\\n");


  const languageInstruction =
    language === "es"
      ? "Respond in clear, natural Spanish."
      : "Respond in clear, natural English.";


  const answer =
    await callOpenAI(
      env.OPENAI_API_KEY,
      {
        model:env.OPENAI_MODEL || "gpt-5-mini",

        reasoning:{effort:"low"},

        instructions:
          "You are a careful Bible study assistant. " +
          languageInstruction +
          " Answer from the supplied Bible passages. Cite Bible references. Clearly distinguish what Scripture directly says from interpretation.",

        input:
          "User question:\\n" +
          question +
          "\\n\\nBible passages:\\n" +
          context,

        max_output_tokens:1400
      }
    );


  return json({
    answer:answer,
    references:passages.map(function(p){
      return p.reference;
    }),
    translation:bibles[language].translation
  });

}


export default {

  async fetch(request,env,ctx){

    void ctx;

    const url =
      new URL(request.url);

    try{

      const staticAsset =
        staticAssets.get(url.pathname);

      if(
        request.method === "GET" &&
        staticAsset
      ){

        return new Response(
          staticAsset.body,
          {
            headers:{
              "content-type":staticAsset.contentType,
              "cache-control":staticAsset.cacheControl,
              ...(url.pathname === "/sw.js"
                ? {"service-worker-allowed":"/"}
                : {})
            }
          }
        );

      }

      if(
        request.method === "GET" &&
        url.pathname === "/"
      ){

        return new Response(
          page,
          {
            headers:{
              "content-type":"text/html; charset=utf-8",
              "cache-control":"no-store"
            }
          }
        );

      }


      if(
        request.method === "GET" &&
        url.pathname === "/api/health"
      ){

        return json({
          ok:true,
          bibleLoaded:true,
          bibleBooks:Object.keys(bibles.en.books).length,
          spanishBibleLoaded:true,
          spanishBibleBooks:Object.keys(bibles.es.books).length,
          aiConfigured:
            Boolean(env.OPENAI_API_KEY)
        });

      }


      if(
        request.method === "GET" &&
        url.pathname === "/api/passage"
      ){

        const reference =
          String(
            url.searchParams.get("reference") ||
            ""
          )
          .trim()
          .slice(0,80);

        if(!reference){

          return json(
            {error:"Reference required"},
            400
          );

        }

        return json(
          await getPassage(
            reference,
            url.searchParams.get("language")
          )
        );

      }


      if(
        request.method === "POST" &&
        url.pathname === "/api/ask"
      ){

        return await handleAsk(
          request,
          env
        );

      }


      return new Response(
        "Not found",
        {status:404}
      );

    }
    catch(error){

      console.error(
        "SERVER ERROR:",
        error
      );

      return json(
        {
          error:
            error?.message ||
            "The request could not be completed."
        },
        500
      );

    }

  }

};
