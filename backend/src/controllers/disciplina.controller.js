const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.criarDisciplina = async (req, res) => {
  try {
    const { nome, carga, professorId } = req.body;

    // Verifica se o professor existe
    const professor = await prisma.professor.findUnique({
      where: { id: professorId }
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor não encontrado." });
    }

    const disciplina = await prisma.disciplina.create({
      data: {
        nome,
        carga,
        professorId: professorId
      }
    });

    return res.status(201).json(disciplina);
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);
    return res.status(500).json({ error: "Erro ao criar disciplina." });
  }
};

// NOVO: Função para listar todas as disciplinas
exports.listarDisciplinas = async (req, res) => {
  try {
    const disciplinas = await prisma.disciplina.findMany({
      select: {
        id: true,
        nome: true,
      }
    });
    return res.json(disciplinas);
  } catch (error) {
    console.error("Erro ao listar disciplinas:", error);
    return res.status(500).json({ error: "Erro ao listar disciplinas." });
  }
};