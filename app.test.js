import assert from "node:assert/strict";
import test from "node:test";
import app from "./app.js";


async function request(path,options={},env={}){
  return app.fetch(new Request("http://localhost" + path,options),env,{});
}


test("health reports the complete local Bible",async function(){
  const response = await request("/api/health");
  const data = await response.json();

  assert.equal(response.status,200);
  assert.equal(data.ok,true);
  assert.equal(data.bibleLoaded,true);
  assert.equal(data.bibleBooks,66);
  assert.equal(data.spanishBibleLoaded,true);
  assert.equal(data.spanishBibleBooks,66);
  assert.equal(data.aiConfigured,false);
});


test("serves an installable iPhone web app shell",async function(){
  const pageResponse = await request("/");
  const html = await pageResponse.text();
  const manifestResponse = await request("/manifest.webmanifest");
  const manifest = await manifestResponse.json();
  const serviceWorkerResponse = await request("/sw.js");
  const serviceWorker = await serviceWorkerResponse.text();
  const iconResponse = await request("/apple-touch-icon.png");
  const icon = new Uint8Array(await iconResponse.arrayBuffer());

  assert.equal(pageResponse.status,200);
  assert.match(html,/apple-mobile-web-app-capable/);
  assert.match(html,/rel="manifest" href="\/manifest\.webmanifest"/);
  assert.match(html,/navigator\.serviceWorker\.register\("\/sw\.js"\)/);
  assert.equal(manifestResponse.status,200);
  assert.equal(manifest.name,"Scripture AI Bible");
  assert.equal(manifest.display,"standalone");
  assert.equal(manifest.icons.length,2);
  assert.match(serviceWorker,/CACHE_NAME = "scripture-ai-v1"/);
  assert.equal(iconResponse.headers.get("content-type"),"image/png");
  assert.deepEqual(Array.from(icon.slice(0,8)),[137,80,78,71,13,10,26,10]);
});


test("looks up an exact WEB verse locally",async function(){
  const response = await request("/api/passage?reference=John%203%3A16");
  const data = await response.json();

  assert.equal(response.status,200);
  assert.equal(data.reference,"John 3:16");
  assert.match(data.text,/For God so loved the world/);
  assert.equal(data.translation,"World English Bible (WEB)");
});


test("looks up an exact RV1909 verse in Spanish",async function(){
  const response = await request(
    "/api/passage?reference=Juan%203%3A16&language=es"
  );
  const data = await response.json();

  assert.equal(response.status,200);
  assert.equal(data.reference,"Juan 3:16");
  assert.match(data.text,/Porque de tal manera amó Dios al mundo/);
  assert.equal(data.translation,"Reina-Valera 1909 (RV1909)");
});


test("supports abbreviations and verse ranges",async function(){
  const response = await request("/api/passage?reference=Ps%2023%3A1-2");
  const data = await response.json();

  assert.equal(response.status,200);
  assert.equal(data.reference,"Psalms 23:1-2");
  assert.match(data.text,/1 Yahweh is my shepherd/);
  assert.match(data.text,/2 He makes me lie down/);
});


test("supports complete chapter lookup",async function(){
  const response = await request("/api/passage?reference=Psalm%20119");
  const data = await response.json();

  assert.equal(response.status,200);
  assert.equal(data.reference,"Psalms 119");
  assert.match(data.text,/1 Blessed are those whose ways are blameless/);
  assert.match(data.text,/176 I have gone astray like a lost sheep/);
});


test("returns a useful status when the AI key is missing",async function(){
  const response = await request("/api/ask",{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify({question:"Who is Jesus?",language:"en"})
  });
  const data = await response.json();

  assert.equal(response.status,503);
  assert.equal(data.code,"ai_not_configured");
});


test("grounds an AI answer in locally retrieved WEB passages",async function(){
  const originalFetch = globalThis.fetch;
  let callNumber = 0;

  globalThis.fetch = async function(url){
    assert.equal(url,"https://api.openai.com/v1/responses");
    callNumber += 1;

    return new Response(JSON.stringify({
      output_text:callNumber === 1
        ? "John 3:16, Romans 5:8, 1 John 4:9-10, Ephesians 2:8-9"
        : "The supplied passages teach that salvation is God's gift (Ephesians 2:8-9)."
    }),{
      status:200,
      headers:{"content-type":"application/json"}
    });
  };

  try{
    const response = await request("/api/ask",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({question:"What is salvation?",language:"en"})
    },{
      OPENAI_API_KEY:"test-key"
    });
    const data = await response.json();

    assert.equal(response.status,200);
    assert.equal(callNumber,2);
    assert.match(data.answer,/salvation is God's gift/);
    assert.deepEqual(data.references,[
      "John 3:16",
      "Romans 5:8",
      "1 John 4:9-10",
      "Ephesians 2:8-9"
    ]);
  }
  finally{
    globalThis.fetch = originalFetch;
  }
});
