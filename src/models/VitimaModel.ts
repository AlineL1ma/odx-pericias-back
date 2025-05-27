import mongoose, { Document, Schema } from "mongoose";

interface IVitima extends Document {
    nome?: string;
    dataNascimento?: Date;
    idadeAproximada?: number;
    nacionalidade?: string;
    cidade?: string;
    sexo: "masculino" | "feminino" | "indeterminado" | "outro";
    estadoCorpo: "inteiro" | "fragmentado" | "carbonizado" | "putrefacto" | "esqueleto";
    imagens?: string[];
    lesoes?: string;
    
    identificada: boolean;
}

const VitimaSchema = new Schema<IVitima>({
    nome: {type: String },
    dataNascimento: { type: Date },
    idadeAproximada: { type: Number },
    nacionalidade: { type: String },
    cidade: { type: String },
    sexo: { type: String, enum: ["masculino", "feminino", "indeterminado", "outro"], required: true },
    estadoCorpo: { type: String, enum: ["inteiro", "fragmentado", "carbonizado", "putrefacto", "esqueleto"], required: true },
    imagens: [{ type: String }],
    lesoes: { type: String },
    identificada: { type: Boolean, default: false}
});

const Vitima = mongoose.model<IVitima>("Vítima", VitimaSchema);
export {Vitima, IVitima};