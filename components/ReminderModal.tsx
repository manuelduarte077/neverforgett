import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Switch, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SymbolView } from 'expo-symbols';

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
              trackColor={{ false: '#E5E5E7', true: '#007AFF' }}
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
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1C1C1E',
  },
  closeButton: {
    padding: 5,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#1C1C1E',
  },
  daysSelector: {
    flexDirection: 'row',
  },
  dayOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    marginLeft: 8,
  },
  dayOptionSelected: {
    backgroundColor: '#007AFF',
  },
  dayOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#8E8E93',
  },
  dayOptionTextSelected: {
    color: '#FFFFFF',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  timeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1C1C1E',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});
