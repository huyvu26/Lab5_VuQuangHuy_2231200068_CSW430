import React, {useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ScreenHeader from '../components/ScreenHeader';
import ServiceForm from '../components/ServiceForm';
import {createService} from '../services/api';
import {RootStackParamList} from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'AddService'>;

const AddServiceScreen = ({navigation}: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (name: string, price: number) => {
    try {
      setIsSubmitting(true);
      await createService(name, price);
      Alert.alert('Success', 'Service added successfully.', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert(
        'Unable to add service',
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
        buttonLabel="Add"
        isSubmitting={isSubmitting}
        onSubmit={handleAdd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
});

export default AddServiceScreen;
