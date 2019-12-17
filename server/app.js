const Koa = require("koa");
const router = require("koa-router")();
const fs = require("fs");
const bodyParser = require("koa-bodyparser");

// 创建一个Koa对象表示web app本身:
const app = new Koa();

// 对于任何请求，app将调用该异步函数处理请求：
app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

app.use(bodyParser());

router.get("/api/ranks", async (ctx, next) => {
  // await next();

  data = fs.readFileSync(__dirname + "/ranks.json", "utf-8");
  ctx.response.body = { status: 200, data: JSON.parse(data) };
});

router.get("/", async (ctx, next) => {
  ctx.response.type = "text/html";
  // console.log("jj");
  ctx.response.body = fs.readFileSync(
    __dirname + "/../src/index.html",
    "utf-8"
  );
  // console.log("i");
});

router.get("/:filename", async (ctx, next) => {
  // console.log(ctx.url);
  const url = ctx.url;
  if (url.endsWith(".js")) {
    ctx.response.type = "application/javascript";
  } else if (url.endsWith(".css")) {
    ctx.response.type = "text/css";
  }
  // console.log("jjkk");
  ctx.response.body = fs.readFileSync(__dirname + "/../src" + url, "utf-8");
});

router.post("/api/ranks", async (ctx, next) => {
  const username = ctx.request.body.username || "";
  let time = Number(ctx.request.body.time) || "";
  let data = fs.readFileSync(__dirname + "/ranks.json");
  data = JSON.parse(data);
  console.log(data);
  let newData = [];
  data.forEach((r, i) => {
    if (newData >= 10) {
      return;
    }
    if (time < r.time) {
      newData.push({ username: username, time: time });
      time = Infinity;
    } else {
      newData.push(r);
    }
  });

  console.log(newData);

  fs.writeFileSync(__dirname + "/ranks.json", JSON.stringify(newData));
  ctx.response.body = { status: 200, data: "" };
});

app.use(router.routes());

// 在端口3000监听:
app.listen(3000);
console.log("app started at port 3000...");