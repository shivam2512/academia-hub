
-- Update chat_messages RLS to allow admins/superadmins to send messages in any batch
DROP POLICY IF EXISTS "batch members send chat" ON public.chat_messages;
CREATE POLICY "batch members/admin send chat" ON public.chat_messages 
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND (
    public.is_batch_member(auth.uid(), batch_id) OR 
    public.is_admin_or_super(auth.uid())
  )
);

-- Allow admins to edit any message (moderation)
DROP POLICY IF EXISTS "edit own messages" ON public.chat_messages;
CREATE POLICY "edit own messages or admin" ON public.chat_messages 
FOR UPDATE USING (
  auth.uid() = user_id OR 
  public.is_admin_or_super(auth.uid())
);

-- Allow admins to delete any message (moderation)
DROP POLICY IF EXISTS "delete own messages or admin" ON public.chat_messages;
CREATE POLICY "delete own messages or admin" ON public.chat_messages 
FOR DELETE USING (
  auth.uid() = user_id OR 
  public.is_admin_or_super(auth.uid())
);

-- Update message_reactions RLS to allow admins/superadmins to react in any batch
DROP POLICY IF EXISTS "react in own batches" ON public.message_reactions;
CREATE POLICY "react in all batches for admin" ON public.message_reactions 
FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (
    SELECT 1 FROM public.chat_messages m 
    WHERE m.id = message_id AND (
      public.is_batch_member(auth.uid(), m.batch_id) OR 
      public.is_admin_or_super(auth.uid())
    )
  )
);
