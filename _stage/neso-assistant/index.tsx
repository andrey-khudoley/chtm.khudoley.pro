import { jsx } from "@app/html-jsx";
import { webV1Route } from "./web/v1/index";

app.get("/", async (ctx) => {
  // Редирект на веб-интерфейс
  return ctx.resp.redirect(webV1Route.url());
});