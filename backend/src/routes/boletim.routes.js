const express = require("express");
const router = express.Router();
const boletimController = require("../controllers/boletim.controller");

// Criar nota
router.post("/notas", boletimController.criarNota);

// Buscar boletim do aluno
router.get("/medias/:matricula", boletimController.getMediasPorAluno);

module.exports = router;
