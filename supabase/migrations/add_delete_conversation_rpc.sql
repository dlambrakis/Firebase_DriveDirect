/*
      # Add delete_conversation RPC

      This migration adds a new RPC function `delete_conversation` to allow users to delete their conversations.

      1.  **New Functions**
          - `delete_conversation(p_conversation_id uuid)`
            - Deletes a conversation and all associated messages and offers.
            - It ensures that the user calling the function is a participant (either buyer or seller) in the conversation before allowing the deletion.
            - This is a hard delete, and the action cannot be undone.

      2.  **Security**
          - The function is defined with `SECURITY DEFINER` to ensure it has the necessary permissions to delete related records (messages, offers) cleanly.
          - It uses `auth.uid()` to securely verify the calling user's identity against the conversation participants.
          - It will raise an exception if a non-participant attempts to delete the conversation, preventing unauthorized actions.
    */

    CREATE OR REPLACE FUNCTION delete_conversation(p_conversation_id uuid)
    RETURNS void
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    DECLARE
      is_participant boolean;
    BEGIN
      -- Check if the current user is a participant in the conversation
      SELECT EXISTS (
        SELECT 1
        FROM conversations
        WHERE id = p_conversation_id
          AND (buyer_id = auth.uid() OR seller_id = auth.uid())
      ) INTO is_participant;

      IF NOT is_participant THEN
        RAISE EXCEPTION 'User is not a participant in this conversation';
      END IF;

      -- If the user is a participant, proceed with deletion.
      -- Deleting from the parent 'conversations' table will cascade and delete
      -- related messages and offers due to foreign key constraints with ON DELETE CASCADE.
      DELETE FROM conversations WHERE id = p_conversation_id;

    END;
    $$;
