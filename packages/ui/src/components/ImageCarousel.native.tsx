import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity, ViewToken } from 'react-native';
import { Colors, Spacing } from '@directdrive/theme';

const { width } = Dimensions.get('window');
const THUMBNAIL_SIZE = 60;
const THUMBNAIL_SPACING = 10;

interface ImageCarouselProps {
  images: string[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainListRef = useRef<FlatList>(null);
  const thumbListRef = useRef<FlatList>(null);

  const defaultImage = 'https://placehold.co/1200x800/1a1a1a/ffffff?text=No+Image';
  const displayImages = images && images.length > 0 ? images : [defaultImage];

  const handleThumbnailPress = useCallback((index: number) => {
    if (mainListRef.current) {
      mainListRef.current.scrollToIndex({ index, animated: true });
    }
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].isViewable) {
      const newIndex = viewableItems[0].index;
      if (newIndex !== null && newIndex !== activeIndex) {
        setActiveIndex(newIndex);
        if (thumbListRef.current) {
          thumbListRef.current.scrollToIndex({
            index: newIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }
      }
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        ref={mainListRef}
        data={displayImages}
        keyExtractor={(item, index) => `main-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.mainImage} />
        )}
        style={styles.mainList}
      />

      {displayImages.length > 1 && (
        <FlatList
          ref={thumbListRef}
          data={displayImages}
          keyExtractor={(item, index) => `thumb-${index}`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbListContainer}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => handleThumbnailPress(index)}>
              <Image
                source={{ uri: item }}
                style={[
                  styles.thumbnail,
                  activeIndex === index && styles.activeThumbnail,
                ]}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.backgroundMuted,
  },
  mainList: {
    height: width * 0.7,
  },
  mainImage: {
    width: width,
    height: width * 0.7,
  },
  thumbListContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: Spacing.sm,
    marginRight: THUMBNAIL_SPACING,
    opacity: 0.6,
  },
  activeThumbnail: {
    opacity: 1,
    borderWidth: 2,
    borderColor: Colors.primary.DEFAULT,
  },
});
