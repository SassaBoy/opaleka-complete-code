import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("predefined"); // "predefined" or "custom"

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        axios.get("https://service-booking-backend-eb9i.onrender.com/api/auth/services"),
        axios.get("https://service-booking-backend-eb9i.onrender.com/api/auth/categories"),
      ]);

      if (servicesRes.data?.success) {
        setAvailableServices(servicesRes.data.services);
      }
      if (categoriesRes.data?.success) {
        setAvailableCategories(categoriesRes.data.categories);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load services or categories. Please try again later.");
    } finally {
      setIsLoading(false);
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
      Alert.alert("Service Already Added", "This service is already in your list.");
      return;
    }
    const newService = { ...service, price: "", priceType: "" };
    setSelectedServices([...selectedServices, newService]);
    onServicesChange([...selectedServices, ...customServices, newService]);
    setIsSaved(false);
  };

  const handleAddCustomService = (category) => {
    const newService = {
      category,
      name: "",
      price: "",
      priceType: "",
      description: "",
      isCustom: true,
    };
    setCustomServices([...customServices, newService]);
    onServicesChange([...selectedServices, ...customServices, newService]);
    setIsSaved(false);
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

  const handleRemoveService = (index, isCustom = false) => {
    if (isCustom) {
      const updatedServices = [...customServices];
      updatedServices.splice(index, 1);
      setCustomServices(updatedServices);
      onServicesChange([...selectedServices, ...updatedServices]);
    } else {
      const updatedServices = [...selectedServices];
      updatedServices.splice(index, 1);
      setSelectedServices(updatedServices);
      onServicesChange([...updatedServices, ...customServices]);
    }
    setIsSaved(false);
  };

  const handleSubmit = () => {
    let isValid = true;
    const allServices = [...selectedServices, ...customServices];
    const newErrors = {};

    allServices.forEach((service, index) => {
      const serviceErrors = validateService(service);
      if (Object.keys(serviceErrors).length > 0) {
        isValid = false;
        const key = service.isCustom ? `custom_${index}` : `predefined_${index}`;
        newErrors[key] = serviceErrors;
      }
    });

    setErrors(newErrors);

    if (!isValid) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields for each service."
      );
      return;
    }

    if (allServices.length === 0) {
      Alert.alert(
        "No Services Added",
        "Please add at least one service before saving."
      );
      return;
    }

    setIsSaved(true);
    onServicesChange(allServices);
    Alert.alert("Success", "Your services have been saved successfully!");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
        <Text style={styles.loadingText}>Loading services...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        {/* Header */}
        <View style={styles.header}>
          <MaterialIcons name="business-center" size={30} color="#1a237e" />
          <Text style={styles.headerTitle}>Your Services</Text>
        </View>
        
        {/* Quick Guide */}
        <View style={styles.guideCard}>
          <Text style={styles.guideTitle}>
            <MaterialIcons name="info-outline" size={18} color="#1a237e" /> Quick Guide
          </Text>
          <Text style={styles.guideText}>
            1. Select services from our list or create your own
          </Text>
          <Text style={styles.guideText}>
            2. Set your price and pricing model for each service
          </Text>
          <Text style={styles.guideText}>
            3. Save your changes when you're done
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "predefined" && styles.activeTab]}
            onPress={() => setActiveTab("predefined")}
          >
            <MaterialIcons 
              name="list" 
              size={20} 
              color={activeTab === "predefined" ? "#1a237e" : "#78909c"} 
            />
            <Text style={[styles.tabText, activeTab === "predefined" && styles.activeTabText]}>
              Predefined Services
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === "custom" && styles.activeTab]}
            onPress={() => setActiveTab("custom")}
          >
            <MaterialIcons 
              name="add-circle-outline" 
              size={20} 
              color={activeTab === "custom" ? "#1a237e" : "#78909c"} 
            />
            <Text style={[styles.tabText, activeTab === "custom" && styles.activeTabText]}>
              Custom Services
            </Text>
          </TouchableOpacity>
        </View>

        {/* Predefined Services Tab */}
        {activeTab === "predefined" && (
          <View style={styles.card}>
            <View style={styles.stepIndicator}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={styles.stepText}>Select a service from our list</Text>
            </View>
            
            <View style={styles.selectContainer}>
              <Picker
                style={styles.picker}
                onValueChange={(value) => {
                  if (value) {
                    const service = availableServices.find((s) => s.name === value);
                    handleAddPredefinedService(service);
                  }
                }}
              >
                <Picker.Item label="↓ Tap here to select a service ↓" value="" />
                {availableServices.map((service, index) => (
                  <Picker.Item
                    key={index}
                    label={`${service.name} (${service.category})`}
                    value={service.name}
                  />
                ))}
              </Picker>
            </View>

            {selectedServices.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="playlist-add" size={40} color="#b0bec5" />
                <Text style={styles.emptyStateText}>
                  No services added yet
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Use the dropdown above to add services
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <Text style={styles.stepText}>Set price for each service</Text>
                </View>
                
                <Text style={styles.serviceCountText}>
                  {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} added
                </Text>
                
                {selectedServices.map((service, index) => (
                  <View key={index} style={styles.serviceCard}>
                    <View style={styles.serviceCardHeader}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveService(index)}
                        style={styles.removeButton}
                      >
                        <MaterialIcons name="delete-outline" size={24} color="#E53935" />
                      </TouchableOpacity>
                    </View>
                    
                    <Text style={styles.serviceCategory}>
                      <MaterialIcons name="category" size={14} color="#546e7a" /> {service.category}
                    </Text>
                    
                    <View style={styles.inputRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>
                          <MaterialIcons name="attach-money" size={14} color="#546e7a" /> Price*
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            errors[`predefined_${index}`]?.price && styles.inputError,
                          ]}
                          placeholder="Enter price"
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
                        <Text style={styles.inputLabel}>
                          <MaterialIcons name="schedule" size={14} color="#546e7a" /> Pricing*
                        </Text>
                        <Picker
                          selectedValue={service.priceType}
                          style={[
                            styles.picker,
                            styles.smallPicker,
                            { fontSize: 16, color: "#000", backgroundColor: "#fff" },
                            errors[`predefined_${index}`]?.priceType && styles.pickerError,
                          ]}
                          itemStyle={{ fontSize: 16, color: "#000" }}
                          dropdownIconColor="#1a237e"
                          mode="dropdown"
                          onValueChange={(value) =>
                            handleUpdateService(index, "priceType", value)
                          }
                        >
                          <Picker.Item label="Select Pricing Type" value="" color="#757575" />
                          <Picker.Item label="Per Hour" value="hourly" color="#000" />
                          <Picker.Item label="Fixed Price" value="once-off" color="#000" />
                        </Picker>

                        {errors[`predefined_${index}`]?.priceType && (
                          <Text style={styles.errorText}>
                            {errors[`predefined_${index}`].priceType}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* Custom Services Tab */}
        {activeTab === "custom" && (
          <View style={styles.card}>
            <View style={styles.stepIndicator}>
              <View style={styles.stepCircle}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={styles.stepText}>Select a category for your custom service</Text>
            </View>
            
            <View style={styles.selectContainer}>
              <Picker
                style={styles.picker}
                onValueChange={(value) => {
                  if (value) handleAddCustomService(value);
                }}
              >
                <Picker.Item label="↓ Tap here to select a category ↓" value="" />
                {availableCategories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>

            {customServices.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="add-box" size={40} color="#b0bec5" />
                <Text style={styles.emptyStateText}>
                  No custom services added yet
                </Text>
                <Text style={styles.emptyStateSubtext}>
                  Select a category above to create your own service
                </Text>
              </View>
            ) : (
              <>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepCircle}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <Text style={styles.stepText}>Add details for each custom service</Text>
                </View>
                
                <Text style={styles.serviceCountText}>
                  {customServices.length} custom service{customServices.length !== 1 ? 's' : ''} added
                </Text>
                
                {customServices.map((service, index) => (
                  <View key={index} style={styles.serviceCard}>
                    <View style={styles.serviceCardHeader}>
                      <Text style={styles.categoryBadge}>{service.category}</Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveService(index, true)}
                        style={styles.removeButton}
                      >
                        <MaterialIcons name="delete-outline" size={24} color="#E53935" />
                      </TouchableOpacity>
                    </View>
                    
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>
                        <MaterialIcons name="label" size={14} color="#546e7a" /> Service Name*
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          errors[`custom_${index}`]?.name && styles.inputError,
                        ]}
                        placeholder="What's your service called?"
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
                      <Text style={styles.inputLabel}>
                        <MaterialIcons name="description" size={14} color="#546e7a" /> Description*
                      </Text>
                      <TextInput
                        style={[
                          styles.input,
                          styles.textArea,
                          errors[`custom_${index}`]?.description && styles.inputError,
                        ]}
                        placeholder="Describe what this service includes"
                        value={service.description}
                        onChangeText={(value) =>
                          handleUpdateService(index, "description", value, true)
                        }
                        multiline
                        numberOfLines={3}
                      />
                      {errors[`custom_${index}`]?.description && (
                        <Text style={styles.errorText}>
                          {errors[`custom_${index}`].description}
                        </Text>
                      )}
                    </View>

                    <View style={styles.inputRow}>
                      <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>
                          <MaterialIcons name="attach-money" size={14} color="#546e7a" /> Price*
                        </Text>
                        <TextInput
                          style={[
                            styles.input,
                            errors[`custom_${index}`]?.price && styles.inputError,
                          ]}
                          placeholder="Enter price"
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
                        <Text style={styles.inputLabel}>
                          <MaterialIcons name="schedule" size={14} color="#546e7a" /> Pricing*
                        </Text>
                        <Picker
                          selectedValue={service.priceType}
                          style={[
                            styles.picker,
                            styles.smallPicker,
                            errors[`custom_${index}`]?.priceType && styles.pickerError,
                          ]}
                          onValueChange={(value) =>
                            handleUpdateService(index, "priceType", value, true)
                          }
                        >
                          <Picker.Item label="Select" value="" />
                          <Picker.Item label="Per Hour" value="hourly" />
                          <Picker.Item label="Fixed Price" value="once-off" />
                        </Picker>
                        {errors[`custom_${index}`]?.priceType && (
                          <Text style={styles.errorText}>
                            {errors[`custom_${index}`].priceType}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                ))}
              </>
            )}
          </View>
        )}

        {/* Summary and Save Button */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryText}>
              <MaterialIcons name="check-circle" size={16} color="#1a237e" /> {selectedServices.length + customServices.length} total services
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.saveButton, isSaved && styles.savedButton]}
            onPress={handleSubmit}
            disabled={isSaved}
          >
            <MaterialIcons name={isSaved ? "check" : "save"} size={20} color="#fff" />
            <Text style={styles.saveButtonText}>
              {isSaved ? "Saved!" : "Save All"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1a237e',
  },
  section: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a237e',
    marginLeft: 12,
  },
  guideCard: {
    backgroundColor: '#e8eaf6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
    borderLeftWidth: 4,
    borderLeftColor: '#1a237e',
  },
  guideTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 12,
  },
  guideText: {
    fontSize: 15,
    color: '#37474f',
    marginBottom: 8,
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#e8eaf6',
    borderBottomWidth: 3,
    borderBottomColor: '#1a237e',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#78909c',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#1a237e',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1a237e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  stepNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#37474f',
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f9fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    marginTop: 10,
  },
  emptyStateText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#78909c',
    marginTop: 12,
  },
  emptyStateSubtext: {
    fontSize: 15,
    color: '#90a4ae',
    textAlign: 'center',
    marginTop: 8,
  },
  serviceCountText: {
    fontSize: 15,
    color: '#546e7a',
    marginBottom: 16,
    marginTop: 8,
    fontWeight: '500',
  },
  serviceCard: {
    backgroundColor: '#f9fafc',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  serviceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#263238',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#e3f2fd',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#1565c0',
  },
  serviceCategory: {
    fontSize: 14,
    color: '#546e7a',
    marginBottom: 16,
  },
  removeButton: {
    padding: 8,
    marginRight: -5,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#546e7a',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
    lineHeight: 22,
  },
  inputError: {
    borderColor: '#E53935',
    backgroundColor: '#ffebee',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 50,
  },
  smallPicker: {
    height: 48,
  },
  pickerError: {
    borderColor: '#E53935',
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#E53935',
    fontSize: 13,
    marginTop: 6,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#37474f',
  },
  saveButton: {
    backgroundColor: '#1a237e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  savedButton: {
    backgroundColor: "#4caf50",
  },
});

export default ServicesSection101;