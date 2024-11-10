import React, { useState, useCallback, useEffect } from "react";
import {
    StyleSheet,
    View,
    Dimensions,
    Image,
    Pressable,
    Text,
    Button,
    TextInput,
    Modal,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withSequence,
} from "react-native-reanimated";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_HEIGHT = CARD_WIDTH * 0.7;
const AUTOPLAY_INTERVAL = 3000;

const initialImages = [
    { uri: require("../TaskManager/images/1.jpg"), task: "Task 1" },
    { uri: require("../TaskManager/images/2.jpg"), task: "Task 2" },
    { uri: require("../TaskManager/images/3.jpg"), task: "Task 3" },
];

const AnimatedCarousel = () => {
    const [images, setImages] = useState(initialImages);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoplay, setIsAutoplay] = useState(true);
    const [newTask, setNewTask] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalDescription, setModalDescription] = useState("");
    const [modalCancelButtonText, setModalCancelButtonText] = useState("");
    const [modalConfirmButtonText, setModalConfirmButtonText] = useState("");
    const [modalConfirmAction, setModalConfirmAction] = useState<() => void>(
        () => { }
    );
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const translateX = useSharedValue(0);

    const changeSlide = useCallback(
        (direction: number) => {
            if (images.length === 0) return;

            scale.value = withSequence(
                withTiming(0.9, { duration: 150 }),
                withTiming(1, { duration: 150 })
            );
            opacity.value = withTiming(0, { duration: 150 });
            translateX.value = withSpring(direction * CARD_WIDTH);

            setTimeout(() => {
                translateX.value = 0;
                opacity.value = withTiming(1, { duration: 150 });
                setActiveIndex((prev) =>
                    direction > 0
                        ? (prev + 1) % images.length
                        : (prev - 1 + images.length) % images.length
                );
            }, 150);
        },
        [images.length]
    );

    const nextSlide = useCallback(() => changeSlide(1), [changeSlide]);
    const prevSlide = useCallback(() => changeSlide(-1), [changeSlide]);

    useEffect(() => {
        let interval: string | number | NodeJS.Timeout | undefined;
        if (isAutoplay && images.length > 1) {
            interval = setInterval(nextSlide, AUTOPLAY_INTERVAL);
        }
        return () => clearInterval(interval);
    }, [isAutoplay, nextSlide, images.length]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { scale: scale.value }],
        opacity: opacity.value,
    }));

    const handleImagePick = async () => {
        const permissionResult =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            showConfirmationModal(
                "Permission denied",
                "Permission required to pick images",
                "OK",
                "",
                () => { }
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            showConfirmationModal(
                "Add Image",
                "Are you sure you want to add this image?",
                "Cancel",
                "Add",
                () => {
                    const newImage = {
                        uri: { uri: result.assets[0].uri },
                        task: newTask || "New Task",
                    };
                    setImages((prevImages) => [...prevImages, newImage]);
                    setNewTask("");
                }
            );
        }
    };

    const handleDeleteHighlight = () => {
        if (images.length <= 1) {
            showConfirmationModal(
                "Cannot Delete",
                "You must have at least one image in the carousel.",
                "OK",
                "",
                () => { }
            );
            return;
        }

        showConfirmationModal(
            "Delete Task",
            "Are you sure you want to delete this task?",
            "Cancel",
            "Delete",
            () => {
                setImages((prevImages) => {
                    const newImages = prevImages.filter(
                        (_, index) => index !== activeIndex
                    );
                    setActiveIndex((prev) =>
                        prev >= newImages.length ? newImages.length - 1 : prev
                    );
                    return newImages;
                });
            }
        );
    };

    const showConfirmationModal = (
        title: string,
        description: string,
        cancelButtonText: string,
        confirmButtonText: string,
        confirmAction: () => void
    ) => {
        setModalTitle(title);
        setModalDescription(description);
        setModalCancelButtonText(cancelButtonText);
        setModalConfirmButtonText(confirmButtonText);
        setModalConfirmAction(() => confirmAction);
        setShowModal(true);
    };

    const renderModal = () => (
        <Modal visible={showModal} transparent animationType="fade">
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{modalTitle}</Text>
                    <Text style={styles.modalDescription}>{modalDescription}</Text>
                    <View style={styles.modalButtonContainer}>
                        <Pressable
                            style={[styles.modalButton, styles.cancelButton]}
                            onPress={() => setShowModal(false)}
                        >
                            <Text style={styles.cancelButtonText}>
                                {modalCancelButtonText}
                            </Text>
                        </Pressable>
                        {modalConfirmButtonText !== "" && (
                            <Pressable
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={() => {
                                    modalConfirmAction();
                                    setShowModal(false);
                                }}
                            >
                                <Text style={styles.confirmButtonText}>
                                    {modalConfirmButtonText}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {images.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.dot,
                        { backgroundColor: index === activeIndex ? "#000" : "#ccc" },
                    ]}
                />
            ))}
        </View>
    );

    if (images.length === 0) {
        return (
            <View style={styles.wrapper}>
                <Text>No images available. Please add an image.</Text>
                <View style={styles.uploadContainer}>
                    <TextInput
                        placeholder="Enter task description"
                        value={newTask}
                        onChangeText={setNewTask}
                        style={styles.taskInput}
                        maxLength={150}
                    />
                    <Button
                        title="Add New Image"
                        onPress={handleImagePick}
                        color="#000"
                    />
                </View>
            </View>
        );
    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <View style={styles.carouselContainer}>
                    {images.length > 1 && (
                        <Pressable
                            onPress={prevSlide}
                            style={[styles.navButton, styles.leftNavButton]}
                        >
                            <AntDesign name="leftcircle" size={30} color="#000" />
                        </Pressable>
                    )}

                    <Animated.View style={[styles.cardContainer, animatedStyle]}>
                        <Pressable
                            style={styles.deleteIcon}
                            onPress={handleDeleteHighlight}
                        >
                            <MaterialIcons name="delete" size={24} color="red" />
                        </Pressable>
                        <Image
                            source={images[activeIndex].uri}
                            style={styles.image}
                            resizeMode="cover"
                        />
                        <Text style={styles.taskText}>{images[activeIndex].task}</Text>
                        <View style={styles.overlay}>
                            <View style={styles.playPauseButton}>
                                <Pressable onPress={() => setIsAutoplay(!isAutoplay)}>
                                    <AntDesign
                                        name={isAutoplay ? "pausecircleo" : "playcircleo"}
                                        size={24}
                                        color="white"
                                    />
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>

                    {images.length > 1 && (
                        <Pressable
                            onPress={nextSlide}
                            style={[styles.navButton, styles.rightNavButton]}
                        >
                            <AntDesign name="rightcircle" size={30} color="#000" />
                        </Pressable>
                    )}
                </View>
                {renderDots()}

                <View style={styles.uploadContainer}>
                    <TextInput
                        placeholder="Enter task highlight"
                        value={newTask}
                        onChangeText={setNewTask}
                        style={styles.taskInput}
                        maxLength={150}
                    />
                    <Pressable
                        style={[styles.addButton, { borderRadius: 10 }]}
                        onPress={handleImagePick}
                    >
                        <Text style={styles.addButtonText}>Highlight Image</Text>
                    </Pressable>
                </View>
            </View>
            {renderModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 28,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    modalDescription: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 24,
    },
    modalButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 16,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 20,
        marginHorizontal: 8,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#E0E0E0",
    },
    cancelButtonText: {
        color: "#000",
        fontWeight: "500",
    },
    confirmButton: {
        backgroundColor: "#6200EE",
    },
    confirmButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
    addButton: {
        backgroundColor: "#ff5733",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "500",
    },
    wrapper: { width: "100%", alignItems: "center", justifyContent: "center" },
    container: {
        width: SCREEN_WIDTH,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        paddingVertical: 20,
    },
    carouselContainer: {
        width: SCREEN_WIDTH,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
    },
    cardContainer: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "white",
        borderRadius: 15,
        overflow: "hidden",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    image: { width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    taskText: {
        position: "absolute",
        bottom: 10,
        left: 10,
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.1)",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        padding: 10,
    },
    deleteIcon: { position: "absolute", top: 10, right: 10, zIndex: 1 },
    playPauseButton: {
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 20,
        padding: 5,
    },
    navButton: {
        padding: 10,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 30,
        position: "absolute",
        zIndex: 1,
    },
    leftNavButton: { left: (SCREEN_WIDTH - CARD_WIDTH) / 2 - 25 },
    rightNavButton: { right: (SCREEN_WIDTH - CARD_WIDTH) / 2 - 25 },
    dotsContainer: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "center",
    },
    dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 },
    uploadContainer: { alignItems: "center", marginTop: 20 },
    taskInput: {
        borderBottomWidth: 0,
        borderColor: "transparent",
        padding: 12,
        width: "80%",
        maxWidth: "80%", // Add this line
        marginBottom: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 4,
        elevation: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    addbutton: {
        backgroundColor: "#ff5733",
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
});

export default AnimatedCarousel;
