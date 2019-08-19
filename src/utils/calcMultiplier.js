const calcMultiplier = (streak, multiplier) => {
  if(streak === 2) {
    return 2;
  } else if(streak >= 4) {
    if(streak > 11) {
      return 10;
    } else {
      return streak-1;
    }
  } else if (streak < 2) {
    return 1;
  } else {
    return multiplier;
  }
}

export default calcMultiplier;