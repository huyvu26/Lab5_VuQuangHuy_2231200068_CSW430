import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScreenHeader from '../components/ScreenHeader';
import ServiceForm from '../components/ServiceForm';
import {updateService} from '../services/api';
import {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'EditService'>;

const EditServiceScreen = ({navigation, route}: Props) => {
  const {service} = route.params;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async (name: string, price: number) => {
    try {
      setIsSubmitting(true);
      await updateService(service.id, name, price);
      Alert.alert('Success', 'Service updated successfully.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert(
        'Unable to update service',
        error instanceof Error ? error.message : 'Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Service" onBack={navigation.goBack} />
      <ServiceForm
        buttonLabel="Update"
        initialName={service.name}
        initialPrice={service.price}
        isSubmitting={isSubmitting}
        onSubmit={handleUpdate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
});

export default EditServiceScreen;
