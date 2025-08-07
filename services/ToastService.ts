import { Alert } from 'react-native';
import { AppError } from '@/types/common';

export interface ToastOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

class ToastService {
  private static instance: ToastService;

  private constructor() {}

  static getInstance(): ToastService {
    if (!ToastService.instance) {
      ToastService.instance = new ToastService();
    }
    return ToastService.instance;
  }

  success(message: string, title?: string): void {
    this.show({ message, ...(title && { title }), type: 'success' });
  }

  error(message: string, title?: string): void {
    this.show({ message, ...(title && { title }), type: 'error' });
  }

  warning(message: string, title?: string): void {
    this.show({ message, ...(title && { title }), type: 'warning' });
  }

  info(message: string, title?: string): void {
    this.show({ message, ...(title && { title }), type: 'info' });
  }

  showError(error: AppError): void {
    this.error(error.message, 'Error');
  }

  private show(options: ToastOptions): void {
    const { message, title, type = 'info' } = options;
    
    // For now, we'll use Alert.alert as a fallback
    // In a real app, you might want to use a proper toast library
    const alertTitle = title || this.getDefaultTitle(type);
    
    Alert.alert(alertTitle, message, [{ text: 'OK' }]);
  }

  private getDefaultTitle(type: ToastOptions['type']): string {
    switch (type) {
      case 'success':
        return 'Éxito';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      case 'info':
      default:
        return 'Información';
    }
  }

  // Confirmation dialog
  confirm(
    message: string,
    title?: string,
    onConfirm?: () => void,
    onCancel?: () => void
  ): void {
    Alert.alert(
      title || 'Confirmar',
      message,
      [
        { text: 'Cancelar', style: 'cancel', onPress: onCancel },
        { text: 'Confirmar', onPress: onConfirm }
      ]
    );
  }

  // Action sheet style dialog
  showActions(
    title: string,
    message: string,
    actions: Array<{
      text: string;
      onPress?: () => void;
      style?: 'default' | 'cancel' | 'destructive';
    }>
  ): void {
    Alert.alert(title, message, actions);
  }
}

export const toast = ToastService.getInstance();
