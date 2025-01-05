const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const dotenv = require("dotenv");
// Cấu hình cho WebSocket
const httpProxy = require("http-proxy");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Tạo proxy server để chuyển tiếp các yêu cầu WebSocket
const wsProxy = httpProxy.createProxyServer({
  target: process.env.CHAT_SERVICE_URL, // Service WebSocket backend chạy ở cổng 5008
  ws: true, // Kích hoạt hỗ trợ WebSocket
});

// Cấu hình CORS và JSON middleware
app.use(cors());
app.use(express.json());


// Chuyển tiếp các yêu cầu HTTP thông thường qua proxy
app.use("/user", proxy(process.env.USER_SERVICE_URL));
app.use("/order", proxy(process.env.ORDER_SERVICE_URL));
app.use("/product", proxy(process.env.PRODUCT_SERVICE_URL, { parseReqBody: false }));
app.use("/chat", proxy(process.env.CHAT_SERVICE_URL)); // Chuyển tiếp các yêu cầu HTTP cho chat
app.use("/pay", proxy(process.env.PAY_SERVICE_URL)); // Chuyển tiếp các yêu cầu HTTP cho api
// Chuyển tiếp các yêu cầu HTTP thông thường
app.use("/chat", (req, res, next) => {
  if (req.method === "GET" && req.headers.upgrade === "websocket") {
    wsProxy.web(req, res);
  } else {
    next();
  }
});
// Xử lý các kết nối WebSocket (sự kiện upgrade)
server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/chat")) {
    // Phải khớp với đường dẫn WebSocket của bạn
    wsProxy.ws(req, socket, head); // Chuyển tiếp yêu cầu WebSocket tới backend (5008)
  }
});

// Lắng nghe các yêu cầu qua cổng 5555
server.listen(process.env.PORT, () => {
  console.log("Gateway is listening on port 5555");
});
