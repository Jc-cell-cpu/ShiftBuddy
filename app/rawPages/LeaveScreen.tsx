import React from 'react';
import CalendarIcon from "@/assets/note-add.svg";
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ms, s, vs } from '@/utils/scale';
import { router } from 'expo-router';

type StatusType = 'Pending' | 'Approved' | 'Rejected';

type Application = {
    title: string;
    date: string;
    status: StatusType;
    description: string;
};

const applications: {
    recent: Application[];
    past: Application[];
} = {
    recent: [
        {
            title: 'Annual Leave',
            date: '1 Sep 2023 - 1 Sep 2023 (Full day)',
            status: 'Pending',
            description: 'Lörem ipsum nappt...',
        },
    ],
    past: [
        {
            title: 'Annual Leave',
            date: '1 Sep 2023 - 1 Sep 2023 (Half day)',
            status: 'Approved',
            description: 'Lörem ipsum nebåligt...',
        },
        {
            title: 'Annual Leave',
            date: '1 Sep 2023 - 1 Sep 2023 (Full day)',
            status: 'Rejected',
            description: 'Lörem ipsum nebåligt...',
        },
        {
            title: 'Annual Leave',
            date: '1 Sep 2023 - 1 Sep 2023 (Full day)',
            status: 'Approved',
            description: 'Lörem ipsum nebåligt...',
        },
        {
            title: 'Annual Leave',
            date: '1 Sep 2023 - 1 Sep 2023 (Full day)',
            status: 'Pending',
            description: 'Lörem ipsum nebåligt...',
        },
        {
            title: 'Annual Leave',
            date: '1 Sep 2023 - 1 Sep 2023 (Full day)',
            status: 'Rejected',
            description: 'Lörem ipsum nebåligt...',
        },
    ],
};

const statusStyles: Record<
    StatusType,
    { backgroundColor: string; color: string }
> = {
    Pending: {
        backgroundColor: '#FEEBCB',
        color: '#B7791F',
    },
    Approved: {
        backgroundColor: '#C6F6D5',
        color: '#276749',
    },
    Rejected: {
        backgroundColor: '#FED7D7',
        color: '#C53030',
    },
};

const LeaveScreen = () => {
    const renderCard = (item: Application, index: number) => {
        const statusStyle = statusStyles[item.status];

        return (
            <View key={index} style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.description}>{item.description}</Text>
                    <View
                        style={[
                            styles.statusBadge,
                            { backgroundColor: statusStyle.backgroundColor },
                        ]}
                    >
                        <Text style={[styles.statusText, { color: statusStyle.color }]}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            <LinearGradient colors={['#F6E8FF', '#FAF5FF']} style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={ms(22)} color="#000" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Leave</Text>

                    <TouchableOpacity style={styles.calendarWrapper}>
                        <View style={styles.calendaricon}>
                            <CalendarIcon
                                width={20}
                                height={20}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Recent Application:</Text>
                {applications.recent.map(renderCard)}

                <Text style={[styles.sectionTitle, { marginTop: vs(10) }]}>
                    Past Application:
                </Text>
                {applications.past.map(renderCard)}
            </ScrollView>
        </View>
    );
};

export default LeaveScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        marginTop: vs(35),
        paddingTop: vs(15),
        paddingBottom: vs(2),
        paddingHorizontal: s(20),

    },
    headerContent: {
        marginBottom: vs(15),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontFamily: 'InterSemiBold',
        fontSize: ms(18),
        fontWeight: '600',
        color: '#000',
    },
    backButton: {
        width: s(34),
        height: s(34),
        borderRadius: s(22),
        backgroundColor: '#fafcff',
        borderColor: '#ccc',
        borderWidth: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendarWrapper: {
        width: s(40),
        height: s(40),
        borderRadius: s(28),
        backgroundColor: 'rgba(240, 226, 240, 1)', // light pink outer circle
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendaricon: {
        width: s(32),
        height: s(32),
        borderRadius: s(21),
        backgroundColor: '#ffffff', // white inner circle
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: s(20),
        paddingTop: vs(20),
        paddingBottom: vs(40),
        borderTopLeftRadius: s(54),
        borderTopRightRadius: s(54),
    },
    sectionTitle: {
        fontSize: ms(14),
        fontWeight: '600',
        color: 'rgba(105, 65, 126, 1)',
        marginBottom: vs(10),
    },
    card: {
        backgroundColor: 'rgba(255, 248, 253, 0.7)',
        borderRadius: ms(18),
        padding: ms(16),
        width: '107%',
        marginLeft: -vs(7),
        marginBottom: vs(12),
    },
    title: {
        fontSize: ms(15),
        fontWeight: '600',
        marginBottom: vs(4),
        color: '#000',
    },
    date: {
        fontSize: ms(12),
        color: '#4A5568',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: vs(12),
    },
    description: {
        fontSize: ms(12),
        color: '#718096',
        flex: 1,
    },
    statusBadge: {
        paddingVertical: vs(4),
        paddingHorizontal: s(10),
        borderRadius: ms(12),
        marginLeft: s(8),
    },
    statusText: {
        fontSize: ms(12),
        fontWeight: '600',
    },
});
