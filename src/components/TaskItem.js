import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/colors';

export default function TaskItem({ task, onToggle, onRemove }) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity style={styles.left} onPress={() => onToggle(task.id)} activeOpacity={0.7}>
        <Ionicons
          name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={task.completed ? theme.success : theme.textMuted}
        />
        <Text
          style={[
            styles.title,
            { color: task.completed ? theme.textMuted : theme.text },
            task.completed && styles.completed,
          ]}
        >
          {task.title}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onRemove(task.id)} hitSlop={10}>
        <Ionicons name="trash-outline" size={22} color={theme.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
    flexShrink: 1,
  },
  completed: {
    textDecorationLine: 'line-through',
  },
});