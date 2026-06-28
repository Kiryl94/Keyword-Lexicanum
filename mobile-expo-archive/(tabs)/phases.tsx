import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getKeywordsForPhase } from '@/lib/lookup';
import { useSessionStore } from '@/store/session';

export default function PhasesScreen() {
  const activeSystem = useSessionStore((s) => s.getActiveSystem());
  const [phase, setPhase] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);

  function onBrowse() {
    if (!activeSystem) return;
    setKeywords(getKeywordsForPhase(phase, activeSystem.id));
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
      <Text style={styles.heading}>Browse by phase</Text>
      <TextInput
        value={phase}
        onChangeText={setPhase}
        placeholder="Enter phase name (e.g. Engagement)"
        placeholderTextColor="#6b6b80"
        style={styles.input}
        onSubmitEditing={onBrowse}
        returnKeyType="search"
      />
      <Pressable style={styles.button} onPress={onBrowse}>
        <Text style={styles.buttonText}>Show keywords</Text>
      </Pressable>
      {keywords.map((keyword) => (
        <Text key={keyword} style={styles.keyword}>
          • {keyword}
        </Text>
      ))}
      {phase.trim() && keywords.length === 0 && (
        <Text style={styles.muted}>No keywords found for this phase in the sample corpus.</Text>
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
  keyword: {
    color: '#d0d0e0',
    fontSize: 16,
  },
  muted: {
    color: '#a0a0b0',
  },
});
