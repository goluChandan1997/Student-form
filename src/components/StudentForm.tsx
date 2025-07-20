'use client';
import { useState } from 'react';
import {
  Upload,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  MessageSquare,
  Camera,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface StudentFormData {
  name: string;
  fathersName: string;
  email: string;
  mobile: string;
  age: string;
  studyStartDate: string;
  studyEndDate: string;
  picture: File | null;
  feedback: string;
  address: string;
}

export default function StudentForm() {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    fathersName: '',
    email: '',
    mobile: '',
    age: '',
    studyStartDate: '',
    studyEndDate: '',
    picture: null,
    feedback: '',
    address: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorDetails, setErrorDetails] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error messages when user starts typing
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
      setErrorDetails([]);
    }
  };

  const resizeAndCompressImage = (file: File, targetSizeKB: number = 500): Promise<File> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        const maxWidth = 1920;
        const maxHeight = 1080;
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx?.drawImage(img, 0, 0, width, height);

        // Binary search for optimal quality
        let quality = 0.8;
        let minQuality = 0.1;
        let maxQuality = 0.9;
        let attempts = 0;
        const maxAttempts = 10;

        const tryCompress = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              const fileSizeKB = blob.size / 1024;
              attempts++;

              if (fileSizeKB <= targetSizeKB || attempts >= maxAttempts) {
                // Convert blob to File
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else if (fileSizeKB > targetSizeKB) {
                maxQuality = quality;
                quality = (minQuality + quality) / 2;
                tryCompress();
              } else {
                minQuality = quality;
                quality = (quality + maxQuality) / 2;
                tryCompress();
              }
            },
            file.type,
            quality,
          );
        };

        tryCompress();
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type first
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select an image file');
        setSubmitStatus('error');
        return;
      }

      try {
        // You might want to add a loading state to your type union, or handle this differently
        // setSubmitStatus("loading"); // Remove this line if you don't have "loading" in your union type
        setErrorMessage('');

        // Resize and compress the image
        const compressedFile = await resizeAndCompressImage(file, 500);

        setFormData((prev) => ({ ...prev, picture: compressedFile }));
        const url = URL.createObjectURL(compressedFile);
        setPreviewUrl(url);

        // Clear any previous errors
        setSubmitStatus('idle');
        setErrorMessage('');
        setErrorDetails([]);

        // Optional: Log the final file size
        console.log(`Original size: ${(file.size / 1024).toFixed(2)}KB`);
        console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(2)}KB`);
      } catch (error) {
        setErrorMessage('Failed to process image. Please try another file.');
        setSubmitStatus('error');
        console.error('Image compression error:', error);
      }
    }
  };
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     // Validate file size (5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       setErrorMessage("File size must be less than 5MB");
  //       setSubmitStatus("error");
  //       return;
  //     }

  //     // Validate file type
  //     if (!file.type.startsWith("image/")) {
  //       setErrorMessage("Please select an image file");
  //       setSubmitStatus("error");
  //       return;
  //     }

  //     setFormData((prev) => ({ ...prev, picture: file }));
  //     const url = URL.createObjectURL(file);
  //     setPreviewUrl(url);

  //     // Clear any previous errors
  //     if (submitStatus === "error") {
  //       setSubmitStatus("idle");
  //       setErrorMessage("");
  //       setErrorDetails([]);
  //     }
  //   }
  // };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.fathersName.trim()) errors.push("Father's name is required");
    // if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.mobile.trim()) errors.push('Mobile number is required');
    if (!formData.age.trim()) errors.push('Age is required');
    if (!formData.studyStartDate.trim()) errors.push('Study start date is required');
    if (!formData.studyEndDate.trim()) errors.push('Study end date is required');
    if (!formData.picture) errors.push('Picture is required');
    if (!formData.feedback.trim()) errors.push('Feedback is required');
    if (!formData.address.trim()) errors.push('Address is required');

    // Additional validations
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile.replace(/\s/g, ''))) {
      errors.push('Mobile number should be 10 digits');
    }

    if (formData.age) {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 1 || age > 100) {
        errors.push('Age should be between 1 and 100');
      }
    }

    // Date validation
    if (formData.studyStartDate && formData.studyEndDate) {
      const startDate = new Date(formData.studyStartDate);
      const endDate = new Date(formData.studyEndDate);

      if (startDate >= endDate) {
        errors.push('Study end date must be after start date');
      }
    }

    return errors;
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');
    setErrorDetails([]);

    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setSubmitStatus('error');
      setErrorMessage('Please fix the following errors:');
      setErrorDetails(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();

      // Debug: Log what we're sending
      console.log('=== Frontend Debug ===');
      console.log('Form data before sending:', formData);

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'picture' && value instanceof File) {
          formDataToSend.append(key, value);
          console.log(`Appending ${key}:`, value.name, value.type, value.size);
        } else if (typeof value === 'string' && value.trim() !== '') {
          formDataToSend.append(key, value.trim());
          console.log(`Appending ${key}:`, value.trim());
        }
      });

      // Debug: Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
      console.log('formDataToSend', formDataToSend);
      const response = await fetch('https://be-student-form.onrender.com/api/students', {
        method: 'POST',
        // credentials: "include",
        body: formDataToSend,
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          fathersName: '',
          email: '',
          mobile: '',
          age: '',
          studyStartDate: '',
          studyEndDate: '',
          picture: null,
          feedback: '',
          address: '',
        });
        setPreviewUrl(null);
      } else {
        setSubmitStatus('error');
        setErrorMessage(responseData.error || 'An error occurred during registration');

        if (responseData.details) {
          if (Array.isArray(responseData.details)) {
            setErrorDetails(responseData.details);
          } else {
            setErrorDetails([responseData.details]);
          }
        }

        if (responseData.missingFields) {
          const missingFieldNames = Object.entries(responseData.missingFields)
            .filter(([_, missing]) => missing)
            .map(([field, _]) => field);
          setErrorDetails((prev) => [...prev, `Missing fields: ${missingFieldNames.join(', ')}`]);
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 bg-gradient-to-r from-blue-600 to-purple-600 px-4 md:px-8 py-6 md:py-8">
            {/* Profile Section */}
            <div className="col-span-1 md:col-span-3 flex flex-col items-center md:items-start">
              <img
                className="rounded-full mb-2"
                src="/images/rahul-profile.jpeg"
                alt="Rahul's Profile"
                width={110}
                height={110}
              />
              <p className="text-blue-100 text-base md:text-lg font-bold text-center md:text-left">
                Rahul Singh
              </p>
            </div>

            {/* Content Section */}
            <div className="col-span-1 md:col-span-9 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">
                APOGEE EDUCATION CENTRE
              </h1>
              <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 md:mb-4 leading-tight">
                Student Registration
              </h1>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg">
                Fill out the form below to register
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-8">
            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center text-red-800 mb-2">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
                {errorDetails.length > 0 && (
                  <ul className="text-red-700 text-sm mt-2 ml-7 space-y-1">
                    {errorDetails.map((detail, index) => (
                      <li key={index}>• {detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">Registration submitted successfully!</span>
                </div>
              </div>
            )}

            {/* Personal Information Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    Full Name <b className="text-red-700 ml-2"> *</b>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    Father's Name <b className="text-red-700 ml-2"> *</b>
                  </label>
                  <input
                    type="text"
                    name="fathersName"
                    value={formData.fathersName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                    placeholder="Enter father's name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4 mr-2 text-blue-500" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4 mr-2 text-blue-500" />
                    Mobile Number <b className="text-red-700 ml-2"> *</b>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    maxLength={10}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    Age <b className="text-red-700 ml-2"> *</b>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors"
                    placeholder="Enter your age"
                  />
                </div>
              </div>
            </div>

            {/* Study Duration Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                Study Duration
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    Start Date <b className="text-red-700 ml-2"> *</b>
                  </label>
                  <input
                    type="date"
                    name="studyStartDate"
                    value={formData.studyStartDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                    End Date <b className="text-red-700 ml-2"> *</b>
                  </label>
                  <input
                    type="date"
                    name="studyEndDate"
                    value={formData.studyEndDate}
                    onChange={handleInputChange}
                    required
                    min={formData.studyStartDate || undefined}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                </div>
              </div>

              {/* Duration Display */}
              {formData.studyStartDate && formData.studyEndDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="text-blue-800 text-sm">
                    <strong>Study Duration:</strong>{' '}
                    {(() => {
                      const start = new Date(formData.studyStartDate);
                      const end = new Date(formData.studyEndDate);
                      const diffTime = Math.abs(end.getTime() - start.getTime());
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      const years = Math.floor(diffDays / 365);
                      const months = Math.floor((diffDays % 365) / 30);
                      const days = diffDays % 30;

                      let duration = [];
                      if (years > 0) duration.push(`${years} year${years > 1 ? 's' : ''}`);
                      if (months > 0) duration.push(`${months} month${months > 1 ? 's' : ''}`);
                      if (days > 0) duration.push(`${days} day${days > 1 ? 's' : ''}`);

                      return duration.join(', ') || '0 days';
                    })()}
                  </div>
                </div>
              )}
            </div>

            {/* Picture Upload Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                Picture Upload
              </h2>

              <div className="space-y-4">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Camera className="w-4 h-4 mr-2 text-blue-500" />
                  Upload Picture <b className="text-red-700 ml-2"> *</b>
                </label>

                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Feedback and Address Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-blue-200 pb-2">
                Additional Information
              </h2>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MessageSquare className="w-4 h-4 mr-2 text-blue-500" />
                    Feedback <b className="text-red-700 ml-2"> *</b>
                  </label>
                  <textarea
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors resize-none"
                    placeholder="Share your thoughts, experience, or any feedback..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                    Address <b className="text-red-700 ml-2"> *</b>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg transition-colors resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
