import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ms, s, vs } from '@/utils/scale';

const TermsAndCondition = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={s(24)} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms and Conditions</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>Introduction</Text>
                <Text style={styles.paragraph}>
                    Welcome to our Terms and Conditions. These terms govern your use of our mobile application. By accessing or using the app, you agree to be bound by these terms. If you do not agree with any part of these terms, you must not use the app.
                </Text>

                <Text style={styles.sectionTitle}>Use of the Application</Text>
                <Text style={styles.paragraph}>
                    You are granted a non-exclusive, non-transferable, revocable license to use the app for personal, non-commercial purposes. You agree not to use the app for any unlawful purpose, to disrupt or interfere with the app’s functionality, or to attempt to gain unauthorized access to any systems or networks connected to the app.
                </Text>

                <Text style={styles.sectionTitle}>User Responsibilities</Text>
                <Text style={styles.paragraph}>
                    You are responsible for maintaining the confidentiality of any account credentials and for all activities that occur under your account. You agree to provide accurate and complete information when using the app and to promptly update any changes to your information.
                </Text>

                <Text style={styles.sectionTitle}>Content and Intellectual Property</Text>
                <Text style={styles.paragraph}>
                    All content provided through the app, including text, graphics, logos, and software, is the property of Example Inc. or its licensors and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without prior written consent from Example Inc.
                </Text>

                <Text style={styles.sectionTitle}>User-Generated Content</Text>
                <Text style={styles.paragraph}>
                    If you upload photos, audio, or other content to the app, you grant Example Inc. a non-exclusive, worldwide, royalty-free license to use, store, and process that content solely for the purpose of providing and improving the app’s functionality. You represent that you have all necessary rights to the content you upload.
                </Text>

                <Text style={styles.sectionTitle}>Prohibited Activities</Text>
                <Text style={styles.paragraph}>
                    You agree not to engage in activities such as uploading malicious code, attempting to reverse-engineer the app, or using the app to transmit harmful or offensive content. Any such activities may result in immediate termination of your access to the app.
                </Text>

                <Text style={styles.sectionTitle}>Third-Party Services</Text>
                <Text style={styles.paragraph}>
                    The app may integrate with third-party services, such as analytics or crash reporting tools. These services are subject to their own terms and conditions, and Example Inc. is not responsible for the practices of these third parties.
                </Text>

                <Text style={styles.sectionTitle}>Limitation of Liability</Text>
                <Text style={styles.paragraph}>
                    To the fullest extent permitted by law, Example Inc. shall not be liable for any indirect, incidental, or consequential damages arising from your use of the app. The app is provided “as is” without warranties of any kind, express or implied, including warranties of merchantability or fitness for a particular purpose.
                </Text>

                <Text style={styles.sectionTitle}>Termination</Text>
                <Text style={styles.paragraph}>
                    We reserve the right to suspend or terminate your access to the app at our discretion, with or without notice, if you violate these terms or for any other reason. Upon termination, your right to use the app will cease immediately.
                </Text>

                <Text style={styles.sectionTitle}>Changes to These Terms</Text>
                <Text style={styles.paragraph}>
                    We may update these Terms and Conditions from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes through the app or via email. Your continued use of the app after such changes constitutes your acceptance of the updated terms.
                </Text>

                <Text style={styles.sectionTitle}>Governing Law</Text>
                <Text style={styles.paragraph}>
                    These terms shall be governed by and construed in accordance with the laws of the state of Tech City, without regard to its conflict of law principles. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Tech City.
                </Text>

                <Text style={styles.sectionTitle}>Contact Us</Text>
                <Text style={styles.paragraph}>
                    For any questions or concerns about these Terms and Conditions, please contact us at support@shiftbuddy.com or write to us at:
                    {'\n\n'}
                    ShiftBuddy Inc.
                    {'\n'}
                    123 Privacy Lane, Suite 100
                    {'\n'}
                    Tech City, TC 12345
                </Text>
            </ScrollView>
        </View>
    );
};

export default TermsAndCondition;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
        marginRight: -s(12),
    },
    headerTitle: {
        fontFamily: "InterSemiBold",
        fontSize: ms(18),
        fontWeight: "600",
    },
    scrollContainer: {
        paddingHorizontal: s(16),
        paddingBottom: vs(32),
    },
    sectionTitle: {
        fontSize: ms(15),
        fontWeight: '600',
        color: '#333',
        marginTop: vs(18),
        marginBottom: vs(6),
    },
    paragraph: {
        fontSize: ms(14),
        color: '#555',
        lineHeight: ms(22),
        marginBottom: vs(10),
    },
});