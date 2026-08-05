import AsyncStorage from '@react-native-async-storage/async-storage';
import {Service} from '../types';

export const API_BASE_URL = 'https://kami-backend-5rs0.onrender.com';

export const AUTH_TOKEN_KEY = '@kami_auth_token';

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject => {
  return typeof value === 'object' && value !== null;
};

const readResponse = async (response: Response): Promise<unknown> => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const extractMessage = (data: unknown): string | null => {
  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (!isObject(data)) {
    return null;
  }

  const possibleMessages = [data.message, data.error, data.msg];

  for (const message of possibleMessages) {
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return null;
};

const extractToken = (data: unknown): string | null => {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (!isObject(data)) {
    return null;
  }

  const possibleTokens = [
    data.token,
    data.accessToken,
    data.access_token,
    data.loginToken,
    data.jwt,
  ];

  for (const token of possibleTokens) {
    if (typeof token === 'string' && token.trim()) {
      return token.trim();
    }
  }

  if (typeof data.data === 'string' && data.data.trim()) {
    return data.data.trim();
  }

  if (isObject(data.data)) {
    return extractToken(data.data);
  }

  return null;
};

const request = async (
  path: string,
  options: RequestInit = {},
  requiresToken = false,
): Promise<unknown> => {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body) {
    headers.set('Content-Type', 'application/json');
  }

  if (requiresToken) {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);

    if (!token) {
      throw new Error('Your login session has expired. Please log in again.');
    }

    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const data = await readResponse(response);

  if (!response.ok) {
    throw new Error(
      extractMessage(data) ?? `Request failed with status ${response.status}`,
    );
  }

  return data;
};

const unwrapData = (data: unknown): unknown => {
  if (isObject(data) && data.data !== undefined) {
    return data.data;
  }

  return data;
};

const readString = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }

  return undefined;
};

const normalizeService = (value: unknown): Service | null => {
  if (!isObject(value)) {
    return null;
  }

  const rawId = value._id ?? value.id;
  const id =
    typeof rawId === 'string' || typeof rawId === 'number'
      ? String(rawId)
      : '';
  const name = readString(value.name);
  const rawPrice = value.price;
  const price =
    typeof rawPrice === 'number'
      ? rawPrice
      : typeof rawPrice === 'string'
        ? Number(rawPrice)
        : Number.NaN;

  if (!id || !name || !Number.isFinite(price)) {
    return null;
  }

  const creatorValue = value.creator ?? value.createdBy;
  let creator = readString(creatorValue);

  if (!creator && isObject(creatorValue)) {
    creator =
      readString(creatorValue.name) ??
      readString(creatorValue.fullName) ??
      readString(creatorValue.phone);
  }

  return {
    id,
    name,
    price,
    creator,
    createdAt: readString(value.createdAt ?? value.time),
    updatedAt: readString(value.updatedAt ?? value.finalUpdate),
  };
};

export const login = async (
  phone: string,
  password: string,
): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/auth`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({phone, password}),
  });

  const data = await readResponse(response);

  if (!response.ok) {
    const message =
      extractMessage(data) ?? `Login failed with status ${response.status}`;

    throw new Error(message);
  }

  const tokenFromBody = extractToken(data);

  const authorizationHeader = response.headers.get('authorization');

  const tokenFromHeader = authorizationHeader?.replace(/^Bearer\s+/i, '');

  const token = tokenFromBody || tokenFromHeader;

  if (!token) {
    throw new Error('The server did not return a login token.');
  }

  return token;
};

export const getServices = async (): Promise<Service[]> => {
  const data = unwrapData(await request('/services'));
  const list = Array.isArray(data)
    ? data
    : isObject(data) && Array.isArray(data.services)
      ? data.services
      : [];

  return list
    .map(normalizeService)
    .filter((service): service is Service => service !== null);
};

export const getService = async (id: string): Promise<Service> => {
  const data = unwrapData(await request(`/services/${encodeURIComponent(id)}`));
  const service = normalizeService(data);

  if (!service) {
    throw new Error('The server returned an invalid service.');
  }

  return service;
};

export const createService = async (
  name: string,
  price: number,
): Promise<void> => {
  await request(
    '/services',
    {
      method: 'POST',
      body: JSON.stringify({name, price}),
    },
    true,
  );
};

export const updateService = async (
  id: string,
  name: string,
  price: number,
): Promise<void> => {
  await request(
    `/services/${encodeURIComponent(id)}`,
    {
      method: 'PUT',
      body: JSON.stringify({name, price}),
    },
    true,
  );
};

export const deleteService = async (id: string): Promise<void> => {
  await request(
    `/services/${encodeURIComponent(id)}`,
    {method: 'DELETE'},
    true,
  );
};
