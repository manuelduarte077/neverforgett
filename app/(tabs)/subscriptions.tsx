import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { SUBSCRIPTION_CATEGORIES } from '@/types/subscription';
import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { commonStyles } from '@/styles/common';
import { theme } from '@/styles/theme';

export default function SubscriptionsScreen() {
  const {
    subscriptions,
    loading,
    loadSubscriptions,
    deleteSubscription,
    searchSubscriptions,
    filterByCategory
  } = useSubscriptionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const getFilteredSubscriptions = () => {
    let filtered = subscriptions;

    if (searchQuery) {
      filtered = searchSubscriptions(searchQuery);
    }

    if (selectedCategory) {
      filtered = filtered.filter(sub => sub.category === selectedCategory);
    }

    return filtered.sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleDeleteSubscription = (id: string, name: string) => {
    Alert.alert(
      'Eliminar Suscripción',
      `¿Estás seguro de que deseas eliminar "${name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteSubscription(id)
        },
      ]
    );
  };



  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const filteredSubscriptions = getFilteredSubscriptions();

  return (
    <SafeAreaView style={commonStyles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Suscripciones</Text>
        <Text style={commonStyles.subtitle}>
          {subscriptions.length} suscripción{subscriptions.length !== 1 ? 'es' : ''} total{subscriptions.length !== 1 ? 'es' : ''}
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <SymbolView name="magnifyingglass" type="hierarchical" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar suscripciones..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={theme.colors.text.secondary}
          />
        </View>

        <TouchableOpacity
          style={[styles.filterButton, showFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <SymbolView name="line.3.horizontal.decrease" type="hierarchical" />
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            <TouchableOpacity
              style={[styles.categoryChip, !selectedCategory && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(null)}
            >
              <Text style={[styles.categoryChipText, !selectedCategory && styles.categoryChipTextActive]}>
                Todas
              </Text>
            </TouchableOpacity>

            {SUBSCRIPTION_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                <Text style={[styles.categoryChipText, selectedCategory === category && styles.categoryChipTextActive]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {(searchQuery || selectedCategory) && (
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Limpiar filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <ScrollView style={styles.subscriptionsList}>
        {filteredSubscriptions.map((subscription) => (
          <SubscriptionCard
            key={subscription.id}
            subscription={subscription}
            onMorePress={() => handleDeleteSubscription(subscription.id, subscription.name)}
          />
        ))}

        {filteredSubscriptions.length === 0 && !loading && (
          <View style={styles.emptyState}>
            {searchQuery || selectedCategory ? (
              <>
                <SymbolView name="magnifyingglass" type="hierarchical" />
                <Text style={styles.emptyTitle}>No se encontraron resultados</Text>
                <Text style={styles.emptySubtitle}>
                  Intenta ajustar tus filtros de búsqueda
                </Text>
              </>
            ) : (
              <>
                <SymbolView name="creditcard" type="hierarchical" />
                <Text style={styles.emptyTitle}>No hay suscripciones</Text>
                <Text style={styles.emptySubtitle}>
                  Agrega tu primera suscripción desde la pestaña "Agregar"
                </Text>
              </>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    marginRight: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.primary,
  },
  filterButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  filterButtonActive: {
    backgroundColor: '#E3F2FD',
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  categoriesScroll: {
    marginBottom: theme.spacing.md,
  },
  categoryChip: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryChipText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  categoryChipTextActive: {
    color: theme.colors.surface,
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
  },
  clearFiltersText: {
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  subscriptionsList: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.xl,
  },
  emptyTitle: {
    fontFamily: theme.typography.fontFamily.semiBold,
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.text.primary,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});