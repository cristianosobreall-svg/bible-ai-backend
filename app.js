const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#112e26">
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
  padding:18px;
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

<footer>
World English Bible passages. AI answers may contain mistakes—always check the cited Scripture.
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

    result.innerHTML =
      '<div class="error">The AI could not answer right now. Please try again.</div>';

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
      await fetch("/api/passage?reference=" + encodeURIComponent(text));

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

    verseButton.textContent =
      "Buscar pasaje";

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

    verseButton.textContent =
      "Find passage";

  }

});

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
      .replace(/[\\[\\]"']/g,"")
      .split(/[,;\\n]+/)
      .map(function(s){
        return s
          .replace(/^[-*\\d.\\s]+/,"")
          .trim();
      })
      .filter(Boolean);

  return [
    ...new Set(
      candidates.filter(function(s){

        return /^[1-3]?\\s?[A-Za-z]+(?:\\s+[A-Za-z]+)*\\s+\\d{1,3}:\\d{1,3}(?:-\\d{1,3})?$/.test(s);

      })
    )
  ].slice(0,7);

}


async function getPassage(reference){

  const url =
    "https://bible-api.com/" +
    encodeURIComponent(reference) +
    "?translation=web";

  const response =
    await fetch(
      url,
      {
        headers:{
          "accept":"application/json"
        }
      }
    );

  if(!response.ok){

    throw new Error("Passage not found");

  }

  const data = await response.json();

  return {
    reference:data.reference || reference,
    text:String(data.text || "").trim(),
    translation:
      data.translation_name ||
      "World English Bible"
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
        model:"gpt-5.4-mini",

        instructions:
          "Select accurate Bible passages. Never invent Bible references. Return only comma-separated Bible references.",

        input:refPrompt,

        max_output_tokens:160
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
      references.map(getPassage)
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
        model:"gpt-5.4-mini",

        instructions:
          "You are a careful Bible study assistant. " +
          languageInstruction +
          " Answer from the supplied Bible passages. Cite Bible references. Clearly distinguish what Scripture directly says from interpretation.",

        input:
          "User question:\\n" +
          question +
          "\\n\\nBible passages:\\n" +
          context,

        max_output_tokens:700
      }
    );


  return json({
    answer:answer,
    references:passages.map(function(p){
      return p.reference;
    }),
    translation:"World English Bible"
  });

}


export default {

  async fetch(request,env,ctx){

    void ctx;

    const url =
      new URL(request.url);

    try{

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
          await getPassage(reference)
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