const Colaboradora = require("../models/colaboradorasModel");

const getAll = async (req, res) => {
  try {
    const colaboradoras = await Colaboradora.find();
    return res.status(200).json(colaboradoras);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const colaboradoraDeletada = await Colaboradora.findByIdAndDelete(id);

    if (!colaboradoraDeletada) {
      return res.status(404).json({ message: "colaboradora não encontrada" });
    }

    const message = `A colaboradora com o ${id} foi deletada com sucesso!`;
    return res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAll,
  deleteById,
};
