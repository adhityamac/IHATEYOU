export type ThemeMode = 'light' | 'dark' | 'auto';
export type CurrentTheme = 'light' | 'dark';

export interface ThemeModeState {
    mode: ThemeMode;
    currentTheme: CurrentTheme;
}
