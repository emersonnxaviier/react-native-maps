import { StyleSheet } from "react-native";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  map: {
    flex: 1,
    width: "100%",
  },

  mapContainer: {
    flex: 1,
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 16,
  },

  title: {
    fontSize: 20,
    marginTop: 24,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 4,
  },

  mapMarker: {
    width: 90,
    height: 80,
  },
  mapMarkerContainer: {
    width: 90,
    height: 40,
    backgroundColor: "#F24F00",
    // flexDirection: "column",
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  mapMarkerImage: {
    width: 90,
    height: 45,
    resizeMode: "cover",
  },

  mapMarkerTitle: {
    // flex: 1,
    color: "#FFF",
    fontSize: 11,
    lineHeight: 23,
  },
});
