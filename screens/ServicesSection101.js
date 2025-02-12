import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";

const ServicesSection101 = ({ onServicesChange }) => {
  const [availableServices, setAvailableServices] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [customServices, setCustomServices] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        axios.get("http://192.168.8.138:5001/api/auth/services"),
        axios.get("http://192.168.8.138:5001/api/auth/categories"),
      ]);

      if (servicesRes.data?.success) {
        setAvailableServices(servicesRes.data.services);
      }
      if (categoriesRes.data?.success) {
        setAvailableCategories(categoriesRes.data.categories);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load services or categories");
    }
  };

  const validateService = (service) => {
    const errors = {};
    if (!service.name) errors.name = "Service name is required";
    if (!service.price) errors.price = "Price is required";
    if (!service.priceType) errors.priceType = "Price type is required";
    if (!service.description) errors.description = "Description is required";
    return errors;
  };

  const handleAddPredefinedService = (service) => {
    if (selectedServices.find((s) => s.name === service.name)) {
      Alert.alert("Error", "This service is already added");
      return;
    }
    const newService = { ...service, price: "", priceType: "" };
    setSelectedServices([...selectedServices, newService]);
    onServicesChange([...selectedServices, ...customServices]);
    setIsSaved(false);
  };

  const handleAddCustomService = (category) => {
    setCustomServices([
      ...customServices,
      { category, name: "", price: "", priceType: "", description: "", isCustom: true },
    ]);
  };
  

  const handleUpdateService = (index, key, value, isCustom = false) => {
    const services = isCustom ? [...customServices] : [...selectedServices];
    services[index] = { ...services[index], [key]: value };

    if (isCustom) {
      setCustomServices(services);
    } else {
      setSelectedServices(services);
    }

    onServicesChange([...selectedServices, ...customServices]);

    setErrors((prev) => ({
      ...prev,
      [`${isCustom ? "custom" : "predefined"}_${index}`]: undefined,
    }));
    const serviceErrors = validateService(services[index]);
    if (Object.keys(serviceErrors).length > 0) {
      setErrors((prev) => ({
        ...prev,
        [`${isCustom ? "custom" : "predefined"}_${index}`]: serviceErrors,
      }));
    }

    setIsSaved(false);
  };

  const handleSubmit = () => {
    let isValid = true;
    const allServices = [...selectedServices, ...customServices];

    allServices.forEach((service, index) => {
      const serviceErrors = validateService(service);
      if (Object.keys(serviceErrors).length > 0) {
        isValid = false;
        const key = service.category ? `custom_${index}` : `predefined_${index}`;
        setErrors((prev) => ({
          ...prev,
          [key]: serviceErrors,
        }));
      }
    });

    if (!isValid) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsSaved(true);
    onServicesChange(allServices);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialIcons name="list" size={24} color="#1a237e" />
          <Text style={styles.sectionTitle}>Services</Text>
        </View>

        {/* Predefined Services */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Predefined Services</Text>
          <Picker
            style={styles.picker}
            onValueChange={(value) => {
              if (value) {
                const service = availableServices.find((s) => s.name === value);
                handleAddPredefinedService(service);
              }
            }}
          >
            <Picker.Item label="Select a Service" value="" />
            {availableServices.map((service, index) => (
              <Picker.Item
                key={index}
                label={`${service.name} (${service.category})`}
                value={service.name}
              />
            ))}
          </Picker>

          {selectedServices.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.serviceName}>{`${service.name} (${service.category})`}</Text>

              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    errors[`predefined_${index}`]?.price && styles.inputError,
                  ]}
                  placeholder="Price"
                  value={service.price}
                  onChangeText={(value) =>
                    handleUpdateService(index, "price", value)
                  }
                  keyboardType="numeric"
                />
                {errors[`predefined_${index}`]?.price && (
                  <Text style={styles.errorText}>
                    {errors[`predefined_${index}`].price}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Picker
                  selectedValue={service.priceType}
                  style={[
                    styles.picker,
                    errors[`predefined_${index}`]?.priceType &&
                      styles.pickerError,
                  ]}
                  onValueChange={(value) =>
                    handleUpdateService(index, "priceType", value)
                  }
                >
                  <Picker.Item label="Price Type" value="" />
                  <Picker.Item label="Per Hour" value="hourly" />
                  <Picker.Item label="Once-Off" value="once-off" />
                </Picker>
                {errors[`predefined_${index}`]?.priceType && (
                  <Text style={styles.errorText}>
                    {errors[`predefined_${index}`].priceType}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Custom Services */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Custom Services</Text>
          <Picker
            style={styles.picker}
            onValueChange={(value) => {
              if (value) handleAddCustomService(value);
            }}
          >
            <Picker.Item label="Select a Category" value="" />
            {availableCategories.map((category, index) => (
              <Picker.Item key={index} label={category} value={category} />
            ))}
          </Picker>

          {customServices.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Text style={styles.categoryName}>{service.category}</Text>

              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    errors[`custom_${index}`]?.name && styles.inputError,
                  ]}
                  placeholder="Service Name"
                  value={service.name}
                  onChangeText={(value) =>
                    handleUpdateService(index, "name", value, true)
                  }
                />
                {errors[`custom_${index}`]?.name && (
                  <Text style={styles.errorText}>
                    {errors[`custom_${index}`].name}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    errors[`custom_${index}`]?.price && styles.inputError,
                  ]}
                  placeholder="Price"
                  value={service.price}
                  onChangeText={(value) =>
                    handleUpdateService(index, "price", value, true)
                  }
                  keyboardType="numeric"
                />
                {errors[`custom_${index}`]?.price && (
                  <Text style={styles.errorText}>
                    {errors[`custom_${index}`].price}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <TextInput
                  style={[
                    styles.input,
                    errors[`custom_${index}`]?.description && styles.inputError,
                  ]}
                  placeholder="Description"
                  value={service.description}
                  onChangeText={(value) =>
                    handleUpdateService(index, "description", value, true)
                  }
                />
                {errors[`custom_${index}`]?.description && (
                  <Text style={styles.errorText}>
                    {errors[`custom_${index}`].description}
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Picker
                  selectedValue={service.priceType}
                  style={[
                    styles.picker,
                    errors[`custom_${index}`]?.priceType &&
                      styles.pickerError,
                  ]}
                  onValueChange={(value) =>
                    handleUpdateService(index, "priceType", value, true)
                  }
                >
                  <Picker.Item label="Price Type" value="" />
                  <Picker.Item label="Per Hour" value="hourly" />
                  <Picker.Item label="Once-Off" value="once-off" />
                </Picker>
                {errors[`custom_${index}`]?.priceType && (
                  <Text style={styles.errorText}>
                    {errors[`custom_${index}`].priceType}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSaved && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSaved}
        >
          <Text style={styles.submitButtonText}>
            {isSaved ? "Services Saved" : "Save Services"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a237e',
    marginLeft: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 12,
  },
  serviceItem: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
    marginTop: 16,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a237e',
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#E53935',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  pickerError: {
    borderColor: '#E53935',
  },
  errorText: {
    color: '#E53935',
    fontSize: 12,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#1a237e',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: "#b0bec5",
  },
});

export default ServicesSection101;