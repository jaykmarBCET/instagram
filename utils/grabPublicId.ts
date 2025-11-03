export function getPublicIdFromUrl(secureUrl:string) {
  try {
    const parts = secureUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) throw new Error('Invalid Cloudinary URL');

    // Get the file name with extension (last part)
    const fileName = parts.pop();
    if(!fileName){
        return secureUrl
    }
    const publicId = fileName.split('.')[0]; // remove extension

    return publicId; // only the public_id
  } catch (err) {
    console.error('Error extracting public_id:', err);
    return null;
  }
}
