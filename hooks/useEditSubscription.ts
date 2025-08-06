import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { Subscription } from '@/types/subscription';

interface FormData {
  name: string;
  cost: string;
  frequency: 'monthly' | 'annual';
  renewalDate: Date;
  category: string;
  notes: string;
}

export const useEditSubscription = (subscriptionId: string) => {
  const { subscriptions, updateSubscription, setSubscriptionReminder } = useSubscriptionStore();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    cost: '',
    frequency: 'monthly',
    renewalDate: new Date(),
    category: '',
    notes: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const subscription = subscriptions.find(sub => sub.id === subscriptionId);

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        cost: subscription.cost.toString(),
        frequency: subscription.frequency,
        renewalDate: new Date(subscription.renewalDate),
        category: subscription.category,
        notes: subscription.notes || '',
      });
    }
  }, [subscription]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.cost.trim()) {
      newErrors.cost = 'El costo es requerido';
    } else {
      const cost = parseFloat(formData.cost);
      if (isNaN(cost) || cost <= 0) {
        newErrors.cost = 'El costo debe ser un número válido mayor a 0';
      }
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateFormData = (field: keyof FormData, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm() || !subscription) return;

    try {
      setLoading(true);
      
      const updatedSubscription: Partial<Subscription> = {
        name: formData.name.trim(),
        cost: parseFloat(formData.cost),
        frequency: formData.frequency,
        renewalDate: formData.renewalDate.toISOString(),
        category: formData.category,
        notes: formData.notes.trim() || undefined,
      };

      await updateSubscription(subscription.id, updatedSubscription);
      
      Alert.alert(
        'Éxito',
        'Suscripción actualizada correctamente',
        [{ text: 'OK' }]
      );
      
      return true;
    } catch (error) {
      Alert.alert(
        'Error',
        'No se pudo actualizar la suscripción. Inténtalo de nuevo.',
        [{ text: 'OK' }]
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReminder = async (reminderData: {
    enabled: boolean;
    daysInAdvance: number;
    time: Date;
  }) => {
    if (!subscription) return false;

    try {
      const success = await setSubscriptionReminder(subscription.id, reminderData);
      
      if (success) {
        Alert.alert(
          'Recordatorio Configurado',
          `Se ha configurado un recordatorio para ${subscription.name} ${reminderData.daysInAdvance} día(s) antes de la renovación.`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          'No se pudo configurar el recordatorio. Verifica los permisos de notificación.',
          [{ text: 'OK' }]
        );
      }
      
      return success;
    } catch (error) {
      Alert.alert(
        'Error',
        'Ocurrió un error al configurar el recordatorio.',
        [{ text: 'OK' }]
      );
      return false;
    }
  };

  const getReminderInitialData = () => {
    if (subscription?.reminder) {
      return {
        enabled: subscription.reminder.enabled,
        daysInAdvance: subscription.reminder.daysInAdvance,
        time: new Date(subscription.reminder.time),
      };
    }
    return {
      enabled: false,
      daysInAdvance: 3,
      time: new Date(),
    };
  };

  return {
    formData,
    errors,
    loading,
    subscription,
    updateFormData,
    handleSubmit,
    handleSaveReminder,
    getReminderInitialData,
  };
}; 