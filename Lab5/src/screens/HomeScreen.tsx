import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons/static';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SafeAreaView} from 'react-native-safe-area-context';
import ScreenHeader from '../components/ScreenHeader';
import {getServices} from '../services/api';
import {RootStackParamList, Service} from '../types';
import {formatPrice} from '../utils/format';

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'> & {
  onLogout: () => Promise<void>;
};

const HomeScreen = ({navigation, onLogout}: HomeScreenProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadServices = useCallback(async (refreshing = false) => {
    refreshing ? setIsRefreshing(true) : setIsLoading(true);
    setError('');

    try {
      setServices(await getServices());
    } catch (loadError) {
      setServices([]);
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load services.',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, [loadServices]),
  );

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Logout', style: 'destructive', onPress: onLogout},
    ]);
  };

  const renderService = ({item}: {item: Service}) => (
    <Pressable
      onPress={() =>
        navigation.navigate('ServiceDetail', {serviceId: item.id})
      }
      style={({pressed}) => [
        styles.serviceCard,
        pressed ? styles.serviceCardPressed : null,
      ]}>
      <Text numberOfLines={1} style={styles.serviceName}>
        {item.name}
      </Text>
      <Text style={styles.servicePrice}>{formatPrice(item.price)}</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScreenHeader
        title="HUY"
        right={
          <Pressable
            accessibilityLabel="Logout"
            hitSlop={8}
            onPress={confirmLogout}
            style={styles.headerButton}>
            <Ionicons name="person-circle" size={28} color="#FFFFFF" />
          </Pressable>
        }
      />

      <View style={styles.logoContainer}>
        <Ionicons name="flower-outline" size={42} color="#F45170" />
        <Text style={styles.logoText}>KAMI SPA</Text>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Danh sách dịch vụ</Text>
        <Pressable
          accessibilityLabel="Add service"
          onPress={() => navigation.navigate('AddService')}
          style={styles.addButton}>
          <Ionicons name="add" size={27} color="#FFFFFF" />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color="#F45170" size="large" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={
            services.length === 0 ? styles.emptyList : styles.list
          }
          data={services}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <View style={styles.centerState}>
              <Ionicons name="cut-outline" size={44} color="#B8B8C0" />
              <Text style={styles.stateTitle}>
                {error ? 'Unable to load services' : 'No services yet'}
              </Text>
              <Text style={styles.stateText}>
                {error || 'Tap the + button to create the first service.'}
              </Text>
              {error ? (
                <Pressable onPress={() => loadServices()} style={styles.retry}>
                  <Text style={styles.retryText}>Try again</Text>
                </Pressable>
              ) : null}
            </View>
          }
          refreshControl={
            <RefreshControl
              colors={['#F45170']}
              onRefresh={() => loadServices(true)}
              refreshing={isRefreshing}
              tintColor="#F45170"
            />
          }
          renderItem={renderService}
        />
      )}

      <View style={styles.bottomBar}>
        {([
          ['home', 'Home'],
          ['card-outline', 'Transection'],
          ['people-outline', 'Customer'],
          ['settings-outline', 'Setting'],
        ] as const).map(([icon, label], index) => (
          <View key={label} style={styles.bottomItem}>
            <Ionicons
              name={icon}
              size={23}
              color={index === 0 ? '#F45170' : '#909098'}
            />
            <Text
              style={[
                styles.bottomLabel,
                index === 0 ? styles.bottomLabelActive : null,
              ]}>
              {label}
            </Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#FFFFFF'},
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    height: 83,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    marginLeft: 6,
    color: '#F45170',
    fontSize: 25,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  sectionHeader: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  sectionTitle: {color: '#222222', fontSize: 16, fontWeight: '700'},
  addButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#F45170',
  },
  list: {paddingHorizontal: 16, paddingBottom: 16},
  emptyList: {flexGrow: 1},
  serviceCard: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#DEDEE3',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  serviceCardPressed: {backgroundColor: '#FFF5F7'},
  serviceName: {
    flex: 1,
    marginRight: 12,
    color: '#24242A',
    fontSize: 14,
    fontWeight: '700',
  },
  servicePrice: {color: '#4A4A50', fontSize: 13},
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  stateTitle: {
    marginTop: 10,
    color: '#33333A',
    fontSize: 16,
    fontWeight: '700',
  },
  stateText: {
    marginTop: 6,
    color: '#74747C',
    textAlign: 'center',
    lineHeight: 20,
  },
  retry: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 6,
    backgroundColor: '#F45170',
  },
  retryText: {color: '#FFFFFF', fontWeight: '700'},
  bottomBar: {
    height: 65,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#ECECF0',
    backgroundColor: '#FFFFFF',
  },
  bottomItem: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  bottomLabel: {marginTop: 3, color: '#909098', fontSize: 10},
  bottomLabelActive: {color: '#F45170'},
});

export default HomeScreen;
