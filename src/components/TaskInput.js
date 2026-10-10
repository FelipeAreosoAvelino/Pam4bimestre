import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/colors';

export default function TaskInput({ value, onChangeText, onAdd }) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: theme.card, color: theme.text, borderColor: theme.border },
        ]}
        placeholder="Digite uma nova tarefa..."
        placeholderTextColor={theme.textMuted}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onAdd}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={onAdd}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});