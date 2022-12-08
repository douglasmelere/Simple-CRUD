const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const models = require("./models")
const User = models.user

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.use("/", express.static("."))
app.post("/user", function (req, res) {
  if (!req.body) {
    res.status(400).send({
      message:
        "É necessário passar as informações de usuário para criar um novo usuário",
    })
    return
  }

  const newUser = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    about: req.body.about,
    photo: req.body.photo,
  }

  if (!newUser.name) {
    res.status(400).send({
      message: "É necessário um nome para criar um novo usuário",
    })
  }

  User.create(newUser)
    .then((data) => {
      res.send(data)
    })
    .catch((erro) => {
      res.status(500).send({
        message:
          erro.message || "Ocorreu erro ao tentar criar uma novo usuário.",
      })
    })
})

app.put("/user/:id", function (req, res) {
  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "É necessário um id para atualizar um usuário" })
    return
  }

  if (!req.body) {
    res.status(400).send({
      message:
        "É necessário passar as informações de usuário para atualizar um usuário",
    })
    return
  }

  const updatedUser = {
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    about: req.body.about,
    photo: req.body.photo,
  }

  if (!updatedUser.name) {
    res.status(400).send({
      message: "É necessário que o usuário possua um nome",
    })
  }

  User.update(updatedUser, { where: { id: req.params.id } })
    .then((data) => {
      res.send(data)
    })
    .catch((erro) => {
      res.status(500).send({
        message:
          erro.message || "Ocorreu erro ao tentar criar uma novo usuário.",
      })
    })
})

app.delete("/user/:id", function (req, res) {
  if (!req.params.id) {
    res
      .status(400)
      .send({ message: "É necessário um id para deletar um usuário" })
    return
  }

  User.destroy({ where: { id: req.params.id } })
    .then((data) => {
      res.send({ deleteUsersCount: data })
    })
    .catch((erro) => {
      res.status(500).send({
        message:
          erro.message || "Ocorreu erro ao tentar criar uma novo usuário.",
      })
    })
})

app.get("/user", function (req, res) {
  User.findAll()
    .then((data) => {
      res.send(data)
    })
    .catch((erro) => {
      res.status(500).send({
        message: erro.message || "Ocorreu erro ao tentar listar usuários.",
      })
    })
})

app.get("/user/:id", function (req, res) {
  User.findByPk(req.params.id)
    .then((data) => {
      res.send(data)
    })
    .catch((erro) => {
      res.status(500).send({
        message: erro.message || "Ocorreu erro ao tentar buscar usuário.",
      })
    })
})

const db = require("./models")
db.sequelize.sync()

app.listen(3000, () => {
  console.log(`O servidor está rodando na URL: http://localhost:3000`)
})
