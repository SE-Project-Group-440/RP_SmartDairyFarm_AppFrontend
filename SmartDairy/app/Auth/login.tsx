import { View, Text, TextInput, Pressable, Image, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useState } from "react";
import { loginRequest } from "../../services/authService";
import { useAuthStore } from "../../Store/auth.store";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = useAuthStore((s) => s.login);

  const validate = () => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Email is invalid";
    if (!password) return "Password is required";
    return "";
  };

  const handleLogin = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await loginRequest(email, password);
      // data should contain token and user info
      await login(data.user, data.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-10">
          <Image 
            source={require("../../assets/images/icon.png")} 
            className="w-28 h-28 rounded-3xl mb-6 shadow-md"
            resizeMode="contain"
          />
          <Text className="text-4xl font-extrabold text-foreground mb-2 text-center">
            Welcome Back 👋
          </Text>
          <Text className="text-muted-foreground text-center text-base px-4">
            Sign in to continue managing your smart dairy farm
          </Text>
        </View>

        <View className="gap-5">
          <View className="mb-2">
            <View className={`flex-row items-center h-14 rounded-2xl border px-4 shadow-sm ${error.includes("Email") ? "border-red-500" : "border-border"}`}>
              <Ionicons name="mail-outline" size={20} color={error.includes("Email") ? "#ef4444" : "#9ca3af"} className="mr-3" />
              <TextInput
                className="flex-1 text-foreground text-base h-full"
                placeholder="Email Address"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
              />
            </View>
          </View>

          <View>
            <View className={`flex-row items-center h-14 rounded-2xl border px-4 shadow-sm ${error.includes("Password") ? "border-red-500" : "border-border"}`}>
              <Ionicons name="lock-closed-outline" size={20} color={error.includes("Password") ? "#ef4444" : "#9ca3af"} className="mr-3" />
              <TextInput
                className="flex-1 text-foreground text-base h-full"
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} className="p-2">
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9ca3af" />
              </Pressable>
            </View>
          </View>
        </View>

        {error ? (
          <View className="flex-row items-center mt-4 bg-red-100/50 p-3 rounded-xl border border-red-200">
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text className="text-red-500 ml-2 flex-1 font-medium">{error}</Text>
          </View>
        ) : null}

        <Pressable className="mt-4 mb-2 items-end">
          <Text className="text-primary font-semibold">Forgot Password?</Text>
        </Pressable>

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className={`mt-6 h-14 rounded-2xl bg-primary items-center justify-center flex-row shadow-lg ${loading ? 'opacity-70' : ''}`}
        >
          {loading ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : null}
          <Text className="text-primary-foreground font-bold text-lg">
            {loading ? "Signing in..." : "Login"}
          </Text>
        </Pressable>

        <View className="flex-row justify-center mt-8">
          <Text className="text-muted-foreground mr-1">Don't have an account?</Text>
          <Pressable onPress={() => router.push("/Auth/signup")}>
            <Text className="text-primary font-bold">Create one</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
