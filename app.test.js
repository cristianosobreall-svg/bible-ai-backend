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
  assert.equal(data.oneSignalConfigured,false);
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
  assert.equal(manifest.name,"Bible Intelligence");
  assert.equal(manifest.display,"standalone");
  assert.equal(manifest.icons.length,2);
  assert.match(serviceWorker,/CACHE_NAME = "bible-intelligence-v7"/);
  assert.equal(iconResponse.headers.get("content-type"),"image/png");
  assert.deepEqual(Array.from(icon.slice(0,8)),[137,80,78,71,13,10,26,10]);
});


test("connects reminders to the OneSignal web push SDK",async function(){
  const pageResponse = await request("/");
  const html = await pageResponse.text();
  const workerResponse = await request("/push/onesignal/OneSignalSDKWorker.js");
  const worker = await workerResponse.text();

  assert.equal(workerResponse.status,200);
  assert.equal(workerResponse.headers.get("content-type"),"text/javascript; charset=utf-8");
  assert.match(worker,/OneSignalSDK\.sw\.js/);
  assert.match(html,/OneSignalSDK\.page\.js/);
  assert.match(html,/657f4101-05f2-40e0-a0ba-5584cc2a185a/);
  assert.match(html,/serviceWorkerPath:"push\/onesignal\/OneSignalSDKWorker\.js"/);
  assert.match(html,/OneSignal\.User\.PushSubscription\.optIn/);
  assert.match(html,/bible_reminder_timezone/);
});


test("sends an immediate reminder through OneSignal",async function(){
  const originalFetch = globalThis.fetch;
  const subscriptionId = "12345678-1234-1234-1234-123456789abc";

  globalThis.fetch = async function(url,options){
    assert.equal(url,"https://api.onesignal.com/notifications");
    assert.equal(options.method,"POST");
    assert.equal(options.headers.authorization,"Key test-rest-api-key");

    const body = JSON.parse(options.body);
    assert.equal(body.app_id,"657f4101-05f2-40e0-a0ba-5584cc2a185a");
    assert.deepEqual(body.include_subscription_ids,[subscriptionId]);
    assert.equal(body.contents.en,"Read Joshua chapter 1");
    assert.equal(body.send_after,undefined);

    return new Response(JSON.stringify({id:"abcdef12-1234-1234-1234-123456789abc"}),{
      status:200,
      headers:{"content-type":"application/json"}
    });
  };

  try{
    const response = await request("/api/reminder",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({
        test:true,
        subscriptionId:subscriptionId,
        message:"Read Joshua chapter 1",
        language:"en"
      })
    },{ONESIGNAL_REST_API_KEY:"test-rest-api-key"});
    const data = await response.json();

    assert.equal(response.status,200);
    assert.equal(data.ok,true);
    assert.deepEqual(data.notificationIds,["abcdef12-1234-1234-1234-123456789abc"]);
  }
  finally{
    globalThis.fetch = originalFetch;
  }
});


test("serves background choices and Bible browser metadata",async function(){
  const pageResponse = await request("/");
  const html = await pageResponse.text();
  const booksResponse = await request("/api/books?language=es");
  const books = await booksResponse.json();
  const waterfallResponse = await request("/background-waterfall.jpg");

  assert.match(html,/Bible Intelligence/);
  assert.match(html,/id="theme"/);
  assert.match(html,/Majestic Waterfall/);
  assert.match(html,/id="bookSelect"/);
  assert.match(html,/id="chapterSelect"/);
  assert.match(html,/id="verseSelect"/);
  assert.equal(booksResponse.status,200);
  assert.equal(books.books.length,66);
  assert.equal(books.books[0].name,"Génesis");
  assert.equal(books.books[0].chapters.length,50);
  assert.equal(books.books[0].chapters[0],31);
  assert.equal(waterfallResponse.headers.get("content-type"),"image/jpeg");
});


test("uses glass controls while keeping Bible text opaque",async function(){
  const pageResponse = await request("/");
  const html = await pageResponse.text();

  assert.match(html,/--glass:rgba\(235,247,255,\.13\)/);
  assert.match(html,/\.panel\{[\s\S]*background:var\(--glass\)/);
  assert.match(html,/\.answer\{[\s\S]*background:rgba\(255,253,247,\.97\)/);
  assert.match(html,/body\[data-theme="mountains"\]/);
  assert.match(html,/body\[data-theme="ocean"\]/);
});


test("shows device-friendly Home Screen installation help",async function(){
  const pageResponse = await request("/");
  const html = await pageResponse.text();

  assert.match(html,/Want Bible Intelligence to work like an app\?/);
  assert.match(html,/Add to Home Screen/);
  assert.match(html,/beforeinstallprompt/);
  assert.match(html,/iphone\|ipad\|ipod/i);
  assert.match(html,/android/i);
  assert.match(html,/display-mode: standalone/);
  assert.match(html,/¿Quieres que Bible Intelligence funcione como una app\?/);
  assert.match(html,/Agregar a pantalla de inicio/);
});


test("includes notes, highlights, bookmarks, reading progress, and optional sermon AI",async function(){
  const pageResponse = await request("/");
  const html = await pageResponse.text();

  assert.match(html,/id="studyTab"/);
  assert.match(html,/id="noteText"/);
  assert.match(html,/Highlight in /);
  assert.match(html,/Bookmark/);
  assert.match(html,/id="reminderTime"/);
  assert.match(html,/id="saveReminder"/);
  assert.match(html,/insertAdjacentElement\("afterend",verseTools\)/);
  assert.match(html,/verseTools\.scrollIntoView/);
  assert.match(html,/Bible reading progress/);
  assert.match(html,/id="sermonDraft"/);
  assert.match(html,/Prepare with AI/);
  assert.match(html,/Save sermon draft/);
  assert.match(html,/bible-intelligence-study-v1/);
  assert.match(html,/bible-intelligence-reading-v1/);
});


test("ships browser JavaScript without syntax errors",async function(){
  const pageResponse = await request("/");
  const html = await pageResponse.text();
  const scripts = Array.from(html.matchAll(/<script>([\s\S]*?)<\/script>/g),function(match){
    return match[1];
  });

  assert.ok(scripts.length > 0);
  scripts.forEach(function(script){
    assert.doesNotThrow(function(){ new Function(script); });
  });
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


test("prepares an optional sermon only from selected study materials",async function(){
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async function(url,options){
    assert.equal(url,"https://api.openai.com/v1/responses");
    const body = JSON.parse(options.body);
    assert.match(body.input,/John 3:16/);
    assert.match(body.input,/God loved the world/);
    assert.match(body.instructions,/Organize only the study materials supplied/);
    return new Response(JSON.stringify({output_text:"Sermon draft based on John 3:16."}),{
      status:200,
      headers:{"content-type":"application/json"}
    });
  };

  try{
    const response = await request("/api/sermon",{
      method:"POST",
      headers:{"content-type":"application/json"},
      body:JSON.stringify({
        title:"God's love",
        language:"en",
        materials:[{type:"highlight",reference:"John 3:16",text:"God loved the world",note:"Grace is offered freely"}]
      })
    },{OPENAI_API_KEY:"test-key"});
    const data = await response.json();

    assert.equal(response.status,200);
    assert.match(data.sermon,/John 3:16/);
  }
  finally{
    globalThis.fetch = originalFetch;
  }
});
