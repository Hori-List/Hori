import { defineConfig } from 'windicss/helpers';

export default defineConfig({
  darkMode: 'class',
  theme: {
    backgroundColor: theme => ( {
      ...theme('colors'),
      dark: '#222030',
    } ),
    boxShadow: {
      'reverse': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
  shortcuts: {
    'background': 'dark:bg-dark',
    'input': 'w-full block px-2 border rounded-lg text-3xl font-medium dark:text-white dark:border-white dark:bg-dark outline-none focus:none',
    'button': 'border rounded-lg px-6 py-1 font-medium text-2xl dark:text-white dark:border-white disabled:opacity-50',
    'label': 'text-xl font-medium dark:text-white block',
    'form': 'w-screen px-4',
    'title': 'dark:text-white text-4xl font-medium mx-2 text-center',
    'header': 'text-3xl font-medium ml-6 pt-12 dark:text-white',
    'text': 'text-xl font-medium dark:text-white',
  },
});
