// utils/constants.ts
export const EQUIPMENT_OPTIONS = [
  { value: 'wifi', label: 'Wi-Fi', icon: 'Wifi' },
  { value: 'projector', label: 'Projecteur', icon: 'Tv' },
  { value: 'whiteboard', label: 'Tableau blanc', icon: 'Square' },
  { value: 'screen', label: 'Écran', icon: 'Monitor' },
  { value: 'sound_system', label: 'Système audio', icon: 'Volume2' },
  { value: 'microphone', label: 'Microphone', icon: 'Mic' },
  { value: 'camera', label: 'Caméra', icon: 'Video' },
  { value: 'air_conditioning', label: 'Climatisation', icon: 'Wind' },
  { value: 'coffee_machine', label: 'Machine à café', icon: 'Coffee' },
  { value: 'water_dispenser', label: 'Fontaine à eau', icon: 'Droplets' },
  { value: 'printer', label: 'Imprimante', icon: 'Printer' },
  { value: 'computer', label: 'Ordinateur', icon: 'Laptop' },
];

export const ROOM_STATUS = {
  ACTIVE: { label: 'Activée', color: 'bg-emerald-500/20 text-emerald-300' },
  INACTIVE: { label: 'Indisponible', color: 'bg-rose-500/20 text-rose-300' },
  MAINTENANCE: { label: 'Maintenance', color: 'bg-amber-500/20 text-amber-300' },
} as const;

export const RESERVATION_STATUS = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-amber-500/20 text-amber-300' },
  APPROUVEE: { label: 'Approuvée', color: 'bg-emerald-500/20 text-emerald-300' },
  REFUSEE: { label: 'Refusée', color: 'bg-rose-500/20 text-rose-300' },
  ANNULEE: { label: 'Annulée', color: 'bg-gray-500/20 text-gray-300' },
} as const;