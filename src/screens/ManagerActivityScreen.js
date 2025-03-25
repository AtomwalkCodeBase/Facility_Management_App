import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, Dimensions, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect, useRouter } from 'expo-router';
import HeaderComponent from '../components/HeaderComponent';
import ModalComponent from '../components/ModalComponent';
import DropdownPicker from '../components/DropdownPicker';
import { getManagerActivityList } from '../services/productServices';
import Loader from '../components/old_components/Loader';
import EmptyMessage from '../components/EmptyMessage';
import QRModal from '../components/QRModal';

const { width } = Dimensions.get('window');

// Styled Components
const GradientBackground = styled(LinearGradient).attrs({
  colors: ['#ffd6b3', '#f7dce0'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  align-items: center;
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
  font-size: 13px;
  font-weight: bold;
  text-align: center;
`;

const FilterContainer = styled.View`
  margin: 10px 0;
  width: 95%;
`;

const ClearFilterButton = styled.TouchableOpacity`
  background-color: #ffc107;
  padding: 8px 15px;
  border-radius: 8px;
  width: 50%;
  align-self: flex-end;
`;

const ClearFilterText = styled.Text`
  color: #353535;
  font-size: 14px;
  font-weight: bold;
`;

const LoadMoreButton = styled.TouchableOpacity`
  margin: 10px 10px;
  padding: 15px;
  background-color: #5a9;
  border-radius: 25px;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
  align-items: center;
`;

const LoadMoreButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-transform: uppercase;
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

const ManagerActivityScreen = ({ activityType = 'PROJECT' , user,setCallType }) => {
  const navigation = useNavigation();
  const router = useRouter();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGetQRModalVisible, setIsGetQRModalVisible] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [qrValue, setQRValue] = useState('');

  const ITEMS_PER_PAGE = 20;

  const loadMoreActivities = async () => {
    if (loadingMore) return; // Prevent duplicate calls
    setLoadingMore(true);
    setCurrentPage((prev) => prev + 1); // Increase the page number
    setLoadingMore(false);
  };

  const dropdownData = useMemo(() => {
    const uniqueOrderRefs = new Set(
      activities
        .filter(({ order_ref_num }) => order_ref_num)
        .map(({ order_ref_num }) => order_ref_num)
    );
  
    return Array.from(uniqueOrderRefs).map((refNum) => ({
      label: refNum,
      value: refNum,
    }));
  }, [activities]);

  // console.log('Act user',user)


  const getHeaderTitle = (type) => {
    switch (type) {
      case 'GET_OD':
        return 'Over Due';
      case 'GET_DT':
        return 'Planned Today';
      case 'GET_DC':
        return 'Due Today';
      case 'GET_D1':
        return 'Due Tomorrow';
      case 'GET_D7':
        return 'Next 7 Days';
      case 'GET_ND':
        return 'After 7 Days';
      case 'GET_OC':
        return 'Over Due Completed';
      case 'GET_FC':
        return 'Future Activity';
      default:
        return 'Manager Activities';
    }
  };
  

  const fetchActivityDetails = async (type) => {
    // alert(type);
    try {
      setLoading(true);
      const response = await getManagerActivityList({ call_mode: type });
  
      const fetchedActivities = response?.data?.activity_list || [];
  
      const updatedActivities = fetchedActivities.map((activity) => {
        // Check if activity_status exists and assign the corresponding status
        if (activity.activity_status) {
          switch (activity.activity_status) {
            case '01':
            case '02':
              if (activity.is_over_due) {
                activity.status = 'OVER-DUE';
              } else {
                activity.status = activity.activity_status === '01' ? 'PLANNED' : 'IN PROGRESS';
              }
              break;
            case '03':
              activity.status = 'COMPLETED';
              break;
            case '04':
              activity.status = 'ON HOLD';
              break;
            case '09':
              activity.status = 'NOT ALLOCATED';
              break;
            case '99':
              activity.status = 'NOT REQUIRED';
              break;
            default:
              activity.status = 'UNKNOWN';
          }
        } else {
          // Determine status if activity_status is undefined
          if (activity.is_over_due) {
            activity.status = 'OVER-DUE';
          } else if (activity.is_due_today) {
            activity.status = 'DUE TODAY';
          } else if (activity.is_due_future) {
            activity.status = 'IN PROGRESS';
          } else {
            activity.status = 'UNKNOWN';
          }
        }
        return activity;
      });
  
      setActivities(updatedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
  

  useEffect(() => {
    fetchActivityDetails(activityType);
    // Cleanup function to clear activities when screen loses focus
    return () => {
      setActivities([]); // Clear activities
      setFilterValue(''); // Reset filter value
      setCurrentPage(1);  // Reset pagination
    };
  },[activityType]
  )

 

  const filteredActivities = useMemo(
    () => (filterValue ? activities.filter((act) => act.order_ref_num === filterValue) : activities),
    [filterValue, activities]
  );

  const paginatedActivities = useMemo(
    () => {
      const start = 0;
      const end = currentPage * ITEMS_PER_PAGE;
      return filteredActivities.slice(start, end);
    },
    [filteredActivities, currentPage]
  );

  const handleBackPress = () => {
    setCallType('PROJECT');
    setActivities([]); // Clear the activity list
    setFilterValue('');
    navigation.goBack();
  };

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };


  const getBadgeColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return '#28a745'; // Green for completed
      case 'OVER-DUE':
        return '#FF5733'; // Red for overdue
      case 'IN PROGRESS':
        return '#ffc107'; // Yellow for in-progress
      default:
        return '#6c757d'; // Gray for unknown or default status
    }
  };
  
  const getBadgeTextColor = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'OVER-DUE':
        return '#fff'; // White text for completed and overdue
      case 'IN PROGRESS':
        return '#454545'; // Dark gray for in-progress
      default:
        return '#fff'; // Dark gray for default or unknown status
    }
  };
  

  const handleCompleteClick = (id) => {
    router.push({
        pathname: 'MarkCompleteScreen',
        params: { ref_num: id },
    });
};


  const handleQcClick = (id) => {
    router.push({
        pathname: 'QcData',
        params: { ref_num: id },
    });
};

  const handleInventoryClick = (id,type) => {
    router.push({
        pathname: 'InventoryData',
        params: { ref_num: id, ref_type: type },
    });
};


const handleQRPress = (id) => {
  setQRValue(`Activity ID: ${id}`); // Generate QR value dynamically
  setIsGetQRModalVisible(true); // Show the QR modal
};

const handlePressScanQR = () => {
  router.push({
    pathname: 'QrScanner' 
  });
};

  // const loadMoreActivities = () => setCurrentPage((prev) => prev + 1);

  // console.log('Manager Activity List -',activities)

  const renderActivity = ({ item }) => {
    const isCurrentUser = item.user_name === user;
    
  
    return (
      <Card>
        <Row>
          <BoldText>{item.order_ref_num || item.project_code}</BoldText>
          <StatusBadge bgColor={getBadgeColor(item.status)}>
            <StatusText textColor={getBadgeTextColor(item.status)}>
              {item.status || 'N/A'}
            </StatusText>
          </StatusBadge>
        </Row>
        <SubText>Assigned to: {item.user_name}</SubText>
        <SubText>Activity: {item.activity_name}</SubText>
        <SubText>Planned Start: {item.start_date || 'N/A'}</SubText>
        <SubText>Actual Start: {item.actual_start_date || 'Activity Not Started'}</SubText>
  
        <ButtonRow>
        {item.actual_start_date ? (
          isCurrentUser ? (
            <>
              <ActionButton
                bgColor="#28a745"
                onPress={() => handleCompleteClick(item.pa_id)}
              >
                <ButtonText>Mark Completed</ButtonText>
              </ActionButton>
              <ActionButton
                bgColor="#f77f00"
                onPress={() => handleQcClick(item.pa_id)}
              >
                <ButtonText>QC Update</ButtonText>
              </ActionButton>
              <ActionButton
                bgColor="#4285f4"
                onPress={() => handleInventoryClick(item.pa_id, 'INV_IN')}
              >
                <ButtonText>Inventory Data</ButtonText>
              </ActionButton>
              <ActionButton
                bgColor="#4285f4"
                onPress={() => handleInventoryClick(item.pa_id, 'INV_OUT')}
              >
                <ButtonText>Production Data</ButtonText>
              </ActionButton>
              <ActionButton
                  bgColor="#4285f4"
                  onPress={() => handleQRPress(item.pa_id)} // Updated to handle QR generation
                >
                  <ButtonText>Generate QR</ButtonText>
                </ActionButton>
              <ActionButton
                bgColor="#4285f4"
                onPress={handlePressScanQR}
              >
                <ButtonText>Scan QR</ButtonText>
              </ActionButton>
            </>
          ) : (
            <ActionButton
              fullWidth
              bgColor="#007bff"
              onPress={() => handleViewDetails(item)}
            >
              <ButtonText>View Details</ButtonText>
            </ActionButton>
          )
          ) : (
            <ActionButton
              fullWidth
              bgColor="#007bff"
              onPress={() => handleViewDetails(item)}
            >
              <ButtonText>View Details</ButtonText>
            </ActionButton>
          )}
        </ButtonRow>
      </Card>
    );
  };
  

  return (
    <GradientBackground>
      <HeaderComponent headerTitle={getHeaderTitle(activityType)} onBackPress={handleBackPress} />
      <FilterContainer>
        <DropdownPicker
          label="Filter by Order Num"
          data={dropdownData}
          value={filterValue}
          setValue={setFilterValue}
        />
        {filterValue && (
          <ClearFilterButton onPress={() => setFilterValue('')}>
            <ClearFilterText>Clear Filter</ClearFilterText>
          </ClearFilterButton>
        )}
      </FilterContainer>
      {loading ? (
        <Loader visible={loading} />
      ) : filteredActivities.length === 0 ? (
        <EmptyMessage data="activity" />
      ) : (
        <>
          <FlatList
            data={paginatedActivities}
            keyExtractor={(item, index) => `${item.order_ref_num || item.project_code}_${index}`}
            renderItem={renderActivity}
            contentContainerStyle={{ padding: 10 }}
            onEndReached={() => loadMoreActivities()}
            onEndReachedThreshold={0.5} // Trigger when the list is scrolled halfway to the bottom
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={
              loadingMore && <Loader visible={loadingMore} /> // Show loader at the bottom while fetching
            }
          />
         
        </>
      )}
      {isModalVisible && selectedActivity && (
        <ModalComponent
          isVisible={isModalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedActivity(null);
          }}
          activityDetails={{
            activity: selectedActivity?.activity_name,
            order: selectedActivity?.order_ref_num,
            user: selectedActivity?.user_name,
            project_num : selectedActivity?.project_code,
            plannedStart: selectedActivity?.start_date,
            actualStart: selectedActivity?.actual_start_date,
            plannedDuration: selectedActivity?.duration,
          }}
        />
      )}
       <QRModal
        isVisible={isGetQRModalVisible}
        onClose={() => setIsGetQRModalVisible(false)}
        qrValue={qrValue}
      />
    </GradientBackground>
  );
};

export default ManagerActivityScreen;
