
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInformationProps {
  email: string;
  onEmailChange: (email: string) => void;
}

const ContactInformation = ({ email, onEmailChange }: ContactInformationProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-4">معلومات التواصل</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">بريد إلكتروني</Label>
          <Input
            id="email"
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="mt-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="newsletter"
            className="rounded"
          />
          <label htmlFor="newsletter" className="text-sm">
            أرسل لي أحدث الأخبار والعروض الحصرية من Building Station!
          </label>
        </div>
      </div>
    </div>
  );
};

export default ContactInformation;
