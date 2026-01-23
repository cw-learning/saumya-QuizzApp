import type { ButtonVariantType } from './button.types';

export const BASE_BUTTON_CLASSES =
  'px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md active:scale-95';

export const VARIANT_CLASSES: Record<ButtonVariantType, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  secondary:
    'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 focus:ring-gray-400',
};

export const FULL_WIDTH_CLASS = 'w-full';
