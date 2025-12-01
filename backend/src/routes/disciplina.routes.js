const express = require("express");
const router = express.Router();
const { criarDisciplina, listarDisciplinas } = require("../controllers/disciplina.controller"); 

router.post("/", criarDisciplina);
router.get("/", listarDisciplinas); // NOVO: Rota GET para listar

module.exports = router;