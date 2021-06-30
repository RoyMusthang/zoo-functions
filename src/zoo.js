// dica do querido Bernado Salgueiro sobre puxar os pontos do arquivo data
const data = require('./data');

function getSpeciesByIds(...ids) {
  if (ids.length === 0) return [];
  const speciesIds = data.species.filter((specie) => ids.includes(specie.id));
  return speciesIds;
}

function getAnimalsOlderThan(animal, age) {
  const animais = data.species.find((specie) => specie.name === animal);
  return animais.residents.every((resident) => resident.age >= age);
}

function getEmployeeByName(employeeName) {
  if (!employeeName) return {};
  return data.employees.find((name) => name.firstName === employeeName
   || name.lastName === employeeName);
}

function createEmployee(personalInfo, associatedWith) {
  return {
    ...personalInfo,
    ...associatedWith,
  };
}

function isManager(id) {
  return data.employees.some(({ managers }) => managers.includes(id));
}

function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  const addName = {
    id,
    firstName,
    lastName,
    managers,
    responsibleFor,
  };
  return data.employees.push(addName);
}

function countAnimals(species) {
  if (!species) {
    const animalObj = {};
    data.species.forEach((specie) => { animalObj[specie.name] = specie.residents.length; });
    return animalObj;
  }
  return data.species.find((specie) => specie.name === species).residents.length;
}

const calculateEntry = (entrants) => {
  if (!entrants) return 0;

  return Object.keys(entrants).reduce((acc, cur) => acc + entrants[cur] * data.prices[cur], 0);
};

function getAnimalMap(options) {
  // kkkkk da não bag dificil demais kkkkkkk.
}

function getSchedule(dayName) {
  // seu código aqui
}

function getOldestFromFirstSpecies(id) {
  // seu código aqui
}

function increasePrices(percentage) {
  // seu código aqui
}

function getEmployeeCoverage(idOrName) {
  // seu código aqui
}

module.exports = {
  calculateEntry,
  getSchedule,
  countAnimals,
  getAnimalMap,
  getSpeciesByIds,
  getEmployeeByName,
  getEmployeeCoverage,
  addEmployee,
  isManager,
  getAnimalsOlderThan,
  getOldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
