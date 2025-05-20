import React, { useEffect, useState } from 'react';
import { FlatList, Dimensions, View, Animated } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRouter } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';
import ModalComponent from '../components/ModalComponent';
import DropdownPicker from '../components/DropdownPicker';
import { getActivityList } from '../services/productServices';

const { width } = Dimensions.get('window');

const GradientBackground = styled(LinearGradient).attrs({
    colors: ['#ffd6b3', '#f7dce0'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
})`
    align-items: center;
    height: 100%;
`;

const Title = styled.Text`
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
`;

const Card = styled.View`
    background-color: #fff;
    border-radius: 12px;
    margin-bottom: 20px;
    padding: 15px;
    elevation: 4;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
`;

const Row = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
`;

const BoldText = styled.Text`
    font-size: 16px;
    font-weight: bold;
    color: #333;
`;

const SubText = styled.Text`
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
`;

const StatusBadge = styled.View`
    background-color: ${(props) => props.bgColor || '#ffca28'};
    border: 2px solid ${(props) => props.bgColor || '#ffca28'};
    border-radius: 20px;
    padding: 4px 8px;
`;

const StatusText = styled.Text`
    font-size: 12px;
    font-weight: bold;
    color: ${(props) => props.textColor || '#454545'};
`;

const ButtonRow = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    margin-top: 10px;
    align-items: center;
`;

const ActionButton = styled.TouchableOpacity`
    background-color: ${(props) => props.bgColor || '#007bff'};
    width: ${(props) => (props.fullWidth ? `${width * 0.85}px` : `${width * 0.4}px`)};
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
`;

const ButtonText = styled.Text`
    color: #fff;
    font-size: 15px;
    font-weight: bold;
    text-align: center;
`;

const FilterContainer = styled.View`
    margin-top: 5px;
    width: 95%;
`;

const ClearFilterContainer = styled.View`
    margin-top: 5px;
    width: 100%;
    align-items: flex-end;
    justify-content: center;
`;

const ClearFilterButton = styled.TouchableOpacity`
    background-color: #ffc107;
    padding: 8px 15px;
    border-radius: 8px;
    border: 1px solid black;
    width: 50%;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
`;

const ClearFilterText = styled.Text`
    color: #353535;
    font-size: 14px;
    font-weight: bold;
`;

const SkeletonCard = styled.View`
    background-color: #e0e0e0;
    border-radius: 12px;
    margin-bottom: 20px;
    padding: 15px;
    elevation: 4;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.1;
    shadow-radius: 4px;
    overflow: hidden;
`;

const SkeletonRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
`;

const SkeletonText = styled.View`
    background-color: #e0e0e0;
    border-radius: 4px;
    height: 16px;
    margin-bottom: 5px;
`;

const SkeletonBadge = styled.View`
    background-color: #e0e0e0;
    border-radius: 20px;
    padding: 4px 8px;
    width: 80px;
    height: 20px;
`;

const SkeletonButton = styled.View`
    background-color: #e0e0e0;
    width: ${(props) => (props.fullWidth ? `${width * 0.85}px` : `${width * 0.4}px`)};
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
`;

const SkeletonFilter = styled.View`
    background-color: #e0e0e0;
    border-radius: 8px;
    height: 45px;
    width: 95%;
    margin-top: 5px;
    margin-bottom: 5px;
    overflow: hidden;
`;

const SkeletonClearFilter = styled.View`
    background-color: #e0e0e0;
    padding: 8px 15px;
    border-radius: 8px;
    width: 50%;
    height: 35px;
    align-items: center;
    justify-content: center;
    margin-bottom: 5px;
    overflow: hidden;
`;

const Shimmer = styled(Animated.View)`
    flex: 1;
    background-color: rgba(255, 255, 255, 0.2);
    width: 100px;
    height: 100%;
`;

const ActivityScreen = (props) => {
    const navigation = useNavigation();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [activities, setActivities] = useState([]);
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const activityType = props.data;
    const project = props.id;

    // Shimmer animation setup
    const shimmerAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ).start();
    }, [shimmerAnim]);

    const shimmerTranslateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-100, 100],
    });

    useEffect(() => {
        fetchActivityDetails();
    }, []);

    useEffect(() => {
        if (project) {
            setFilterValue(project);
        } else {
            applyFilter();
        }
    }, [project, activities]);

    useEffect(() => {
        applyFilter();
    }, [filterValue, activities]);

    const fetchActivityDetails = async () => {
        setIsLoading(true);
        try {
            const res = await getActivityList();
            let fetchedActivities = res?.data?.a_list || [];

            const parseDate = (dateStr) => {
                if (!dateStr) return null;
                const [day, month, year] = dateStr.split('-');
                const months = {
                    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
                    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
                };
                return new Date(year, months[month], day);
            };

            const currentDate = new Date();

            const mapActivityStatus = {
                '01': 'PLANNED',
                '02': 'IN PROGRESS',
                '03': 'COMPLETED',
                '04': 'ON HOLD',
                '09': 'NOT ALLOCATED',
                '99': 'NOT REQUIRED',
            };

            fetchedActivities = fetchedActivities.map((activity) => {
                const dueDate = parseDate(activity.due_date);
                let status = mapActivityStatus[activity.activity_status] || 'UNKNOWN';

                if ((activity.activity_status === '01' || activity.activity_status === '02') && activity.is_over_due) {
                    status = 'OVER-DUE';
                } else if (dueDate && dueDate < currentDate && status === 'IN PROGRESS') {
                    status = 'OVER-DUE';
                } else if (activity.no_hold === 0 && activity.no_pending === 0) {
                    status = 'COMPLETED';
                }

                return {
                    ...activity,
                    status,
                };
            });

            if (activityType === 'PENDING') {
                fetchedActivities = fetchedActivities.filter(
                    (activity) => activity.status !== 'COMPLETED' && activity.no_pending !== 0
                );
            } else if (activityType === 'OverDue') {
                fetchedActivities = fetchedActivities.filter(
                    (activity) => activity.status === 'OVER-DUE'
                );
            } else if (activityType === 'Completed') {
                fetchedActivities = fetchedActivities.filter(
                    (activity) => activity.status === 'COMPLETED'
                );
            }

            setActivities(fetchedActivities);
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilter = () => {
        if (!filterValue) {
            setFilteredActivities(activities);
        } else {
            const filtered = activities.filter(
                (activity) => activity.ref_num === filterValue
            );
            setFilteredActivities(filtered);
        }
    };

    const getUniqueRefNums = () => {
        const uniqueRefNums = activities.reduce((acc, curr) => {
            if (curr.ref_num && !acc.includes(curr.ref_num)) {
                acc.push(curr.ref_num);
            }
            return acc;
        }, []);
        return uniqueRefNums.map((ref_num) => ({ label: ref_num, value: ref_num }));
    };

    const handleCompleteClick = (id) => {
        router.push({
            pathname: 'MarkCompleteScreen',
            params: { ref_num: id },
        });
    };

    const handleInventoryClick = (id, type) => {
        router.push({
            pathname: 'InventoryData',
            params: { ref_num: id, ref_type: type },
        });
    };

    const handleQcClick = (id) => {
        router.push({
            pathname: 'QcData',
            params: { ref_num: id },
        });
    };

    const handleViewDetails = (activity) => {
        setSelectedActivity(activity);
        setModalVisible(true);
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const getBadgeColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return '#28a745';
            case 'OVER-DUE':
                return '#FF5733';
            case 'IN PROGRESS':
                return '#ffc107';
            default:
                return '#6c757d';
        }
    };

    const getBadgeTextColor = (status) => {
        switch (status) {
            case 'COMPLETED':
                return '#fff';
            case 'OVER-DUE':
                return '#fff';
            case 'IN PROGRESS':
                return '#454545';
            default:
                return '#fff';
        }
    };

    const dropdownData = getUniqueRefNums();

    const renderSkeletonCard = () => (
        <SkeletonCard>
            <SkeletonRow>
                <SkeletonText style={{ width: width * 0.4 }} />
                <SkeletonBadge />
            </SkeletonRow>
            <SkeletonText style={{ width: width * 0.3 }} />
            <SkeletonText style={{ width: width * 0.5 }} />
            <SkeletonText style={{ width: width * 0.2 }} />
            <ButtonRow>
                <SkeletonButton style={{ width: width * 0.4 }} >
                    <Shimmer style={{ transform: [{ translateX: shimmerTranslateX }] }} />
                </SkeletonButton>
                <SkeletonButton style={{ width: width * 0.4 }} >
                    <Shimmer style={{ transform: [{ translateX: shimmerTranslateX }] }} />
                </SkeletonButton>
            </ButtonRow>
            <Shimmer style={{ transform: [{ translateX: shimmerTranslateX }] }} />
        </SkeletonCard>
    );

    if (isLoading) {
        return (
            <GradientBackground>
                <HeaderComponent
                    headerTitle={
                        activityType === 'PENDING'
                            ? 'Pending Activities'
                            : activityType === 'OverDue'
                            ? 'OverDue Activities'
                            : activityType === 'Completed'
                            ? 'Completed Activities'
                            : 'My Activities'
                    }
                    onBackPress={handleBackPress}
                    loading={true} // Pass loading prop to HeaderComponent
                />
                <FilterContainer>
                    <SkeletonFilter>
                        <Shimmer style={{ transform: [{ translateX: shimmerTranslateX }] }} />
                    </SkeletonFilter>
                    {filterValue && (
                        <ClearFilterContainer>
                            <SkeletonClearFilter>
                                <Shimmer style={{ transform: [{ translateX: shimmerTranslateX }] }} />
                            </SkeletonClearFilter>
                        </ClearFilterContainer>
                    )}
                </FilterContainer>
                <FlatList
                    data={[1, 2, 3]} // Render 3 skeleton cards
                    keyExtractor={(item) => item.toString()}
                    renderItem={renderSkeletonCard}
                    contentContainerStyle={{ padding: 10 }}
                    showsVerticalScrollIndicator={false}
                />
            </GradientBackground>
        );
    }

    return (
        <GradientBackground>
            <HeaderComponent
                headerTitle={
                    activityType === 'PENDING'
                        ? 'Pending Activities'
                        : activityType === 'OverDue'
                        ? 'OverDue Activities'
                        : activityType === 'Completed'
                        ? 'Completed Activities'
                        : 'My Activities'
                }
                onBackPress={handleBackPress}
            />
            <FilterContainer>
                <DropdownPicker
                    label="Filter by Project Num"
                    data={dropdownData}
                    value={filterValue}
                    setValue={setFilterValue}
                />
                {filterValue && (
                    <ClearFilterContainer>
                        <ClearFilterButton onPress={() => setFilterValue('')}>
                            <ClearFilterText>Clear Filter</ClearFilterText>
                        </ClearFilterButton>
                    </ClearFilterContainer>
                )}
            </FilterContainer>
            <FlatList
                data={filteredActivities}
                keyExtractor={(item) => item.activity_id.toString()}
                renderItem={({ item: activity }) => (
                    <Card>
                        <Row>
                            <BoldText>{activity.sale_order_no || activity.ref_num}</BoldText>
                            <StatusBadge bgColor={getBadgeColor(activity.status)}>
                                <StatusText textColor={getBadgeTextColor(activity.status)}>
                                    {activity.status}
                                </StatusText>
                            </StatusBadge>
                        </Row>
                        <SubText>{activity.ref_num || 'None'}</SubText>
                        <SubText>{activity.activity_name || 'None'}</SubText>
                        <SubText>Due Date: {activity.due_date || 'N/A'}</SubText>
                        <ButtonRow>
                            {activity.status !== 'COMPLETED' && activity.activity_status === '02' ? (
                                <>
                                    <ActionButton
                                        bgColor="#28a745"
                                        onPress={() => handleCompleteClick(activity.activity_id)}
                                    >
                                        <ButtonText>Mark as Completed</ButtonText>
                                    </ActionButton>
                                    <ActionButton
                                        bgColor="#f77f00"
                                        onPress={() => handleQcClick(activity.activity_id)}
                                    >
                                        <ButtonText>QC Data Update</ButtonText>
                                    </ActionButton>
                                    <ActionButton
                                        bgColor="#4285f4"
                                        onPress={() => handleInventoryClick(activity.activity_id, 'INV_IN')}
                                    >
                                        <ButtonText>Inventory Update</ButtonText>
                                    </ActionButton>
                                    <ActionButton
                                        bgColor="#4285f4"
                                        onPress={() => handleInventoryClick(activity.activity_id, 'INV_OUT')}
                                    >
                                        <ButtonText>Production Update</ButtonText>
                                    </ActionButton>
                                </>
                            ) : (
                                <ActionButton
                                    bgColor="#4285f4"
                                    fullWidth={true}
                                    onPress={() => handleViewDetails(activity)}
                                >
                                    <ButtonText>View Details</ButtonText>
                                </ActionButton>
                            )}
                        </ButtonRow>
                    </Card>
                )}
                contentContainerStyle={{ padding: 10 }}
                showsVerticalScrollIndicator={false}
            />
            {selectedActivity && (
                <ModalComponent
                    isVisible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    activityDetails={{
                        order: selectedActivity.sale_order_no,
                        activity: selectedActivity.activity_name,
                        project_num: selectedActivity.ref_num,
                    }}
                />
            )}
        </GradientBackground>
    );
};

export default ActivityScreen;