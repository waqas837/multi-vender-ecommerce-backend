const express = require("express");
const cors = require("cors");
require("./db"); // connected mongoDB
const UserRoutes = require("../routes/UserRoutes");
const AdminRoutes = require("../routes/AdminRoutes");
const app = express();
const path = require("path");
app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));
var Port = process.env.PORT || 1000;
// 1.User means both seller and buyer route
app.use("/user", UserRoutes); //  this is for the both seller and buyer route
// 2.Admin routes
app.use("/admin", AdminRoutes);
app.use("/images", express.static(path.join("public/images/")));

app.get("/", (req, res) => {
  res.send("welcome to the multivender ecommerce website");
});
app.listen(Port, () => {
  console.log(`server is listening at port ${Port}`);
});
