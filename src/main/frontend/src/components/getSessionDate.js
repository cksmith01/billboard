const getSessionDate = () => {
  const date = new Date();
  let year = date.getFullYear();
  if (date.getMonth() == 11 && date.getDate() >= 15) {
    year++;
  }
  return year;
};
export { getSessionDate };
