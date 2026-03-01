import { View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { loginRequest } from "../../services/authService";
import { useAuthStore } from "../../Store/auth.store";
import { router } from "expo-router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = useAuthStore((s) => s.login);

  const handleLogin = async () => {
    try {
      const data = await loginRequest(email, password);
      // data should contain token and user info
      await login(data.user, data.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      <Text className="text-3xl font-bold text-foreground mb-2">
        Welcome back 👋
      </Text>
      <Text className="text-muted-foreground mb-8">
        Sign in to continue
      </Text>

      <View className="space-y-4">
        <TextInput
          className="h-12 rounded-xl border border-border px-4 text-foreground"
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          className="h-12 rounded-xl border border-border px-4 text-foreground"
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {error ? (
        <Text className="text-red-500 mt-3">{error}</Text>
      ) : null}

      <Pressable
        onPress={handleLogin}
        className="mt-6 h-12 rounded-xl bg-primary items-center justify-center"
      >
        <Text className="text-primary-foreground font-semibold text-base">
          Login
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/Auth/signup")}
        className="mt-4 items-center"
      >
        <Text className="text-primary font-medium">
          Create an account
        </Text>
      </Pressable>
    </View>
  );
}
