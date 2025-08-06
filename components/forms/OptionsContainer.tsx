import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '@/styles/theme';

interface OptionsContainerProps {
  children: React.ReactNode;
}

export const OptionsContainer = ({ children }: OptionsContainerProps) => {
  return <View style={styles.container}>{children}</View>;
};

interface OptionProps {
  label: string;
  onPress: () => void;
}

export const Option = ({ label, onPress }: OptionProps) => {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress}>
      <Text style={styles.optionText}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.xs,
    ...theme.shadows.sm,
  },
  option: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  optionText: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
}); 