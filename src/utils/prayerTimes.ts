export interface WaktuSholatItem {
  nama: string;
  waktu: string; // HH:MM
  icon: string;
  isPassed: boolean;
  isNext: boolean;
  countdownStr?: string;
}

export const JADWAL_SHOLAT_DEFAULT = [
  { nama: 'Shubuh', waktu: '04:28' },
  { nama: 'Terbit', waktu: '05:42' },
  { nama: 'Dzuhur', waktu: '11:49' },
  { nama: 'Asar', waktu: '15:08' },
  { nama: 'Maghrib', waktu: '17:54' },
  { nama: 'Isya', waktu: '19:04' },
];

export function getWaktuSholatList(currentDate: Date = new Date()): WaktuSholatItem[] {
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  let nextIndex = -1;
  const list: WaktuSholatItem[] = JADWAL_SHOLAT_DEFAULT.map((item, idx) => {
    const [h, m] = item.waktu.split(':').map(Number);
    const itemMinutes = h * 60 + m;
    const isPassed = currentMinutes >= itemMinutes;

    if (nextIndex === -1 && currentMinutes < itemMinutes) {
      nextIndex = idx;
    }

    return {
      nama: item.nama,
      waktu: item.waktu,
      icon: item.nama === 'Shubuh' ? 'sunrise' : item.nama === 'Dzuhur' ? 'sun' : item.nama === 'Asar' ? 'cloud-sun' : item.nama === 'Maghrib' ? 'sunset' : 'moon',
      isPassed,
      isNext: false,
    };
  });

  if (nextIndex === -1) {
    // Past all prayers today, next is Shubuh tomorrow
    nextIndex = 0;
  }

  if (list[nextIndex]) {
    list[nextIndex].isNext = true;
    const [h, m] = list[nextIndex].waktu.split(':').map(Number);
    let diff = (h * 60 + m) - currentMinutes;
    if (diff < 0) diff += 24 * 60;
    const hoursLeft = Math.floor(diff / 60);
    const minsLeft = diff % 60;
    list[nextIndex].countdownStr = `${hoursLeft > 0 ? `${hoursLeft}j ` : ''}${minsLeft}m lagi`;
  }

  return list;
}

export function formatWIBTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta'
  });
}

export function formatWIBDate(date: Date = new Date()): string {
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  });
}

export function getNamaHijriah(): string {
  // Approximate Hijri representation for pesantren display
  return '25 Rabiul Akhir 1448 H';
}
