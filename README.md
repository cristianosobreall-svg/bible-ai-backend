# Scripture AI Bible

A bilingual English/Spanish Bible study app that:

- answers Bible questions with cited Scripture;
- includes complete 66-book public-domain Bible texts in English and Spanish;
- looks up exact passages without depending on an outside Bible API;
- supports answers in English and Spanish.

## Bible text and license

The English Scripture text is the **World English Bible (WEB)** and the Spanish
text is the **Reina-Valera 1909 (RV1909)**. Both are public domain. Translation
names are used only to identify faithful copies of the source texts.

The bundled `web.json` data was generated from `eng-web.usfx.xml` in the
[`seven1m/open-bibles`](https://github.com/seven1m/open-bibles) repository at
commit `f257a3559025c3f873b48a75019f53a9354ed7de`. The bundled `rv1909.json` was
generated from `spa-rv1909.usfx.xml` at that same commit. The source repository
identifies both translations as public domain. The authoritative WEB site also
states that the WEB is public domain: <https://worldenglish.bible/>. eBible.org
identifies the RV1909 edition as Dominio Público:
<https://ebible.org/details.php?id=spaRV1909>.

Do not replace this data with text from a copyrighted translation unless you
first obtain the necessary license.

## Run locally

Requires Node.js 20 or newer.

```bash
export OPENAI_API_KEY="your-key"
npm start
```

Open `http://localhost:3000`.

## Deploy on Render

1. Create a new Render Blueprint from this repository.
2. Add `OPENAI_API_KEY` as a private environment variable.
3. Deploy the web service.

Never put an API key in the repository. The app reads it only from the server environment.

AI answers may contain mistakes. Always verify the cited Scripture.
