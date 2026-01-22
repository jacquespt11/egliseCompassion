// src/services/api/test-client.ts (temporaire - à supprimer après)
import { apiClient } from './client';

export async function testApiClient() {
    console.log('🧪 Test du client API Symfony...');

    try {
        // Test 1: Vérifier que l'URL de base est correcte
        console.log('Base URL:', apiClient['client'].defaults.baseURL);

        // Test 2: Vérifier les headers par défaut
        console.log('Headers:', apiClient['client'].defaults.headers.common);

        // Note: Nous ne pouvons pas tester les appels réels sans être authentifié
        // Ces tests viendront avec l'implémentation de useAuth

        console.log('✅ Client API configuré avec succès');
        return true;
    } catch (error) {
        console.error('❌ Erreur de configuration du client:', error);
        return false;
    }
}

// Exécutez ce test dans votre main.tsx temporairement pour vérifier