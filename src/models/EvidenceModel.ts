import mongoose, { Document, Schema } from "mongoose";

interface IEvidence extends Document {
  caso: mongoose.Types.ObjectId;
  vitima: mongoose.Types.ObjectId;
  tipo: "imagem" | "texto";
  categoria: string;
  dataUpload: Date;
  coletadoPor: mongoose.Types.ObjectId;
  conteudo?: string; // se for texto
  imagemURL?: string; // se for imagem
  laudo?: string;

// Ante-Mortem
  historicoClinico?: string;
  radiografias?: string[];
  registrosOrtodonticos?: {
    fotografiasAntesDepois?: string[]; // URLs de fotografias
    modelosGesso?: string[]; // URLs ou referências a modelos de gesso
    relatoMovimentacoes?: string; // Relato textual
  };
  padraoOclusao?: "normal" | "cruzada" | "aberta" | "outro";

  // Características Odontológicas Específicas
  particularidadesAnatomicas?: string[]; // Ex: dentes ausentes, agenesias, fusões
  materiaisRestauracoes?: ("amálgama" | "resina" | "ouro" | "porcelana" | "outro")[];
  alteraçõesPatologicas?: string; // Descrição de abscessos cicatrizados, cistos etc.

  // Informações Complementares
  relatosFamiliares?: string;
  habitosComportamentais?: ("bruxismo" | "onicofagia" | "outro")[];
}

// Dados base para coletar a evidência
const EvidenceSchema = new Schema<IEvidence>({
  caso: { type: Schema.Types.ObjectId, ref: "Case", required: true },
  vitima: { type: Schema.Types.ObjectId, ref: "Vítima", required: true },  
  tipo: { type: String, enum: ["imagem", "texto"], required: true },
  categoria: { type: String, required: true },
  dataUpload: { type: Date, default: Date.now },
  coletadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  conteudo: { type: String },
  imagemURL: { type: String },

  // Ante-Mortem
  historicoClinico: { type: String },
  radiografias: [{ type: String }],
  registrosOrtodonticos: {
    fotografiasAntesDepois: [{ type: String }],
    modelosGesso: [{ type: String }],
    relatoMovimentações: { type: String }
  },
  padraoOclusao: { type: String, enum: ["normal", "cruzada", "aberta", "outro"] },

  // Características Odontológicas Específicas
  particularidadesAnatomicas: [{ type: String }],
  materiaisRestauracoes: [{ type: String, enum: ["amálgama", "resina", "ouro", "porcelana", "outro"] }],

  // Informações Complementares
  relatosFamiliares: { type: String },
  habitosComportamentais: [{ type: String, enum: ["bruxismo", "onicofagia", "outro"] }]
});

const Evidence = mongoose.model<IEvidence>("Evidence", EvidenceSchema);
export { Evidence, IEvidence };
