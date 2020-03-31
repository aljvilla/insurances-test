'use strict';

const axios = require('axios');

const policyPath = 'https://dn8mlk7hdujby.cloudfront.net/interview/insurance/policy';

const calculateLifeInsurance = ({ worker, companyPercentage, ufValue }) => {
  let cost = 0;
  if (worker.age > 65) return 0;
  switch (true) {
    case worker.childs === 0:
      cost = 0.279;
      break;
    case worker.childs === 1:
      cost = 0.4396;
      break;
    case worker.childs >= 2:
      cost = 0.5599;
      break;
  }
  const total = +(cost * ufValue).toFixed(0);
  const employerCoverage = +((total * companyPercentage) / 100).toFixed(0);
  const employeeCoverage = total - employerCoverage;
  return { total, employerCoverage, employeeCoverage };
};

const calculateDentalInsurance = ({ worker, companyPercentage, ufValue, hasDentalCare }) => {
  let cost = 0;
  if (worker.age > 65 || !hasDentalCare) return 0;
  switch (true) {
    case worker.childs === 0:
      cost = 0.12;
      break;
    case worker.childs === 1:
      cost = 0.1950;
      break;
    case worker.childs >= 2:
      cost = 0.2480;
      break;
  }
  const total = +(cost * ufValue).toFixed(0);
  const employerCoverage = +((total * companyPercentage) / 100).toFixed(0);
  const employeeCoverage = total - employerCoverage;
  return { total, employerCoverage, employeeCoverage };
};

const getUfActualValue = async () => {
  try {
    const { data: { UFs: [{ Valor: ufValue }] } } = await axios({
      url: 'https://api.sbif.cl/api-sbifv3/recursos_api/uf?apikey=2d4b1045b3141b9ffdd3046fe4c8e89d2f4de674&formato=json',
      method: 'get',
    });
    return +String(ufValue).replace('.', '').replace(',', '.');
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports.hello = async () => {
  const response = {};
  try {
    const ufValue = await getUfActualValue();
    const {
      data: {
        policy: { workers, has_dental_care: hasDentalCare, company_percentage: companyPercentage },
      },
    } = await axios({ url: policyPath, method: 'get' });

    const insurances = await Promise.all(workers.map((worker) => {
      const lifeInsurance = calculateLifeInsurance({ worker, companyPercentage, ufValue });
      const dentalInsurance = calculateDentalInsurance({ worker, companyPercentage, ufValue, hasDentalCare });
      return { ...worker, lifeInsurance, dentalInsurance };
    }));

    response.statusCode = 200;
    response.body = JSON.stringify({ ufValue, hasDentalCare, insurances });
    return response;
  } catch (err) {
    response.statusCode = 500;
    response.body = JSON.stringify({ message: err.message }, null, 2);
    return response;
  }
};
