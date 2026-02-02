/**
 * React Native GraphRAG API Client
 * 
 * GraphRAG integration for the Oracle app
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// Configuration
const API_BASE_URL = 'http://localhost:8000'; // Change this to your server's IP/domain

interface ServerStatus {
  graphrag_available: boolean;
  ragtest_exists: boolean;
}

interface QueryResponse {
  success: boolean;
  response?: string;
  method?: string;
  execution_time_seconds?: number;
  timestamp?: string;
  error?: string;
}

// GraphRAG API Client Class
class GraphRAGClient {
  private baseUrl: string;
  
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async healthCheck(): Promise<ServerStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Health check failed: ${error.message}`);
    }
  }

  async getMethods(): Promise<{ methods: string[] }> {
    try {
      const response = await fetch(`${this.baseUrl}/methods`);
      return await response.json();
    } catch (error: any) {
      throw new Error(`Get methods failed: ${error.message}`);
    }
  }

  async query(queryText: string, method: string = 'global'): Promise<QueryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: queryText,
          method: method,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || `HTTP ${response.status}`);
      }

      return data;
    } catch (error: any) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }
}

// React Native Component
const GraphRAGComponent = () => {
  const { colors } = useTheme();
  const [client] = useState(() => new GraphRAGClient());
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState('global');
  const [response, setResponse] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);

  const checkServerHealth = useCallback(async () => {
    try {
      const health = await client.healthCheck();
      setServerStatus(health);
    } catch (error) {
      console.error('Health check error:', error);
      Alert.alert('Server Error', 'Failed to connect to GraphRAG server');
    }
  }, [client]);

  const loadAvailableMethods = useCallback(async () => {
    try {
      const methods = await client.getMethods();
      setAvailableMethods(methods.methods || []);
    } catch (error: unknown) {
      console.error('Load methods error:', error);
    }
  }, [client]);

  // Check server health on component mount
  useEffect(() => {
    checkServerHealth();
    loadAvailableMethods();
  }, [checkServerHealth, loadAvailableMethods]);

  const executeQuery = async () => {
    if (!query.trim()) {
      Alert.alert('Invalid Input', 'Please enter a query');
      return;
    }

    setLoading(true);
    setResponse(null);

    try {
      const result = await client.query(query, method);
      setResponse(result);
    } catch (error) {
      console.error('Query error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResponse(null);
    setQuery('');
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>GraphRAG Knowledge Base</Text>

      {/* Server Status */}
      <View style={[styles.statusContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.statusLabel, { color: colors.text }]}>Server Status:</Text>
        {serverStatus ? (
          <View>
            <Text style={[styles.statusText, { color: serverStatus.graphrag_available ? '#10b981' : '#ef4444' }]}>
              {serverStatus.graphrag_available ? '✅ Connected' : '❌ Disconnected'}
            </Text>
            <Text style={[styles.statusDetail, { color: colors.textSecondary }]}>
              GraphRAG: {serverStatus.graphrag_available ? 'Available' : 'Not Available'}
            </Text>
            <Text style={[styles.statusDetail, { color: colors.textSecondary }]}>
              Data: {serverStatus.ragtest_exists ? 'Ready' : 'Missing'}
            </Text>
          </View>
        ) : (
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>Checking...</Text>
        )}
      </View>

      {/* Query Method Selection */}
      <View style={styles.methodContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Query Method:</Text>
        <View style={styles.methodButtons}>
          {availableMethods.map((m) => (
            <TouchableOpacity
              key={m}
              style={[
                styles.methodButton, 
                { backgroundColor: colors.surface, borderColor: colors.border },
                method === m && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setMethod(m)}
            >
              <Text style={[
                styles.methodButtonText, 
                { color: colors.text },
                method === m && { color: colors.primaryText, fontWeight: 'bold' }
              ]}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Query Input */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Your Question:</Text>
        <TextInput
          style={[styles.textInput, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
          value={query}
          onChangeText={setQuery}
          placeholder="Enter your question here..."
          placeholderTextColor={colors.textSecondary}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button, 
            { backgroundColor: colors.primary },
            (loading || !serverStatus?.graphrag_available) && { opacity: 0.5 }
          ]}
          onPress={executeQuery}
          disabled={loading || !serverStatus?.graphrag_available}
        >
          {loading ? (
            <ActivityIndicator color={colors.primaryText} />
          ) : (
            <Text style={[styles.buttonText, { color: colors.primaryText }]}>Ask GraphRAG</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]}
          onPress={clearResults}
        >
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Response Display */}
      {response && (
        <View style={[styles.responseContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.responseTitle, { color: colors.text }]}>Response:</Text>
          {response.success ? (
            <View>
              <ScrollView style={styles.responseScroll}>
                <Text style={[styles.responseText, { color: colors.text }]}>{response.response}</Text>
              </ScrollView>
              <View style={[styles.responseMetadata, { borderTopColor: colors.border }]}>
                <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                  Method: {response.method} | Time: {response.execution_time_seconds?.toFixed(2)}s
                </Text>
                <Text style={[styles.metadataText, { color: colors.textSecondary }]}>
                  {response.timestamp ? new Date(response.timestamp).toLocaleString() : ''}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.errorText, { color: '#ef4444' }]}>
              Error: {response.error || 'Unknown error occurred'}
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  statusContainer: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusDetail: {
    fontSize: 12,
  },
  methodContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  methodButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  methodButtonText: {
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  responseContainer: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
  },
  responseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  responseScroll: {
    maxHeight: 300,
    marginBottom: 10,
  },
  responseText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  responseMetadata: {
    borderTopWidth: 1,
    paddingTop: 10,
  },
  metadataText: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 14,
  },
});

export default GraphRAGComponent;
