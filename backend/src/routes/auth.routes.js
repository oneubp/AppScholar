const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");

// ROTA DE LOGIN
router.post("/login", async (req, res) => {
  try {
    const { matricula, senha } = req.body;

    // 1. Buscar o Usuário, incluindo o link para Aluno e Professor
    const usuario = await prisma.usuario.findUnique({
      where: { matricula },
      include: {
        aluno: true, 
        professor: true,
      },
    });

    if (!usuario) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    // 2. Determinar o papel do usuário (role)
    let role = 'desconhecido';
    if (usuario.aluno) {
        role = 'aluno';
    } else if (usuario.professor) {
        role = 'professor';
    }

    // 3. Retornar o papel junto com os dados básicos
    return res.status(200).json({
      message: "Login efetuado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        matricula: usuario.matricula,
        role: role, // NOVO: Retorna o papel
      },
    });
  } catch (err) {
    console.error("Erro ao fazer login:", err);
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
});

module.exports = router;