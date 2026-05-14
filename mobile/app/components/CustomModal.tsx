import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { BlurView } from "expo-blur";

const CustomModal = ({
  isVisible,
  toggleModal,
  onConfirm,
  productName,
  message,
}: {
  isVisible: boolean;
  toggleModal: () => void;
  onConfirm: () => void;
  productName: string;
  message?: string;
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={toggleModal} // Закрытие при нажатии на фон
      onSwipeComplete={toggleModal} // Закрытие свайпом
      swipeDirection={["down"]} // Направление свайпа
      backdropOpacity={0.5} // Степень затемнения
      animationIn="fadeIn" // Анимация появления
      animationOut="fadeOut" // Анимация исчезновения
      useNativeDriver={true} // Оптимизация производительности
      animationInTiming={1000}
      animationOutTiming={100}
    >
      <View style={styles.content}>
        <BlurView intensity={100} tint="systemChromeMaterialDark" style={StyleSheet.absoluteFill} />
        
        {/* Индикатор для свайпа (маленькая полоска сверху) */}
        <View style={styles.dragHandle} />

        
        <Text style={styles.text}>Remove <Text className="font-bold">{productName}</Text> from wishlist?</Text>
        

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={toggleModal}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton]}
            onPress={() => onConfirm()}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: "transparent",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#FFFFFF",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    color: "#A1A1AA",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: "center",
  },
  confirmButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)"
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  confirmText: {
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelText: {
    color: "#3b82f6",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CustomModal;
