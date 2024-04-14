import { useEffect, useState, useRef } from "react";
import { Image, SafeAreaView, Text, View } from "react-native";
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  watchPositionAsync,
  LocationAccuracy,
} from "expo-location";
import MapView, { Marker } from "react-native-maps";

import { styles } from "./styles";

export function Teste() {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const mapRef = useRef<MapView>(null);

  async function requestLocationPermission() {
    const { granted } = await requestForegroundPermissionsAsync();

    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition);
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    watchPositionAsync(
      {
        accuracy: LocationAccuracy.Highest,
        timeInterval: 3000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          pitch: 80,
          center: response.coords,
        });
      }
    );
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}> Olá usuário. </Text>
        <Text style={styles.description}>
          Visualize no mapa os pontos de entrega.
        </Text>
        <View style={styles.mapContainer}>
          {location && (
            <MapView
              style={styles.map}
              ref={mapRef}
              loadingEnabled
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005, // INFORMAÇÃO TIRADA DA DOCUMENTAÇÃO
                longitudeDelta: 0.005, // INFORMAÇÃO TIRADA DA DOCUMENTAÇÃO
              }}
            >
              <>
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                >
                  <View
                    style={[styles.mapMarkerContainer, { borderRadius: 500 }]}
                  >
                    {/* <Image style={styles.mapMarkerImage} /> */}
                    <Text style={styles.mapMarkerTitle}> VOCÊ </Text>
                  </View>
                </Marker>

                <Marker
                  style={styles.mapMarker}
                  coordinate={{ latitude: -9.3989977, longitude: -38.2197148 }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Text style={styles.mapMarkerTitle}> ENTREGA 01 </Text>
                  </View>
                </Marker>

                <Marker
                  style={styles.mapMarker}
                  coordinate={{ latitude: -9.4014894, longitude: -38.2221172 }}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Text style={styles.mapMarkerTitle}> ENTREGA 02 </Text>
                  </View>
                </Marker>
              </>
            </MapView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
