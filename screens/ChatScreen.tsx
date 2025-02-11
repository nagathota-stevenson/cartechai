import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';


const OPENAI_API_KEY = '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';

const ChatScreen = ({ carDetails }) => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! I am your AI mechanic. How can I assist you with your car?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');

  // Function to send a message and get a response from OpenAI
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInputText('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: `You are an AI mechanic. The car details are: ${JSON.stringify(carDetails)}.` },
            { role: 'user', content: inputText },
          ],
          max_tokens: 150,
        }),
      });

      const data = await response.json();
      const aiResponse = data.choices?.[0]?.message?.content.trim() || 'Sorry, I could not understand that.';

      setMessages((prevMessages) => [...prevMessages, { id: Date.now().toString(), text: aiResponse, sender: 'bot' }]);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { id: Date.now().toString(), text: 'Error: Unable to get a response.', sender: 'bot' }]);
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.botMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.container}>
        
        
        <FlatList data={messages} renderItem={renderItem} keyExtractor={(item) => item.id} style={styles.chatBox} />
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#0f0f0f',
    alignItems: 'center',

  },
  animation: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  chatBox: {
    flex: 1,
    width: '100%',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#1e88e5',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#444',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 10,
    color: '#fff',
    backgroundColor: '#222',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#1e88e5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
