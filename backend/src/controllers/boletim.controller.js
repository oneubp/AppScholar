const prisma = require("../prisma/client");

// CALCULAR MÉDIAS DO ALUNO
exports.getMediasPorAluno = async (req, res) => {
  try {
    const { matricula } = req.params;

    const aluno = await prisma.aluno.findUnique({
      where: { matricula },
    });

    if (!aluno) {
      return res.status(404).json({ error: "Aluno não encontrado." });
    }

    // 2. Buscar todas as notas do aluno, incluindo as faltas
    const notas = await prisma.nota.findMany({
      where: { alunoId: aluno.id },
      include: {
        disciplina: true, 
      },
    });

    if (notas.length === 0) {
      return res.status(404).json({ error: "Nenhuma nota encontrada para este aluno." });
    }

    // 3. Calcular médias por disciplina
    const boletim = notas.map((nota) => {
      const media = (nota.n1 + nota.n2 + nota.n3) / 3;

      return {
        disciplina: nota.disciplina.nome,
        disciplinaId: nota.disciplinaId, // Adicionando ID para referência futura
        cargaHoraria: nota.disciplina.carga,
        notas: {
          n1: nota.n1,
          n2: nota.n2,
          n3: nota.n3,
        },
        faltas: nota.faltas, // NOVO: Incluir faltas
        media: Number(media.toFixed(2)),
      };
    });

    return res.json({
      aluno: {
        id: aluno.id,
        nome: aluno.nome,
        matricula: aluno.matricula,
        curso: aluno.curso,
      },
      boletim,
    });

  } catch (error) {
    console.error("Erro no boletim:", error);
    res.status(500).json({ error: "Erro ao gerar boletim." });
  }
};

// CRIAR NOTA
exports.criarNota = async (req, res) => {
  try {
    // NOVO: Adicionar faltas
    const { alunoId, disciplinaId, n1, n2, n3, faltas } = req.body;

    // Verificar aluno e disciplina
    const aluno = await prisma.aluno.findUnique({ where: { id: alunoId } });
    if (!aluno) return res.status(404).json({ error: "Aluno não encontrado." });

    const disciplina = await prisma.disciplina.findUnique({ where: { id: disciplinaId } });
    if (!disciplina) return res.status(404).json({ error: "Disciplina não encontrada." });

    // Criar nota
    const novaNota = await prisma.nota.create({
      data: {
        alunoId,
        disciplinaId,
        n1,
        n2,
        n3,
        faltas: faltas || 0, // NOVO: Salvar faltas (padrão 0)
      },
    });

    res.status(201).json(novaNota);

  } catch (error) {
    console.error("Erro ao criar nota:", error);
    res.status(500).json({ error: "Erro ao cadastrar nota." });
  }
};