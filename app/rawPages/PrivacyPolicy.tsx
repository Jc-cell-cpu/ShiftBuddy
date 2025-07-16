import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ms, s, vs } from '@/utils/scale';

const PrivacyPolicy = () => {
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
                <Text style={styles.headerTitle}>Privacy Policy</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionTitle}>1. Introduction</Text>
                <Text style={styles.paragraph}>
                    Welcome to our Privacy Policy. Your privacy is critically important to us. This policy outlines how we collect, use, disclose, and safeguard your information when you use our mobile application. Please read this policy carefully to understand our practices regarding your personal data.
                </Text>

                <Text style={styles.sectionTitle}>2. Types of Data We Collect</Text>
                <Text style={styles.paragraph}>
                    We collect limited personal data required to operate core features of our application. This includes:
                    {'\n'}• Photos you choose to upload from your camera or gallery
                    {'\n'}• Audio input for speech-to-text conversion
                    {'\n'}• Device information such as device type, operating system, and unique device identifiers
                    {'\n'}• Usage data including app interactions, features accessed, and session duration
                    {'\n'}• Location data (optional, with your explicit consent) to provide location-based features
                </Text>

                <Text style={styles.sectionTitle}>3. Use of Your Personal Data</Text>
                <Text style={styles.paragraph}>
                    The data collected is used exclusively for the following purposes:
                    {'\n'}• To allow users to upload images via camera or gallery
                    {'\n'}• To convert voice input into text using speech-to-text
                    {'\n'}• To enhance user experience and app functionality
                    {'\n'}• To analyze app usage for improving performance and user interface
                    {'\n'}• To provide personalized content or recommendations (where applicable)
                    {'\n'}• To troubleshoot technical issues and ensure app stability
                    {'\n\n'}
                    We do not share, sell, or transfer your personal data to third parties except as described in this policy or with your explicit consent.
                </Text>

                <Text style={styles.sectionTitle}>4. Access to Device Permissions</Text>
                <Text style={styles.paragraph}>
                    Our app may request permission for:
                    {'\n'}• Camera – for capturing and uploading photos
                    {'\n'}• Microphone – for voice input through speech-to-text
                    {'\n'}• Gallery – for selecting existing images to upload
                    {'\n'}• Location – for optional location-based features (with your consent)
                    {'\n'}• Notifications – to send you updates or alerts about app features
                    {'\n\n'}
                    You can manage these permissions at any time through your device settings.
                </Text>

                <Text style={styles.sectionTitle}>5. Data Storage and Retention</Text>
                <Text style={styles.paragraph}>
                    Any photos, voice input, or other data used during your session are processed temporarily and are not stored unless required by a specific app feature. We retain usage data and device information for analytics purposes for a period not exceeding 12 months, after which it is anonymized or deleted. Data is stored securely using industry-standard encryption protocols.
                </Text>

                <Text style={styles.sectionTitle}>6. Data Security</Text>
                <Text style={styles.paragraph}>
                    We implement robust security measures to protect your data, including:
                    {'\n'}• Encryption of data in transit and at rest
                    {'\n'}• Regular security audits and vulnerability assessments
                    {'\n'}• Access controls to limit data access to authorized personnel only
                    {'\n\n'}
                    Despite these measures, no method of transmission over the internet or electronic storage is 100% secure. We strive to protect your data but cannot guarantee absolute security.
                </Text>

                <Text style={styles.sectionTitle}>7. Your Consent</Text>
                <Text style={styles.paragraph}>
                    By using this app, you agree to the collection and usage of your data as described in this policy. You can revoke access to any permissions at any time via your device settings. If you choose to revoke permissions, some features of the app may become unavailable.
                </Text>

                <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
                <Text style={styles.paragraph}>
                    Our app may integrate with third-party services for analytics or crash reporting (e.g., Firebase Analytics, Sentry). These services may collect anonymized data to help us improve the app. We ensure that any third-party providers comply with strict data protection standards and do not use your personal data for purposes other than those specified.
                </Text>

                <Text style={styles.sectionTitle}>9. Children’s Privacy</Text>
                <Text style={styles.paragraph}>
                    Our app is not intended for use by individuals under the age of 13. We do not knowingly collect personal data from children under 13. If we become aware that a child under 13 has provided us with personal data, we will take steps to delete such information.
                </Text>

                <Text style={styles.sectionTitle}>10. International Data Transfers</Text>
                <Text style={styles.paragraph}>
                    Your data may be transferred to and processed in countries other than your own. We ensure that any international data transfers comply with applicable data protection laws, including GDPR where relevant, and that appropriate safeguards are in place.
                </Text>

                <Text style={styles.sectionTitle}>11. Changes to This Privacy Policy</Text>
                <Text style={styles.paragraph}>
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes through the app or via email. Your continued use of the app after such changes constitutes your acceptance of the updated policy.
                </Text>

                <Text style={styles.sectionTitle}>12. Contact Us</Text>
                <Text style={styles.paragraph}>
                    For any questions or concerns about this Privacy Policy or our data practices, please contact us at support@shiftbuddy.com or write to us at:
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

export default PrivacyPolicy;

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
        marginRight: s(12),
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