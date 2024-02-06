const express = require("express");

const app = express();

const path = require("path");
const rootDir = require("./util/path");

const bodyParser = require("body-parser");

const cors = require("cors");

const leaderboardRoutes = require("./routes/leaderboard");
const purchaseRoutes = require("./routes/purchase");
const userRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");
const User = require("./models/User");
const Expense = require("./models/Expense");
const Order = require("./models/Order");
const DownloadedFile = require("./models/DownloadedFile");
const ForgotPasswordRequest = require("./models/ForgotPasswordRequest");
const sequelize = require("./util/database");

require("dotenv").config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/premium", leaderboardRoutes);
app.use("/purchase", purchaseRoutes);
app.use("/api", adminRoutes);
app.use("/api", userRoutes);

User.hasMany(Expense);
Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(DownloadedFile, {
  foreignKey: "userId", // Assuming 'userId' is the foreign key in the FileDownloaded table
  onDelete: "CASCADE", // Delete associated files when a user is deleted
});

DownloadedFile.belongsTo(User, {
  foreignKey: "userId", // Assuming 'userId' is the foreign key in the FileDownloaded table
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000, (req, res) => {
      console.log("server running on Port=3000");
    });
  })
  .catch((err) => console.log(err));
