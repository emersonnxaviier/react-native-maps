import {
  getCurrentPositionAsync,
  LocationObject,
  requestForegroundPermissionsAsync,
} from "expo-location";
import React, { useState, useEffect } from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import MapView, { Marker } from "react-native-maps";

type PropT = {
  id: number;
  latitude: number;
  longitude: number;
};

// Função para calcular a distância entre dois pontos geográficos (latitude e longitude)
function calcDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // raio da Terra em quilômetros
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distância em quilômetros
  return distance;
}

export const Home = () => {
  const [orders, setOrders] = useState([
    { id: 1, latitude: -9.375021, longitude: -38.242406 },
    { id: 2, latitude: -9.4445568, longitude: -38.2162545 },
    { id: 3, latitude: -9.378827, longitude: -38.228829 },
    { id: 4, latitude: -9.3989977, longitude: -38.2197148 },
    { id: 5, latitude: -9.408597, longitude: -38.225825 },
  ]);
  const [currentLocation, setCurrentLocation] = useState<LocationObject | null>(
    null
  );

  // SOLICITA A PERMISSÃO PARA USO DA LOCALIZAÇÃO NO APP
  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setCurrentLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Função para classificar os pedidos com base na distância
  const sortOrdersByDistance = () => {
    if (!currentLocation) return;

    const sortedOrders = [...orders].sort((a, b) => {
      const distanceA = calcDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        a.latitude,
        a.longitude
      );
      const distanceB = calcDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        b.latitude,
        b.longitude
      );
      return distanceA - distanceB;
    });

    setOrders(sortedOrders);
  };

  // Função para selecionar o pedido mais próximo
  const getNearestOrder = () => {
    if (!currentLocation) return null;

    let nearestOrder = null || ({} as PropT);
    let shortestDistance = Infinity;

    orders.forEach((order) => {
      const distance = calcDistance(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude,
        order.latitude,
        order.longitude
      );
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestOrder = order;
      }
    });

    return nearestOrder;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {currentLocation && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.latitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {orders.map((order) => (
            <Marker
              key={order.id}
              coordinate={{
                latitude: order.latitude,
                longitude: order.longitude,
              }}
              title={`Pedido ${order.id}`}
            />
          ))}

          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="Sua Localização"
            pinColor="blue"
          />
        </MapView>
      )}
      <Button
        title="Classificar Pedidos por Distância"
        onPress={sortOrdersByDistance}
        color="#F24F00"
      />
      <Text style={{ marginTop: 10, marginBottom: 10, textAlign: "center" }}>
        Pedido mais próximo:{" "}
        {getNearestOrder() ? `Pedido ${getNearestOrder()?.id}` : "Nenhum"}
      </Text>
    </SafeAreaView>
  );
};
