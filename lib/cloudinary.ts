import {Cloudinary} from "@cloudinary/url-gen"


export const cld = new Cloudinary({
    cloud:{
        cloudName:process.env.EXPO_PUBLIC_CLOUD_NAME! 
    },
})