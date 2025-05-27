import { NextFunction, Response, Request } from "express";
import cloudinary from "../config/cloudinary";
import { Evidence } from "../models/EvidenceModel";
import { Case } from "../models/CaseModel"; // Importando o modelo de "Case"
import { Vitima } from "../models/VitimaModel";

export const evidenceController = {

  // Adicionar evidência
  async addEvidence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { caseTitle, tipo } = req.params;
      const { 
        categoria, 
        vitimaId, 
        coletadoPor, 
        conteudo,
        laudo,
        historicoClinico,
        radiografias,
        registrosOrtodonticos,
        padraoOclusao,
        particularidadesAnatomicas,
        materiaisRestauracoes,
        relatosFamiliares,
        habitosComportamentais } = req.body;


      // Busca o caso pelo título
      const foundCase = await Case.findOne({ titulo: caseTitle });
      if (!foundCase) {
        res.status(404).json({ msg: "Caso não encontrado com esse título." });
        return;
      }

      const caseId = foundCase._id; // Usando o ID do caso encontrado

      // Busca a vítima pelo ID
      const foundVitima = await Vitima.findById(vitimaId);
      if (!foundVitima) {
        res.status(404).json({ msg: "Vítima não encontrada com esse ID." });
        return;
      }

      // Dados base para criação da evidência
      const evidenceData: Partial<typeof Evidence> = {
        caso: foundCase._id,
        vitima: foundVitima._id,
        tipo,
        categoria,
        coletadoPor,
        // Utilização do operador Spreed para adicionar apenas as informações que foram 
        // fornecidas em cada campo preenchido, evitando de os por como obrigatórios
        ...(laudo && { laudo }),
        ...(historicoClinico && { historicoClinico }),
        ...(radiografias && { radiografias }),
        ...(registrosOrtodonticos && { registrosOrtodonticos }),
        ...(padraoOclusao && { padraoOclusao }),
        ...(particularidadesAnatomicas && { particularidadesAnatomicas }),
        ...(materiaisRestauracoes && { materiaisRestauracoes }),
        ...(relatosFamiliares && { relatosFamiliares }),
        ...(habitosComportamentais && { habitosComportamentais })
      };

      // Processando as evidências
      if (tipo === "imagem") {
        if (!req.file?.path) {
        res.status(400).json({ msg: "Arquivo de imagem não fornecido." });
        return;
        }

        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "evidencias",
          use_filename: true,
          unique_filename: false
        });

       Object.assign(evidenceData, { imagemURL: result.secure_url });
      } else if (tipo === "texto") {
        if (!conteudo) {
        res.status(400).json({ msg: "Conteúdo de texto não fornecido." });
        return;
        }
        
        Object.assign(evidenceData, { conteudo });
      } else {
        res.status(400).json({ msg: "Tipo de evidência inválido." });
        return;
      }

      // Cria e retorna a evidência
      const newEvidence = await Evidence.create(evidenceData);
      res.status(201).json({ msg: "Evidência adicionada com sucesso.", evidence: newEvidence });

    } catch (err) {
      next(err);
    }
  },

  // Exibir uma evidência
  async getEvidence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { evidenceId } = req.params;
      const evidence = await Evidence.findById(evidenceId)
      .populate("caso vitima coletadoPor");
      
      if (!evidence) {
        res.status(404).json({ msg: "Evidência não encontrada." });
        return;
      }

      res.status(200).json(evidence);
    } catch (err) {
      next(err);
    }
  },

  // Deletar uma evidência
  async deleteEvidence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { evidenceId } = req.params;
      const deletedEvidence = await Evidence.findByIdAndDelete(evidenceId);

      if (!deletedEvidence) {
        res.status(404).json({ msg: "Evidência não encontrada." });
        return;
      }

      res.status(200).json({ msg: "Evidência deletada com sucesso." });
    } catch (err) {
      next(err);
    }
  },

  // Listar todas as evidências
  async listEvidences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const evidences = await Evidence.find()
      .populate("Evidências listadas.");
      res.status(200).json(evidences);
    } catch (err) {
      next(err);
    }
  },

  // Filtrar evidências
  async filterEvidences(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { tipo, categoria, vitimaId, caseId } = req.query;

      const filters: any = {};
      if (tipo) filters.tipo = tipo;
      if (categoria) filters.categoria = categoria;
      if (vitimaId) filters.vitima = vitimaId;
      if (caseId) filters.caso = caseId;

      const filteredEvidences = await Evidence.find(filters)
      .populate("Evidências filtradas.");
      res.status(200).json(filteredEvidences);
    } catch (err) {
      next(err);
    }
  }
};