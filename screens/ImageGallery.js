import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Text,
  Alert
} from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";

const ImageGallery = ({ images = [], editing = false, onDeleteImage, onAddImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = Dimensions.get('window').width;

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.imageContainer, { width: windowWidth - 32 }]}>
        {/* Show Image */}
        {images.length > 0 ? (
  <>
    <Image
      source={{ 
        uri: images[currentIndex]?.startsWith("http") 
          ? images[currentIndex] 
          : images[currentIndex]?.startsWith("file://") 
            ? images[currentIndex] 
            : `file://${images[currentIndex]}` 
      }}
      style={styles.image}
      resizeMode="cover"
    />

    {editing && (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => {
          Alert.alert(
            "Delete Image",
            "Are you sure you want to delete this image?",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                  await onDeleteImage(currentIndex);
                  setCurrentIndex((prevIndex) => 
                    prevIndex >= images.length - 1 ? Math.max(0, prevIndex - 1) : prevIndex
                  );
                },
              },
            ]
          );
        }}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    )}
  </>
) : null}


        {/* Navigation Buttons */}
        {images.length > 1 && (
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
              onPress={goToPrevious}
              disabled={currentIndex === 0}
            >
              <MaterialIcons name="chevron-left" size={30} color={currentIndex === 0 ? "#ccc" : "white"} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navButton, currentIndex >= images.length - 1 && styles.navButtonDisabled]}
              onPress={goToNext}
              disabled={currentIndex >= images.length - 1}
            >
              <MaterialIcons name="chevron-right" size={30} color={currentIndex >= images.length - 1 ? "#ccc" : "white"} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Image Counter */}
      {images.length > 0 && (
  <View style={styles.counterContainer}>
    <Text style={styles.counterText}>{`${currentIndex + 1} of ${images.length}`}</Text>
  </View>
)}

      {/* Add Image Button (only visible when editing is on) */}
         {/* Add Image Button (only visible when editing is on) */}
         {editing && (
        <TouchableOpacity 
          style={[styles.addImageButton, images.length === 0 && styles.addImageButtonNoImages]} 
          onPress={onAddImage}
        >
          <MaterialIcons name="add-photo-alternate" size={30} color="white" />
          <Text style={styles.addImageButtonText}>Add Image</Text>
        </TouchableOpacity>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  imageContainer: {
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 12,  
    right: 12, 
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  navigationContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    top: '50%',
    transform: [{ translateY: -20 }],
  },
  navButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 5,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  counterContainer: {
    marginTop: 10,
  },
  counterText: {
    color: '#666',
    fontSize: 14,
  },
  addImageSlide: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a237e', // Brighter Blue for a Modern Look
    paddingVertical: 14, // More padding for a larger button
    paddingHorizontal: 20,
    borderRadius: 50, // Circular button edges for modern UI
    marginTop: 16, // Adjusted spacing
    shadowColor: '#000', // Subtle shadow for depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android Shadow
  },
  addImageButtonText: {
    color: '#FFF',
    fontSize: 18, // Bigger, more readable text
    fontWeight: '600', // Bold to stand out
    marginLeft: 10, // Space between text and icon
    letterSpacing: 0.5, // Slight spacing for a cleaner look
  },
  addImageText: {
    color: '#444', // Darker for better readability
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500', // Slightly bolder text
  },
  addImageButtonNoImages: {
    marginTop: -230, // Moves button up only when no images are available
  },

});

export default ImageGallery;
