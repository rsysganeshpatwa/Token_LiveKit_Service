import express from "express";
import { createAndRegisterInstance } from "../services/awsInstanceService.js";

const router = express.Router();

router.post("/create-instance", async (req, res) => {
  const { launchTemplateId, instanceCount, targetGroupArn } = req.body;

  try {
    const result = await createAndRegisterInstance({
      launchTemplateId,
      instanceCount,
      targetGroupArn,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
