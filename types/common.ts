import { NativeSyntheticEvent, TextInputChangeEventData } from 'react-native';

// Date picker event types
export interface DatePickerEvent {
  type: string;
  nativeEvent: {
    timestamp?: number;
  };
}

// Form field types
export interface FormFieldChangeEvent {
  target: {
    value: string;
  };
}



// Common error type
export interface AppError {
  message: string;
  code?: string;
}

// Navigation types
export type AppRoute = 
  | '/(tabs)'
  | '/(tabs)/index'
  | '/(tabs)/subscriptions'
  | '/(tabs)/analytics'
  | '/add'
  | '/settings'
  | '/edit-subscription/[id]';
