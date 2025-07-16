// components/StatusModal.tsx
import React, { useEffect, useRef } from 'react';
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    Animated,
    StyleSheet,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from '@expo/vector-icons';
import { ms, s, vs } from '@/utils/scale';

type StatusModalProps = {
    visible: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    onClose: () => void;
};

const StatusModal: React.FC<StatusModalProps> = ({
                                                     visible,
                                                     type,
                                                     title,
                                                     message,
                                                     onClose,
                                                 }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const isSuccess = type === 'success';

    return (
        <Modal visible={visible} animationType="fade" transparent>
            <BlurView style={styles.modalContainer} blurType="light" blurAmount={4}>
                <Animated.View
                    style={[styles.modalContent, { opacity: fadeAnim }]}
                >
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={s(15)} color="#080808" />
                    </TouchableOpacity>

                    <Ionicons
                        name={isSuccess ? 'checkmark' : 'close'}
                        size={34}
                        color={isSuccess ? '#7F4E2D' : '#B3261E'}
                        style={[
                            styles.icon,
                            { backgroundColor: isSuccess ? '#FBE1D1' : '#FCD7D7' },
                        ]}
                    />

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                </Animated.View>
            </BlurView>
        </Modal>
    );
};

export default StatusModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: s(16),
        padding: s(20),
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: s(10),
        right: s(10),
        zIndex: 10,
    },
    icon: {
        padding: 14,
        borderRadius: 99,
        marginBottom: vs(12),
    },
    title: {
        fontSize: ms(16),
        fontWeight: '600',
        marginBottom: vs(8),
        color: '#000',
    },
    message: {
        textAlign: 'center',
        fontSize: ms(13),
        color: '#444',
        marginBottom: vs(8),
    },
});
