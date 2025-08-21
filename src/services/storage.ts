import { supabase } from "@/integrations/supabase/client";

export const storageService = {
  /**
   * Upload an image to the partner-logos bucket
   */
  async uploadPartnerLogo(file: File, fileName: string): Promise<string> {
    const { data, error } = await supabase.storage
      .from('partner-logos')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }

    return `https://aegclwuugreshufvisax.supabase.co/storage/v1/object/public/partner-logos/${data.path}`;
  },

  /**
   * Get public URL for a partner logo
   */
  getPartnerLogoUrl(fileName: string): string {
    return `https://aegclwuugreshufvisax.supabase.co/storage/v1/object/public/partner-logos/${fileName}`;
  },

  /**
   * Delete a partner logo
   */
  async deletePartnerLogo(fileName: string): Promise<void> {
    const { error } = await supabase.storage
      .from('partner-logos')
      .remove([fileName]);

    if (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
};