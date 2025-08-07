import { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SymbolView } from 'expo-symbols';
import { theme } from '@/styles/theme';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (reminderData: {
    enabled: boolean;
    daysInAdvance: number;
    time: Date;
  }) => void;
  initialData?: {
    enabled: boolean;
    daysInAdvance: number;
    time: Date;
  };
}

export const ReminderModal = ({ visible, onClose, onSave, initialData }: ReminderModalProps) => {
  const [enabled, setEnabled] = useState(initialData?.enabled ?? false);
  const [daysInAdvance, setDaysInAdvance] = useState(initialData?.daysInAdvance ?? 3);
  const [time, setTime] = useState(initialData?.time ?? new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    onSave({
      enabled,
      daysInAdvance,
      time,
    });
    onClose();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTime(selectedDate);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Configurar Recordatorio</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalView: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: theme.spacing.xl,
    ...theme.shadows.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  modalTitle: {
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
