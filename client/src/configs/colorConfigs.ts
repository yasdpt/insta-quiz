export const getColor = (): string => {
  const colors = [
    "bg-amber-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-cyan-500",
    "bg-emerald-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
