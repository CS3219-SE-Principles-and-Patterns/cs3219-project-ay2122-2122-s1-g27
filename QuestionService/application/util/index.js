exports.GetRandomNumberBetweenInclMinExclMax = (min, max) =>
  Math.floor(min + Math.random() * (max - min))
