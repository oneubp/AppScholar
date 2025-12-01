const prisma = require("../prisma/client");
const bcrypt = require("bcrypt");

exports.criarProfessor = async (req, res) => {
  try {
    const { nome, matricula, senha, titulacao, tempoDocencia } = req.body;

    if (!nome || !matricula || !senha || !titulacao || tempoDocencia === undefined) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // 1. Criptografar Senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Usar uma transação para garantir atomicidade
    const result = await prisma.$transaction(async (tx) => {
      // 2. Criar o registro Professor
      const professor = await tx.professor.create({
        data: { 
          nome, 
          titulacao, 
          tempoDocencia: Number(tempoDocencia) 
        }
      });

      // 3. Criar o registro Usuario e linkar com o Professor
      const usuario = await tx.usuario.create({
        data: {
          nome,
          matricula,
          senha: senhaHash,
          professorId: professor.id, 
        },
      });

      return { professor, usuario };
    });

    const { usuario } = result;
    res.status(201).json({
        message: "Professor cadastrado com sucesso!", 
        usuario: { id: usuario.id, nome: usuario.nome, matricula: usuario.matricula }
    });

  } catch (error) {
    if (error.code === 'P2002') { 
      return res.status(409).json({ error: "Matrícula já cadastrada." });
    }
    console.error("Erro ao criar professor:", error);
    res.status(500).json({ error: "Erro ao criar professor." });
  }
};

exports.listarProfessores = async (req, res) => {
  try {
    const professores = await prisma.professor.findMany();
    res.json(professores);

  } catch (error) {
    console.error("Erro ao listar professores:", error);
    res.status(500).json({ error: "Erro ao listar professores." });
  }
};