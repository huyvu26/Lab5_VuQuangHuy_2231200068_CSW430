import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

type ServiceFormProps = {
  initialName?: string;
  initialPrice?: number;
  buttonLabel: string;
  isSubmitting: boolean;
  onSubmit: (name: string, price: number) => void;
};

const ServiceForm = ({
  initialName = '',
  initialPrice,
  buttonLabel,
  isSubmitting,
  onSubmit,
}: ServiceFormProps) => {
  const [name, setName] = useState(initialName);
  const [price, setPrice] = useState(
    initialPrice === undefined ? '0' : String(initialPrice),
  );
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');

  const handleSubmit = () => {
    const normalizedName = name.trim();
    const normalizedPrice = Number(price.replace(/[^0-9]/g, ''));
    const nextNameError = normalizedName ? '' : 'Please enter a service name.';
    const nextPriceError =
      Number.isFinite(normalizedPrice) && normalizedPrice > 0
        ? ''
        : 'Price must be greater than 0.';

    setNameError(nextNameError);
    setPriceError(nextPriceError);

    if (!nextNameError && !nextPriceError) {
      onSubmit(normalizedName, normalizedPrice);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.keyboardView}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Service name *</Text>
        <TextInput
          editable={!isSubmitting}
          onChangeText={value => {
            setName(value);
            if (nameError) {
              setNameError('');
            }
          }}
          placeholder="Input a service name"
          placeholderTextColor="#96969E"
          style={[styles.input, nameError ? styles.inputError : null]}
          value={name}
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

        <Text style={styles.label}>Price *</Text>
        <TextInput
          editable={!isSubmitting}
          keyboardType="number-pad"
          onChangeText={value => {
            setPrice(value.replace(/[^0-9]/g, ''));
            if (priceError) {
              setPriceError('');
            }
          }}
          placeholder="0"
          placeholderTextColor="#96969E"
          style={[styles.input, priceError ? styles.inputError : null]}
          value={price}
        />
        {priceError ? <Text style={styles.error}>{priceError}</Text> : null}

        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit}
          style={({pressed}) => [
            styles.button,
            pressed && !isSubmitting ? styles.buttonPressed : null,
          ]}>
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>{buttonLabel}</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  content: {
    padding: 12,
  },
  label: {
    marginBottom: 7,
    color: '#202027',
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    height: 48,
    marginBottom: 17,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: '#F0F0F5',
    borderRadius: 6,
    backgroundColor: '#F3F3F8',
    color: '#222222',
    fontSize: 14,
  },
  inputError: {
    marginBottom: 5,
    borderColor: '#D93025',
  },
  error: {
    marginBottom: 12,
    color: '#D93025',
    fontSize: 12,
  },
  button: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    borderRadius: 7,
    backgroundColor: '#F45170',
  },
  buttonPressed: {
    opacity: 0.82,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default ServiceForm;
