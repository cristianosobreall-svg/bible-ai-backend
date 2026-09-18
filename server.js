import http from "node:http";
import app from "./app.js";

const port = Number(process.env.PORT || 3000);

const server = http.createServer(async (req, res) => {
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);

    const host = req.headers.host || `localhost:${port}`;
    const url = new URL(req.url || "/", `http://${host}`);
    const method = req.method || "GET";
    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) value.forEach((item) => headers.append(name, item));
      else if (value !== undefined) headers.set(name, value);
    }

    const request = new Request(url, {
      method,
      headers,
      body: method === "GET" || method === "HEAD" ? undefined : Buffer.concat(chunks),
    });

    const response = await app.fetch(request, process.env, {});
    res.statusCode = response.status;
    response.headers.forEach((value, name) => res.setHeader(name, value));
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ error: "The server could not complete the request." }));
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Scripture AI Bible is running on port ${port}`);
});
