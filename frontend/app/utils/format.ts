export const format = {
  dateTime(value: string | number | Date) {
    const date = new Date(value);
    return date.toLocaleString();
  },
};
