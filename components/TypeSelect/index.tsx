import { StyleSheet } from "react-native";
import { Text } from "../Themed";
import TypeDropdown from "../TypeModal";

interface TypeSelectProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
}

export default function TypeSelect({ label, onChange, value }: TypeSelectProps) {
   return (
     <>
        <Text style={styles.label}>{label}</Text>
        <TypeDropdown
            value={value}
            onChange={onChange}
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
});