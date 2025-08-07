import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SymbolView } from 'expo-symbols';
import { theme } from '@/styles/theme';
import { DatePickerEvent } from '@/types/common';

interface ReminderData {
  enabled: boolean;
  daysInAdvance: number;
  time: Date;
}

interface ReminderBottomSheetProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  onSave: (reminderData: ReminderData) => void;
  initialData?: ReminderData;
}

export const ReminderBottomSheet = ({ 
  bottomSheetModalRef, 
  onSave, 
  initialData 
}: ReminderBottomSheetProps) => {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? false);
  const [daysInAdvance, setDaysInAdvance] = useState(initialData?.daysInAdvance ?? 3);
  const [time, setTime] = useState(initialData?.time ?? new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Variables
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  // Callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, [bottomSheetModalRef]);

  const handleDismiss = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [bottomSheetModalRef]);

  const handleSave = useCallback(() => {
    onSave({
      enabled,
      daysInAdvance,
      time,
    });
    handleDismiss();
  }, [enabled, daysInAdvance, time, onSave, handleDismiss]);

  const handleTimeChange = (event: DatePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Configurar Recordatorio</Text>
          <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
            <SymbolView name="xmark" type="hierarchical" />
          </TouchableOpacity>
        </View>

        <View style={styles.optionRow}>
          <Text style={styles.optionLabel}>Activar recordatorios</Text>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
          />
        </View>

        {enabled && (
          <>
            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Días de anticipación</Text>
              <View style={styles.daysSelector}>
                {[1, 3, 7].map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.dayOption,
                      daysInAdvance === days && styles.dayOptionSelected,
                    ]}
                    onPress={() => setDaysInAdvance(days)}
                  >
                    <Text
                      style={[
                        styles.dayOptionText,
                        daysInAdvance === days && styles.dayOptionTextSelected,
                      ]}
                    >
                      {days} {days === 1 ? 'día' : 'días'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.optionRow}>
              <Text style={styles.optionLabel}>Hora de notificación</Text>
              <TouchableOpacity
                style={styles.timeSelector}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.timeText}>{formatTime(time)}</Text>
                <SymbolView name="clock" type="hierarchical" />
              </TouchableOpacity>
            </View>

            {showTimePicker && (
              <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: theme.colors.surface,
  },
  handleIndicator: {
    backgroundColor: theme.colors.border,
  },
  contentContainer: {
    flex: 1,
    padding: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  optionLabel: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  daysSelector: {
    flexDirection: 'row',
  },
  dayOption: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    marginLeft: theme.spacing.sm,
  },
  dayOptionSelected: {
    backgroundColor: theme.colors.primary,
  },
  dayOptionText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  dayOptionTextSelected: {
    color: theme.colors.surface,
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  timeText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  saveButtonText: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.surface,
  },
}); 