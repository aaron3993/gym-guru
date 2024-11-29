const customMappings = {
  weightLoss: "Weight Loss",
  muscleGain: "Muscle Gain",
  generalFitness: "General Fitness",
};

export const formatText = (text) => {
  if (!text) return text;
  if (customMappings[text]) return customMappings[text];
  return text
    .toLowerCase()
    .replace(/(?:^|\s)\w/g, (match) => match.toUpperCase());
};
