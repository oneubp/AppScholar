const express = require("express");
const router = express.Router();
const alunoController = require("../controllers/aluno.controller");

// Criar aluno
router.post("/", alunoController.criarAluno);

// Listar alunos
router.get("/", alunoController.listarAlunos);

module.exports = router;
