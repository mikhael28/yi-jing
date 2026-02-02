import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Animated,
  Switch,
} from 'react-native'; 
import { styles } from '../index';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame, Clock, X, Palette, Circle, Trash2, Volume2 } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { VoiceSettings } from './voice-settings';

export interface SettingsDrawerProps {
    settingsVisible: boolean;
    settingsTranslateX: Animated.Value;
    closeSettings: () => void;
    insets: { top: number; bottom: number; left: number; right: number };
    onDeleteAllJournalRecords?: () => void;
}
    

export function SettingsDrawer(props: SettingsDrawerProps) {
  const { colors, isDark, toggleTheme, animationStyle, toggleAnimationStyle } = useTheme();
  const [settingsActiveTab, setSettingsActiveTab] = React.useState<'style' | 'voice' | 'history'>('style');

    
  const renderSettingsTabContent = () => {
    switch (settingsActiveTab) {
      case 'style':
        return (
          <ScrollView style={styles.tabContent} contentContainerStyle={styles.tabContentContainer}>
            <Text style={[styles.tabTitle, { color: colors.text }]}>Style Settings</Text>
            <Text style={[styles.tabDescription, { color: colors.textSecondary }]}>
              Customize the appearance of your Oracle experience.
            </Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Toggle between light and dark themes
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={isDark ? colors.primaryText : colors.text}
                testID="theme-switch"
              />
            </View>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Animation Style</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {animationStyle === 'torch' ? 'Divine Torch - Mystical oracle energy' : 'Prometheus Flame - Sacred fire of knowledge'}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.animationToggle, { backgroundColor: colors.surface, borderColor: colors.border }]}
                onPress={toggleAnimationStyle}
                activeOpacity={0.7}
              >
                {animationStyle === 'torch' ? (
                  <Circle size={20} color={colors.text} />
                ) : (
                  <Flame size={20} color={colors.text} />
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        );
      case 'voice':
        return <VoiceSettings />;
      case 'history':
        return (
          <ScrollView style={styles.tabContent} contentContainerStyle={styles.tabContentContainer}>
            <Text style={[styles.tabTitle, { color: colors.text }]}>History</Text>
            <Text style={[styles.tabDescription, { color: colors.textSecondary }]}>
              Manage your Oracle consultation history.
            </Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: colors.text }]}>Clear All Journal Records</Text>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Permanently delete all consultation history from your journal
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.animationToggle, { backgroundColor: '#ff4444', borderColor: '#ff6666' }]}
                onPress={props.onDeleteAllJournalRecords}
                activeOpacity={0.7}
              >
                <Trash2 size={20} color="#ffffff" />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.historyPlaceholder, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Clock size={48} color={colors.textSecondary} />
              <Text style={[styles.historyPlaceholderText, { color: colors.textSecondary }]}>
                Access your journal from the main drawer to view consultation history
              </Text>
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };
    return(
        <>
          {props.settingsVisible && (
                <Animated.View
                  style={[
                    styles.settingsDrawer,
                    {
                      transform: [{ translateX: props.settingsTranslateX }],
                    },
                  ]}
                >
                  <LinearGradient
                    colors={isDark ? ['#000000', '#1a1a1a', '#000000'] : ['#ffffff', '#f5f5f5', '#ffffff']}
                    style={StyleSheet.absoluteFillObject}
                  />
                  
                  {/* Settings Header */}
                  <View style={[styles.drawerHeader, { paddingTop: props.insets.top + 20, borderBottomColor: colors.border }]}>
                    <Text style={[styles.drawerTitle, { color: colors.text }]}>Settings</Text>
                    <TouchableOpacity onPress={props.closeSettings} style={[styles.closeButton, { backgroundColor: colors.surface }]}>
                      <X size={24} color={colors.text} />
                    </TouchableOpacity>
                  </View>
        
                  {/* Settings Tab Navigation */}
                  <View style={styles.tabNavigation}>
                    <TouchableOpacity
                      style={[styles.tab, { backgroundColor: colors.surface }, settingsActiveTab === 'style' && { backgroundColor: colors.primary }]}
                      onPress={() => setSettingsActiveTab('style')}
                    >
                      <Palette size={20} color={settingsActiveTab === 'style' ? colors.primaryText : colors.text} />
                      <Text style={[styles.tabText, { color: colors.text }, settingsActiveTab === 'style' && { color: colors.primaryText }]}>Style</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.tab, { backgroundColor: colors.surface }, settingsActiveTab === 'voice' && { backgroundColor: colors.primary }]}
                      onPress={() => setSettingsActiveTab('voice')}
                    >
                      <Volume2 size={20} color={settingsActiveTab === 'voice' ? colors.primaryText : colors.text} />
                      <Text style={[styles.tabText, { color: colors.text }, settingsActiveTab === 'voice' && { color: colors.primaryText }]}>Voice</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.tab, { backgroundColor: colors.surface }, settingsActiveTab === 'history' && { backgroundColor: colors.primary }]}
                      onPress={() => setSettingsActiveTab('history')}
                    >
                      <Clock size={20} color={settingsActiveTab === 'history' ? colors.primaryText : colors.text} />
                      <Text style={[styles.tabText, { color: colors.text }, settingsActiveTab === 'history' && { color: colors.primaryText }]}>History</Text>
                    </TouchableOpacity>
                  </View>
        
                  {/* Settings Tab Content */}
                  {renderSettingsTabContent()}
                </Animated.View>
              )}
              </>
    )
}

