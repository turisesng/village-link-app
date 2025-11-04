import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
// FIX: Changed absolute import path (@/lib/supabase) to a relative path (../../lib/supabase)
import { authHelpers, UserRole, SignUpProfileParams } from "../../lib/supabase"; 
import { ArrowLeft, Upload } from "lucide-react";

// === CONSTANTS ===

/**
 * Service categories for Service Providers.
 */
const serviceCategories = [
  { value: 'plumber', label: 'Plumber' },
  { value: 'electrician', label: 'Electrician' },
  { value: 'carpenter', label: 'Carpenter' },
  { value: 'painter', label: 'Painter' },
  { value: 'welder', label: 'Welder' },
  { value: 'mechanic', label: 'Mechanic' },
  { value: 'tutor', label: 'Private Tutor' },
  { value: 'hair_stylist', label: 'Hair Stylist / Barber' },
  { value: 'chef', label: 'Private Chef / Cook' },
  { value: 'security', label: 'Security Guard' },
  { value: 'ac_repair', label: 'AC Repair Technician' },
  { value: 'cleaner', label: 'Cleaner / Maid Service' },
  { value: 'gardener', label: 'Gardener / Landscaper' },
  { value: 'other', label: 'Other (Please Specify)' },
];

/**
 * Vehicle types for Riders.
 */
const vehicleTypes = [
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'tricycle', label: 'Tricycle (Keke)' },
    { value: 'bicycle', label: 'Bicycle' },
    { value: 'bus', label: 'Bus / Van' },
    { value: 'car', label: 'Car' },
    { value: 'other', label: 'Other' },
];

/**
 * Types of documents accepted for identification.
 */
const identificationTypes = [
  { value: 'national_id', label: 'National ID' },
  { value: 'driver_license', label: 'Driver License' },
  { value: 'passport', label: 'International Passport' },
];

/**
 * Types of documents accepted as proof of address.
 */
const proofOfAddressTypes = [
  { value: 'utility_bill', label: 'Utility Bill' },
  { value: 'lease_agreement', label: 'Lease Agreement' },
  { value: 'bank_statement', label: 'Bank Statement' },
];

// Re-usable component for styled file input
interface FileUploadProps {
    id: string;
    label: string;
    file: File | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required: boolean;
    disabled: boolean;
    className?: string;
}

const StyledFileInput: React.FC<FileUploadProps> = ({ id, label, file, onChange, required, disabled, className = '' }) => (
    <div className={`grid w-full items-center gap-1.5 ${className}`}>
        <Label htmlFor={id}>{label}{required && ' *'}</Label>
        <Label className={`flex w-full items-center justify-center border border-input rounded-md px-3 cursor-pointer h-10 transition ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-50'}`}>
            <Upload className="w-4 h-4 mr-2" />
            {file ? file.name : 'Choose File'}
            <Input 
                id={id} name={id} type="file" className="sr-only" 
                onChange={onChange} required={required} disabled={disabled}
            />
        </Label>
    </div>
);


