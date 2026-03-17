export const formatDate = (dateString: string, includeYear = true) => {
  const options: Intl.DateTimeFormatOptions = {
    month: '2-digit',
    day: '2-digit',
    ...(includeYear && { year: 'numeric' }),
  };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

export const formatDateTime = (dateString: string) => {
  const datePart = formatDate(dateString, true);
  const timePart = new Date(dateString).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
  return `${datePart} • ${timePart}`;
};

export const formatPeriod = (start: string, end: string, includeStartYear = true) => {
  const startDate = formatDate(start, includeStartYear);
  const endDate = formatDate(end, true);
  return `${startDate} • ${endDate}`;
};
