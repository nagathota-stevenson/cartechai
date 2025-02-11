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

const CustomButton: React.FC<ButtonProps> = ({ title, onPress, backgroundColor = '#95ff77', color = '#2a2e2e', style, icon, iconColor = '#2a2e2e' }) => {
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor }, style]}
            onPress={onPress}
        >
            <View style={styles.content}>
                {icon && <Icon name={icon} color={iconColor} style={styles.icon} />} 
                <Text style={[styles.text, { color }]}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 350,
        padding: 16,
        borderRadius: 32,
        margin: 16,
        textAlign: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
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
        fontFamily: 'SpaceMono',
        fontSize: 16,
    },
});

export default CustomButton;
