import express from "express";
import multer from "multer";
import { evidenceController } from "../controllers/evidenceController";
import { checkPermissions } from "../middlewares/permissionsMiddleware";
import { Perfil } from "../models/UserModel";

const router = express.Router();
const multerUpload = multer({ dest: "uploads/" });

router.post(
    "/", 
    checkPermissions([Perfil.ADMIN, Perfil.PERITO]),  
    multerUpload.single("file"), 
    evidenceController.addEvidence);

router.post(
  "/:caseTitle/:tipo",
  checkPermissions([Perfil.ADMIN, Perfil.PERITO]),
  multerUpload.single("file"),
  evidenceController.addEvidence);

router.get(
  "/:evidenceId",
  checkPermissions([Perfil.ADMIN, Perfil.PERITO]),
  evidenceController.getEvidence);

router.delete(
  "/:evidenceId",
  checkPermissions([Perfil.ADMIN, Perfil.PERITO]),
  evidenceController.deleteEvidence);

router.get(
  "/",
  checkPermissions([Perfil.ADMIN, Perfil.PERITO]),
  evidenceController.listEvidences);

router.get(
  "/filter",
  checkPermissions([Perfil.ADMIN, Perfil.PERITO]),
  evidenceController.filterEvidences
);

export default router;