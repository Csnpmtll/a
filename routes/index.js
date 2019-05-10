var bodyParser = require("body-parser");
var app = require("express")();
var MongoClient = require("mongodb").MongoClient;
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
MongoClient.connect("mongodb://localhost:27017", (err, client) => {
  if (err) throw err;
  var db = client.db("project02");
  app.get("/login", function(req, res, next) {
    res.render("login", { error: "" });
  });
  app.post("/result", (req, res) => {
    db.collection("mst_employee").findOne(
      {
        user: req.body.txtuser,
        password: req.body.txtpass
      },
      (err, result) => {
        if (err) 
          return res.status(500).send(err.toString());
        if (result) {
          res.render("result", {
            name: result.name,
            surname: result.surname,
            doctype: result.doctype,
            salary: result.salary,
            ot: result.OT,
            bonus: result.Bonus,
            netincome: ((result.salary+result.OT+result.Bonus)-((result.salary+result.OT+result.Bonus)*0.05))
          });
        }
        res.render("login", { error: "ไม่พบข้อมูล" });
      }
    );
  });
  app.listen(3000, () => {
    console.log("  App is running at http://localhost:3000");
  });
});
module.exports = app;
