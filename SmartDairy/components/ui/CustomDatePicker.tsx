import { useState } from "react";
import { Platform, Pressable, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Props = {
  value: string;
  onChange: (date: string) => void;
};


export default function CustomDatePicker({
  value,
  onChange,
}: Props) {
  const [show, setShow] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      const formatted = selectedDate.toISOString().split("T")[0];
      onChange(formatted);
    }
  };

  // 🌐 WEB
  if (Platform.OS === "web") {
    return (
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        max={new Date().toISOString().split("T")[0]}
        style={{
          padding: 12,
          borderRadius: 10,
          border: "1px solid #ccc",
          width: "100%",
        }}
      />
    );
  }

  // 📱 MOBILE
  return (
    <>
      <Pressable
        onPress={() => setShow(true)}
        style={{
          padding: 12,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#ccc",
        }}
      >
        <Text>{value || "YYYY-MM-DD"}</Text>
      </Pressable>

      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </>
  );
}