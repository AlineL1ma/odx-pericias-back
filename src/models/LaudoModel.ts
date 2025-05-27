import mongoose, { Document, Schema } from "mongoose";

interface ILaudo extends Document {
    evidencia: mongoose.Types.ObjectId;
    perito: mongoose.Types.ObjectId;
    dadosAntemortem: String;
    dadosPostMortem: String;
    analiseLesoes: string;
    conclusao: String;
    dataCriacao: Date;
    assinaturaDigital?: string;
}

const LaudoSchema = new Schema<ILaudo>({
    evidencia: { type: Schema.Types.ObjectId, ref: "Evidence", required: true },
    perito: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dadosAntemortem: { type: String, required: true },
    dadosPostMortem: { type: String, required: true },
    analiseLesoes: { type: String, required: true },
    dataCriacao: { type: Date, default: Date.now },
    assinaturaDigital: { type: String }
});

const Laudo = mongoose.model<ILaudo>("Laudo", LaudoSchema);
export { Laudo, ILaudo };