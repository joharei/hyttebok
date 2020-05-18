export function formatDateForDisplay(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return date.toLocaleDateString('nb-NO', options);
}

export function formatDateForInput(date: Date | undefined): string | undefined {
  if (!date) {
    return undefined;
  }

  return (
    date.getFullYear().toString() +
    '-' +
    (date.getMonth() + 1).toString().padStart(2, '0') +
    '-' +
    date.getDate().toString().padStart(2, '0')
  );
}
