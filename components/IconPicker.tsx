import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { SymbolView, SFSymbol } from 'expo-symbols';
import { theme } from '@/styles/theme';

// Lista de iconos populares para suscripciones (sin duplicados)
const SUBSCRIPTION_ICONS: SFSymbol[] = [
  // Entretenimiento
  'tv', 'play.tv', 'tv.and.mediabox', 'gamecontroller', 'gamecontroller.fill',
  'music.note', 'music.mic', 'music.quarternote.3', 'music.note.list',
  'music.note.tv', 'music.note.tv.fill', 'music.note.house', 'music.note.house.fill',
  'film', 'film.fill', 'video', 'video.fill', 'video.badge.plus', 'video.badge.checkmark',
  'video.slash', 'video.slash.fill', 'video.and.waveform', 'video.and.waveform.fill',
  'video.bubble.left', 'video.bubble.left.fill',
  'headphones', 'airpods', 'airpodspro', 'speaker.wave.3', 'speaker.wave.3.fill',
  
  // Productividad
  'laptopcomputer', 'desktopcomputer', 'keyboard', 'keyboard.chevron.compact.down',
  'doc.text', 'doc.text.fill', 'doc.richtext', 'doc.plaintext',
  'folder', 'folder.fill', 'folder.badge.plus', 'folder.badge.gearshape',
  'paperclip', 'paperclip.circle', 'paperclip.circle.fill',
  'calendar', 'calendar.badge.plus', 'calendar.badge.clock',
  
  // Noticias
  'newspaper', 'newspaper.fill', 'book', 'book.fill', 'book.closed', 'book.closed.fill',
  'magazine', 'magazine.fill', 'text.book.closed', 'text.book.closed.fill',
  
  // Fitness
  'figure.walk', 'figure.run', 'figure.strengthtraining.traditional',
  'figure.yoga', 'figure.pool.swim', 'figure.hiking',
  'heart', 'heart.fill', 'heart.circle', 'heart.circle.fill',
  
  // Educación
  'graduationcap', 'graduationcap.fill', 'pencil', 'pencil.circle', 'pencil.circle.fill', 'pencil.and.outline',
  'highlighter',
  
  // Utilidades
  'wrench.and.screwdriver', 'wrench.and.screwdriver.fill', 'hammer', 'hammer.fill',
  'gear', 'gearshape', 'gearshape.fill', 'gearshape.2', 'gearshape.2.fill',
  'slider.horizontal.3', 'slider.horizontal.below.rectangle',
  
  // Otros
  'star', 'star.fill', 'star.circle', 'star.circle.fill',
  'gift', 'gift.fill', 'gift.circle', 'gift.circle.fill',
  'creditcard', 'creditcard.fill', 'creditcard.circle', 'creditcard.circle.fill',
  'cart', 'cart.fill', 'cart.circle', 'cart.circle.fill',
  'bag', 'bag.fill', 'bag.circle', 'bag.circle.fill',
  'house', 'house.fill', 'house.circle', 'house.circle.fill',
  'car', 'car.fill', 'car.circle', 'car.circle.fill',
  'airplane', 'airplane.circle', 'airplane.circle.fill',
  'bus', 'bus.fill', 'bus.doubledecker', 'bus.doubledecker.fill',
  'tram.fill', 'tram.circle', 'tram.circle.fill',
  'bicycle', 'bicycle.circle', 'bicycle.circle.fill',
  'wifi', 'wifi.slash', 'wifi.circle', 'wifi.circle.fill',
  'antenna.radiowaves.left.and.right', 'antenna.radiowaves.left.and.right.circle',
  'cellularbars',
  'battery.100', 'battery.25', 'battery.0', 'battery.100.bolt',
  'bolt', 'bolt.fill', 'bolt.circle', 'bolt.circle.fill',
  'flame', 'flame.fill', 'flame.circle', 'flame.circle.fill',
  'drop', 'drop.fill', 'drop.circle', 'drop.circle.fill',
  'leaf', 'leaf.fill', 'leaf.circle', 'leaf.circle.fill',
  'sun.max', 'sun.max.fill', 'sun.max.circle', 'sun.max.circle.fill',
  'moon', 'moon.fill', 'moon.circle', 'moon.circle.fill',
  'cloud', 'cloud.fill', 'cloud.circle', 'cloud.circle.fill',
  'snowflake', 'snowflake.circle', 'snowflake.circle.fill',
  'umbrella', 'umbrella.fill',
  'thermometer', 'thermometer.snowflake', 'thermometer.sun',
  'clock', 'clock.fill', 'clock.circle', 'clock.circle.fill',
  'timer', 'timer.circle', 'timer.circle.fill',
  'stopwatch', 'stopwatch.fill',
  'alarm', 'alarm.fill',
  'bell', 'bell.fill', 'bell.circle', 'bell.circle.fill',
  'megaphone', 'megaphone.fill',
  'speaker.wave.1', 'speaker.wave.1.fill', 'speaker.wave.2', 'speaker.wave.2.fill',
  'speaker.slash', 'speaker.slash.fill',
  'mic', 'mic.fill', 'mic.circle', 'mic.circle.fill',
  'mic.slash', 'mic.slash.fill', 'mic.slash.circle', 'mic.slash.circle.fill',
  
  // Controles de reproducción
  'play', 'play.fill', 'play.circle', 'play.circle.fill',
  'pause', 'pause.fill', 'pause.circle', 'pause.circle.fill',
  'stop', 'stop.fill', 'stop.circle', 'stop.circle.fill',
  'forward', 'forward.fill', 'backward', 'backward.fill',
  'shuffle', 'repeat', 'repeat.1',
  
  // Controles básicos
  'plus', 'plus.circle', 'plus.circle.fill', 'plus.square', 'plus.square.fill',
  'minus', 'minus.circle', 'minus.circle.fill', 'minus.square', 'minus.square.fill',
  'xmark', 'xmark.circle', 'xmark.circle.fill', 'xmark.square', 'xmark.square.fill',
  'checkmark', 'checkmark.circle', 'checkmark.circle.fill', 'checkmark.square', 'checkmark.square.fill',
  'chevron.up', 'chevron.down', 'chevron.left', 'chevron.right',
  'arrow.up', 'arrow.down', 'arrow.left', 'arrow.right',
  'arrow.up.circle', 'arrow.down.circle', 'arrow.left.circle', 'arrow.right.circle',
  'arrow.up.circle.fill', 'arrow.down.circle.fill', 'arrow.left.circle.fill', 'arrow.right.circle.fill',
  'magnifyingglass', 'magnifyingglass.circle', 'magnifyingglass.circle.fill',
  
  // Personas y comunicación
  'person', 'person.fill', 'person.circle', 'person.circle.fill',
  'person.2', 'person.2.fill', 'person.3', 'person.3.fill',
  'envelope', 'envelope.fill', 'envelope.circle', 'envelope.circle.fill',
  'phone', 'phone.fill', 'phone.circle', 'phone.circle.fill',
  'message', 'message.fill', 'message.circle', 'message.circle.fill',
  'location', 'location.fill', 'location.circle', 'location.circle.fill',
  'map', 'map.fill', 'map.circle', 'map.circle.fill',
  'globe',
  'link', 'link.circle', 'link.circle.fill',
  'lock', 'lock.fill', 'lock.circle', 'lock.circle.fill',
  'key', 'key.fill',
  'eye', 'eye.fill', 'eye.slash', 'eye.slash.fill',
  'hand.raised', 'hand.raised.fill', 'hand.raised.slash', 'hand.raised.slash.fill',
  'hand.thumbsup', 'hand.thumbsup.fill', 'hand.thumbsdown', 'hand.thumbsdown.fill',
  'flag', 'flag.fill', 'flag.circle', 'flag.circle.fill',
  'bookmark', 'bookmark.fill', 'bookmark.circle', 'bookmark.circle.fill',
  'tag', 'tag.fill', 'tag.circle', 'tag.circle.fill',
  'ticket', 'ticket.fill',
  'crown', 'crown.fill',
  'diamond', 'diamond.fill', 'diamond.circle', 'diamond.circle.fill',
  'sparkles',
  'wand.and.stars', 'wand.and.stars.inverse',
  'theatermasks', 'theatermasks.fill',
  'dice', 'dice.fill',
  'puzzlepiece', 'puzzlepiece.fill',
  'brain', 'brain.fill', 'brain.head.profile', 'brain.head.profile.fill',
  'atom',
  'flask', 'flask.fill',
  'testtube.2',
  'binoculars', 'binoculars.fill',
  
  // Cámaras y fotos
  'camera', 'camera.fill', 'camera.circle', 'camera.circle.fill',
  'camera.rotate', 'camera.rotate.fill',
  'photo', 'photo.fill', 'photo.circle', 'photo.circle.fill',
  'photo.on.rectangle', 'photo.fill.on.rectangle.fill',
  'photo.stack', 'photo.stack.fill',
  'rectangle.stack', 'rectangle.stack.fill',
  'square.stack', 'square.stack.fill',
  
  // Almacenamiento y dispositivos
  'cube', 'cube.fill', 'cube.transparent', 'cube.transparent.fill',
  'shippingbox', 'shippingbox.fill',
  'archivebox', 'archivebox.fill',
  'externaldrive', 'externaldrive.fill',
  'internaldrive', 'internaldrive.fill',
  'opticaldiscdrive', 'opticaldiscdrive.fill',
  'network', 'server.rack',
  'pc', 'macpro.gen3',
  'display', 'display.2',
  'airplayvideo', 'airplayaudio',
  'airport.express', 'airport.extreme', 'airport.extreme.tower',
  'homepod', 'homepod.fill', 'homepod.2', 'homepod.2.fill',
  'hifispeaker', 'hifispeaker.fill',
  'radio', 'radio.fill',
  'appletv', 'appletv.fill',
  'appletvremote.gen1', 'appletvremote.gen1.fill',
  'appletvremote.gen2', 'appletvremote.gen2.fill',
  'appletvremote.gen3', 'appletvremote.gen3.fill',
  'appletvremote.gen4', 'appletvremote.gen4.fill',
];

