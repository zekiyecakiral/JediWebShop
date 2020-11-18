function calculateSaber(age, crystal = null) {
  const degreeEnum = {
    PADAWAN: 'Padawan',
    JEDI: 'Jedi',
    JEDI_NO_POWER: 'Jedi [no-power]',
  };

  if (age < 0) {
    age = 0;
  }
  const increasingForceByYear = 10;
  let force = increasingForceByYear * age;
  force = Math.round((force + Number.EPSILON) * 100) / 100;
  let degree = degreeEnum.PADAWAN;

  if (force >= 93.2) {
    degree = degreeEnum.JEDI;
  }

  if (age >= 140) {
    degree = degreeEnum.JEDI_NO_POWER;
  }

  if (!crystal) {
    if (age >= 18) {
      force = 'unlimited';
    }
    
    return {
      force: force,
      degree: degree
    };
  }

  const harvestedAmount = crystal.harvestedAmount;
  const forcePercentage = crystal.forcePercentage;
  let powerUsage = (force * forcePercentage) / 100;
  powerUsage = Math.round((powerUsage + Number.EPSILON) * 100) / 100;
  let priceResult = harvestedAmount * powerUsage;
  priceResult = Math.round((priceResult + Number.EPSILON) * 100) / 100;

  if (degree == degreeEnum.JEDI) {
    priceResult = 2;
  }

  if (age >= 18) {
    force = 'unlimited';
    powerUsage = 'NaN ';
  }

  const result = {
    price: priceResult,
    powerUsage: powerUsage,
    force: force,
    planet: crystal.planet,
    crystalType: `${crystal.planet} crystal`,
    degree: degree,
  };

  return result;
}

module.exports = calculateSaber;
