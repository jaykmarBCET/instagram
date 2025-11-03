import type { Post } from '@/components/PostListItem';
import PostListItem from '@/components/PostListItem';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { useAuth } from '../providers/AuthProvider';

export default function FeedScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:profiles(*)')
      .order('created_at', { ascending: false });
     



    if (error) {
      Alert.alert('Error', 'Something went wrong while fetching posts.');
      setLoading(false);
      return;
    }

    setPosts(data as Post[]);
    setLoading(false);
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostListItem post={item} />}
      contentContainerStyle={{
        gap: 5,
        maxWidth: 512,
        alignSelf: 'center',
        width: '100%',
      }}
      showsVerticalScrollIndicator={false}
      onRefresh={fetchPosts}
      refreshing={loading}
      
    />
  );
}