interface IconPickerProps {
  selectedIcon: SFSymbol;
  onIconSelect: (icon: SFSymbol) => void;
  visible: boolean;
  onClose: () => void;
}

export const IconPicker = ({ selectedIcon, onIconSelect, visible, onClose }: IconPickerProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = SUBSCRIPTION_ICONS.filter(icon =>
    icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIconSelect = (icon: SFSymbol) => {
    onIconSelect(icon);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Seleccionar Icono</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <SymbolView name="xmark" type="hierarchical" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <SymbolView name="magnifyingglass" type="hierarchical" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar iconos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={styles.iconGrid} showsVerticalScrollIndicator={false}>
          <View style={styles.iconContainer}>
            {filteredIcons.map((icon) => (
              <TouchableOpacity
                key={icon}
                style={[
                  styles.iconItem,
                  selectedIcon === icon && styles.selectedIconItem
                ]}
                onPress={() => handleIconSelect(icon)}
              >
                <SymbolView
                  name={icon}
                  type="hierarchical"
                  style={styles.icon}
                  tintColor={selectedIcon === icon ? theme.colors.primary : theme.colors.text.primary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.typography.fontFamily.regular,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
  },
  iconGrid: {
    flex: 1,
  },
  iconContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
  },
  iconItem: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    margin: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  selectedIconItem: {
    backgroundColor: theme.colors.primary + '10',
    borderColor: theme.colors.primary,
  },
  icon: {
    width: 32,
    height: 32,
    color: theme.colors.text.primary,
  },
  selectedIcon: {
    color: theme.colors.primary,
  },
});
