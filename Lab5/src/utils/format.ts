export const formatPrice = (price: number): string => {
  return `${Math.round(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')} đ`;
};

export const formatDateTime = (value?: string): string => {
  if (!value) {
    return 'N/A';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const twoDigits = (part: number) => String(part).padStart(2, '0');

  return `${twoDigits(date.getDate())}/${twoDigits(
    date.getMonth() + 1,
  )}/${date.getFullYear()} ${twoDigits(date.getHours())}:${twoDigits(
    date.getMinutes(),
  )}:${twoDigits(date.getSeconds())}`;
};
