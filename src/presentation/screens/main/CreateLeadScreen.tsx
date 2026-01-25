import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Input } from "../../components";
import { create_lead_styles } from "./styles/create-lead-styles";

export default function CreateLeadScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [docType, setDocType] = useState("V");
  const [docNumber, setDocNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("+57");
  const [phone, setPhone] = useState("");
  const [phoneCode2, setPhoneCode2] = useState("+57");
  const [phone2, setPhone2] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [reference, setReference] = useState("");
  const [location, setLocation] = useState({
    latitude: 4.711,
    longitude: -74.0721,
  });

  const mapStyle = [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "all",
      stylers: [
        {
          color: "#f2f2f2",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#686868",
        },
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [
        {
          color: "#f2f2f2",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "all",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "all",
      stylers: [
        {
          saturation: -100,
        },
        {
          lightness: 45,
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "all",
      stylers: [
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.fill",
      stylers: [
        {
          lightness: "-22",
        },
        {
          visibility: "on",
        },
        {
          color: "#b4b4b4",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          saturation: "-51",
        },
        {
          lightness: "11",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text",
      stylers: [
        {
          saturation: "3",
        },
        {
          lightness: "-56",
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          lightness: "-52",
        },
        {
          color: "#9094a0",
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [
        {
          weight: "6.13",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.icon",
      stylers: [
        {
          weight: "1.24",
        },
        {
          saturation: "-100",
        },
        {
          lightness: "-10",
        },
        {
          gamma: "0.94",
        },
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#b4b4b4",
        },
        {
          weight: "5.40",
        },
        {
          lightness: "7",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "labels.text",
      stylers: [
        {
          visibility: "simplified",
        },
        {
          color: "#231f1f",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "labels.text.fill",
      stylers: [
        {
          visibility: "simplified",
        },
        {
          color: "#595151",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          lightness: "-16",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "on",
        },
        {
          color: "#d7d7d7",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text",
      stylers: [
        {
          color: "#282626",
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [
        {
          saturation: "-41",
        },
        {
          lightness: "-41",
        },
        {
          color: "#2a4592",
        },
        {
          visibility: "simplified",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.stroke",
      stylers: [
        {
          weight: "1.10",
        },
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "geometry.fill",
      stylers: [
        {
          lightness: "-16",
        },
        {
          weight: "0.72",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          lightness: "-37",
        },
        {
          color: "#2a4592",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [
        {
          visibility: "off",
        },
        {
          color: "#eeed6a",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.stroke",
      stylers: [
        {
          visibility: "off",
        },
        {
          color: "#0a0808",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "all",
      stylers: [
        {
          color: "#b7e4f4",
        },
        {
          visibility: "on",
        },
      ],
    },
  ];

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0C352E" />
      <View style={create_lead_styles.container}>
        <ScrollView
          style={create_lead_styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={create_lead_styles.form}>
            <View style={create_lead_styles.row}>
              <Input
                label="Nombres"
                value={firstName}
                onChangeText={setFirstName}
                containerStyle={create_lead_styles.halfField}
              />
              <Input
                label="Apellidos"
                value={lastName}
                onChangeText={setLastName}
                containerStyle={create_lead_styles.halfField}
              />
            </View>

            <Input
              label="Documento de identidad"
              hasSelect
              selectOptions={[
                { label: "V", value: "V" },
                { label: "P", value: "P" },
                { label: "J", value: "J" },
              ]}
              selectValue={docType}
              onSelectChange={setDocType}
              value={docNumber}
              onChangeText={setDocNumber}
              keyboardType="numeric"
              rightIcon={<Feather name="check" size={18} color="#D3D3D3" />}
            />

            <Input
              label="Teléfono"
              hasSelect
              selectOptions={[
                { label: "+57", value: "+57" },
                { label: "+1", value: "+1" },
                { label: "+58", value: "+58" },
              ]}
              selectValue={phoneCode}
              onSelectChange={setPhoneCode}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              rightIcon={<Feather name="check" size={18} color="#D3D3D3" />}
            />

            <Input
              label="Teléfono secundario"
              hasSelect
              selectOptions={[
                { label: "+57", value: "+57" },
                { label: "+1", value: "+1" },
                { label: "+58", value: "+58" },
              ]}
              selectValue={phoneCode2}
              onSelectChange={setPhoneCode2}
              value={phone2}
              onChangeText={setPhone2}
              keyboardType="phone-pad"
              rightIcon={<Feather name="check" size={18} color="#D3D3D3" />}
            />

            <Input
              label="Correo eléctronico"
              value={email}
              onChangeText={setEmail}
              placeholder="anapuki@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              rightIcon={<Feather name="check" size={18} color="#D3D3D3" />}
            />

            <Input
              label="Dirección"
              value={address}
              onChangeText={setAddress}
            />

            <Input
              label="Referencia"
              value={reference}
              onChangeText={setReference}
            />

            <View style={create_lead_styles.mapContainer}>
              <MapView
                style={{ width: "100%", height: "100%" }}
                initialRegion={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                userInterfaceStyle="light"
                onPress={(e) => setLocation(e.nativeEvent.coordinate)}
                customMapStyle={mapStyle}
              >
                <Marker
                  coordinate={location}
                  anchor={{ x: 0.5, y: 1 }}
                  image={require("@/assets/images/marker.png")}
                  style={{
                    width: 400,
                    height: 400,
                  }}
                ></Marker>
              </MapView>
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity style={create_lead_styles.nextButton}>
          <Text style={create_lead_styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
