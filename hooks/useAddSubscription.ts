import { useState } from 'react';
import { Alert } from 'react-native';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { CATEGORY_COLORS } from '@/types/subscription';
import { useDate } from './useDate';

interface FormData {
  name: string;
  cost: string;
  frequency: 'monthly' | 'annual';
  renewalDate: Date;
  category: string;
  notes: string;
}

export const useAddSubscription = () => {
  const { addSubscription, loading } = useSubscriptionStore();
  const { formatDate } = useDate();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    cost: '',
    frequency: 'monthly',
    renewalDate: new Date(),
    category: '',
    notes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.cost.trim()) {
      newErrors.cost = 'El costo es requerido';
    } else if (isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) <= 0) {
      newErrors.cost = 'El costo debe ser un número válido';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await addSubscription({
        name: formData.name.trim(),
        cost: parseFloat(formData.cost),
        frequency: formData.frequency,
        renewalDate: formData.renewalDate.toISOString(),
        category: formData.category,
        notes: formData.notes.trim(),
        color: CATEGORY_COLORS[formData.category] || CATEGORY_COLORS.Otros,
      });

      // Reset form
      setFormData({
        name: '',
        cost: '',
        frequency: 'monthly',
        renewalDate: new Date(),
        category: '',
        notes: '',
      });

      Alert.alert(
        'Suscripción Agregada',
        'La suscripción se ha agregado correctamente',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la suscripción');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, renewalDate: selectedDate });
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const formatRenewalDate = () => {
    return formatDate(formData.renewalDate);
  };

  return {
    formData,
    errors,
    loading,
    showDatePicker,
    showCategoryPicker,
    showFrequencyPicker,
    handleSubmit,
    handleDateChange,
    updateFormData,
    formatRenewalDate,
    setShowDatePicker,
    setShowCategoryPicker,
    setShowFrequencyPicker,
  };
}; 