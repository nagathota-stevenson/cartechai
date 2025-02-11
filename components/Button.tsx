import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, View } from 'react-native';
import { Icon } from 'react-native-elements'; // Assuming you're using react-native-elements for icons

interface ButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    backgroundColor?: string;
    color?: string;
    style?: object;
    icon?: string; // Add icon prop
    iconColor?: string; // Add icon color prop
}

const CustomButton: React.FC<ButtonProps> = ({ title, onPress, backgroundColor = '#007BFF', color = '#FFFFFF', style, icon, iconColor = '#FFFFFF' }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }, style]}
            onPress={onPress}
        >
            <View style={styles.content}>
                {icon && <Icon name={icon} color={iconColor} style={styles.icon} />} {/* Render icon if provided */}
                <Text style={[styles.text, { color }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderColor: '#ccc',
        padding: 16,
        borderRadius: 16,
        width: '90%',
        marginBottom: 16,
        backgroundColor: '#fff',
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
    },
});

export default CustomButton;