const Onboarding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  // Ensure the role is a valid UserRole, defaults to 'resident'
  const roleParam = searchParams.get('role') as UserRole || 'resident';

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    
    // Universal Document and Address fields
    address: '',
    proof_of_address_type: '',
    identification_type: '',
    proof_of_address: null as File | null,
    identification_document: null as File | null,

    // Store Fields
    business_registration_document: null as File | null,

    // Service Provider Fields
    service_category: '', 
    manual_service_category: '',
    skill_certification_document: null as File | null,

    // Rider Fields
    vehicle_type: '',
    license_plate_number: '',
    vehicle_license_document: null as File | null,
    driver_license_document: null as File | null, 
    
    is_outside_estate: false,
  });

  // Helper flags for conditional rendering and validation
  const requiresAddressAndDocuments = ['resident', 'store', 'service_provider', 'rider'].includes(roleParam);
  const requiresStoreDetails = roleParam === 'store';
  const requiresServiceCategory = roleParam === 'service_provider';
  const requiresRiderDetails = roleParam === 'rider';
  
  // Logic to determine if 'is_outside_estate' checkbox should be shown
  const showOutsideEstateCheckbox = roleParam !== 'resident';

  const getCardTitle = () => {
    switch (roleParam) {
      case 'resident': return 'Resident Onboarding';
      case 'store': return 'Store Registration';
      case 'service_provider': return 'Service Provider Application';
      case 'rider': return 'Rider Application';
      default: return 'User Registration';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | React.ChangeEvent<HTMLTextAreaElement>>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFormData({ ...formData, [field]: file });
  };
  
  const handleSelectChange = (value: string, field: keyof typeof formData) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // --- Basic Validation ---
    if (!formData.full_name || !formData.email || !formData.password || !formData.phone_number) {
        toast.error("Please fill in all required basic fields.");
        setLoading(false);
        return;
    }

    let finalServiceCategory = formData.service_category;

    // --- Role-Specific Validation ---
    if (requiresStoreDetails && !formData.business_registration_document) {
        toast.error("Certificate of Incorporation or Business Registration is required.");
        setLoading(false);
        return;
    }

    if (requiresServiceCategory) {
        if (!finalServiceCategory) {
            toast.error("Please select a service category.");
            setLoading(false);
            return;
        }
        if (finalServiceCategory === 'other') {
            if (!formData.manual_service_category) {
                toast.error("Please specify your service category.");
                setLoading(false);
                return;
            }
            finalServiceCategory = formData.manual_service_category;
        }
        if (!formData.skill_certification_document) {
            toast.error("Skill Certification document is required.");
            setLoading(false);
            return;
        }
    }
    
    if (requiresRiderDetails) {
        if (!formData.vehicle_type || !formData.license_plate_number) {
            toast.error("Please fill in all vehicle details.");
            setLoading(false);
            return;
        }
        if (!formData.vehicle_license_document || !formData.driver_license_document) {
            toast.error("Both Vehicle License and Driver's License documents are required.");
            setLoading(false);
            return;
        }
    }

    // --- Universal Verification Validation ---
    const isVerificationRequired = requiresAddressAndDocuments && !formData.is_outside_estate;

    if (requiresAddressAndDocuments && !formData.address) {
         toast.error(`Please provide the required address.`);
        setLoading(false);
        return;
    }

    if (isVerificationRequired) {
        if (!formData.proof_of_address || !formData.identification_document || !formData.proof_of_address_type || !formData.identification_type) {
            toast.error(`Please provide the required address verification documents and select document types.`);
            setLoading(false);
            return;
        }
    }
    
    // --- Submission ---
    try {
      
      const profileData: SignUpProfileParams = {
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          role: roleParam, // Use roleParam (which is of type UserRole)
          
          address: formData.address,
          // Only pass verification docs if they are actually required (i.e., not outside estate)
          proof_of_address_type: isVerificationRequired ? formData.proof_of_address_type : undefined,
          proof_of_address: isVerificationRequired ? formData.proof_of_address : null,
          identification_type: isVerificationRequired ? formData.identification_type : undefined,
          identification_document: isVerificationRequired ? formData.identification_document : null,

          // Store
          business_registration_document: formData.business_registration_document,
          
          // Service Provider
          service_category: finalServiceCategory, 
          skill_certification_document: formData.skill_certification_document,

          // Rider
          vehicle_type: formData.vehicle_type,
          license_plate_number: formData.license_plate_number,
          vehicle_license_document: formData.vehicle_license_document,
          driver_license_document: formData.driver_license_document,

          is_outside_estate: formData.is_outside_estate,
      };

      await authHelpers.signUp(formData.email, formData.password, profileData);

      // Clear form and display success
      setFormData({
        email: '', password: '', full_name: '', phone_number: '', 
        address: '', proof_of_address_type: '', identification_type: '', 
        proof_of_address: null, identification_document: null, service_category: '',
        manual_service_category: '', skill_certification_document: null,
        vehicle_type: '', license_plate_number: '', vehicle_license_document: null, driver_license_document: null,
        business_registration_document: null,
        is_outside_estate: false,
      });
      toast.success("Registration submitted! Awaiting admin approval.");
      
      // Navigate to the dedicated waiting page
      navigate('/awaiting-approval');

    } catch (err) {
      const errorMessage = (err as Error).message.includes('duplicate key') 
                           ? "You are already registered. Please sign in." 
                           : (err as Error).message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-semibold">{getCardTitle()}</h2>
        </div>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{getCardTitle()}</CardTitle>
            <CardDescription>
              Enter your details to register as a {roleParam.replace('_', ' ')}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* === BASIC FIELDS (Common to ALL roles) === */}
              <Input 
                id="full_name" name="full_name" placeholder="Full Name"
                value={formData.full_name} onChange={handleChange} required />
              <Input 
                id="phone_number" name="phone_number" placeholder="Phone Number"
                value={formData.phone_number} onChange={handleChange} required />
              <Input 
                id="email" name="email" type="email" placeholder="Email Address"
                value={formData.email} onChange={handleChange} required />
              <Input 
                id="password" name="password" type="password" placeholder="Password"
                value={formData.password} onChange={handleChange} required />

              {/* === SERVICE PROVIDER-SPECIFIC FIELDS === */}
              {requiresServiceCategory && (
                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <h3 className="text-lg font-semibold pt-2">Service Details</h3>
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="service_category">Service Category *</Label>
                    <Select onValueChange={(value) => handleSelectChange(value, 'service_category')} value={formData.service_category} required>
                      <SelectTrigger><SelectValue placeholder="Select a service category" /></SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {formData.service_category === 'other' && (
                      <Input
                          id="manual_service_category" name="manual_service_category"
                          placeholder="Specify your service (e.g., Dog Walker)"
                          value={formData.manual_service_category} onChange={handleChange} required className="mt-1"
                      />
                  )}
                  
                </div>
              )}

              {/* === RIDER-SPECIFIC FIELDS === */}
              {requiresRiderDetails && (
                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <h3 className="text-lg font-semibold pt-2">Vehicle Details</h3>
                  
                  {/* Vehicle Type Dropdown */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="vehicle_type">Vehicle Type *</Label>
                    <Select 
                      onValueChange={(value) => handleSelectChange(value, 'vehicle_type')}
                      value={formData.vehicle_type}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* License Plate Number */}
                  <Input 
                    id="license_plate_number" name="license_plate_number"
                    placeholder="License Plate Number (e.g., KJA-123AA)"
                    value={formData.license_plate_number} onChange={handleChange} required
                  />

                  {/* Driver's License Upload */}
                  <StyledFileInput
                    id="driver_license_document"
                    label="Driver's License Upload"
                    file={formData.driver_license_document}
                    onChange={(e) => handleFileChange(e, 'driver_license_document')}
                    required={true}
                    disabled={loading}
                  />

                  {/* Vehicle License Upload */}
                  <StyledFileInput
                    id="vehicle_license_document"
                    label="Vehicle License / Proof of Ownership"
                    file={formData.vehicle_license_document}
                    onChange={(e) => handleFileChange(e, 'vehicle_license_document')}
                    required={true}
                    disabled={loading}
                  />
                </div>
              )}


              {/* === UNIVERSAL VERIFICATION FIELDS (Address, ID, Proof of Address, Skills) === */}
              {requiresAddressAndDocuments && (
                <div className="space-y-4 pt-2 border-t border-gray-200">
                  <h3 className="text-lg font-semibold pt-2">
                    Verification & Location Details
                  </h3>
                  
                  {/* Address */}
                  <Input 
                    id="address" name="address"
                    placeholder={roleParam === 'store' ? 'Store Address' : 'Residence/Business Address'}
                    value={formData.address} onChange={handleChange} required
                  />

                  {/* Store Registration Document Upload (NEW for Store) */}
                  {requiresStoreDetails && (
                    <StyledFileInput
                        id="business_registration_document"
                        label="Business Registration / Incorporation Certificate"
                        file={formData.business_registration_document}
                        onChange={(e) => handleFileChange(e, 'business_registration_document')}
                        required={true}
                        disabled={loading}
                    />
                  )}
                  
                  {/* Skill Certification Upload (Only for Service Provider) */}
                  {roleParam === 'service_provider' && (
                    <StyledFileInput
                        id="skill_certification_document"
                        label="Skill Certification Document"
                        file={formData.skill_certification_document}
                        onChange={(e) => handleFileChange(e, 'skill_certification_document')}
                        required={true}
                        disabled={loading}
                    />
                  )}

                  {/* Proof of Address Upload */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="proof_of_address">Proof of Address {(!formData.is_outside_estate) && '*'}</Label>
                    <div className="flex space-x-2">
                      <Select required={!formData.is_outside_estate} onValueChange={(value) => handleSelectChange(value, 'proof_of_address_type')} value={formData.proof_of_address_type} disabled={formData.is_outside_estate || loading}>
                        <SelectTrigger className="w-1/2"><SelectValue placeholder="Document Type" /></SelectTrigger>
                        <SelectContent>
                          {proofOfAddressTypes.map(type => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Label className={`flex w-1/2 items-center justify-center border border-input rounded-md px-3 cursor-pointer hover:bg-gray-50 transition ${formData.is_outside_estate || loading ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}>
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.proof_of_address ? formData.proof_of_address.name : 'Choose File'}
                        <Input id="proof_of_address" name="proof_of_address" type="file" className="sr-only" 
                          onChange={(e) => handleFileChange(e, 'proof_of_address')} 
                          required={!formData.is_outside_estate}
                          disabled={formData.is_outside_estate || loading}
                        />
                      </Label>
                    </div>
                  </div>

                  {/* Identification Document Upload */}
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="identification_document">Identification Document {(!formData.is_outside_estate) && '*'}</Label>
                    <div className="flex space-x-2">
                      <Select required={!formData.is_outside_estate} onValueChange={(value) => handleSelectChange(value, 'identification_type')} value={formData.identification_type} disabled={formData.is_outside_estate || loading}>
                        <SelectTrigger className="w-1/2"><SelectValue placeholder="Document Type" /></SelectTrigger>
                        <SelectContent>
                          {identificationTypes.map(type => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Label className={`flex w-1/2 items-center justify-center border border-input rounded-md px-3 cursor-pointer hover:bg-gray-50 transition ${formData.is_outside_estate || loading ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}`}>
                        <Upload className="w-4 h-4 mr-2" />
                        {formData.identification_document ? formData.identification_document.name : 'Choose File'}
                        <Input id="identification_document" name="identification_document" type="file" className="sr-only" 
                          onChange={(e) => handleFileChange(e, 'identification_document')} 
                          required={!formData.is_outside_estate}
                          disabled={formData.is_outside_estate || loading}
                        />
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* === OUTSIDE ESTATE CHECKBOX (Hidden for Resident) === */}
              {showOutsideEstateCheckbox && (
                <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
                  <Checkbox
                    id="outside_estate" checked={formData.is_outside_estate}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_outside_estate: checked as boolean })}
                  />
                  <Label htmlFor="outside_estate" className="text-sm font-normal">
                    I am located outside the estate (Waives verification documents)
                  </Label>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading} variant="default">
                {loading ? 'Submitting...' : 'Submit Request'}
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/signin')}
                  className="text-blue-600 font-medium hover:underline"
                >
                  Sign in
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
