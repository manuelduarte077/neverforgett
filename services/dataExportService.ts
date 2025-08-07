import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import { Subscription } from '@/types/subscription';

interface ImportedSubscription {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  cost: number;
  frequency: 'monthly' | 'annual';
  renewalDate: string;
  category: string;
  notes?: string;
  color: string;
  reminder?: {
    enabled: boolean;
    daysInAdvance: number;
    time: string | Date;
  };
}

export class DataExportService {
  static async exportData(subscriptions: Subscription[]) {
    if (subscriptions.length === 0) {
      throw new Error('No hay suscripciones para exportar.');
    }
    
    const dataToExport = JSON.stringify(subscriptions, null, 2);
    const fileUri = `${FileSystem.documentDirectory}subscriptions_export_${Date.now()}.json`;
    await FileSystem.writeAsStringAsync(fileUri, dataToExport);
    
    const canShare = await Sharing.isAvailableAsync();
    
    if (!canShare) {
      throw new Error('La función de compartir no está disponible en este dispositivo.');
    }
    
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Exportar Suscripciones',
      UTI: 'public.json'
    });
  }

  static async importData() {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true
    });
    
    if (result.canceled) {
      return null;
    }
    
    const fileUri = result.assets?.[0]?.uri;
    if (!fileUri) {
      throw new Error('No se pudo obtener el URI del archivo');
    }
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const importedData = JSON.parse(fileContent);
    
    if (!Array.isArray(importedData)) {
      throw new Error('El formato del archivo no es válido');
    }
    
    return importedData.map((sub: ImportedSubscription) => {
      const { id, createdAt, updatedAt, ...subscriptionData } = sub;
      
      if (subscriptionData.reminder && subscriptionData.reminder.time) {
        subscriptionData.reminder = {
          ...subscriptionData.reminder,
          time: new Date(subscriptionData.reminder.time)
        };
      }
      
      return subscriptionData;
    });
  }
} 