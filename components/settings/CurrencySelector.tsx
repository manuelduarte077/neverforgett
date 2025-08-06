import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { SymbolView } from 'expo-symbols';
import { theme } from '@/styles/theme';

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  country: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', country: 'Estados Unidos' },
  { code: 'NIO', name: 'Córdoba Nicaragüense', symbol: 'C$', country: 'Nicaragua' },
  { code: 'CRC', name: 'Colón Costarricense', symbol: '₡', country: 'Costa Rica' },
  { code: 'HNL', name: 'Lempira Hondureño', symbol: 'L', country: 'Honduras' },
  { code: 'GTQ', name: 'Quetzal Guatemalteco', symbol: 'Q', country: 'Guatemala' },
];

interface CurrencySelectorProps {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  onSelect: (currency: Currency) => void;
  selectedCurrency: Currency;
}

export const CurrencySelector = ({ 
  bottomSheetModalRef, 
  onSelect, 
  selectedCurrency 
}: CurrencySelectorProps) => {
  // Variables
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  // Callbacks
  const handleDismiss = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, [bottomSheetModalRef]);

  const handleSelectCurrency = useCallback((currency: Currency) => {
    onSelect(currency);
    handleDismiss();
  }, [onSelect, handleDismiss]);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.indicator}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Seleccionar Moneda</Text>
          <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
            <SymbolView name="xmark" type="hierarchical" />
          </TouchableOpacity>
        </View>

        <View style={styles.currencyList}>
          {CURRENCIES.map((currency) => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.currencyItem,
                selectedCurrency.code === currency.code && styles.selectedCurrency
              ]}
              onPress={() => handleSelectCurrency(currency)}
            >
              <View style={styles.currencyInfo}>
                <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                <View style={styles.currencyDetails}>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                  <Text style={styles.currencyCountry}>{currency.country}</Text>
                </View>
              </View>
              {selectedCurrency.code === currency.code && (
                <SymbolView name="checkmark" type="hierarchical" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: theme.colors.surface,
  },
  indicator: {
    backgroundColor: theme.colors.border,
    width: 40,
    height: 4,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  currencyList: {
    padding: theme.spacing.lg,
  },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  selectedCurrency: {
    backgroundColor: theme.colors.primary + '10',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  currencySymbol: {
    fontFamily: theme.typography.fontFamily.bold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.primary,
    marginRight: theme.spacing.lg,
    minWidth: 30,
  },
  currencyDetails: {
    flex: 1,
  },
  currencyName: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  currencyCountry: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
}); 