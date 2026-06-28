import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GAME_SYSTEMS, useSessionStore } from '@/store/session';

export default function SystemScreen() {
  const activeSystemId = useSessionStore((s) => s.activeSystemId);
  const setActiveSystem = useSessionStore((s) => s.setActiveSystem);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Keyword Lexicanum</Text>
      <Text style={styles.subtitle}>Select your active game system</Text>
      {GAME_SYSTEMS.map((system) => {
        const selected = activeSystemId === system.id;
        return (
          <Pressable
            key={system.id}
            onPress={() => setActiveSystem(system.id)}
            style={[styles.card, selected && styles.cardSelected]}
          >
            <Text style={styles.cardTitle}>{system.label}</Text>
            <Text style={styles.cardBody}>{system.description}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
    padding: 20,
    gap: 12,
  },
  title: {
    color: '#f5f5f5',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#a0a0b0',
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  cardSelected: {
    borderColor: '#e94560',
  },
  cardTitle: {
    color: '#f5f5f5',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardBody: {
    color: '#a0a0b0',
    fontSize: 14,
  },
});
