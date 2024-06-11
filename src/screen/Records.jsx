import React, { useState, useEffect, useContext } from 'react';
import { Card, Text } from 'react-native-paper';
import { StyleSheet, View, FlatList, Image, TextInput, Modal, TouchableOpacity, Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../components/colors';
import axios from 'axios';
import { Rating } from 'react-native-ratings';
import { useIsFocused } from '@react-navigation/native';
import RecordsSkeleton from '../components/RecordsSkeleton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecordAni from '../components/RecordAni';
import { GlobalContext } from '../components/GlobalContext';
import VideoPlayer from '../components/Video';
import DateTimePicker from '@react-native-community/datetimepicker';

const isVideoUrl = (url) => {
    const videoExtensions = ['.mp4', '.mov', '.wmv', '.flv', '.avi', '.mkv'];
    return videoExtensions.some((ext) => url.endsWith(ext));
};

const Records = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [noRecords, setNoRecords] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { globalVariable } = useContext(GlobalContext);
    const isFocused = useIsFocused();


    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    const fetchData = async () => {
        try {
            const userUID = await AsyncStorage.getItem('userUID');
            //console.log('User UID1:', userUID);

            if (!userUID) {
                console.error('User UID not found in AsyncStorage');
                return;
            }
            const response = await axios.get(`${globalVariable}/posease/getfeedback?uid=${userUID}`);
            const sortedData = response.data.tips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setRecords(sortedData);
            setFilteredRecords(sortedData);
            setLoading(false);

            if (sortedData.length === 0) {
                setNoRecords(true);
            } else {
                setNoRecords(false);
            }
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query.trim() === '') {
            setFilteredRecords(records);
        } else {
            const filtered = records.filter(record =>
                record.feedbackText.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredRecords(filtered);
        }
    };
    const toggleModal = () => {
        setShowModal(!showModal);
        setSelectedDate(null)

    };


    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setSelectedDate(selectedDate);
        }
    };

    const applyDateFilter = () => {
        if (selectedDate) {
            const selectedDateTime = new Date(selectedDate).setHours(0, 0, 0, 0);
            const filtered = records.filter(record => {
                const recordDateTime = new Date(record.createdAt).setHours(0, 0, 0, 0);
                return recordDateTime === selectedDateTime;
            });
            setFilteredRecords(filtered);
        } else {
            setFilteredRecords(records);
        }
        toggleModal(); // Close modal after applying filter
    };
    const RoundButton = ({ title, onPress, color }) => (
        <TouchableOpacity
            style={[styles.roundButton, { backgroundColor: color }]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Records</Text>
            <View style={styles.searchContainer}>
                <Icon name="search" size={25} color="#888" style={styles.searchIcon} />
                <TextInput
                    placeholder="Search Records"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    style={styles.searchBox}
                    underlineColor="transparent"
                    mode="flat"
                />
                <TouchableOpacity onPress={toggleModal}>
                    <Icon name="filter-list" size={25} color="#888" style={styles.filterIcon} />
                </TouchableOpacity>
            </View>
            {loading ? (
                <RecordsSkeleton />
            ) : noRecords ? (
                <RecordAni />
            ) : (
                <FlatList
                    data={filteredRecords}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <Card style={styles.card}>
                            <View style={styles.cover}>
                                {isVideoUrl(item.mediaUrl) ? (
                                    <VideoPlayer videoUrl={item.mediaUrl} paused={true} style={styles.video} />
                                ) : (
                                    <Image source={{ uri: item.mediaUrl }} style={styles.image} />
                                )}
                            </View>
                            <Card.Content>
                                <Text variant="titleLarge" style={styles.title}>
                                    Feedback
                                </Text>
                                <Text variant="titleLarge" style={styles.subtitle}>
                                    {item.feedbackText}
                                </Text>
                                <Rating
                                    type="star"
                                    ratingCount={5}
                                    startingValue={item.rating}
                                    imageSize={20}
                                    readonly
                                />
                                <Text style={styles.timestamp}>
                                    Recorded At: {new Date(item.createdAt).toLocaleString()}
                                </Text>
                            </Card.Content>
                        </Card>
                    )}
                    showsVerticalScrollIndicator={false}
                />
            )}


            <Modal
                visible={showModal}
                animationType="slide"
                transparent={true}
                onRequestClose={toggleModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Date</Text>

                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                            <Text style={styles.datePickerText}>
                                {selectedDate ? selectedDate.toLocaleDateString() : 'Select date'}
                            </Text>
                            <Icon name="calendar-today" size={25} color={colors.primary} style={styles.calendarIcon} />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDate || new Date()}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                                minimumDate={new Date(2000, 0, 1)}
                                maximumDate={new Date()}
                            />
                        )}


                        <View style={styles.buttonContainer}>
                            <RoundButton title="Close" onPress={toggleModal} color="red" />
                            <RoundButton title="Apply Filter" onPress={applyDateFilter} color="green" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: colors.secondary,
        elevation: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 25,
        elevation: 2,
        paddingHorizontal: 10,
    },
    searchBox: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 25,
    },
    searchIcon: {
        marginRight: 3,
    },
    filterIcon: {
        marginLeft: 5,
    },
    card: {
        marginBottom: 10,
        borderRadius: 15,
        elevation: 5,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    cover: {
        height: 400,
        borderRadius: 14,
        marginBottom: 10,
        borderColor: colors.primary,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary,
    },
    heading: {
        fontSize: 25,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: 'black',
    },
    timestamp: {
        fontSize: 14,
        color: '#888',
        marginTop: 8,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    datePickerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // Continued styles
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 5,
    },
    datePickerText: {
        fontSize: 16,
        color: colors.primary,
    },
    calendarIcon: {
        marginLeft: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    roundButton: {
        borderRadius: 25, // Adjust this value to change the roundness
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },

});

export default Records;

