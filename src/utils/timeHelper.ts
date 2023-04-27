export const formatTime = (seconds: number) => {
  if (seconds <= 0) {
    return '00:00';
  }

  const hours: number = Math.floor(seconds / 3600);
  const minutes: number = Math.floor((seconds % 3600) / 60);
  const _seconds: number = Math.round((seconds % 3600) % 60);
  const _withoutHours = `${minutes < 10 ? '0' : ''}${minutes}:${_seconds < 10 ? '0' : ''}${_seconds}`;
  if (hours > 0) {
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${
      _seconds < 10 ? '0' : ''
    }${_seconds}`;
  }
  return hours > 0 ? `${hours < 10 ? '0' : ''}${hours}:${_withoutHours}` : _withoutHours;
};
