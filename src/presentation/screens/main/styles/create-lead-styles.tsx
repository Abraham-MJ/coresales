import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const create_lead_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F1F3",
  },
  header: {
    backgroundColor: "#0C352E",
    // paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600" as "600",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  halfField: {
    width: "48%",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#61646B",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 14,
    color: "#232323",
  },
  pickerContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    height: 48,
    overflow: "hidden",
  },
  picker: {
    width: 80,
    height: 48,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#232323",
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputText: {
    flex: 1,
    fontSize: 14,
    color: "#232323",
  },

  mapContainer: {
    height: 350,
    backgroundColor: "#E5E5E5",
    borderRadius: 23,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#D9E0EC",
  },

  mapPlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
  },

  markerWrapper: {
    width: 500,
    height: 500,
  },

  mapIcon: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: "#27A8A1",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    transform: [{ translateX: -90 }, { translateY: -20 }],
  },

  nextButton: {
    backgroundColor: "#0C352E",
    borderRadius: 12,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600" as "600",
  },
});
