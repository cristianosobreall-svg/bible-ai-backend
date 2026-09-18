# Scripture AI Bible

A bilingual English/Spanish Bible study app that:

- answers Bible questions with cited Scripture;
- looks up exact passages from the World English Bible;
- supports voice questions and read-aloud answers;
- saves answers in the browser.

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
