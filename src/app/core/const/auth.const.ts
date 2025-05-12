import { ActionButtons } from '../models/action.buttons.interface';

export const loginActionButtons = (
  navigateToRegister: () => void,
  onSubmit: () => void
): ActionButtons[] => [
  {
    label: 'Sign up',
    action: () => {
      navigateToRegister();
    },
    style: 'secondary',
  },
  {
    label: 'Sign in',
    action: () => {
      onSubmit();
    },
  },
];
