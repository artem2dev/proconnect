export function timeSinceLastOnline(isoDate) {
  const now = new Date();
  const lastOnline = new Date(isoDate);
  const diffMs = now - lastOnline;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) {
    return 'was online just now';
  } else if (diffMinutes < 60) {
    return `was online ${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `was online ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays <= 7) {
    return `was online ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    const day = String(lastOnline.getDate()).padStart(2, '0');
    const month = String(lastOnline.getMonth() + 1).padStart(2, '0');
    const year = lastOnline.getFullYear();
    return `was online ${month}.${day}.${year}`;
  }
}
