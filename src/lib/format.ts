export const formatDate = (date: string): string => {
  const parsed = new Date(date);
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};
