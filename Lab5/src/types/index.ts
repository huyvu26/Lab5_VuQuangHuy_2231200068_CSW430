export type Service = {
  id: string;
  name: string;
  price: number;
  creator?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  AddService: undefined;
  ServiceDetail: {serviceId: string};
  EditService: {service: Service};
};
