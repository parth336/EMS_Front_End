var express = require("express");
var router = express.Router();
var sql = require("./config");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
const { route } = require(".");
const auth = require("./authentication").auth;
require("dotenv").config({ path: `${__dirname}/../.env` });
/* GET users listing. */
router.get("/login", function (req, res, next) {
  res.render("login", {
    title: "CRUD APP",
    error: { status: false, message: "" },
    role: "admin",
  });
});


router.get("/dashboard", auth, (req, res) => {
  res.render("admin", {
    title: "Admin",
    error: { status: false, message: "" },
  });
});

router.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let role = req.body.role;
  if (role == "user") {
    let query = `select * from employee where email = '${email}'`;
    sql
      .execSql(query)
      .then((result) => {
        result = result.recordset;
        if (result.length > 0) {
          let user = result[0];
          user.role = "user";
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
              console.log(err);
              res.status(200).json({ error: true, message: "Server error!!" });
            }
            if (result) {
              let token = jwt.sign(user, process.env.TOKEN_SECRET, {
                expiresIn: "1h",
              });
              res.cookie("token", token).status(200).json({ error: false });
            } else {
              res
                .status(200)
                .json({ error: true, message: "Wrong Email or Password!!" });
            }
          });
        } else {
          res
            .status(200)
            .json({ error: true, message: "Wrong Email or Password!!" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(200).json({ error: true, message: "Server error!!" });
      });
  } else {
    let query = `select * from admin where email = '${email}'`;
    sql
      .execSql(query)
      .then((result) => {
        result = result.recordset;
        if (result.length > 0) {
          let user = result[0];
          user.role = "admin";
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
              console.log(err);
              res.status(200).json({ error: true, message: "Server error!!" });
            }
            console.log(result);
            if (result) {
              let token = jwt.sign(user, process.env.TOKEN_SECRET, {
                expiresIn: "1h",
              });
              res.cookie("token", token).status(200).json({ error: false });
            } else {
              res
                .status(200)
                .json({ error: true, message: "Wrong Email or Password!!" });
            }
          });
        } else {
          res
            .status(200)
            .json({ error: true, message: "Wrong Email or Password!!" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(200).json({ error: true, message: "Server error!!" });
      });
  }
});

router.get("/category", auth, (req, res) => {
  let query = `select * from category`;
  sql
    .execSql(query)
    .then((result) => {
      result = result.recordset;
      res.render("category", { title: "Category", data: result });
    })
    .catch((err) => {
      console.error(err);
      res.clearCookie("token");
      res.redirect("/");
    });
});

router.post("/addCategory", auth, (req, res) => {
  let query = `INSERT into category (name) values ('${req.body.name}')`;
  sql
    .execSql(query)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: true, message: "Internal server error!" });
    });
});

router.post("/deletecategory", auth, (req, res) => {
  let query = `DELETE FROM category WHERE id = ${req.body.id}`;
  sql
    .execSql(query)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: true, message: "Internal server error!" });
    });
});

router.get("/employees", auth, (req, res) => {
  let query = `select * from employees`;
  sql
    .execSql(query)
    .then((result) => {
      result = result.recordset;
      res.render("employeees", { title: "Employees", data: result });
    })
    .catch((err) => {
      console.error(err);
      res.clearCookie("token");
      res.redirect("/");
    });
});


module.exports = router;
