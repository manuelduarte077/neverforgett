import { useState } from 'react';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { CATEGORY_COLORS } from '@/types/subscription';
import { useDate } from './useDate';
import { DatePickerEvent } from '@/types/common';
import { toast } from '@/services/ToastService';
import { SFSymbol } from 'expo-symbols';

interface FormData {
  name: string;
  cost: string;
  frequency: 'monthly' | 'annual';
  renewalDate: Date;
  category: string;
  notes: string;
  icon: SFSymbol;
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
    icon: 'creditcard' as SFSymbol,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
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
        color: CATEGORY_COLORS[formData.category] || CATEGORY_COLORS.Otros || '#000000',
        icon: formData.icon,
      });

      setFormData({
        name: '',
        cost: '',
        frequency: 'monthly',
        renewalDate: new Date(),
        category: '',
        notes: '',
        icon: 'creditcard' as SFSymbol,
      });

      toast.success('La suscripción se ha agregado correctamente', 'Suscripción Agregada');
    } catch (error) {
      toast.error('No se pudo agregar la suscripción');
    }
  };

  const handleDateChange = (event: DatePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, renewalDate: selectedDate });
    }
  };

  const updateFormData = (field: keyof FormData, value: string | number | Date) => {
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
    showIconPicker,
    handleSubmit,
    handleDateChange,
    updateFormData,
    formatRenewalDate,
    setShowDatePicker,
    setShowCategoryPicker,
    setShowFrequencyPicker,
    setShowIconPicker,
  };
}; 