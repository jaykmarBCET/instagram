import AsyncStorage from "@react-native-async-storage/async-storage"
import {createClient} from "@supabase/supabase-js"


const SUPABASE_URL = process.env.EXPO_PUBLIC_SAPABASE_PROJECT_URL!
const SUPABASE_ANON_KEY =process.env.EXPO_PUBLIC_SAPABASE_API_KEY!

export const supabase = createClient(SUPABASE_URL,SUPABASE_ANON_KEY,{
    auth:{
        storage:AsyncStorage,
        autoRefreshToken:true,
        persistSession:true,
        detectSessionInUrl:true,
    }
})


export interface UserProfile{
    id:string;
    username:string;
    full_name?:string;
    avatar_url?:string;
    website?:string
}