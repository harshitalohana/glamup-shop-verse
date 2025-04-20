
import { supabase } from './client';

// Function to initialize storage buckets
export const initializeStorage = async () => {
  try {
    // Check if the profiles bucket exists, create it if not
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error checking storage buckets:', error);
      return;
    }
    
    const profilesBucketExists = buckets.some(bucket => bucket.name === 'profiles');
    
    if (!profilesBucketExists) {
      console.log('Creating profiles storage bucket');
      const { error: createError } = await supabase.storage.createBucket('profiles', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
      });
      
      if (createError) {
        console.error('Error creating profiles bucket:', createError);
      } else {
        console.log('Profiles bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Upload file to storage and return the public URL
export const uploadFile = async (
  bucket: string,
  file: File,
  path?: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);
      
    if (error) {
      throw error;
    }
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};
