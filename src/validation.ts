function isValidDice (dice: string): boolean {
  console.log(dice);
  return (
    Array.isArray(dice.match(/[0-9]+d[0-9]+/gi)) ||
    Array.isArray(dice.match(/[0-9]+d[0-9]+\+[0-9]+/gi)) // could be xDy+z
    && Array.isArray(dice.match(/[0-9]+d[0-9]/gi)) // must be at least xDy
  );
}

export {
  isValidDice
}