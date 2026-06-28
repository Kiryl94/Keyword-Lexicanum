import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { lookupKeyword } from '@/lib/lookup';
import { useSessionStore } from '@/store/session';

export default function LookupScreen() {
  const activeSystem = useSessionStore((s) => s.getActiveSystem());
  const recentLookups = useSessionStore((s) => s.recentLookups);
  const addRecentLookup = useSessionStore((s) => s.addRecentLookup);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Awaited<ReturnType<typeof lookupKeyword>> | null>(
    null,
  );

  async function onSearch(term: string) {
    const trimmed = term.trim();
    if (!trimmed || !activeSystem) return;

    setLoading(true);
    setResult(null);
    try {
      const response = await lookupKeyword(trimmed, activeSystem.id);
      setResult(response);
      addRecentLookup(trimmed);
    } finally {
      setLoading(false);
    }
  }

  if (!activeSystem) {
    return (
      <View style={styles.container}>
        <Text style={styles.muted}>Select a game system on the System tab first.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>{activeSystem.label}</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Enter a keyword (e.g. Advantage, Engagement)"
        placeholderTextColor="#6b6b80"
        style={styles.input}
        onSubmitEditing={() => onSearch(query)}
        returnKeyType="search"
      />
      <Pressable style={styles.button} onPress={() => onSearch(query)}>
        <Text style={styles.buttonText}>Look up</Text>
      </Pressable>

      {loading && <ActivityIndicator color="#e94560" />}

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>{result.keyword}</Text>
          {result.phase && (
            <Text style={styles.phase}>Applies during: {result.phase}</Text>
          )}
          <Text style={styles.explanation}>{result.explanation}</Text>
          {result.citation && (
            <Text style={styles.citation}>Source: {result.citation}</Text>
          )}
          {result.offlineNote && (
            <Text style={styles.offlineNote}>{result.offlineNote}</Text>
          )}
        </View>
      )}

      {recentLookups.length > 0 && (
        <View style={styles.recent}>
          <Text style={styles.recentTitle}>Recent lookups</Text>
          {recentLookups.map((item) => (
            <Pressable key={item} onPress={() => { setQuery(item); onSearch(item); }}>
              <Text style={styles.recentItem}>{item}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
    backgroundColor: '#0f0f1a',
    flexGrow: 1,
  },
  heading: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
    color: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  button: {
    backgroundColor: '#e94560',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  resultTitle: {
    color: '#f5f5f5',
    fontSize: 18,
    fontWeight: '700',
  },
  phase: {
    color: '#e94560',
    fontWeight: '600',
  },
  explanation: {
    color: '#d0d0e0',
    lineHeight: 22,
  },
  citation: {
    color: '#8a8aa0',
    fontSize: 12,
  },
  offlineNote: {
    color: '#f0ad4e',
    fontSize: 12,
  },
  recent: {
    marginTop: 8,
    gap: 6,
  },
  recentTitle: {
    color: '#a0a0b0',
    fontWeight: '600',
  },
  recentItem: {
    color: '#e94560',
    paddingVertical: 4,
  },
  muted: {
    color: '#a0a0b0',
    padding: 20,
  },
});
