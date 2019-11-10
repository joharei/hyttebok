export function formatDateString(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return new Date(dateString).toLocaleDateString('nb-NO', options);
}