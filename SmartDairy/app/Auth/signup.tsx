import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useState } from "react";
import { signupRequest } from "../../services/authService";
import { useAuthStore } from "../../Store/auth.store";
import { router } from "expo-router";

export default function Signup() {
  const [form, setForm] = useState({
    fname: "",
    lname: "",
    mobile: "",
    email: "",
    password: "",
    admintype: false,
  });

  const login = useAuthStore((s) => s.login);

  const handleSignup = async () => {
    try {
      const data = await signupRequest(form);
      await login({ email: form.email }, data.token);
      router.replace("/(tabs)");
    } catch (err: any) {
      alert(err.message || "Signup failed");
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background px-6"
      contentContainerStyle={{ paddingVertical: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-3xl font-bold text-foreground mb-2">
        Create account 🚀
      </Text>
      <Text className="text-muted-foreground mb-8">
        Let’s get you started
      </Text>

      <View className="space-y-4">
        {Object.entries(form).map(([key, value]) =>
          key !== "admintype" ? (
            <TextInput
              key={key}
              className="h-12 rounded-xl border border-border px-4 text-foreground"
              placeholder={key.toUpperCase()}
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              secureTextEntry={key === "password"}
              value={value}
              onChangeText={(v) =>
                setForm((prev) => ({ ...prev, [key]: v }))
              }
            />
          ) : null
        )}
      </View>

      <Pressable
        onPress={handleSignup}
        className="mt-8 h-12 rounded-xl bg-primary items-center justify-center"
      >
        <Text className="text-primary-foreground font-semibold text-base">
          Sign Up
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        className="mt-4 items-center"
      >
        <Text className="text-primary font-medium">
          Already have an account? Login
        </Text>
      </Pressable>
    </ScrollView>
  );
}
