import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { Text } from "../Themed";

interface InputProps extends TextInputProps {
  label?: string;
}

export default function Input({ label, ...rest }: InputProps) {
   return (
     <>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            {...rest}
        />
    </>
   )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderColor: '#ddd',
    borderWidth: 1,
  },
});