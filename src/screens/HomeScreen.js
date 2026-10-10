import { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import TaskInput from '../components/TaskInput';
import TaskItem from '../components/TaskItem';
import { useTheme } from '../theme/colors';

const STORAGE_KEY = '@todo_tasks';

export default function HomeScreen({ navigation }) {
  const theme = useTheme();
  const [text, setText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Carrega as tarefas salvas ao abrir o app
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setTasks(JSON.parse(saved));
      } catch (e) {
        console.log('Erro ao carregar tarefas', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Salva sempre que a lista mudar (só depois do carregamento inicial)
  useEffect(() => {
    if (!loaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch((e) =>
      console.log('Erro ao salvar tarefas', e)
    );
  }, [tasks, loaded]);

  function addTask() {
    const title = text.trim();
    if (!title) {
      Alert.alert('Atenção', 'Digite uma tarefa antes de adicionar.');
      return;
    }
    setTasks((prev) => [{ id: Date.now().toString(), title, completed: false }, ...prev]);
    setText('');
  }

  function toggleTask(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  function removeTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Minhas Tarefas</Text>
          <Text style={[styles.subtitle, { color: theme.textMuted }]}>
            {tasks.length} no total · {completedCount} concluída(s)
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Perfil')} hitSlop={10}>
          <Ionicons name="person-circle-outline" size={36} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <TaskInput value={text} onChangeText={setText} onAdd={addTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleTask} onRemove={removeTask} />
        )}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: theme.textMuted }]}>
            Nenhuma tarefa ainda. Adicione a primeira!
          </Text>
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  list: {
    paddingBottom: 30,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});