import React, { useState } from 'react';
    import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Pressable, Alert } from 'react-native';
    import { useUserVehicles } from '@/hooks/useUserVehicles';
    import { Colors, Typography } from '@directdrive/theme';
    import { Car, PlusCircle } from 'lucide-react-native';
    import MyListingCard from '@/components/MyListingCard';
    import { deleteData, getSupabaseClient } from '@directdrive/supabase-client';

    export default function MyListingsScreen() {
      const { vehicles, loading, error, removeVehicle } = useUserVehicles();
      const [deletingId, setDeletingId] = useState<string | null>(null);
      const supabase = getSupabase();

      const handleDelete = (vehicleId: string, images: string[]) => {
        Alert.alert(
          "Delete Listing",
          "Are you sure you want to delete this listing? This action cannot be undone.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", style: "destructive", onPress: () => performDelete(vehicleId, images) }
          ]
        );
      };

      const performDelete = async (vehicleId: string, images: string[]) => {
        setDeletingId(vehicleId);
        try {
          // Delete images from storage first
          if (images && images.length > 0) {
            const bucketName = 'vehicle-images';
            const filePaths = images.map(url => {
                try {
                    const urlObject = new URL(url);
                    const searchString = `/storage/v1/object/public/${bucketName}/`;
                    const pathStartIndex = urlObject.pathname.indexOf(searchString);
                    if (pathStartIndex === -1) return null;
                    return urlObject.pathname.substring(pathStartIndex + searchString.length);
                } catch (e) { return null; }
            }).filter((p): p is string => p !== null);

            if (filePaths.length > 0) {
                const { error: deleteStorageError } = await supabase.storage.from(bucketName).remove(filePaths);
                // Log error but proceed to delete DB record anyway
                if (deleteStorageError) {
                  console.error("Could not delete images from storage:", deleteStorageError.message);
                }
            }
          }
          
          // Delete the vehicle record from the database
          const { error: deleteDbError } = await deleteData('vehicles', { id: vehicleId });

          if (deleteDbError) {
            throw new Error(`Failed to delete listing: ${deleteDbError.message}`);
          }

          // If successful, remove from local state
          removeVehicle(vehicleId);

        } catch (err: any) {
          console.error("Failed to delete listing:", err);
          Alert.alert("Error", err.message || "Failed to delete listing. Please try again.");
        } finally {
          setDeletingId(null);
        }
      };

      const renderContent = () => {
        if (loading) {
          return <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />;
        }
        if (error) {
          return <Text style={styles.infoText}>Error: {error.message}</Text>;
        }
        if (vehicles.length === 0) {
          return (
            <View style={styles.emptyContainer}>
              <Car size={64} color={Colors.text.tertiary} strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>No vehicles listed yet</Text>
              <Text style={styles.emptySubtitle}>Ready to sell? List your car and reach thousands of potential buyers.</Text>
              <Pressable style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1 }]}>
                <PlusCircle color={Colors.white} size={20} />
                <Text style={styles.buttonText}>List Your First Car</Text>
              </Pressable>
            </View>
          );
        }
        return (
          <FlatList
            data={vehicles}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MyListingCard 
                vehicle={item} 
                onDelete={() => handleDelete(item.id, item.images || [])}
                isDeleting={deletingId === item.id}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
        );
      };

      return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Listings</Text>
          </View>
          {renderContent()}
        </SafeAreaView>
      );
    }

    const styles = StyleSheet.create({
      safeArea: { flex: 1, backgroundColor: Colors.background },
      header: {
        padding: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
      },
      headerTitle: { ...Typography.heading.h3, color: Colors.text.primary },
      listContent: { padding: 24 },
      infoText: { ...Typography.body.md, color: Colors.text.secondary, textAlign: 'center', marginTop: 50 },
      emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
      emptyTitle: { ...Typography.heading.h4, color: Colors.text.primary, marginTop: 24, marginBottom: 8 },
      emptySubtitle: { ...Typography.body.md, color: Colors.text.secondary, textAlign: 'center', marginBottom: 24, maxWidth: 300 },
      button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderRadius: 8, paddingHorizontal: 24, backgroundColor: Colors.primary },
      buttonText: { ...Typography.body.md, fontFamily: 'Inter_600SemiBold', color: Colors.white, marginLeft: 12 },
    });
