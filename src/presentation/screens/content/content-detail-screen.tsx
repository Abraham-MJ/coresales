import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "../../components/ui/Input";
import { styles } from "./content-detail-styles";

interface File {
  id: string;
  name: string;
  size: string;
  type: "image" | "video" | "document";
}

const files: File[] = [
  { id: "1", name: "DSC202108413.jpg", size: "2MB", type: "image" },
  { id: "2", name: "RKAKL2022.xlsx", size: "140Kb", type: "document" },
  {
    id: "3",
    name: "Indonesia_Raya_youtube.com.mp4",
    size: "34MB",
    type: "video",
  },
  { id: "4", name: "DSC2021084131.jpg", size: "2MB", type: "image" },
  { id: "5", name: "DSC2021084132.jpg", size: "3MB", type: "image" },
];

export const ContentDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const folder = params.folder
    ? JSON.parse(params.folder as string)
    : { name: "Ventas" };
  const [searchText, setSearchText] = useState("");

  const renderFileItem = ({ item }: { item: File }) => (
    <TouchableOpacity style={styles.fileItem}>
      <Image
        source={require("../../../../assets/images/icon-step-2.png")}
        style={styles.fileIcon}
        resizeMode="contain"
      />
      <View style={styles.fileContent}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <Text style={styles.fileSize}>{item.size}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.content}>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.sortButton}>
              <Text style={styles.sortText}>A - Z ▼</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Input
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Buscar..."
              leftIcon={<Feather name="search" size={18} color="#9CA3AF" />}
            />
          </View>

          <FlatList
            data={files}
            renderItem={renderFileItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </>
  );
};
