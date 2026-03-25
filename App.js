import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  LayoutAnimation,
  UIManager
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Check, Trash2, Plus } from 'lucide-react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = ['#ef4444', '#f97316', '#22c55e', '#3b82f6', '#a855f7'];

export default function App() {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'לקנות מצרכים לשבת', color: '#f97316', completed: false },
    { id: '2', text: 'לסיים שיעורי בית במתמטיקה', color: '#ef4444', completed: false },
    { id: '3', text: 'לארגן את החדר', color: '#3b82f6', completed: true },
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[2]); // Default Green

  const addTask = () => {
    if (inputText.trim() === '') return;
    
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newTask = {
      id: Date.now().toString(),
      text: inputText,
      color: selectedColor,
      completed: false,
    };
    
    setTasks([newTask, ...tasks]);
    setInputText('');
  };

  const toggleTask = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTasks(tasks.filter(task => task.id !== id));
  };

  const pendingCount = tasks.filter(t => !t.completed).length;

  const renderItem = ({ item }) => (
    <View style={[
      styles.taskItem, 
      { borderRightColor: item.color },
      item.completed && styles.taskItemCompleted
    ]}>
      <TouchableOpacity 
        style={[
          styles.checkbox, 
          item.completed ? styles.checkboxChecked : { borderColor: '#d1d5db' }
        ]}
        onPress={() => toggleTask(item.id)}
      >
        {item.completed && <Check size={16} color="#fff" />}
      </TouchableOpacity>
      
      <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
        {item.text}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Trash2 size={20} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>המשימות שלי</Text>
        <Text style={styles.headerSubtitle}>
          {pendingCount === 0 ? 'הכל מוכן!' : `${pendingCount} משימות ממתינות`}
        </Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Add Task Section */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.addButton} onPress={addTask}>
              <Plus color="#fff" size={24} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="מה צריך לעשות?"
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={addTask}
              textAlign="right"
            />
          </View>
          
          <View style={styles.colorPickerRow}>
            <View style={styles.colorOptions}>
              {COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorCircle,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorCircle
                  ]}
                  onPress={() => setSelectedColor(color)}
                />
              ))}
            </View>
            <Text style={styles.colorPickerLabel}>בחר צבע:</Text>
          </View>
        </View>

        {/* Task List */}
        <View style={styles.listContainer}>
          {tasks.length === 0 ? (
            <View style={styles.emptyState}>
              <Check size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>אין משימות כרגע. איזה כיף!</Text>
            </View>
          ) : (
            <FlatList
              data={[...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#2563eb',
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#bfdbfe',
    textAlign: 'center',
    marginTop: 4,
  },
  keyboardView: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: '#fff',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginLeft: 10,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  addButton: {
    backgroundColor: '#2563eb',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorPickerLabel: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  colorOptions: {
    flexDirection: 'row',
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  selectedColorCircle: {
    borderWidth: 3,
    borderColor: '#e5e7eb',
    transform: [{ scale: 1.1 }],
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 20,
  },
  taskItem: {
    flexDirection: 'row-reverse', // RTL Support for basic elements
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 16,
    borderRightWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  taskItemCompleted: {
    opacity: 0.6,
    backgroundColor: '#f9fafb',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'right',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#9ca3af',
  },
  deleteButton: {
    padding: 5,
    marginRight: 10,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#9ca3af',
    fontSize: 16,
  }
});
