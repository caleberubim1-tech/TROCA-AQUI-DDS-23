// IMPORTAÇÃO DO MODULO EXPRESS
const express = require("express");
const router = express.Router();

// Rota de produtos generica
router.get("/meus-produtos",(req,res) => {
  res.status(404).render('erro', {mensagem: "Essa página ainda não existe"})});

//Rota de siada
router.get("/vitrine", (req, res) => {
  res.status(404).render('erro', {mensagem: "Essa página ainda não existe"})});

module.exports = router