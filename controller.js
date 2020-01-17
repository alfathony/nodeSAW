const _ = require("lodash");
const criteria = require("./criteria");

const Controller = {};

function getMinMax(value) {
  const hargaMin = _.minBy(value, "harga");
  const peminatMax = _.maxBy(value, "peminat");
  const kemasanMax = _.maxBy(value, "kemasan");
  return {
    harga: hargaMin.harga,
    peminat: peminatMax.peminat,
    kemasan: kemasanMax.kemasan
  };
}

function normalisasi(matrix, maxmin) {
  matrix.harga = maxmin.harga / matrix.harga;
  matrix.peminat = matrix.peminat / maxmin.peminat;
  matrix.kemasan = matrix.kemasan / maxmin.kemasan;

  return matrix;
}

function hitungPeringkat(nilai) {
  const total =
    nilai.harga * criteria.harga +
    nilai.peminat * criteria.peminat +
    nilai.kemasan * criteria.kemasan;
  const result = {
    nama: nilai.nama,
    total: total
  };
  return result;
}

Controller.getRecomendation = (req, res) => {
  const post = req.body;
  const getNilaiBobot = post;
  const getMaxMin = getMinMax(getNilaiBobot);
  const normalisasiNilai = _.map(getNilaiBobot, nilai =>
    normalisasi(nilai, getMaxMin)
  );
  const hitungBobotPeringkat = _.map(normalisasiNilai, nilai =>
    hitungPeringkat(nilai)
  );
  res.json(hitungBobotPeringkat);
};

module.exports = Controller;
