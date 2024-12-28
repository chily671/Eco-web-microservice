const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
// Cấu hình cho WebSocket
const httpProxy = require("http-proxy");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Tạo proxy server để chuyển tiếp các yêu cầu WebSocket
const wsProxy = httpProxy.createProxyServer({
  target: "http://localhost:5008", // Service WebSocket backend chạy ở cổng 5008
  ws: true, // Kích hoạt hỗ trợ WebSocket
});

// Cấu hình CORS và JSON middleware
app.use(cors());
app.use(express.json());


// Chuyển tiếp các yêu cầu HTTP thông thường qua proxy
app.use("/user", proxy("http://localhost:5001"));
app.use("/order", proxy("http://localhost:5002"));
app.use("/product", proxy("http://localhost:5000", { parseReqBody: false }));
app.use("/chat", proxy("http://localhost:5008")); // Chuyển tiếp các yêu cầu HTTP cho chat
app.use("/pay", proxy("http://localhost:5009")); // Chuyển tiếp các yêu cầu HTTP cho api
// Chuyển tiếp các yêu cầu HTTP thông thường
app.use("/chat", (req, res) => {
  wsProxy.web(req, res); // Chuyển tiếp yêu cầu HTTP đến backend
});
// Xử lý các kết nối WebSocket (sự kiện upgrade)
server.on("upgrade", (req, socket, head) => {
  if (req.url.startsWith("/chat")) {
    // Phải khớp với đường dẫn WebSocket của bạn
    wsProxy.ws(req, socket, head); // Chuyển tiếp yêu cầu WebSocket tới backend (5008)
  }
});

// Lắng nghe các yêu cầu qua cổng 5555
server.listen(5555, () => {
  console.log("Gateway is listening on port 5555");
});
