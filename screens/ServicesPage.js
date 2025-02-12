import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const ServicesPage = ({ route }) => {
  const { categoryName, services } = route.params;
  const navigation = useNavigation();

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredServices, setFilteredServices] = useState(services);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    setFilteredServices(services);
  }, [services]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredServices(services);
      return;
    }

    // Sort services based on whether they match the search query
    const sortedServices = [...services].sort((a, b) => {
      const aMatches = a.name.toLowerCase().includes(query.toLowerCase());
      const bMatches = b.name.toLowerCase().includes(query.toLowerCase());
      
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    });

    // Filter out non-matching services
    const filtered = sortedServices.filter((service) =>
      service.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredServices(filtered);
  };

  const toggleDescription = (id) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderItem = ({ item }) => {
    const isExpanded = expandedDescriptions[item._id];

    return (
      <View style={styles.serviceItemContainer}>
        <View style={styles.serviceContent}>
          <View style={styles.textContainer}>
            <Text style={styles.serviceItemText}>{item.name}</Text>
            {isExpanded && (
              <Text style={styles.serviceDescription}>{item.description}</Text>
            )}
            <TouchableOpacity
              onPress={() => toggleDescription(item._id)}
              style={styles.readMoreButton}
              activeOpacity={0.7}
            >
              <Text style={styles.readMoreText}>
                {isExpanded ? 'Read Less' : 'Read More'}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('LoadingScreen', { service: item })
            }
            style={styles.arrowButton}
            activeOpacity={0.7}
          >
            <View style={styles.arrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyList = () => {
    if (searchQuery.trim() !== '') {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            No services found matching "{searchQuery}"
          </Text>
          <TouchableOpacity 
            style={styles.clearSearchButton}
            onPress={() => {
              setSearchQuery('');
              setFilteredServices(services);
            }}
          >
            <Text style={styles.clearSearchText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a237e" />
      <View style={styles.headerContainer}>
        <Text style={styles.header}>{categoryName}</Text>
        <Text style={styles.subHeader}>Select a service to continue</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.trim() !== '' && (
            <TouchableOpacity 
              onPress={() => {
                setSearchQuery('');
                setFilteredServices(services);
              }}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredServices}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyList}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={[
          styles.listContainer,
          filteredServices.length === 0 && styles.emptyListContainer
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerContainer: {
    backgroundColor: '#1a237e',
    padding: 25,
    paddingTop: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    marginBottom: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#E8EAF6',
    fontWeight: '500',
  },
  searchContainer: {
    padding: 16,
    zIndex: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    borderRadius: 25,
    height: 50,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 20,
    paddingTop: 10,
    minHeight: 100,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  clearSearchButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  clearSearchText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  serviceItemContainer: {
    marginBottom: 15,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#1a237e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  textContainer: {
    flex: 1,
    marginRight: 15,
  },
  serviceItemText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a237e',
    marginBottom: 8,
  },
  serviceDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  readMoreText: {
    fontSize: 14,
    color: '#1a237e',
    fontWeight: '500',
  },
  arrowButton: {
    padding: 5,
  },
  arrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EAF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#1a237e',
    fontSize: 20,
    fontWeight: '600',
  },
  separator: {
    height: 8,
  },
});

export default ServicesPage;