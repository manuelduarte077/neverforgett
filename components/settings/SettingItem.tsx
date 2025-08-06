import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { theme } from '@/styles/theme';

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress: () => void;
  color?: string;
  showChevron?: boolean;
  disabled?: boolean;
}

export const SettingItem = ({
  icon,
  title,
  subtitle,
  onPress,
  color = theme.colors.text.primary,
  showChevron = true,
  disabled = false
}: SettingItemProps) => (
  <TouchableOpacity 
    style={[styles.settingItem, disabled && styles.settingItemDisabled]} 
    onPress={onPress}
    disabled={disabled}
  >
    <View style={styles.settingIcon}>
      {icon}
    </View>
    <View style={styles.settingContent}>
      <Text style={[styles.settingTitle, { color }]}>{title}</Text>
      {subtitle && (
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      )}
    </View>
    {showChevron && (
      <SymbolView name="chevron.right" type="hierarchical" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.lg,
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
}); 