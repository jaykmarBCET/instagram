import { View, Text, useWindowDimensions, Share } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons, Feather, FontAwesome } from "@expo/vector-icons";
import { AdvancedImage } from "cloudinary-react-native";
import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
import { cld } from "@/lib/cloudinary";
import { getPublicIdFromUrl } from "@/utils/grabPublicId";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/app/providers/AuthProvider";

interface User {
  id: string;
  avatar_url: string;
  username: string;
}

export interface Post {
  id: string;
  image: string;
  caption: string;
  user: User;
}

const PostListItem = ({ post }: { post: Post }) => {
  const { width } = useWindowDimensions();
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuth();

  const image = cld.image(post.image);
  const avatar = cld.image(getPublicIdFromUrl(post.user.avatar_url)!);

  avatar
    .resize(thumbnail().width(400).height(400).gravity(focusOn(FocusOn.face())))
    .roundCorners(byRadius(200));

  const shareHandle = async () => {
    try {
      await Share.share({
        message: `Check out this post: ${post.caption || ""}\n${post.image}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // ✅ Get Like Status
  const getIsLiked = async () => {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from("likes")
      .select("*")
      .eq("postId", post.id)
      .eq("likeBy", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error checking like:", error);
      return;
    }
    setIsLiked(!!data);
  };

  // ✅ Like Post
  const likePost = async () => {
    if (!user?.id) return;
    const { error } = await supabase
      .from("likes")
      .insert([{ postId: post.id, likeBy: user.id }]);
    if (error) console.error("Error liking:", error);
    else setIsLiked(true);
  };

  // ✅ Unlike Post
  const unlikePost = async () => {
    if (!user?.id) return;
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("postId", post.id)
      .eq("likeBy", user.id);
    if (error) console.error("Error unliking:", error);
    else setIsLiked(false);
  };

  // ✅ Toggle Like/Unlike
  const handleLikeToggle = async () => {
    if (isLiked) {
      await unlikePost();
    } else {
      await likePost();
    }
  };

  useEffect(() => {
    getIsLiked();
  }, []);

  return (
    <View className="bg-white mb-3">
      {/* User Info */}
      <View className="p-2 flex flex-row items-center gap-2">
        <AdvancedImage
          cldImg={avatar}
          className="w-12 aspect-square rounded-full"
        />
        <Text className="font-semibold text-md">{post.user.username}</Text>
      </View>

      {/* Post Image */}
      <AdvancedImage
        cldImg={image}
        className="w-full bg-white"
        style={{ aspectRatio: 4 / 3, width }}
      />

      {/* Caption */}
      {post.caption ? (
        <Text className="pl-2 italic font-semibold text-sm mt-1">
          {post.caption}
        </Text>
      ) : null}

      {/* Action Buttons */}
      <View className="flex flex-row gap-3 p-3 items-center">
        <FontAwesome
          color={isLiked ? "#ff6b6b" : "black"}
          onPress={handleLikeToggle}
          name={isLiked ? "heart" : "heart-o"}
          size={25}
        />
        <Ionicons name="chatbubble-outline" size={25} />
        <Feather onPress={shareHandle} name="send" size={20} />
        <View className="ml-auto">
          <Feather name="bookmark" size={25} />
        </View>
      </View>
    </View>
  );
};

export default PostListItem;
