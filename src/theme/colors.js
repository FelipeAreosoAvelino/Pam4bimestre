import { useColorScheme } from 'react-native';

const light = {
  background: '#F2F4F8',
  card: '#FFFFFF',
  text: '#1B1F2A',
  textMuted: '#7A8190',
  primary: '#4F46E5',
  danger: '#E5484D',
  success: '#2FA66A',
  border: '#E1E5EC',
};

const dark = {
  background: '#0F1117',
  card: '#1B1F2A',
  text: '#F2F4F8',
  textMuted: '#8D94A5',
  primary: '#7C74F5',
  danger: '#F2686D',
  success: '#43C285',
  border: '#2A2F3C',
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? dark : light;
}