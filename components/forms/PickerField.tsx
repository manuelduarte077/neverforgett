import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SymbolView, SFSymbol } from 'expo-symbols';
import { theme } from '@/styles/theme';

interface PickerFieldProps {
  label: string;
  value: string;
  onPress: () => void;
  placeholder?: string;
  error?: string | undefined;
  icon?: string;
  showChevron?: boolean;
}

export const PickerField = ({
  label,
  value,
  onPress,
  placeholder,
  error,
  icon,
  showChevron = true,
}: PickerFieldProps) => {
  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.pickerContainer, error && styles.inputError]}
        onPress={onPress}
      >
        {icon && (
          <SymbolView 
            name={icon as SFSymbol} 
            style={styles.icon} 
            type="hierarchical" 
          />
        )}
        <Text style={[
          styles.pickerText,
          icon && styles.pickerTextWithIcon,
          !value && styles.placeholderText,
        ]}>
          {value || placeholder}
        </Text>
        {showChevron && (
          <SymbolView 
            name="chevron.down" 
            style={styles.chevron} 
            type="hierarchical" 
          />
        )}
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  pickerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  icon: {
    width: 20,
    height: 20,
    margin: 5,
  },
  pickerText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    flex: 1,
  },
  pickerTextWithIcon: {
    marginLeft: theme.spacing.md,
  },
  placeholderText: {
    color: theme.colors.text.secondary,
  },
  chevron: {
    width: 20,
    height: 20,
    margin: 5,
  },
  errorText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
  },
}); 