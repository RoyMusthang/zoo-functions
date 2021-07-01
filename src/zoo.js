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

const optionUndefined = () => {
  const acharAnimaisLocalization = (localization) => data.species.filter((specie) =>
    specie.location === localization).map((specie2) => specie2.name);
  const localizations = ['NE', 'NW', 'SE', 'SW'];
  const resultado = {};
  const tipoAnimais = localizations.map((localization) => acharAnimaisLocalization(localization));
  localizations.forEach((key, index) => {
    resultado[key] = tipoAnimais[index];
  });
  return resultado;
};

const animaisSexSortTrueFalse = (localization, index, sex = undefined, sorted = undefined) => {
  let acharAnimaisSexTrueFalse;
  if (sex === undefined) {
    acharAnimaisSexTrueFalse = data.species.filter((specie) => specie.location === localization)
      .map((specie2) => specie2.residents.map((name) => name.name))[index];
  } else {
    acharAnimaisSexTrueFalse = data.species.filter((specie) => specie.location === localization)
      .map((specie2) => (specie2.residents.filter((specie) => specie.sex === sex)
        .map((name) => name.name)))[index];
  }
  let ordemTrueFalse;
  if (sorted === true) {
    ordemTrueFalse = acharAnimaisSexTrueFalse.sort();
  } else {
    ordemTrueFalse = acharAnimaisSexTrueFalse;
  }
  return ordemTrueFalse;
};

const indexLocalization = (localizations) => data.species.map((localizatio) => localizatio.location)
  .filter((loc) => loc === localizations);

const animaisLocalization = (localization, index) => data.species.filter((specie) =>
  specie.location === localization).map((specie2) => specie2.name)[index];

const objetosTiposNames = (localization, index, sex, sorted) => {
  const objeto = {
    [animaisLocalization(localization, index)]:
      animaisSexSortTrueFalse(localization, index, sex, sorted),
  };
  return objeto;
};

const arrayTiposNames = (localization, sex, sorted) => {
  const array = [];
  const localizations = indexLocalization(localization);
  for (let index = 0; index < localizations.length; index += 1) {
    array.push(objetosTiposNames(localization, index, sex, sorted));
  }
  return array;
};

const getAnimalMap = (options = undefined) => {
  if (options === undefined || options.includeNames === undefined) {
    return optionUndefined();
  }
  const { sex = undefined, sorted = undefined } = options;
  const localizations = ['NE', 'NW', 'SE', 'SW'];
  const objeto = {};
  localizations.forEach((key) => {
    objeto[key] = arrayTiposNames(key, sex, sorted);
  });
  return objeto;
};

function hoursConverter(hour) {
  if (hour > 12) return `${(hour - 12)}pm`;
  if (hour === 0) return '12pm';
  return `${hour}am`;
}

function scheduleMessage(dayName, schedule) {
  if (schedule[dayName].open !== schedule[dayName].close) {
    return `Open from ${hoursConverter(schedule[dayName]
      .open)} until ${hoursConverter(schedule[dayName].close)}`;
  }
  return 'CLOSED';
}

function getSchedule(dayName) {
  const schedule = {};
  const { hours } = data;
  if (dayName) {
    schedule[dayName] = scheduleMessage(dayName, hours);
  } else {
    Object.keys(hours).forEach((day) => {
      schedule[day] = scheduleMessage(day, hours);
    });
  }
  return schedule;
}

function getOldestFromFirstSpecies(id) {
  const person = data.employees.find((employee) => employee.id === id);
  const firstSpecie = data.species.find((specie) => specie.id === person.responsibleFor[0]);
  const oldest = firstSpecie.residents.sort((a, b) => b.age - a.age);

  return Object.values(oldest[0]);
}

function increasePrices(percentage) {
  const keys = Object.keys(data.prices);
  keys.forEach((key) => {
    data.prices[key] = Math.round(data.prices[key] * (1 + percentage / 100) * 100) / 100;
  });
}

const createObject = (employee) => {
  const object = {};
  const fullName = `${employee.firstName} ${employee.lastName}`;
  object[fullName] = [];
  employee.responsibleFor.forEach((res) => {
    const { name } = data.species.find(({ id }) => id === res);
    object[fullName].push(name);
  });
  return object;
};

const findById = (id) => {
  const find = data.employees.find((employee) => employee.id === id);
  return createObject(find);
};

const findByName = (name) => {
  const find = data.employees.find(({ firstName, lastName }) => firstName === name
    || lastName === name);
  return createObject(find);
};

function getEmployeeCoverage(idOrName) {
  if (!idOrName) {
    const object = {};
    data.employees.forEach((employee) => {
      Object.assign(object, createObject(employee));
    });
    return object;
  }
  if (idOrName.length > 25) return findById(idOrName);
  return findByName(idOrName);
}
// vlw zezé salvou na 13... cabelo tava bolado hoje
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
