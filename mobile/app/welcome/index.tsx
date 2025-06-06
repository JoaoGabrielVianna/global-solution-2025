import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Image,
    SafeAreaView
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useRouter } from 'expo-router';

interface WelcomeScreenProps {
    onGetStarted: () => void;
}

export default function WelcomeScreen() {

    const router = useRouter();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

            <View style={styles.content}>
                {/* Header com ícone/logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoIcon}>🏔️</Text>
                    </View>
                    <Text style={styles.title}>Global Solution</Text>
                    <Text style={styles.subtitle}>Monitoramento de Riscos</Text>
                </View>

                {/* Descrição principal */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        Sistema inteligente para monitoramento de deslizamentos de terra.
                    </Text>
                    <Text style={styles.subDescription}>
                        Monitore umidade do solo, inclinação do terreno e receba alertas em tempo real.
                    </Text>
                </View>

                {/* Features highlights */}
                <View style={styles.featuresContainer}>
                    <View style={styles.feature}>
                        <View style={styles.featureIcon}>
                            <Text style={styles.featureEmoji}>📊</Text>
                        </View>
                        <Text style={styles.featureText}>Análise de Dados</Text>
                    </View>

                    <View style={styles.feature}>
                        <View style={styles.featureIcon}>
                            <Text style={styles.featureEmoji}>⚠️</Text>
                        </View>
                        <Text style={styles.featureText}>Alertas de Risco</Text>
                    </View>

                    <View style={styles.feature}>
                        <View style={styles.featureIcon}>
                            <Text style={styles.featureEmoji}>📱</Text>
                        </View>
                        <Text style={styles.featureText}>Monitoramento</Text>
                    </View>
                </View>

                {/* Botão de início */}
                <TouchableOpacity style={styles.startButton} onPress={() => { router.replace('/(root)/environment-data') }}>
                    <Text style={styles.startButtonText}>Começar Monitoramento</Text>
                </TouchableOpacity>

                {/* Footer */}
                <Text style={styles.footer}>
                    FIAP - Engenharia da Computação - 2025
                </Text>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
        justifyContent: 'space-between',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    logoIcon: {
        fontSize: 48,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.text,
        textAlign: 'center',
        fontWeight: '500',
    },
    descriptionContainer: {
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    description: {
        fontSize: 20,
        color: COLORS.text,
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 12,
        lineHeight: 28,
    },
    subDescription: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        lineHeight: 24,
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
    },
    feature: {
        alignItems: 'center',
        flex: 1,
    },
    featureIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureEmoji: {
        fontSize: 28,
    },
    featureText: {
        fontSize: 14,
        color: COLORS.text,
        textAlign: 'center',
        fontWeight: '500',
    },
    startButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        marginHorizontal: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    startButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    footer: {
        fontSize: 12,
        color: COLORS.placeholder,
        textAlign: 'center',
        marginTop: 16,
    },
});