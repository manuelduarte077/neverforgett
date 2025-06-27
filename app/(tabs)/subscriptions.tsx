import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { SUBSCRIPTION_CATEGORIES } from '@/types/subscription';
import { SymbolView } from 'expo-symbols';

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
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Suscripciones</Text>
        <Text style={styles.subtitle}>
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
            placeholderTextColor="#8E8E93"
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
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#8E8E93',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1C1C1E',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
  },
  filterButtonActive: {
    backgroundColor: '#E3F2FD',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoriesScroll: {
    marginBottom: 12,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  categoryChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8E8E93',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
  },
  clearFiltersText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#007AFF',
  },
  subscriptionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1C1C1E',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
});