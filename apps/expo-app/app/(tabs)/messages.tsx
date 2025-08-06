import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useConversations, useDeleteConversation } from '@directdrive/hooks';
import { useRouter } from 'expo-router';
import { Colors, Typography, Spacing } from '@directdrive/theme';
import { useAuth } from '@/providers/AuthProvider';
import ConversationListItem from '@/components/ConversationListItem';
import { MessageSquare, AlertTriangle } from 'lucide-react-native';
import { useQueryClient } from '@tanstack/react-query';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: conversations, isLoading, isError, error, refetch } = useConversations(user?.id);
  const { mutate: deleteConversation, isPending: isDeleting } = useDeleteConversation();

  const handleDelete = (conversationId: string) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to permanently delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteConversation(conversationId, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['conversations', user?.id] });
              },
              onError: (err) => {
                Alert.alert("Error", err.message || "Failed to delete conversation.");
              },
            });
          },
        },
      ]
    );
  };

  const renderContent = () => {
    if (isLoading && !conversations) {
      return <ActivityIndicator size="large" color={Colors.primary} style={styles.centered} />;
    }

    if (isError) {
      return (
        <View style={styles.centered}>
          <AlertTriangle color={Colors.danger} size={48} />
          <Text style={styles.errorText}>Error loading messages</Text>
          <Text style={styles.errorSubText}>{error?.message}</Text>
        </View>
      );
    }

    if (!conversations || conversations.length === 0) {
      return (
        <View style={styles.centered}>
          <MessageSquare color={Colors.text.secondary} size={64} />
          <Text style={styles.emptyText}>You have no messages.</Text>
          <Text style={styles.emptySubText}>Contact a seller to start a conversation.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.public_id}
        renderItem={({ item }) => (
          <ConversationListItem
            conversation={item}
            currentUserId={user?.id || ''}
            onPress={() => router.push(`/conversation/${item.public_id}`)}
            onDelete={() => handleDelete(item.public_id)}
            isDeleting={isDeleting}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} colors={[Colors.primary]} />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.heading.h3,
    color: Colors.text.primary,
  },
  listContainer: {
    paddingVertical: Spacing.sm,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  emptyText: {
    ...Typography.heading.h4,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
  },
  emptySubText: {
    ...Typography.body.lg,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  errorText: {
    ...Typography.heading.h4,
    color: Colors.danger,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorSubText: {
    ...Typography.body.md,
    color: Colors.text.secondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
});
