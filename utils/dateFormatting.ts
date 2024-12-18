export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pl-PL', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('pl-PL', { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

