const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professor.controller");

router.post("/", professorController.criarProfessor);
router.get("/", professorController.listarProfessores);

module.exports = router;
