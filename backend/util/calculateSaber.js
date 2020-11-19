function  calculateSaber(age, crystal = null) {
  const degreeEnum = {
    PADAWAN: 'Padawan',
    JEDI: 'Jedi',
    JEDI_NO_POWER: 'Jedi [no-power]',
  };
  let error = "";

  if (age < 0) {
    age = 0;
  }
  const increasingForceByYear = 10;
  let force = increasingForceByYear * age;
  force = force.toFixed(2)
  let degree = degreeEnum.PADAWAN;

  if (force >= 93.2) {
    degree = degreeEnum.JEDI;
  }

  if (age >= 140) {
    degree = degreeEnum.JEDI_NO_POWER;
    force = 0;
  }

  // this part only returns degree and force if crystal is null
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
  powerUsage=powerUsage.toFixed(2);
  let priceResult = harvestedAmount * powerUsage;
  priceResult=priceResult.toFixed(2);

  if (degree === degreeEnum.JEDI) {
    priceResult = 2;
  }

  if (degree === degreeEnum.JEDI_NO_POWER) {
    force = "no-power";
    error = "You cannot allow to buy a saber light. We suggest you go to holiday!";
  }

  if (age >= 18) {
    force = 'unlimited';
    powerUsage = 'NaN ';
    error = "You cannot allow to buy a saber light! You are 18 years old or more....";
  }

  const result = {
    price: priceResult,
    powerUsage: powerUsage,
    force: force,
    planet: crystal.planet,
    crystalType: `${crystal.planet} crystal`,
    degree: degree,
    error: error
  };

  return result;
}

module.exports = calculateSaber;
