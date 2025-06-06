import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import { COLORS } from '@/app/constants/colors';

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  icon: React.ElementType;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  unit?: string;
  type?: 'text' | 'numeric' | 'dropdown';
  dropdownData?: string[];
}

export function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  keyboardType = 'default',
  unit,
  type = 'text',
  dropdownData = [],
}: InputFieldProps) {
  const [inputText, setInputText] = useState(value || '');
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setInputText(value);
  }, [value]);

  useEffect(() => {
    if (type === 'dropdown' && inputText.length > 0) {
      const filtered = dropdownData.filter(item =>
        item.toLowerCase().includes(inputText.toLowerCase())
      );
      setFilteredData(filtered.slice(0, 10));
      setShowDropdown(filtered.length > 0);
    } else {
      setShowDropdown(false);
    }
  }, [inputText, dropdownData, type]);

  const handleSelectItem = (item: string) => {
    setInputText(item);
    onChangeText(item);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const handleChangeText = (text: string) => {
    setInputText(text);
    onChangeText(text);
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelContainer}>
        <Icon size={20} color={COLORS.primary} />
        <Text style={styles.label}>{label}</Text>
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          value={inputText}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          style={styles.input}
          keyboardType={type === 'numeric' ? keyboardType : 'default'}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>

      {type === 'dropdown' && showDropdown && (
        <View style={styles.dropdown}>
          {filteredData.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => handleSelectItem(item)}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
    zIndex: 10, // garante que o dropdown fique sobre outros componentes
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: COLORS.text,
  },
  unit: {
    fontSize: 14,
    color: COLORS.textLight,
    fontWeight: '500',
    marginLeft: 8,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    maxHeight: 180,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
