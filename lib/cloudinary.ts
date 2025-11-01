import {Cloudinary} from "@cloudinary/url-gen"
import { UploadApiResponse } from "cloudinary-react-native/lib/typescript/src/api/upload/model/params/upload-params"
import {upload} from "cloudinary-react-native"

export const cld = new Cloudinary({
    cloud:{
        cloudName:process.env.EXPO_PUBLIC_CLOUD_NAME! 
    },
})


 export const uploadImage = async (file:string) => {

    const options = {
      upload_preset: "instagram",
      unsigned: true
    }
    return new Promise<UploadApiResponse>(async(resolve, reject) => {
      if (!file) return;


      await upload(cld, {
        file: file,
        options,
        callback: (error, response) => {
          if(error || !response){
            reject(error)
          }else{
            resolve(response)
          }
          
        }
      })

    })

  }