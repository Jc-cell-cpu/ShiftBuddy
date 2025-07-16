import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CalendarIcon from '@/assets/note-add.svg';
import { ms, s, vs } from '@/utils/scale';
import { router } from 'expo-router';
import CalendarComponent from '@/components/CalendarComponent';
import { Ionicons } from '@expo/vector-icons';

type StatusType = 'Pending' | 'Approved' | 'Rejected';

type Application = {
    title: string;
    date: string;
    status: StatusType;
    description: string;
};

const applications = {
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
    ],
} as const;

const statusStyles: Record<
    StatusType,
    { backgroundColor: string; color: string }
> = {
    Pending: { backgroundColor: '#FEEBCB', color: '#B7791F' },
    Approved: { backgroundColor: '#C6F6D5', color: '#276749' },
    Rejected: { backgroundColor: '#FED7D7', color: '#C53030' },
};

const formatDate = (date: Date): string =>
    `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;


const leaveTypes = ['Annual Leave', 'Medical Leave', 'Emergency Leave', 'Personal Leave'];

const LeaveScreen = () => {
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [dateRange, setDateRange] = useState<{ startDate: Date | null; endDate: Date | null }>({
        startDate: null,
        endDate: null,
    });



    const renderCard = (item: Application, index: number) => {
        const statusStyle = statusStyles[item.status];
        return (
            <View key={index} style={styles.card}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.date}>{item.date}</Text>
                <View style={styles.cardFooter}>
                    <Text style={styles.description}>{item.description}</Text>
                    <View
                        style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}
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
                    <TouchableOpacity
                        style={styles.calendarWrapper}
                        onPress={() => setShowApplyForm(prev => !prev)}
                    >
                        <View style={styles.calendaricon}>
                            <CalendarIcon width={20} height={20} />
                        </View>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={vs(20)}
            >
                <ScrollView keyboardShouldPersistTaps="handled">
                    {showApplyForm ? (
                        <>
                            <View style={styles.calendarExpanded}>
                                <CalendarComponent
                                    isExpanded
                                    selectedRange={dateRange}
                                    onDateChange={(date: Date) => {
                                        if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
                                            setDateRange({ startDate: date, endDate: null }); // start new range
                                        } else if (dateRange.startDate && !dateRange.endDate) {
                                            if (date >= dateRange.startDate) {
                                                setDateRange({ ...dateRange, endDate: date }); // complete range
                                            } else {
                                                // allow backward reset
                                                setDateRange({ startDate: date, endDate: null });
                                            }
                                        }
                                    }}
                                />


                            </View>

                            <View style={styles.applyCard}>
                                <Text style={styles.applyHeading}>Apply Leave</Text>

                                <TextInput
                                    placeholder="Select date range"
                                    placeholderTextColor="#999"
                                    style={styles.input}
                                    editable={false}
                                    value={
                                        dateRange.startDate
                                            ? dateRange.endDate
                                                ? `${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`
                                                : `${formatDate(dateRange.startDate)}`
                                            : ''
                                    }
                                />

                                <View style={styles.leaveTypeRow}>
                                    {leaveTypes.map((type) => (
                                        <TouchableOpacity
                                            key={type}
                                            style={[
                                                styles.leaveTypeButton,
                                                selectedLeaveType === type && styles.leaveTypeSelected,
                                            ]}
                                            onPress={() => setSelectedLeaveType(type)}
                                        >
                                            <Text>{type}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <View style={styles.timeRow}>
                                    <View style={styles.timeInputWithIcon}>
                                        <TextInput
                                            placeholder="Start time"
                                            placeholderTextColor="#999"
                                            style={styles.timeInput}
                                            value={startTime}
                                            onChangeText={setStartTime}
                                        />
                                        <Ionicons name="time-outline" size={ms(18)} color="#000" style={styles.timeIcon} />
                                    </View>
                                    <View style={styles.timeInputWithIcon}>
                                        <TextInput
                                            placeholder="End time"
                                            placeholderTextColor="#999"
                                            style={styles.timeInput}
                                            value={endTime}
                                            onChangeText={setEndTime}
                                        />
                                        <Ionicons name="time-outline" size={ms(18)} color="#000" style={styles.timeIcon} />
                                    </View>
                                </View>

                                <TextInput
                                    placeholder="Type the note here..."
                                    placeholderTextColor="#999"
                                    style={[styles.input, { height: vs(80), textAlignVertical: 'top' }]}
                                    multiline
                                    value={note}
                                    onChangeText={setNote}
                                />

                                <TouchableOpacity style={styles.applyButton}>
                                    <Text style={styles.applyButtonText}>Apply Leave</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <>
                        <View style={styles.scrollContent}>
                            <Text style={styles.sectionTitle}>Recent Application:</Text>
                            {applications.recent.map(renderCard)}

                            <Text style={[styles.sectionTitle, { marginTop: vs(10) }]}>
                                Past Application:
                            </Text>
                            {applications.past.map(renderCard)}
                        </View>
                        </>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

export default LeaveScreen;


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
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
        backgroundColor: 'rgba(240, 226, 240, 1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendaricon: {
        width: s(32),
        height: s(32),
        borderRadius: s(21),
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingHorizontal: s(18),
        paddingTop: vs(15),
        paddingBottom: vs(10),
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
    title: { fontSize: ms(15), fontWeight: '600', marginBottom: vs(4), color: '#000' },
    date: { fontSize: ms(12), color: '#4A5568' },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: vs(12),
    },
    description: { fontSize: ms(12), color: '#718096', flex: 1 },
    statusBadge: {
        paddingVertical: vs(4),
        paddingHorizontal: s(10),
        borderRadius: ms(12),
        marginLeft: s(8),
    },
    statusText: { fontSize: ms(12), fontWeight: '600' },

    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: s(24),
        borderTopRightRadius: s(24),
        padding: s(7),
        maxHeight: '95%',
    },
    formContainer: { marginTop: vs(12) },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: s(10),
        padding: s(12),
        marginBottom: vs(10),
    },
    leaveTypeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: s(8),
        marginBottom: vs(10),
    },
    leaveTypeButton: {
        backgroundColor: '#FBEAEF',
        paddingHorizontal: s(12),
        paddingVertical: vs(6),
        borderRadius: s(8),
    },
    calendarExpanded: {
        width: '100%',
        paddingHorizontal: s(1), // Optional space from edges
        marginTop: vs(10),
    },

    leaveTypeSelected: {
        backgroundColor: '#D2A5E3',
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: vs(10),
    },
    timeInput: {
        flex: 0.48,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: s(10),
        padding: s(12),
    },
    applyCard: {
        marginTop: vs(5),
        padding: s(16),
        backgroundColor: '#fff',
        borderRadius: s(24),
        borderWidth: 0.1,
        marginHorizontal: s(10), // ⬅️ Make this small for wide card
        width: '100%', // ⬅️ Ensure wider layout
        height: '100%',
        alignSelf: 'center', // ⬅️ Center inside ScrollView
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
    },

    applyHeading: {
        fontSize: ms(16),
        fontWeight: '600',
        marginBottom: vs(12),
        color: '#000',
    },
    timeInputWithIcon: {
        flex: 0.48,
        position: 'relative',
    },
    timeIcon: {
        position: 'absolute',
        right: s(10),
        top: vs(12),
    },
    applyButton: {
        backgroundColor: '#69417E',
        paddingVertical: vs(14),
        borderRadius: 100,
        alignItems: 'center',
        marginTop: vs(10),
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: ms(16),
    },

});
