import { z } from 'zod';

export const authSchema = z.object({
  email: z.string()
    .trim()
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .max(255, 'البريد الإلكتروني يجب أن يكون أقل من 255 حرف'),
  password: z.string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .max(128, 'كلمة المرور يجب أن تكون أقل من 128 حرف'),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword !== undefined) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
});

export const checkoutSchema = z.object({
  email: z.string()
    .trim()
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .max(255, 'البريد الإلكتروني يجب أن يكون أقل من 255 حرف'),
  firstName: z.string()
    .trim()
    .min(1, 'الاسم الأول مطلوب')
    .max(50, 'الاسم الأول يجب أن يكون أقل من 50 حرف')
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'الاسم يجب أن يحتوي على أحرف فقط'),
  lastName: z.string()
    .trim()
    .min(1, 'اسم العائلة مطلوب')
    .max(50, 'اسم العائلة يجب أن يكون أقل من 50 حرف')
    .regex(/^[a-zA-Z\u0600-\u06FF\s]+$/, 'الاسم يجب أن يحتوي على أحرف فقط'),
  phone: z.string()
    .regex(/^[0-9+\-\s()]{7,20}$/, 'رقم الهاتف غير صحيح'),
  street: z.string()
    .trim()
    .min(1, 'عنوان الشارع مطلوب')
    .max(200, 'عنوان الشارع يجب أن يكون أقل من 200 حرف'),
  city: z.string()
    .trim()
    .min(1, 'المدينة مطلوبة')
    .max(100, 'المدينة يجب أن تكون أقل من 100 حرف'),
  postalCode: z.string()
    .regex(/^[0-9]{5,10}$/, 'الرمز البريدي غير صحيح')
    .optional()
    .or(z.literal('')),
  country: z.string()
    .min(1, 'الدولة مطلوبة'),
});
