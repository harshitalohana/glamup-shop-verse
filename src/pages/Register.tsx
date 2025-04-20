import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";

const interests = [
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty" },
  { id: "accessories", label: "Accessories" },
  { id: "footwear", label: "Footwear" },
  { id: "seasonal", label: "Seasonal" },
];

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    gender: "Prefer not to say",
    city: "",
    pincode: "",
    interests: [] as string[],
    age: 25,
    budget: 500,
    role: "user" as const,
    profileImage: undefined as File | undefined,
  });
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (id: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, id]
        : prev.interests.filter((i) => i !== id),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profileImage: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Name, email, and password are required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      // In a real app, we'd upload the image to a server and get a URL
      // For now, we'll use a fake URL if an image was selected
      const profileImage = formData.profileImage 
        ? URL.createObjectURL(formData.profileImage) 
        : undefined;

      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        city: formData.city,
        pincode: formData.pincode,
        interests: formData.interests,
        age: formData.age,
        budget: formData.budget,
        role: formData.role,
        profileImage,
      });

      if (success) {
        // User will be redirected automatically by AuthContext
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-screen py-12 bg-gray-50">
        <div className="w-full max-w-2xl p-4">
          <Card className="border-glamup-purple/20">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
              <CardDescription className="text-center">
                Fill out the form below to create your GlamUp account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Smith"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="glamup-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="glamup-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="glamup-input"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="glamup-input"
                      required
                    />
                  </div>

                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="1234567890"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="glamup-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger className="glamup-input">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non-binary">Non-binary</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="glamup-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode/Zip</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      placeholder="10001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="glamup-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Profile Image</Label>
                  <div className="flex items-center space-x-4">
                    {imagePreview && (
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <Input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="glamup-input flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Interests</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {interests.map((interest) => (
                      <div key={interest.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`interest-${interest.id}`}
                          checked={formData.interests.includes(interest.id)}
                          onCheckedChange={(checked) =>
                            handleInterestChange(interest.id, checked === true)
                          }
                        />
                        <label
                          htmlFor={`interest-${interest.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {interest.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Age: {formData.age}</Label>
                  </div>
                  <Slider
                    value={[formData.age]}
                    min={18}
                    max={80}
                    step={1}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, age: value[0] }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label>Monthly Shopping Budget: ${formData.budget}</Label>
                  </div>
                  <Slider
                    value={[formData.budget]}
                    min={100}
                    max={5000}
                    step={100}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, budget: value[0] }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => 
                      handleSelectChange("role", value as "admin" | "user")
                    }
                  >
                    <SelectTrigger className="glamup-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Regular User</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full glamup-btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-glamup-purple hover:underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
