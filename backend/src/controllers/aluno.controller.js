const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");

// Criar um aluno e o respectivo usuário
exports.criarAluno = async (req, res) => {
  try {
    const { nome, matricula, senha, curso } = req.body;

    if (!nome || !matricula || !senha) {
      return res.status(400).json({ error: "Nome, matrícula e senha são obrigatórios." });
    }

    // 1. Criptografar Senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Usar uma transação para garantir atomicidade
    const result = await prisma.$transaction(async (tx) => {
      // 2. Criar o registro Aluno
      const aluno = await tx.aluno.create({
        data: {
          nome,
          matricula,
          curso,
        },
      });

      // 3. Criar o registro Usuario e linkar com o Aluno
      const usuario = await tx.usuario.create({
        data: {
          nome,
          matricula,
          senha: senhaHash,
          alunoId: aluno.id, 
        },
      });

      return { aluno, usuario };
    });
    
    const { usuario } = result;
    res.status(201).json({ 
      message: "Aluno cadastrado com sucesso!", 
      usuario: { id: usuario.id, nome: usuario.nome, matricula: usuario.matricula }
    });
  } catch (error) {
    if (error.code === 'P2002') { 
      return res.status(409).json({ error: "Matrícula já cadastrada." });
    }
    console.error("Erro ao cadastrar aluno:", error);
    res.status(500).json({ error: "Erro interno ao cadastrar aluno." });
  }
};

// Listar alunos
exports.listarAlunos = async (req, res) => {
  try {
    const alunos = await prisma.aluno.findMany();
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar alunos." });
  }
};