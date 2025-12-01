const express = require("express");
const app = express();

const authRoutes = require("./src/routes/auth.routes");
const aluno = require("./src/routes/aluno.routes");
const disciplinaRoutes = require("./src/routes/disciplina.routes");
const professoresRoutes = require("./src/routes/professores.routes");
const boletim = require("./src/routes/boletim.routes");
const cursoRoutes = require("./src/routes/cursos.routes");

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/alunos", aluno);
app.use("/disciplinas", disciplinaRoutes);
app.use("/professores", professoresRoutes);
app.use("/boletim", boletim);
app.use("/cursos", cursoRoutes);

app.get("/", (req, res) => {
  res.send("API Scholar funcionando!");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});