import React, { useState } from 'react';
import { KeyboardAvoidingView, Text, View, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FileText, Plus, X } from 'phosphor-react-native';
import Toast from 'react-native-toast-message';

export default function App() {
  const [task, setTask] = useState({
    id: Date.now(),
    text: "",
    isCompleted: false,
    isEditing: false,
  });
  const [taskItems, setTaskItems] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setIsCreating(false);

    if (task.text.trim()) {
      setTaskItems([...taskItems, task]);
      setTask({
        id: Date.now(),
        text: "",
        isCompleted: false,
        isEditing: false,
      });
    }
  };

  const toggleTaskCompletion = (taskId) => {
    const targetTask = taskItems.find(task => task.id === taskId);
    if (targetTask && targetTask.isCompleted) {
      Toast.show({
        type: 'error',
        text1: 'Task already completed',
        text2: 'This task has already been marked as done'
      });
      return;
    }
    setTaskItems(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, isCompleted: !task.isCompleted, isEditing: false }
          : task
      )
    );
  };

  const handleTaskEdit = (taskId) => {
    setTaskItems(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, isEditing: !task.isEditing }
          : { ...task, isEditing: false }
      )
    );
  };

  const updateTaskText = (taskId, newText) => {
    setTaskItems(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, text: newText }
          : task
      )
    );
  };

  return (
    <SafeAreaView className="flex flex-col h-full w-full bg-black p-4 text-white">
      <Text className="text-white text-2xl mb-4">
        👋 Hey User
      </Text>

      <View className="p-3 bg-[#497bf1] rounded-2xl mt-3 flex flex-col justify-between items-center">
        <View className="flex flex-row w-full items-center justify-between">
          <Text className="text-white text-lg">
            Create New Task
          </Text>
          <TouchableOpacity
            className="bg-white p-1 rounded-full"
            onPress={() => setIsCreating(!isCreating)}
          >
            {isCreating ? (
              <X size={24} weight="bold" color="red" />
            ) : (
              <Plus size={24} weight="bold" color="blue" />
            )}
          </TouchableOpacity>
        </View>

        {isCreating && (
          <View className="px-3 flex flex-row w-full justify-between items-center bg-gray-300 rounded-2xl mt-4">
            <TextInput
              className="flex-1 py-2"
              placeholder="Enter your task here"
              value={task.text}
              onChangeText={text => setTask({ ...task, text })}
            />
            <TouchableOpacity onPress={handleAddTask}>
              <FileText size={24} weight="fill" color="blue" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView className="flex flex-col w-full bg-[#393939] mt-3 rounded-2xl p-3">
        {taskItems.length <= 0 ? (
          <View className="p-3 mt-3 rounded-2xl">
            <Text className="text-white text-lg text-center">
              🎯 No tasks, create a new one
            </Text>
          </View>
        ) : (
          taskItems.map(({ text, isEditing, isCompleted, id }) => (
            <View key={id} className="bg-blue-500/80 flex flex-row items-center p-3 rounded-2xl mb-3 justify-between">
              <View className="flex-row items-center flex-1">
                <TouchableOpacity
                  onPress={() => toggleTaskCompletion(id)}
                  className="mr-3"
                >
                  <Ionicons
                    name={isCompleted ? "checkbox" : "square-outline"}
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
                <ScrollView
                  horizontal={true}
                  className="flex-1"
                  showsHorizontalScrollIndicator={false}
                >
                  <TextInput
                    value={text}
                    editable={isEditing}
                    onChangeText={newText => updateTaskText(id, newText)}
                    className={`text-white font-semibold min-w-[150px] ${isCompleted ? 'line-through opacity-50' : ''}`}
                  />
                </ScrollView>
              </View>

              <TouchableOpacity
                className="bg-white p-2 rounded-2xl ml-2"
                onPress={() => handleTaskEdit(id)}
                disabled={isCompleted}
              >
                <Text style={{ opacity: isCompleted ? 0.5 : 1 }}>
                  {isEditing ? "Save 📗" : "Edit 🖋"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <Toast />
    </SafeAreaView>
  );
}