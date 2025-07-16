import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms, s, vs } from '@/utils/scale';
import { router } from 'expo-router';

LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
const faqData = [
    {
        id: '1',
        question: 'How to create a account?',
        answer:
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
    },
    {
        id: '2',
        question: 'How to add a payment method by this app?',
        answer:
            'You can add a payment method by navigating to the Payments section under Settings and tapping “Add new method”.',
    },
    {
        id: '3',
        question: 'What Time Does The Stock Market Open?',
        answer: 'The stock market typically opens at 9:30 AM and closes at 4 PM EST.',
    },
    {
        id: '4',
        question: 'Is The Stock Market Open On Weekends?',
        answer: 'No, the stock market is closed on weekends.',
    },
    {
        id: '5',
        question: 'Is The Stock Market Open On Weekends?',
        answer: 'No, the stock market is closed on weekends.',
    },
    {
        id: '6',
        question: 'Is The Stock Market Open On Weekends?',
        answer: 'No, the stock market is closed on weekends.',
    },
    {
        id: '7',
        question: 'Is The Stock Market Open On Weekends?',
        answer: 'No, the stock market is closed on weekends.',
    },
    {
        id: '8',
        question: 'Is The Stock Market Open On Weekends?',
        answer: 'No, the stock market is closed on weekends.',
    },
    {
        id: '9',
        question: 'Is The Stock Market Open On Weekends?',
        answer: 'No, the stock market is closed on weekends.',
    },
    {
        id: '10',
        question: 'Is The Stock Market Open On Weekends?',
        answer: 'No, the stock market is closed on weekends.',
    },
];

const FaqScreen = () => {
    const insets = useSafeAreaInsets();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const handleToggle = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const renderItem = ({ item }: { item: typeof faqData[0] }) => {
        const isExpanded = item.id === expandedId;
        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => handleToggle(item.id)}
                activeOpacity={0.9}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.question}>{item.question}</Text>
                    <Ionicons
                        name={isExpanded ? 'remove' : 'add'}
                        size={ms(20)}
                        color="#69417E"
                    />
                </View>
                {isExpanded && <Text style={styles.answer}>{item.answer}</Text>}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={ms(22)} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FAQ</Text>
            </View>

            {/* Search Input */}
            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={ms(18)} color="#999" style={{ marginHorizontal: s(8) }} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#999"
                    style={styles.searchInput}
                />
                <Ionicons name="mic-outline" size={ms(18)} color="#999" style={{ marginHorizontal: s(8) }} />
            </View>

            {/* Top Questions Header */}
            <View style={styles.topRow}>
                <Text style={styles.topTitle}>Top Questions</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>View all</Text>
                </TouchableOpacity>
            </View>

            {/* FAQ List */}
            <FlatList
                data={faqData}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: vs(30) }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default FaqScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: s(16),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: s(16),
        gap: s(61),
        marginTop: vs(3),
    },
    backButton: {
        width: s(34),
        height: s(34),
        borderRadius: s(22),
        backgroundColor: "rgba(243, 243, 243, 1)",
        borderColor: "#ccc",
        borderWidth: 0.3,
        justifyContent: "center",
        alignItems: "center",
        marginRight: s(40),
        marginLeft: -s(13),
    },
    headerTitle: {
        fontFamily: "InterSemiBold",
        fontSize: ms(18),
        fontWeight: "600",
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F2',
        borderRadius: s(12),
        paddingVertical: vs(8),
        marginBottom: vs(12),
    },
    searchInput: {
        flex: 1,
        fontSize: ms(14),
        color: '#000',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    topTitle: {
        fontSize: ms(15),
        fontWeight: '600',
        color: '#000',
    },
    viewAll: {
        fontSize: ms(14),
        fontWeight: '500',
        color: '#69417E',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: s(12),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: s(14),
        marginBottom: vs(10),
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    question: {
        fontSize: ms(14),
        fontWeight: '500',
        flex: 1,
        color: '#000',
        marginRight: s(10),
    },
    answer: {
        marginTop: vs(8),
        fontSize: ms(13),
        color: '#666',
        lineHeight: ms(20),
    },
});
