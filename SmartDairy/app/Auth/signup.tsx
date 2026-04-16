import { View, Text, TextInput, Pressable, ScrollView, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { signupRequest } from "../../services/authService";
import { useAuthStore } from "../../Store/auth.store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type SignupForm = {
  fname: string;
  lname: string;
  mobile: string;
  email: string;
  password: string;
  admintype: boolean;
};

export default function Signup() {
  const [form, setForm] = useState<SignupForm>({
    fname: "",
    lname: "",
    mobile: "",
    email: "",
    password: "",
    admintype: false, 
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignupForm, string>>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);

  const validate = () => {
    const newErrors: Partial<Record<keyof SignupForm, string>> = {};
    if (!form.fname.trim()) newErrors.fname = "First name is required";
    if (!form.lname.trim()) newErrors.lname = "Last name is required";
    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const updateForm = (key: keyof SignupForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  const handleSignup = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const data = await signupRequest(form);
      await login(data.user, data.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      setErrors({ email: err.message || "Signup failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingVertical: 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <Image 
            source={require("../../assets/images/icon.png")} 
            className="w-24 h-24 rounded-3xl mb-4 shadow-md"
            resizeMode="contain"
          />
          <Text className="text-3xl font-extrabold text-foreground mb-2 text-center">
            Create Account 🚀
          </Text>
          <Text className="text-muted-foreground text-center text-base px-4">
            Join us to manage your farm efficiently
          </Text>
        </View>

        <View className="space-y-4">
          <View className="flex-row items-start justify-between">
            <View className="flex-1 mr-2">
              <View className={`flex-row items-center h-14 rounded-2xl border px-3 shadow-sm ${errors.fname ? 'border-red-500' : 'border-border'}`}>
                <Ionicons name="person-outline" size={18} color={errors.fname ? "#ef4444" : "#9ca3af"} className="mr-2" />
                <TextInput
                  className="flex-1 text-foreground text-base h-full"
                  placeholder="First Name"
                  placeholderTextColor="#9ca3af"
                  value={form.fname}
                  onChangeText={(v) => updateForm("fname", v)}
                />
              </View>
              {errors.fname && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.fname}</Text>}
            </View>

            <View className="flex-1 ml-2">
              <View className={`flex-row items-center h-14 rounded-2xl border px-3 shadow-sm ${errors.lname ? 'border-red-500' : 'border-border'}`}>
                <TextInput
                  className="flex-1 text-foreground text-base h-full"
                  placeholder="Last Name"
                  placeholderTextColor="#9ca3af"
                  value={form.lname}
                  onChangeText={(v) => updateForm("lname", v)}
                />
              </View>
              {errors.lname && <Text className="text-red-500 text-xs mt-1 ml-1">{errors.lname}</Text>}
            </View>
          </View>

          <View>
            <View className={`flex-row items-center h-14 rounded-2xl border px-4 shadow-sm ${errors.mobile ? 'border-red-500' : 'border-border'}`}>
              <Ionicons name="call-outline" size={20} color={errors.mobile ? "#ef4444" : "#9ca3af"} className="mr-3" />
              <TextInput
                className="flex-1 text-foreground text-base h-full"
                placeholder="Mobile Number (10 digits)"
                placeholderTextColor="#9ca3af"
                keyboardType="phone-pad"
                value={form.mobile}
                onChangeText={(v) => updateForm("mobile", v)}
              />
            </View>
            {errors.mobile && <Text className="text-red-500 text-xs mt-1 ml-2">{errors.mobile}</Text>}
          </View>

          <View>
            <View className={`flex-row items-center h-14 rounded-2xl border px-4 shadow-sm ${errors.email ? 'border-red-500' : 'border-border'}`}>
              <Ionicons name="mail-outline" size={20} color={errors.email ? "#ef4444" : "#9ca3af"} className="mr-3" />
              <TextInput
                className="flex-1 text-foreground text-base h-full"
                placeholder="Email Address"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                value={form.email}
                onChangeText={(v) => updateForm("email", v)}
              />
            </View>
            {errors.email && <Text className="text-red-500 text-xs mt-1 ml-2">{errors.email}</Text>}
          </View>

          <View>
            <View className={`flex-row items-center h-14 rounded-2xl border px-4 shadow-sm ${errors.password ? 'border-red-500' : 'border-border'}`}>
              <Ionicons name="lock-closed-outline" size={20} color={errors.password ? "#ef4444" : "#9ca3af"} className="mr-3" />
              <TextInput
                className="flex-1 text-foreground text-base h-full"
                placeholder="Password (min. 6 characters)"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={(v) => updateForm("password", v)}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} className="p-2">
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9ca3af" />
              </Pressable>
            </View>
            {errors.password && <Text className="text-red-500 text-xs mt-1 ml-2">{errors.password}</Text>}
          </View>
        </View>

        <Pressable
          onPress={handleSignup}
          disabled={loading}
          className={`mt-8 h-14 rounded-2xl bg-primary items-center justify-center flex-row shadow-lg ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : null}
          <Text className="text-primary-foreground font-bold text-lg">
            {loading ? "Creating Account..." : "Sign Up"}
          </Text>
        </Pressable>

        <View className="flex-row justify-center mt-8 pb-10">
          <Text className="text-muted-foreground mr-1">Already have an account?</Text>
          <Pressable onPress={() => router.back()}>
            <Text className="text-primary font-bold">Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
