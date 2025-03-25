
import { R22nProvider } from 'r22n';

import { ModalProvider } from '../modal';
import { ThemeProvider } from '../theme';

export type LayoutProviderProps = {
  theme?: string,
  language?: string,
  translations?: Record<string, string>,
  children: React.ReactNode
}

export default function LayoutProvider(props: LayoutProviderProps) {
  const { theme, language, translations, children } = props;
  const modal = [
    'border-2 p-4 bg-[#EBF0F6] border-[#C8D5E0] text-[#222222]',
    'dark:bg-[#090D14] dark:border-[#1F2937] dark:text-[#DDDDDD]'
  ];
  return (
    <R22nProvider language={language} translations={translations}>
      <ThemeProvider theme={theme}>
        <ModalProvider className={modal.join(' ')}>
          {children}
        </ModalProvider>
      </ThemeProvider>
    </R22nProvider>
  );
}
