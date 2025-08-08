const express = require("express");
const path = require("path");
const nunjucks = require("nunjucks");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:5000", credentials: true }));

nunjucks.configure("views", {
  autoescape: true,
  express: app,
});
app.set("view engine", "njk");

app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("index.njk");
});

app.post(
  "/signup",
  (req, res, next) => {
    req.body = JSON.stringify(req.body);
    req.headers["content-type"] = "application/json";
    next();
  },
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
    pathRewrite: { "^/signup": "/api/users/register" },
    onProxyRes(proxyRes, req, res) {
      if (proxyRes.statusCode === 201) {
        res.redirect("/");
      }
    },
  })
);

app.post(
  "/login",
  (req, res, next) => {
    req.body = JSON.stringify(req.body);
    req.headers["content-type"] = "application/json";
    next();
  },
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
    pathRewrite: { "^/login": "/api/users/login" },
    onProxyRes(proxyRes, req, res) {
      if (proxyRes.statusCode === 200) {
        res.redirect("/app");
      }
    },
  })
);

app.use(
  "/api",
  createProxyMiddleware({
    target: "http://localhost:3000",
    changeOrigin: true,
    credentials: true,
  })
);

app.use("/app", express.static(path.join(__dirname, "public")));

app.get("/app/*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Frontend доступен по адресу: http://localhost:${PORT}`);
});
