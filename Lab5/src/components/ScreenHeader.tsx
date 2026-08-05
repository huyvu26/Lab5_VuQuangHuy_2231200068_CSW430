import React, {ReactNode} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons/static';
import {SafeAreaView} from 'react-native-safe-area-context';

type ScreenHeaderProps = {
  title: string;
  onBack?: () => void;
  right?: ReactNode;
};

const ScreenHeader = ({title, onBack, right}: ScreenHeaderProps) => {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={[styles.side, !onBack ? styles.emptySide : null]}>
          {onBack ? (
            <Pressable
              accessibilityLabel="Go back"
              hitSlop={10}
              onPress={onBack}
              style={styles.iconButton}>
              <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
            </Pressable>
          ) : null}
        </View>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>

        <View style={[styles.side, styles.right]}>{right}</View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F45170',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F45170',
  },
  side: {
    width: 56,
    alignItems: 'center',
  },
  emptySide: {
    width: 16,
  },
  right: {
    justifyContent: 'center',
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
  },
});

export default ScreenHeader;
