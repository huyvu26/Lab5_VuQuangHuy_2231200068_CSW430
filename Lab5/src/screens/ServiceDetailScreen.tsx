import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons/static';
import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import ScreenHeader from '../components/ScreenHeader';
import {deleteService, getService} from '../services/api';
import {RootStackParamList, Service} from '../types';
import {formatDateTime, formatPrice} from '../utils/format';

type Props = NativeStackScreenProps<RootStackParamList, 'ServiceDetail'>;

const ServiceDetailScreen = ({navigation, route}: Props) => {
  const {serviceId} = route.params;
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const loadService = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      setService(await getService(serviceId));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load service details.',
      );
    } finally {
      setIsLoading(false);
    }
  }, [serviceId]);

  useFocusEffect(
    useCallback(() => {
      loadService();
    }, [loadService]),
  );

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteService(serviceId);
      Alert.alert('Success', 'Service deleted successfully.', [
        {text: 'OK', onPress: () => navigation.popToTop()},
      ]);
    } catch (deleteError) {
      Alert.alert(
        'Unable to delete service',
        deleteError instanceof Error ? deleteError.message : 'Please try again.',
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Warning',
      'Are you sure you want to remove this service? This operation cannot be returned.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', style: 'destructive', onPress: handleDelete},
      ],
    );
  };

  const menu = service ? (
    <Menu>
      <MenuTrigger
        customStyles={{triggerWrapper: styles.menuTrigger}}
        disabled={isDeleting}>
        {isDeleting ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        )}
      </MenuTrigger>
      <MenuOptions customStyles={{optionsContainer: styles.menuOptions}}>
        <MenuOption
          onSelect={() => navigation.navigate('EditService', {service})}>
          <View style={styles.menuRow}>
            <Ionicons name="create-outline" size={20} color="#33333A" />
            <Text style={styles.menuText}>Edit</Text>
          </View>
        </MenuOption>
        <MenuOption onSelect={confirmDelete}>
          <View style={styles.menuRow}>
            <Ionicons name="trash-outline" size={20} color="#D93025" />
            <Text style={[styles.menuText, styles.deleteText]}>Delete</Text>
          </View>
        </MenuOption>
      </MenuOptions>
    </Menu>
  ) : null;

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Service detail"
        onBack={navigation.goBack}
        right={menu}
      />

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color="#F45170" size="large" />
        </View>
      ) : error || !service ? (
        <View style={styles.centerState}>
          <Ionicons name="alert-circle-outline" size={45} color="#D93025" />
          <Text style={styles.errorText}>{error || 'Service not found.'}</Text>
          <Pressable onPress={loadService} style={styles.retryButton}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.details}>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Service name: </Text>
            {service.name}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Price: </Text>
            {formatPrice(service.price)}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Creator: </Text>
            Huy
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Time: </Text>
            {formatDateTime(service.createdAt)}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.label}>Final update: </Text>
            {formatDateTime(service.updatedAt)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  details: {padding: 12},
  detailText: {
    marginBottom: 7,
    color: '#33333A',
    fontSize: 15,
    lineHeight: 20,
  },
  label: {color: '#202027', fontWeight: '700'},
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 10,
    color: '#55555D',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 6,
    backgroundColor: '#F45170',
  },
  retryText: {color: '#FFFFFF', fontWeight: '700'},
  menuTrigger: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOptions: {
    width: 145,
    marginTop: 40,
    borderRadius: 5,
  },
  menuRow: {
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  menuText: {marginLeft: 10, color: '#33333A', fontSize: 15},
  deleteText: {color: '#D93025'},
});

export default ServiceDetailScreen;
