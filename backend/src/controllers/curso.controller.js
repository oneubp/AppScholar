const prisma = require("../prisma/client");

exports.criarCurso = async (req, res) => {
  try {
    const { nome, area, duracaoAnos, coordenador } = req.body;

    if (!nome || !area || !duracaoAnos || !coordenador) {
        return res.status(400).json({ error: "Preencha todos os campos obrigatórios." });
    }

    const curso = await prisma.curso.create({
      data: {
        nome,
        area,
        duracaoAnos: Number(duracaoAnos),
        coordenador,
      },
    });
    res.status(201).json(curso);
  } catch (error) {
    if (error.code === 'P2002') {
        return res.status(409).json({ error: "Curso com este nome já existe." });
    }
    console.error("Erro ao cadastrar curso:", error);
    res.status(500).json({ error: "Erro interno ao cadastrar curso." });
  }
};

exports.listarCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar cursos." });
  }
};

exports.atualizarCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, area, duracaoAnos, coordenador } = req.body;

    const curso = await prisma.curso.update({
      where: { id: Number(id) },
      data: {
        nome,
        area,
        duracaoAnos: duracaoAnos ? Number(duracaoAnos) : undefined,
        coordenador,
      },
    });
    res.json(curso);
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ error: "Curso não encontrado." });
    }
    console.error("Erro ao atualizar curso:", error);
    res.status(500).json({ error: "Erro ao atualizar curso." });
  }
};

exports.deletarCurso = async (req, res) => {
  try {
    const { id } = req.params;

    const alunosVinculados = await prisma.aluno.count({
        where: { cursoId: Number(id) }
    });

    if (alunosVinculados > 0) {
        return res.status(400).json({ error: `Existem ${alunosVinculados} alunos vinculados a este curso. Desvincule-os antes de deletar.` });
    }

    const curso = await prisma.curso.delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Curso deletado com sucesso!", curso });
  } catch (error) {
    if (error.code === 'P2025') {
        return res.status(404).json({ error: "Curso não encontrado." });
    }
    console.error("Erro ao deletar curso:", error);
    res.status(500).json({ error: "Erro ao deletar curso." });
  }
};