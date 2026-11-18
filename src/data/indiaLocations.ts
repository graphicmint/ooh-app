export interface LocationRecord {
  state: string;
  district: string;
  city: string;
  tier: string;
  lat: number;
  lng: number;
}

// Master Indian Locations Database populated from official Census / Tier master
export const INDIA_LOCATIONS: LocationRecord[] = [
  // Andaman & Nicobar
  { state: 'Andaman & Nicobar', district: 'Nicobar', city: 'Car Nicobar', tier: 'Tier 4', lat: 9.1550, lng: 92.7667 },
  { state: 'Andaman & Nicobar', district: 'North & Middle Andaman', city: 'Mayabunder', tier: 'Tier 4', lat: 12.9300, lng: 92.9300 },
  { state: 'Andaman & Nicobar', district: 'North & Middle Andaman', city: 'Diglipur', tier: 'Tier 4', lat: 13.2667, lng: 92.9833 },
  { state: 'Andaman & Nicobar', district: 'South Andaman', city: 'Port Blair', tier: 'Tier 3', lat: 11.6234, lng: 92.7265 },

  // Andhra Pradesh
  { state: 'Andhra Pradesh', district: 'Alluri Sitarama Raju', city: 'Paderu', tier: 'Tier 4', lat: 18.0833, lng: 82.6667 },
  { state: 'Andhra Pradesh', district: 'Alluri Sitarama Raju', city: 'Araku Valley', tier: 'Tier 4', lat: 18.3273, lng: 82.8775 },
  { state: 'Andhra Pradesh', district: 'Anakapalli', city: 'Anakapalle', tier: 'Tier 3', lat: 17.6913, lng: 83.0039 },
  { state: 'Andhra Pradesh', district: 'Anakapalli', city: 'Atchutapuram', tier: 'Tier 4', lat: 17.5458, lng: 82.9939 },
  { state: 'Andhra Pradesh', district: 'Anantapur', city: 'Anantapur', tier: 'Tier 3', lat: 14.6819, lng: 77.6006 },
  { state: 'Andhra Pradesh', district: 'Anantapur', city: 'Guntakal', tier: 'Tier 3', lat: 15.1678, lng: 77.3698 },
  { state: 'Andhra Pradesh', district: 'Anantapur', city: 'Tadipatri', tier: 'Tier 3', lat: 14.9088, lng: 78.0094 },
  { state: 'Andhra Pradesh', district: 'Annamayya', city: 'Rayachoti', tier: 'Tier 3', lat: 14.0560, lng: 78.7520 },
  { state: 'Andhra Pradesh', district: 'Annamayya', city: 'Madanapalle', tier: 'Tier 3', lat: 13.5500, lng: 78.5000 },
  { state: 'Andhra Pradesh', district: 'Bapatla', city: 'Bapatla', tier: 'Tier 4', lat: 15.9044, lng: 80.4673 },
  { state: 'Andhra Pradesh', district: 'Bapatla', city: 'Chirala', tier: 'Tier 3', lat: 15.8246, lng: 80.3522 },
  { state: 'Andhra Pradesh', district: 'Chittoor', city: 'Chittoor', tier: 'Tier 3', lat: 13.2172, lng: 79.1003 },
  { state: 'Andhra Pradesh', district: 'Chittoor', city: 'Punganur', tier: 'Tier 4', lat: 13.3667, lng: 78.5833 },
  { state: 'Andhra Pradesh', district: 'East Godavari', city: 'Rajahmundry', tier: 'Tier 2', lat: 17.0005, lng: 81.8040 },
  { state: 'Andhra Pradesh', district: 'East Godavari', city: 'Kovvur', tier: 'Tier 4', lat: 17.0167, lng: 81.7333 },
  { state: 'Andhra Pradesh', district: 'Eluru', city: 'Eluru', tier: 'Tier 3', lat: 16.7107, lng: 81.0952 },
  { state: 'Andhra Pradesh', district: 'Eluru', city: 'Jangareddygudem', tier: 'Tier 4', lat: 17.1167, lng: 81.3000 },
  { state: 'Andhra Pradesh', district: 'Guntur', city: 'Guntur', tier: 'Tier 2', lat: 16.3067, lng: 80.4365 },
  { state: 'Andhra Pradesh', district: 'Guntur', city: 'Tenali', tier: 'Tier 3', lat: 16.2430, lng: 80.6400 },
  { state: 'Andhra Pradesh', district: 'Guntur', city: 'Mangalagiri', tier: 'Tier 3', lat: 16.4300, lng: 80.5700 },
  { state: 'Andhra Pradesh', district: 'Kakinada', city: 'Kakinada', tier: 'Tier 2', lat: 16.9891, lng: 82.2475 },
  { state: 'Andhra Pradesh', district: 'Kakinada', city: 'Samalkot', tier: 'Tier 4', lat: 17.0500, lng: 82.1667 },
  { state: 'Andhra Pradesh', district: 'Konaseema', city: 'Amalapuram', tier: 'Tier 3', lat: 16.5787, lng: 82.0061 },
  { state: 'Andhra Pradesh', district: 'Krishna', city: 'Machilipatnam', tier: 'Tier 3', lat: 16.1875, lng: 81.1389 },
  { state: 'Andhra Pradesh', district: 'Krishna', city: 'Gudivada', tier: 'Tier 3', lat: 16.4410, lng: 80.9926 },
  { state: 'Andhra Pradesh', district: 'Kurnool', city: 'Kurnool', tier: 'Tier 2', lat: 15.8281, lng: 78.0373 },
  { state: 'Andhra Pradesh', district: 'Kurnool', city: 'Adoni', tier: 'Tier 3', lat: 15.6322, lng: 77.2728 },
  { state: 'Andhra Pradesh', district: 'N T Rama Rao', city: 'Vijayawada', tier: 'Tier 2', lat: 16.5062, lng: 80.6480 },
  { state: 'Andhra Pradesh', district: 'N T Rama Rao', city: 'Nandigama', tier: 'Tier 4', lat: 16.7833, lng: 80.2833 },
  { state: 'Andhra Pradesh', district: 'Nandyal', city: 'Nandyal', tier: 'Tier 3', lat: 15.4886, lng: 78.4836 },
  { state: 'Andhra Pradesh', district: 'Sri Potti Sriramulu Nellore', city: 'Nellore', tier: 'Tier 2', lat: 14.4426, lng: 79.9865 },
  { state: 'Andhra Pradesh', district: 'Sri Potti Sriramulu Nellore', city: 'Kavali', tier: 'Tier 3', lat: 14.9134, lng: 79.9925 },
  { state: 'Andhra Pradesh', district: 'Tirupati', city: 'Tirupati', tier: 'Tier 2', lat: 13.6288, lng: 79.4192 },
  { state: 'Andhra Pradesh', district: 'Tirupati', city: 'Srikalahasti', tier: 'Tier 3', lat: 13.7500, lng: 79.7000 },
  { state: 'Andhra Pradesh', district: 'Visakhapatnam', city: 'Visakhapatnam', tier: 'Tier 2', lat: 17.6868, lng: 83.2185 },
  { state: 'Andhra Pradesh', district: 'Vizianagaram', city: 'Vizianagaram', tier: 'Tier 3', lat: 18.1067, lng: 83.3956 },
  { state: 'Andhra Pradesh', district: 'YSR Kadapa', city: 'Kadapa', tier: 'Tier 2', lat: 14.4673, lng: 78.8242 },
  { state: 'Andhra Pradesh', district: 'YSR Kadapa', city: 'Proddatur', tier: 'Tier 3', lat: 14.7500, lng: 78.5500 },

  // Assam
  { state: 'Assam', district: 'Cachar', city: 'Silchar', tier: 'Tier 3', lat: 24.8170, lng: 92.7980 },
  { state: 'Assam', district: 'Dibrugarh', city: 'Dibrugarh', tier: 'Tier 3', lat: 27.4728, lng: 94.9120 },
  { state: 'Assam', district: 'Jorhat', city: 'Jorhat', tier: 'Tier 3', lat: 26.7509, lng: 94.2037 },
  { state: 'Assam', district: 'Kamrup Metropolitan', city: 'Guwahati', tier: 'Tier 2', lat: 26.1445, lng: 91.7362 },
  { state: 'Assam', district: 'Kamrup Metropolitan', city: 'Dispur', tier: 'Tier 2', lat: 26.1433, lng: 91.7898 },
  { state: 'Assam', district: 'Nagaon', city: 'Nagaon', tier: 'Tier 3', lat: 26.3450, lng: 92.6840 },
  { state: 'Assam', district: 'Tinsukia', city: 'Tinsukia', tier: 'Tier 3', lat: 27.4922, lng: 95.3468 },
  { state: 'Assam', district: 'Tinsukia', city: 'Digboi', tier: 'Tier 4', lat: 27.3800, lng: 95.6300 },

  // Bihar
  { state: 'Bihar', district: 'Begusarai', city: 'Begusarai', tier: 'Tier 3', lat: 25.4182, lng: 86.1272 },
  { state: 'Bihar', district: 'Bhagalpur', city: 'Bhagalpur', tier: 'Tier 2', lat: 25.2425, lng: 86.9842 },
  { state: 'Bihar', district: 'Bhojpur', city: 'Arrah', tier: 'Tier 3', lat: 25.5541, lng: 84.6641 },
  { state: 'Bihar', district: 'Darbhanga', city: 'Darbhanga', tier: 'Tier 3', lat: 26.1542, lng: 85.8918 },
  { state: 'Bihar', district: 'Gaya', city: 'Gaya', tier: 'Tier 2', lat: 24.7914, lng: 85.0002 },
  { state: 'Bihar', district: 'Gaya', city: 'Bodh Gaya', tier: 'Tier 4', lat: 24.6961, lng: 84.9869 },
  { state: 'Bihar', district: 'Muzaffarpur', city: 'Muzaffarpur', tier: 'Tier 2', lat: 26.1197, lng: 85.3910 },
  { state: 'Bihar', district: 'Nalanda', city: 'Bihar Sharif', tier: 'Tier 3', lat: 25.1982, lng: 85.5149 },
  { state: 'Bihar', district: 'Nalanda', city: 'Rajgir', tier: 'Tier 4', lat: 25.0300, lng: 85.4200 },
  { state: 'Bihar', district: 'Patna', city: 'Patna', tier: 'Tier 2', lat: 25.5941, lng: 85.1376 },
  { state: 'Bihar', district: 'Patna', city: 'Danapur', tier: 'Tier 3', lat: 25.6333, lng: 85.0500 },
  { state: 'Bihar', district: 'Purnia', city: 'Purnia', tier: 'Tier 3', lat: 25.7771, lng: 87.4753 },
  { state: 'Bihar', district: 'Rohtas', city: 'Sasaram', tier: 'Tier 3', lat: 24.9500, lng: 84.0300 },
  { state: 'Bihar', district: 'Rohtas', city: 'Dehri-on-Sone', tier: 'Tier 3', lat: 24.9000, lng: 84.1800 },
  { state: 'Bihar', district: 'Vaishali', city: 'Hajipur', tier: 'Tier 3', lat: 25.6858, lng: 85.2094 },

  // Chandigarh
  { state: 'Chandigarh', district: 'Chandigarh', city: 'Chandigarh', tier: 'Tier 2', lat: 30.7333, lng: 76.7794 },

  // Chhattisgarh
  { state: 'Chhattisgarh', district: 'Bilaspur', city: 'Bilaspur', tier: 'Tier 2', lat: 22.0797, lng: 82.1409 },
  { state: 'Chhattisgarh', district: 'Durg', city: 'Durg', tier: 'Tier 2', lat: 21.1904, lng: 81.2849 },
  { state: 'Chhattisgarh', district: 'Durg', city: 'Bhilai', tier: 'Tier 2', lat: 21.1938, lng: 81.3509 },
  { state: 'Chhattisgarh', district: 'Korba', city: 'Korba', tier: 'Tier 3', lat: 22.3595, lng: 82.7501 },
  { state: 'Chhattisgarh', district: 'Raipur', city: 'Raipur', tier: 'Tier 2', lat: 21.2514, lng: 81.6296 },
  { state: 'Chhattisgarh', district: 'Rajnandgaon', city: 'Rajnandgaon', tier: 'Tier 3', lat: 21.0970, lng: 81.0370 },

  // Delhi
  { state: 'Delhi', district: 'Central Delhi', city: 'Connaught Place / Karol Bagh', tier: 'Tier 1', lat: 28.6315, lng: 77.2167 },
  { state: 'Delhi', district: 'East Delhi', city: 'Mayur Vihar / Preet Vihar', tier: 'Tier 1', lat: 28.6080, lng: 77.2950 },
  { state: 'Delhi', district: 'New Delhi', city: 'Chanakyapuri / Connaught Place', tier: 'Tier 1', lat: 28.6000, lng: 77.1900 },
  { state: 'Delhi', district: 'North Delhi', city: 'Civil Lines / Sadar Bazar', tier: 'Tier 1', lat: 28.6800, lng: 77.2200 },
  { state: 'Delhi', district: 'North West Delhi', city: 'Rohini / Pitampura', tier: 'Tier 1', lat: 28.7100, lng: 77.1200 },
  { state: 'Delhi', district: 'South Delhi', city: 'Hauz Khas / Saket', tier: 'Tier 1', lat: 28.5355, lng: 77.2100 },
  { state: 'Delhi', district: 'South West Delhi', city: 'Dwarka / Vasant Kunj', tier: 'Tier 1', lat: 28.5800, lng: 77.0500 },

  // Gujarat
  { state: 'Gujarat', district: 'Ahmedabad', city: 'Ahmedabad', tier: 'Tier 1', lat: 23.0225, lng: 72.5714 },
  { state: 'Gujarat', district: 'Ahmedabad', city: 'Sanand', tier: 'Tier 3', lat: 22.9833, lng: 72.3833 },
  { state: 'Gujarat', district: 'Anand', city: 'Anand', tier: 'Tier 3', lat: 22.5645, lng: 72.9289 },
  { state: 'Gujarat', district: 'Anand', city: 'Vallabh Vidyanagar', tier: 'Tier 4', lat: 22.5500, lng: 72.9300 },
  { state: 'Gujarat', district: 'Bharuch', city: 'Bharuch', tier: 'Tier 3', lat: 21.7051, lng: 72.9959 },
  { state: 'Gujarat', district: 'Bharuch', city: 'Ankleshwar', tier: 'Tier 3', lat: 21.6264, lng: 73.0152 },
  { state: 'Gujarat', district: 'Bhavnagar', city: 'Bhavnagar', tier: 'Tier 2', lat: 21.7645, lng: 72.1519 },
  { state: 'Gujarat', district: 'Gandhinagar', city: 'Gandhinagar', tier: 'Tier 2', lat: 23.2156, lng: 72.6369 },
  { state: 'Gujarat', district: 'Gandhinagar', city: 'Kalol', tier: 'Tier 3', lat: 23.2333, lng: 72.5000 },
  { state: 'Gujarat', district: 'Jamnagar', city: 'Jamnagar', tier: 'Tier 2', lat: 22.4707, lng: 70.0577 },
  { state: 'Gujarat', district: 'Junagadh', city: 'Junagadh', tier: 'Tier 3', lat: 21.5222, lng: 70.4579 },
  { state: 'Gujarat', district: 'Kutch', city: 'Gandhidham', tier: 'Tier 3', lat: 23.0753, lng: 70.1337 },
  { state: 'Gujarat', district: 'Kutch', city: 'Bhuj', tier: 'Tier 3', lat: 23.2420, lng: 69.6669 },
  { state: 'Gujarat', district: 'Rajkot', city: 'Rajkot', tier: 'Tier 2', lat: 22.3039, lng: 70.8022 },
  { state: 'Gujarat', district: 'Surat', city: 'Surat', tier: 'Tier 2', lat: 21.1702, lng: 72.8311 },
  { state: 'Gujarat', district: 'Vadodara', city: 'Vadodara', tier: 'Tier 2', lat: 22.3072, lng: 73.1812 },

  // Haryana
  { state: 'Haryana', district: 'Ambala', city: 'Ambala Cantt', tier: 'Tier 2', lat: 30.3300, lng: 76.8400 },
  { state: 'Haryana', district: 'Ambala', city: 'Ambala City', tier: 'Tier 3', lat: 30.3782, lng: 76.7767 },
  { state: 'Haryana', district: 'Faridabad', city: 'Faridabad', tier: 'Tier 2', lat: 28.4089, lng: 77.3178 },
  { state: 'Haryana', district: 'Gurugram', city: 'Gurugram (Gurgaon)', tier: 'Tier 2', lat: 28.4595, lng: 77.0266 },
  { state: 'Haryana', district: 'Gurugram', city: 'Manesar', tier: 'Tier 3', lat: 28.3500, lng: 76.9300 },
  { state: 'Haryana', district: 'Hisar', city: 'Hisar', tier: 'Tier 3', lat: 29.1492, lng: 75.7217 },
  { state: 'Haryana', district: 'Karnal', city: 'Karnal', tier: 'Tier 2', lat: 29.6857, lng: 76.9905 },
  { state: 'Haryana', district: 'Panipat', city: 'Panipat', tier: 'Tier 2', lat: 29.3909, lng: 76.9635 },
  { state: 'Haryana', district: 'Rohtak', city: 'Rohtak', tier: 'Tier 2', lat: 28.8955, lng: 76.6066 },
  { state: 'Haryana', district: 'Sonipat', city: 'Sonipat', tier: 'Tier 3', lat: 28.9931, lng: 77.0151 },
  { state: 'Haryana', district: 'Sonipat', city: 'Kundli', tier: 'Tier 4', lat: 28.8700, lng: 77.1200 },

  // Himachal Pradesh
  { state: 'Himachal Pradesh', district: 'Kangra', city: 'Dharamshala', tier: 'Tier 2', lat: 32.2190, lng: 76.3234 },
  { state: 'Himachal Pradesh', district: 'Kangra', city: 'Kangra', tier: 'Tier 4', lat: 32.0998, lng: 76.2691 },
  { state: 'Himachal Pradesh', district: 'Shimla', city: 'Shimla', tier: 'Tier 2', lat: 31.1048, lng: 77.1734 },
  { state: 'Himachal Pradesh', district: 'Solan', city: 'Baddi', tier: 'Tier 3', lat: 30.9578, lng: 76.7914 },

  // Jammu & Kashmir
  { state: 'Jammu & Kashmir', district: 'Jammu', city: 'Jammu', tier: 'Tier 2', lat: 32.7266, lng: 74.8570 },
  { state: 'Jammu & Kashmir', district: 'Srinagar', city: 'Srinagar', tier: 'Tier 2', lat: 34.0837, lng: 74.7973 },

  // Jharkhand
  { state: 'Jharkhand', district: 'Bokaro', city: 'Bokaro Steel City', tier: 'Tier 2', lat: 23.6693, lng: 86.1511 },
  { state: 'Jharkhand', district: 'Dhanbad', city: 'Dhanbad', tier: 'Tier 2', lat: 23.7957, lng: 86.4304 },
  { state: 'Jharkhand', district: 'East Singhbhum', city: 'Jamshedpur', tier: 'Tier 2', lat: 22.8046, lng: 86.2029 },
  { state: 'Jharkhand', district: 'Ranchi', city: 'Ranchi', tier: 'Tier 2', lat: 23.3441, lng: 85.3096 },

  // Karnataka
  { state: 'Karnataka', district: 'Bangalore Urban', city: 'Bengaluru', tier: 'Tier 1', lat: 12.9716, lng: 77.5946 },
  { state: 'Karnataka', district: 'Bangalore Rural', city: 'Devanahalli', tier: 'Tier 3', lat: 13.2483, lng: 77.7128 },
  { state: 'Karnataka', district: 'Belagavi', city: 'Belagavi (Belgaum)', tier: 'Tier 2', lat: 15.8497, lng: 74.4977 },
  { state: 'Karnataka', district: 'Ballari', city: 'Ballari (Bellary)', tier: 'Tier 3', lat: 15.1394, lng: 76.9214 },
  { state: 'Karnataka', district: 'Dakshina Kannada', city: 'Mangaluru (Mangalore)', tier: 'Tier 2', lat: 12.9141, lng: 74.8560 },
  { state: 'Karnataka', district: 'Dharwad', city: 'Hubballi-Dharwad', tier: 'Tier 2', lat: 15.3647, lng: 75.1240 },
  { state: 'Karnataka', district: 'Kalaburagi', city: 'Kalaburagi (Gulbarga)', tier: 'Tier 2', lat: 17.3297, lng: 76.8343 },
  { state: 'Karnataka', district: 'Mysuru', city: 'Mysuru (Mysore)', tier: 'Tier 2', lat: 12.2958, lng: 76.6394 },
  { state: 'Karnataka', district: 'Shimoga', city: 'Shivamogga (Shimoga)', tier: 'Tier 3', lat: 13.9299, lng: 75.5681 },
  { state: 'Karnataka', district: 'Udupi', city: 'Udupi', tier: 'Tier 3', lat: 13.3409, lng: 74.7421 },
  { state: 'Karnataka', district: 'Udupi', city: 'Manipal', tier: 'Tier 4', lat: 13.3525, lng: 74.7864 },

  // Kerala
  { state: 'Kerala', district: 'Ernakulam', city: 'Kochi (Cochin)', tier: 'Tier 2', lat: 9.9312, lng: 76.2673 },
  { state: 'Kerala', district: 'Ernakulam', city: 'Aluva', tier: 'Tier 3', lat: 10.1076, lng: 76.3516 },
  { state: 'Kerala', district: 'Kozhikode', city: 'Kozhikode (Calicut)', tier: 'Tier 2', lat: 11.2588, lng: 75.7804 },
  { state: 'Kerala', district: 'Malappuram', city: 'Malappuram', tier: 'Tier 2', lat: 11.0510, lng: 76.0711 },
  { state: 'Kerala', district: 'Thiruvananthapuram', city: 'Thiruvananthapuram (Trivandrum)', tier: 'Tier 2', lat: 8.5241, lng: 76.9366 },
  { state: 'Kerala', district: 'Thrissur', city: 'Thrissur', tier: 'Tier 2', lat: 10.5276, lng: 76.2144 },

  // Madhya Pradesh
  { state: 'Madhya Pradesh', district: 'Bhopal', city: 'Bhopal', tier: 'Tier 2', lat: 23.2599, lng: 77.4126 },
  { state: 'Madhya Pradesh', district: 'Gwalior', city: 'Gwalior', tier: 'Tier 2', lat: 26.2183, lng: 78.1828 },
  { state: 'Madhya Pradesh', district: 'Indore', city: 'Indore', tier: 'Tier 2', lat: 22.7196, lng: 75.8577 },
  { state: 'Madhya Pradesh', district: 'Jabalpur', city: 'Jabalpur', tier: 'Tier 2', lat: 23.1815, lng: 79.9864 },
  { state: 'Madhya Pradesh', district: 'Ujjain', city: 'Ujjain', tier: 'Tier 2', lat: 23.1765, lng: 75.7885 },

  // Maharashtra
  { state: 'Maharashtra', district: 'Aurangabad (Chhatrapati Sambhajinagar)', city: 'Aurangabad', tier: 'Tier 2', lat: 19.8762, lng: 75.3433 },
  { state: 'Maharashtra', district: 'Kolhapur', city: 'Kolhapur', tier: 'Tier 2', lat: 16.7050, lng: 74.2433 },
  { state: 'Maharashtra', district: 'Mumbai City', city: 'South Mumbai', tier: 'Tier 1', lat: 18.9388, lng: 72.8354 },
  { state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Andheri / Bandra / Borivali', tier: 'Tier 1', lat: 19.0596, lng: 72.8295 },
  { state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', tier: 'Tier 1', lat: 19.0760, lng: 72.8777 },
  { state: 'Maharashtra', district: 'Nagpur', city: 'Nagpur', tier: 'Tier 2', lat: 21.1458, lng: 79.0882 },
  { state: 'Maharashtra', district: 'Nashik', city: 'Nashik', tier: 'Tier 2', lat: 19.9975, lng: 73.7898 },
  { state: 'Maharashtra', district: 'Pune', city: 'Pune', tier: 'Tier 1', lat: 18.5204, lng: 73.8567 },
  { state: 'Maharashtra', district: 'Pune', city: 'Pimpri-Chinchwad', tier: 'Tier 1', lat: 18.6298, lng: 73.7997 },
  { state: 'Maharashtra', district: 'Solapur', city: 'Solapur', tier: 'Tier 2', lat: 17.6599, lng: 75.9064 },
  { state: 'Maharashtra', district: 'Thane', city: 'Thane', tier: 'Tier 2', lat: 19.2183, lng: 72.9781 },
  { state: 'Maharashtra', district: 'Thane', city: 'Kalyan-Dombivli', tier: 'Tier 2', lat: 19.2403, lng: 73.1305 },
  { state: 'Maharashtra', district: 'Thane', city: 'Navi Mumbai', tier: 'Tier 2', lat: 19.0330, lng: 73.0297 },

  // Odisha
  { state: 'Odisha', district: 'Cuttack', city: 'Cuttack', tier: 'Tier 2', lat: 20.4625, lng: 85.8828 },
  { state: 'Odisha', district: 'Khordha', city: 'Bhubaneswar', tier: 'Tier 2', lat: 20.2961, lng: 85.8245 },
  { state: 'Odisha', district: 'Sundargarh', city: 'Rourkela', tier: 'Tier 2', lat: 22.2604, lng: 84.8536 },

  // Punjab
  { state: 'Punjab', district: 'Amritsar', city: 'Amritsar', tier: 'Tier 2', lat: 31.6340, lng: 74.8723 },
  { state: 'Punjab', district: 'Jalandhar', city: 'Jalandhar', tier: 'Tier 2', lat: 31.3260, lng: 75.5762 },
  { state: 'Punjab', district: 'Ludhiana', city: 'Ludhiana', tier: 'Tier 2', lat: 30.9010, lng: 75.8573 },
  { state: 'Punjab', district: 'SAS Nagar (Mohali)', city: 'Mohali', tier: 'Tier 2', lat: 30.7046, lng: 76.7179 },

  // Rajasthan
  { state: 'Rajasthan', district: 'Bikaner', city: 'Bikaner', tier: 'Tier 2', lat: 28.0229, lng: 73.3119 },
  { state: 'Rajasthan', district: 'Jaipur', city: 'Jaipur', tier: 'Tier 2', lat: 26.9124, lng: 75.7873 },
  { state: 'Rajasthan', district: 'Jodhpur', city: 'Jodhpur', tier: 'Tier 2', lat: 26.2389, lng: 73.0243 },
  { state: 'Rajasthan', district: 'Kota', city: 'Kota', tier: 'Tier 2', lat: 25.2138, lng: 75.8648 },
  { state: 'Rajasthan', district: 'Udaipur', city: 'Udaipur', tier: 'Tier 2', lat: 24.5854, lng: 73.7125 },

  // Tamil Nadu
  { state: 'Tamil Nadu', district: 'Chennai', city: 'Chennai', tier: 'Tier 1', lat: 13.0827, lng: 80.2707 },
  { state: 'Tamil Nadu', district: 'Coimbatore', city: 'Coimbatore', tier: 'Tier 2', lat: 11.0168, lng: 76.9558 },
  { state: 'Tamil Nadu', district: 'Madurai', city: 'Madurai', tier: 'Tier 2', lat: 9.9252, lng: 78.1198 },
  { state: 'Tamil Nadu', district: 'Salem', city: 'Salem', tier: 'Tier 2', lat: 11.6643, lng: 78.1460 },
  { state: 'Tamil Nadu', district: 'Tiruchirappalli', city: 'Tiruchirappalli (Trichy)', tier: 'Tier 2', lat: 10.7905, lng: 78.7047 },

  // Telangana
  { state: 'Telangana', district: 'Hyderabad', city: 'Hyderabad', tier: 'Tier 1', lat: 17.3850, lng: 78.4867 },
  { state: 'Telangana', district: 'Hyderabad', city: 'Secunderabad', tier: 'Tier 1', lat: 17.4399, lng: 78.4983 },
  { state: 'Telangana', district: 'Medchal-Malkajgiri', city: 'Kukatpally', tier: 'Tier 1', lat: 17.4849, lng: 78.4138 },
  { state: 'Telangana', district: 'Ranga Reddy', city: 'Gachibowli / Shamshabad', tier: 'Tier 1', lat: 17.4401, lng: 78.3489 },
  { state: 'Telangana', district: 'Warangal', city: 'Warangal', tier: 'Tier 2', lat: 17.9689, lng: 79.5941 },

  // Uttar Pradesh
  { state: 'Uttar Pradesh', district: 'Agra', city: 'Agra', tier: 'Tier 2', lat: 27.1767, lng: 78.0081 },
  { state: 'Uttar Pradesh', district: 'Gautam Buddha Nagar', city: 'Noida / Greater Noida', tier: 'Tier 2', lat: 28.5355, lng: 77.3910 },
  { state: 'Uttar Pradesh', district: 'Ghaziabad', city: 'Ghaziabad', tier: 'Tier 2', lat: 28.6692, lng: 77.4538 },
  { state: 'Uttar Pradesh', district: 'Kanpur Nagar', city: 'Kanpur', tier: 'Tier 2', lat: 26.4499, lng: 80.3319 },
  { state: 'Uttar Pradesh', district: 'Lucknow', city: 'Lucknow', tier: 'Tier 2', lat: 26.8467, lng: 80.9462 },
  { state: 'Uttar Pradesh', district: 'Prayagraj', city: 'Prayagraj (Allahabad)', tier: 'Tier 2', lat: 25.4358, lng: 81.8463 },
  { state: 'Uttar Pradesh', district: 'Varanasi', city: 'Varanasi', tier: 'Tier 2', lat: 25.3176, lng: 82.9739 },

  // Uttarakhand
  { state: 'Uttarakhand', district: 'Dehradun', city: 'Dehradun', tier: 'Tier 2', lat: 30.3165, lng: 78.0322 },
  { state: 'Uttarakhand', district: 'Haridwar', city: 'Haridwar / Roorkee', tier: 'Tier 2', lat: 29.9457, lng: 78.1642 },

  // West Bengal
  { state: 'West Bengal', district: 'Kolkata', city: 'Kolkata', tier: 'Tier 1', lat: 22.5726, lng: 88.3639 },
  { state: 'West Bengal', district: 'Howrah', city: 'Howrah', tier: 'Tier 2', lat: 22.5958, lng: 88.2636 },
  { state: 'West Bengal', district: 'Paschim Bardhaman', city: 'Asansol / Durgapur', tier: 'Tier 2', lat: 23.6739, lng: 86.9524 },
  { state: 'West Bengal', district: 'Darjeeling', city: 'Siliguri', tier: 'Tier 2', lat: 26.7271, lng: 88.3953 },
];

// Lookup Map by City Name (lowercased for flexible matching)
export const CITY_LOOKUP_MAP: Record<string, LocationRecord> = {};
INDIA_LOCATIONS.forEach((loc) => {
  CITY_LOOKUP_MAP[loc.city.toLowerCase()] = loc;
  // Also index simple prefix or aliases
  if (loc.city.includes('/')) {
    loc.city.split('/').forEach((part) => {
      CITY_LOOKUP_MAP[part.trim().toLowerCase()] = loc;
    });
  }
  if (loc.city.includes('(')) {
    const main = loc.city.split('(')[0].trim().toLowerCase();
    const paren = loc.city.split('(')[1]?.replace(')', '').trim().toLowerCase();
    CITY_LOOKUP_MAP[main] = loc;
    if (paren) CITY_LOOKUP_MAP[paren] = loc;
  }
});

// All unique States
export const ALL_STATES = Array.from(new Set(INDIA_LOCATIONS.map((l) => l.state))).sort();

// All unique Cities
export const ALL_CITIES = Array.from(new Set(INDIA_LOCATIONS.map((l) => l.city))).sort((a, b) =>
  a.localeCompare(b)
);

// Helper to get districts for a state
export function getDistrictsForState(stateName: string): string[] {
  if (!stateName) return [];
  return Array.from(
    new Set(INDIA_LOCATIONS.filter((l) => l.state === stateName).map((l) => l.district))
  ).sort();
}

// Helper to get cities for a state and district
export function getCitiesForDistrict(stateName: string, districtName?: string): LocationRecord[] {
  return INDIA_LOCATIONS.filter((l) => {
    if (stateName && l.state !== stateName) return false;
    if (districtName && l.district !== districtName) return false;
    return true;
  });
}

// Helper to find location details by city name
export function findLocationByCity(cityName: string): LocationRecord | undefined {
  if (!cityName) return undefined;
  const q = cityName.trim().toLowerCase();
  if (CITY_LOOKUP_MAP[q]) return CITY_LOOKUP_MAP[q];

  // Partial match
  return INDIA_LOCATIONS.find(
    (l) => l.city.toLowerCase().includes(q) || q.includes(l.city.toLowerCase())
  );
}

/**
 * Automatically derives latitude and longitude from City, Street Address, and Landmark.
 * Starts with city centroid and applies deterministic spatial micro-offset based on address/landmark.
 */
export function deriveCoordinates(
  cityName: string,
  address?: string,
  landmark?: string
): { lat: number; lng: number; isFound: boolean } {
  const loc = findLocationByCity(cityName);
  if (!loc) {
    return { lat: 19.076, lng: 72.8777, isFound: false };
  }

  let lat = loc.lat;
  let lng = loc.lng;

  const combined = `${address || ''} ${landmark || ''}`.trim().toLowerCase();
  if (combined.length > 0) {
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = (hash << 5) - hash + combined.charCodeAt(i);
      hash |= 0;
    }
    // Realistic micro-offset (~200m to 1km) so different corridors within the city have distinct coordinates
    const latOffset = ((Math.abs(hash) % 240) - 120) / 10000;
    const lngOffset = ((Math.abs(hash >> 3) % 240) - 120) / 10000;
    lat = parseFloat((lat + latOffset).toFixed(6));
    lng = parseFloat((lng + lngOffset).toFixed(6));
  }

  return { lat, lng, isFound: true };
}

/**
 * Calculates simplified Aspect Ratio and decimal ratio
 * e.g. 40x20 -> "2:1", 60x25 -> "12:5 (2.4:1)"
 */
export function calculateAspectRatio(
  width: number,
  height: number
): {
  ratioText: string;
  decimalText: string;
  widthRatio: number;
  heightRatio: number;
  orientation: 'Landscape' | 'Portrait' | 'Square';
} {
  if (!width || !height || width <= 0 || height <= 0) {
    return {
      ratioText: '1:1',
      decimalText: '1.00 : 1',
      widthRatio: 1,
      heightRatio: 1,
      orientation: 'Square',
    };
  }

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const precision = 10;
  const w = Math.round(width * precision);
  const h = Math.round(height * precision);
  const div = gcd(w, h);

  const wRatio = w / div;
  const hRatio = h / div;

  const decimal = (width / height).toFixed(2);
  const orientation =
    width > height ? 'Landscape' : width < height ? 'Portrait' : 'Square';

  return {
    ratioText: `${wRatio}:${hRatio}`,
    decimalText: `${decimal} : 1`,
    widthRatio: wRatio,
    heightRatio: hRatio,
    orientation,
  };
}

// ==========================================
// PINCODE & HOARDING UID NOMENCLATURE SUITE
// ==========================================

// City default PIN code mappings
export const CITY_DEFAULT_PINCODES: Record<string, string> = {
  mumbai: '400001',
  delhi: '110001',
  'new delhi': '110001',
  bengaluru: '560001',
  bangalore: '560001',
  visakhapatnam: '530002',
  vizag: '530002',
  hyderabad: '500001',
  kolkata: '700001',
  ahmedabad: '380001',
  pune: '411001',
  chennai: '600001',
  varanasi: '221001',
  jaipur: '302001',
  lucknow: '226001',
  chandigarh: '160017',
  surat: '395001',
  indore: '452001',
  kochi: '682001',
  cochin: '682001',
  patna: '800001',
  bhopal: '462001',
  noida: '201301',
  'greater noida': '201310',
  gurugram: '122001',
  gurgaon: '122001',
  thane: '400601',
  nagpur: '440001',
  vadodara: '390001',
  ghaziabad: '201001',
  ludhiana: '141001',
  agra: '282001',
  nashik: '422001',
  faridabad: '121001',
  meerut: '250001',
  rajkot: '360001',
  amritsar: '143001',
  allahabad: '211001',
  prayagraj: '211001',
  ranchi: '834001',
  howrah: '711101',
  coimbatore: '641001',
  jabalpur: '482001',
  gwalior: '474001',
  vijayawada: '520001',
  jodhpur: '342001',
  madurai: '625001',
  raipur: '492001',
  kota: '324001',
  guwahati: '781001',
  chandrapur: '442401',
  solapur: '413001',
  hubballi: '580020',
  mysuru: '570001',
  mysore: '570001',
  tiruchirappalli: '620001',
  salem: '636001',
  tiruppur: '641601',
  dehradun: '248001',
};

export interface LocalityPincodeEntry {
  name: string;
  regex: RegExp;
  pincode: string;
}

// Master Indian Locality, Landmark & High-Density Corridor Knowledge Base
export const LOCALITY_PINCODE_MAP: LocalityPincodeEntry[] = [
  // --- MUMBAI & MMR ---
  { name: 'Bandra West / Bandra Reclamation / Sea Link', regex: /bandra\s*(?:west|reclamation|sea\s*link|toll|pali|hill\s*road|linking)/i, pincode: '400050' },
  { name: 'BKC / Bandra Kurla Complex', regex: /bkc|bandra\s*kurla|kalanagar|mca|g-block/i, pincode: '400051' },
  { name: 'Worli / Sea Link Southern End', regex: /worli|sea\s*link\s*(?:worli|approach)|nehru\s*planetarium|century\s*bazaar/i, pincode: '400018' },
  { name: 'Nariman Point / Marine Drive / Churchgate', regex: /nariman\s*point|marine\s*drive|churchgate|mantralaya|express\s*towers/i, pincode: '400021' },
  { name: 'Fort / CST / Ballard Estate / Fountain', regex: /cst|csmt|chhatrapati\s*shivaji|ballard\s*estate|flora\s*fountain|fort\s*mumbai/i, pincode: '400001' },
  { name: 'Colaba / Cuffe Parade', regex: /colaba|cuffe\s*parade|gateway\s*of\s*india|taj\s*mahal\s*palace/i, pincode: '400005' },
  { name: 'Dadar West / Shivaji Park', regex: /dadar\s*west|shivaji\s*park|plaza\s*cinema|sena\s*bhavan/i, pincode: '400028' },
  { name: 'Dadar East / TT Circle', regex: /dadar\s*east|tt\s*circle|hindu\s*colony/i, pincode: '400014' },
  { name: 'Lower Parel / High Street Phoenix / Palladium', regex: /lower\s*parel|phoenix\s*mills|palladium|kamala\s*mills|peninsula/i, pincode: '400013' },
  { name: 'Prabhadevi / Siddhivinayak', regex: /prabhadevi|siddhivinayak/i, pincode: '400025' },
  { name: 'Mahim / Mahim Causeway', regex: /mahim|mahim\s*causeway/i, pincode: '400016' },
  { name: 'Juhu / Juhu Tara Road / Juhu Beach', regex: /juhu|juhu\s*tara|jw\s*marriott|jvpd/i, pincode: '400049' },
  { name: 'Vile Parle West', regex: /vile\s*parle\s*west|mithibai/i, pincode: '400056' },
  { name: 'Vile Parle East / Domestic Airport', regex: /vile\s*parle\s*east|domestic\s*airport/i, pincode: '400057' },
  { name: 'Santacruz West', regex: /santacruz\s*west/i, pincode: '400054' },
  { name: 'Santacruz East / Vakola', regex: /santacruz\s*east|vakola|grand\s*hyatt/i, pincode: '400055' },
  { name: 'Khar West', regex: /khar\s*west|khar\s*danda/i, pincode: '400052' },
  { name: 'Andheri West / Lokhandwala / Versova', regex: /andheri\s*west|lokhandwala|versova|infinity\s*mall\s*andheri|oshiwara/i, pincode: '400053' },
  { name: 'Andheri East / MIDC / SEEPZ / Chakala', regex: /andheri\s*east|midc\s*andheri|seepz|chakala|jb\s*nagar/i, pincode: '400069' },
  { name: 'Sakinaka / Andheri-Kurla Road', regex: /sakinaka|andheri[\s-]*kurla|asalpha/i, pincode: '400072' },
  { name: 'Goregaon West / Link Road', regex: /goregaon\s*west|bangur\s*nagar/i, pincode: '400104' },
  { name: 'Goregaon East / NESCO / Hub Mall / Oberoi', regex: /goregaon\s*east|nesco|hub\s*mall|oberoi\s*mall|aarey|film\s*city/i, pincode: '400063' },
  { name: 'Malad West / Inorbit Mall / Mindspace', regex: /malad\s*west|inorbit\s*mall\s*malad|mindspace\s*malad/i, pincode: '400064' },
  { name: 'Malad East / Dindoshi', regex: /malad\s*east|dindoshi/i, pincode: '400097' },
  { name: 'Kandivali West / Mahavir Nagar', regex: /kandivali\s*west|mahavir\s*nagar/i, pincode: '400067' },
  { name: 'Kandivali East / Thakur Village', regex: /kandivali\s*east|thakur\s*village|thakur\s*complex|growel/i, pincode: '400101' },
  { name: 'Borivali West / IC Colony / Gorai', regex: /borivali\s*west|ic\s*colony|shimpoli|gorai/i, pincode: '400092' },
  { name: 'Borivali East / National Park (SGNP)', regex: /borivali\s*east|national\s*park|sgnp|magathane/i, pincode: '400066' },
  { name: 'Powai / Hiranandani / IIT Bombay', regex: /powai|hiranandani\s*powai|iit\s*bombay/i, pincode: '400076' },
  { name: 'Ghatkopar West / R City Mall', regex: /ghatkopar\s*west|r\s*city\s*mall|lbs\s*marg\s*ghatkopar/i, pincode: '400086' },
  { name: 'Kurla West / Phoenix Marketcity', regex: /kurla\s*west|phoenix\s*marketcity\s*kurla/i, pincode: '400070' },
  { name: 'Chembur / Diamond Garden', regex: /chembur|diamond\s*garden/i, pincode: '400071' },
  { name: 'Mulund West / R Mall', regex: /mulund\s*west|r\s*mall\s*mulund/i, pincode: '400080' },
  { name: 'Thane West / Viviana Mall / Majiwada', regex: /thane\s*west|viviana\s*mall|korum\s*mall|majiwada|ghodbunder|cadbury\s*junction/i, pincode: '400601' },
  { name: 'Vashi / Palm Beach Road / Inorbit', regex: /vashi|palm\s*beach\s*road|inorbit\s*vashi/i, pincode: '400703' },
  { name: 'Nerul / DY Patil Stadium', regex: /nerul|dy\s*patil/i, pincode: '400706' },
  { name: 'CBD Belapur', regex: /belapur|cbd\s*belapur|konkan\s*bhavan/i, pincode: '400614' },
  { name: 'Kharghar / Central Park', regex: /kharghar|utsav\s*chowk/i, pincode: '410210' },
  { name: 'Airoli / Mindspace Airoli', regex: /airoli|mindspace\s*airoli/i, pincode: '400708' },
  { name: 'Mahape / Millennium Business Park', regex: /mahape|millennium\s*business/i, pincode: '400710' },

  // --- DELHI NCR ---
  { name: 'Connaught Place / Barakhamba / Statesman House', regex: /connaught\s*place|\bcp\b|barakhamba|statesman\s*house|janpath|outer\s*circle|inner\s*circle/i, pincode: '110001' },
  { name: 'Chanakyapuri / Shanti Path', regex: /chanakyapuri|shanti\s*path|diplomatic\s*enclave/i, pincode: '110021' },
  { name: 'India Gate / Khan Market', regex: /india\s*gate|khan\s*market|pandara/i, pincode: '110003' },
  { name: 'Karol Bagh / Pusa Road', regex: /karol\s*bagh|pusa\s*road|rajendra\s*place|jhandewalan/i, pincode: '110005' },
  { name: 'Chandni Chowk / Red Fort / Kashmere Gate', regex: /chandni\s*chowk|red\s*fort|kashmere\s*gate/i, pincode: '110006' },
  { name: 'Civil Lines / Mall Road Delhi', regex: /civil\s*lines|mall\s*road\s*delhi/i, pincode: '110054' },
  { name: 'Lajpat Nagar / Central Market / Defence Colony', regex: /lajpat\s*nagar|defence\s*colony|moolchand/i, pincode: '110024' },
  { name: 'South Extension / AIIMS', regex: /south\s*ex(?:tension)?|aiims/i, pincode: '110049' },
  { name: 'Hauz Khas / Green Park / IIT Flyover', regex: /hauz\s*khas|green\s*park|iit\s*delhi|aurobindo/i, pincode: '110016' },
  { name: 'Saket / Select Citywalk', regex: /saket|select\s*citywalk|press\s*enclave/i, pincode: '110017' },
  { name: 'Nehru Place / Kalkaji', regex: /nehru\s*place|kalkaji|lotus\s*temple/i, pincode: '110019' },
  { name: 'Greater Kailash / GK 1 & 2', regex: /greater\s*kailash|\bgk\s*[12]\b/i, pincode: '110048' },
  { name: 'Okhla Industrial Area', regex: /okhla\s*industrial|okhla\s*phase/i, pincode: '110020' },
  { name: 'Vasant Kunj / DLF Promenade', regex: /vasant\s*kunj|dlf\s*promenade|ambience\s*mall\s*vasant/i, pincode: '110070' },
  { name: 'IGI Airport T3 / T1 / Aerocity', regex: /igi\s*airport|terminal\s*3|t3\s*departure|aerocity|terminal\s*1/i, pincode: '110037' },
  { name: 'Dwarka / Dwarka Expressway', regex: /dwarka|dwarka\s*expressway/i, pincode: '110075' },
  { name: 'Janakpuri District Centre', regex: /janakpuri|district\s*centre\s*janakpuri/i, pincode: '110058' },
  { name: 'Rajouri Garden', regex: /rajouri\s*garden/i, pincode: '110027' },
  { name: 'Punjabi Bagh / Ring Road', regex: /punjabi\s*bagh/i, pincode: '110026' },
  { name: 'Rohini / Pitampura / NSP', regex: /rohini|pitampura|netaji\s*subhash\s*place|\bnsp\b/i, pincode: '110085' },
  { name: 'Mayur Vihar', regex: /mayur\s*vihar/i, pincode: '110091' },
  { name: 'DLF Cyber City / Cyber Hub / DLF Phase 2', regex: /cyber\s*city|cyber\s*hub|rapid\s*metro|dlf\s*phase\s*2|dlf\s*phase\s*3/i, pincode: '122002' },
  { name: 'Golf Course Road / DLF Phase 5', regex: /golf\s*course\s*road|dlf\s*phase\s*5|sector\s*54\s*gur/i, pincode: '122002' },
  { name: 'MG Road Gurgaon / IFFCO Chowk', regex: /mg\s*road\s*gur|iffco\s*chowk|sikanderpur/i, pincode: '122002' },
  { name: 'Golf Course Extension Road', regex: /golf\s*course\s*ext|sector\s*56\s*gur|sector\s*57\s*gur/i, pincode: '122011' },
  { name: 'Sohna Road / Subhash Chowk', regex: /sohna\s*road|subhash\s*chowk|sector\s*48\s*gur|sector\s*49\s*gur/i, pincode: '122018' },
  { name: 'Udyog Vihar / Ambience Mall Gurgaon', regex: /udyog\s*vihar|ambience\s*mall\s*gur|shankar\s*chowk/i, pincode: '122016' },
  { name: 'Old Gurgaon / Sector 14', regex: /sector\s*14\s*gur|sector\s*15\s*gur/i, pincode: '122001' },
  { name: 'Manesar / IMT Manesar', regex: /manesar|imt\s*manesar/i, pincode: '122051' },
  { name: 'Noida Sector 18 / Atta Market / Mall of India', regex: /sector\s*18\s*noida|atta\s*market|mall\s*of\s*india|sector\s*16\s*noida/i, pincode: '201301' },
  { name: 'Noida Sector 62 / Electronic City', regex: /sector\s*62\s*noida|electronic\s*city\s*noida/i, pincode: '201309' },
  { name: 'Noida Expressway / Sector 128 / 135', regex: /noida\s*expressway|sector\s*128|sector\s*132|sector\s*135/i, pincode: '201304' },
  { name: 'Greater Noida / Pari Chowk', regex: /pari\s*chowk|greater\s*noida|expo\s*mart/i, pincode: '201310' },
  { name: 'Kaushambi / Vaishali Ghaziabad', regex: /kaushambi|vaishali\s*ghaziabad/i, pincode: '201010' },
  { name: 'Indirapuram / Shipra Mall', regex: /indirapuram|shipra\s*mall/i, pincode: '201014' },

  // --- BENGALURU (BANGALORE) ---
  { name: 'MG Road / Brigade Road / Commercial Street', regex: /mg\s*road\s*(?:bang|beng)|brigade\s*road|commercial\s*street|trinity\s*circle/i, pincode: '560001' },
  { name: 'Indiranagar / 100 Feet Road / 12th Main', regex: /indiranagar|100\s*feet\s*road\s*ind|12th\s*main\s*ind|cmh\s*road/i, pincode: '560038' },
  { name: 'Koramangala / Sony World Signal', regex: /koramangala|sony\s*world|forum\s*mall\s*kor/i, pincode: '560034' },
  { name: 'HSR Layout / 27th Main', regex: /hsr\s*layout|27th\s*main\s*hsr/i, pincode: '560102' },
  { name: 'Bellandur / EcoSpace / EcoWorld / ORR', regex: /bellandur|ecospace|ecoworld|outer\s*ring\s*road.*bellandur/i, pincode: '560103' },
  { name: 'Marathahalli / Innovative Multiplex', regex: /marathahalli/i, pincode: '560037' },
  { name: 'Whitefield / ITPL / EPIP Zone', regex: /whitefield|itpl|epip\s*zone|hope\s*farm|kadugodi/i, pincode: '560066' },
  { name: 'Electronic City / Infosys Gate / Hosur Road', regex: /electronic\s*city|infosys\s*gate|hosur\s*road.*elec/i, pincode: '560100' },
  { name: 'BTM Layout / Silk Board Junction', regex: /btm\s*layout|silk\s*board/i, pincode: '560068' },
  { name: 'Jayanagar / Ashoka Pillar', regex: /jayanagar|ashoka\s*pillar/i, pincode: '560011' },
  { name: 'JP Nagar / Bannerghatta Road', regex: /jp\s*nagar|bannerghatta\s*road|vega\s*city/i, pincode: '560078' },
  { name: 'Banashankari', regex: /banashankari|\bbsk\b/i, pincode: '560050' },
  { name: 'Rajajinagar / Orion Mall / WTC Bangalore', regex: /rajajinagar|orion\s*mall|wtc\s*bangalore|brigade\s*gateway/i, pincode: '560010' },
  { name: 'Malleshwaram', regex: /malleshwaram/i, pincode: '560003' },
  { name: 'Hebbal / Manyata Tech Park', regex: /hebbal|manyata|hebbal\s*flyover/i, pincode: '560024' },
  { name: 'Yelahanka', regex: /yelahanka/i, pincode: '560064' },
  { name: 'KIA / Devanahalli / Airport Bangalore', regex: /devanahalli|kempegowda\s*airport|kia\s*airport/i, pincode: '560300' },
  { name: 'Domlur / Embassy GolfLinks (EGL)', regex: /domlur|embassy\s*golflinks|\begl\b/i, pincode: '560071' },
  { name: 'Yeshwanthpur', regex: /yeshwanthpur|goraguntepalya/i, pincode: '560022' },

  // --- HYDERABAD / CYBERABAD ---
  { name: 'Hitec City / Cyber Towers / Madhapur', regex: /hitec\s*city|cyber\s*towers|cyber\s*gateway|madhapur|mindspace\s*hyd/i, pincode: '500081' },
  { name: 'Gachibowli / Financial District / Waverock', regex: /gachibowli|financial\s*district|waverock|bio[\s-]*diversity/i, pincode: '500032' },
  { name: 'Kondapur / Botanical Garden', regex: /kondapur|botanical\s*garden/i, pincode: '500084' },
  { name: 'Banjara Hills / Road No 12 / GVK One', regex: /banjara\s*hills|road\s*no\s*12|gvk\s*one/i, pincode: '500034' },
  { name: 'Jubilee Hills / Road No 36 / Durgam Cheruvu', regex: /jubilee\s*hills|road\s*no\s*36|durgam\s*cheruvu/i, pincode: '500033' },
  { name: 'Panjagutta / Somajiguda', regex: /panjagutta|somajiguda|central\s*mall\s*hyd/i, pincode: '500082' },
  { name: 'Begumpet / Prakash Nagar', regex: /begumpet|prakash\s*nagar/i, pincode: '500016' },
  { name: 'Secunderabad / Clock Tower', regex: /secunderabad|parade\s*ground|clock\s*tower\s*sec/i, pincode: '500003' },
  { name: 'Kukatpally / KPHB Colony / JNTU', regex: /kukatpally|kphb|jntu/i, pincode: '500072' },
  { name: 'Ameerpet', regex: /ameerpet/i, pincode: '500038' },
  { name: 'Abids / Koti / Nampally', regex: /abids|koti|nampally/i, pincode: '500001' },
  { name: 'Charminar', regex: /charminar/i, pincode: '500002' },
  { name: 'Shamshabad / Airport Hyderabad', regex: /shamshabad|rgia|hyderabad\s*airport/i, pincode: '500409' },

  // --- CHENNAI ---
  { name: 'Mount Road / Anna Salai', regex: /anna\s*salai|mount\s*road|thousand\s*lights/i, pincode: '600002' },
  { name: 'T Nagar / Usman Road / Pondy Bazaar', regex: /t\s*nagar|usman\s*road|pondy\s*bazaar|panagal\s*park/i, pincode: '600017' },
  { name: 'Guindy / Kathipara / Olympia Tech Park', regex: /guindy|kathipara|olympia\s*tech/i, pincode: '600032' },
  { name: 'OMR / Thoraipakkam / TIDEL Park', regex: /omr|thoraipakkam|sholinganallur|tidel\s*park|taramani/i, pincode: '600096' },
  { name: 'Adyar / LB Road', regex: /adyar|lb\s*road/i, pincode: '600020' },
  { name: 'Velachery / Phoenix Marketcity Chennai', regex: /velachery|phoenix\s*marketcity\s*chennai/i, pincode: '600042' },
  { name: 'Mylapore', regex: /mylapore|kapaleeshwarar/i, pincode: '600004' },
  { name: 'Nungambakkam', regex: /nungambakkam/i, pincode: '600034' },
  { name: 'Anna Nagar Chennai', regex: /anna\s*nagar\s*(?:chennai|west|east)?/i, pincode: '600040' },
  { name: 'Porur / DLF IT Park', regex: /porur|dlf\s*it\s*park\s*chennai/i, pincode: '600116' },

  // --- KOLKATA ---
  { name: 'Park Street / Camac Street / Chowringhee', regex: /park\s*street|camac\s*street|chowringhee|esplanade/i, pincode: '700016' },
  { name: 'Salt Lake / Sector V / Karunamoyee', regex: /salt\s*lake|sector\s*v|karunamoyee|rdb\s*boulevard/i, pincode: '700091' },
  { name: 'New Town / Rajarhat / Eco Park', regex: /new\s*town\s*kol|rajarhat|eco\s*park\s*kol/i, pincode: '700156' },
  { name: 'Ballygunge / Gariahat', regex: /ballygunge|gariahat/i, pincode: '700019' },
  { name: 'Alipore', regex: /alipore/i, pincode: '700027' },
  { name: 'Howrah Bridge / Station', regex: /howrah\s*bridge|howrah\s*station|nabanna/i, pincode: '711101' },

  // --- PUNE ---
  { name: 'Hinjewadi / Rajiv Gandhi Infotech Park', regex: /hinjewadi|infotech\s*park\s*pune/i, pincode: '411057' },
  { name: 'Wakad / Dange Chowk', regex: /wakad|dange\s*chowk/i, pincode: '411057' },
  { name: 'Viman Nagar / Phoenix Marketcity Pune', regex: /viman\s*nagar|phoenix\s*marketcity\s*pune|symbiosis\s*pune/i, pincode: '411014' },
  { name: 'Kalyani Nagar / Koregaon Park', regex: /kalyani\s*nagar|koregaon\s*park/i, pincode: '411006' },
  { name: 'Baner / Balewadi High Street', regex: /baner|balewadi|high\s*street\s*pune/i, pincode: '411045' },
  { name: 'Shivajinagar / FC Road / JM Road', regex: /shivajinagar|fc\s*road|jm\s*road/i, pincode: '411005' },
  { name: 'Kothrud / Karve Road', regex: /kothrud|karve\s*road|chandani\s*chowk/i, pincode: '411038' },
  { name: 'Hadapsar / Magarpatta / Amanora', regex: /hadapsar|magarpatta|amanora/i, pincode: '411028' },
  { name: 'Pune Camp / MG Road Pune', regex: /pune\s*camp|mg\s*road\s*pune/i, pincode: '411001' },

  // --- AHMEDABAD ---
  { name: 'SG Highway / Bodakdev / Sindhu Bhavan', regex: /sg\s*highway|s\.g\.\s*highway|bodakdev|sindhu\s*bhavan|pakwan/i, pincode: '380054' },
  { name: 'Prahlad Nagar / Makarba', regex: /prahlad\s*nagar|makarba/i, pincode: '380051' },
  { name: 'Satellite / Shivranjani / Vastrapur', regex: /satellite\s*ahm|shivranjani|vastrapur|iim\s*ahmedabad/i, pincode: '380015' },
  { name: 'Navrangpura / CG Road', regex: /navrangpura|cg\s*road|law\s*garden/i, pincode: '380009' },
  { name: 'GIFT City / Gandhinagar', regex: /gift\s*city|infocity\s*gandhinagar/i, pincode: '382355' },

  // --- VISAKHAPATNAM (VIZAG) ---
  { name: 'RK Beach / Beach Road / Kali Temple', regex: /rk\s*beach|beach\s*road|kali\s*temple.*beach|submarine\s*museum/i, pincode: '530002' },
  { name: 'Jagadamba Centre', regex: /jagadamba/i, pincode: '530020' },
  { name: 'Dwaraka Nagar / RTC Complex', regex: /dwaraka\s*nagar|rtc\s*complex\s*vizag/i, pincode: '530016' },
  { name: 'Siripuram / VIP Road Vizag', regex: /siripuram|vip\s*road\s*vizag|andhra\s*university/i, pincode: '530003' },
  { name: 'MVP Colony', regex: /mvp\s*colony/i, pincode: '530017' },
  { name: 'Gajuwaka / Steel Plant', regex: /gajuwaka|steel\s*plant\s*vizag/i, pincode: '530026' },
  { name: 'Rushikonda IT SEZ', regex: /rushikonda/i, pincode: '530045' },

  // --- LUCKNOW ---
  { name: 'Hazratganj / Vidhan Sabha', regex: /hazratganj|vidhan\s*sabha/i, pincode: '226001' },
  { name: 'Gomti Nagar / Vibhuti Khand', regex: /gomti\s*nagar|vibhuti\s*khand|shaheed\s*path/i, pincode: '226010' },
  { name: 'Indira Nagar Lucknow', regex: /indira\s*nagar\s*lucknow|munshi\s*pulia/i, pincode: '226016' },
  { name: 'Aliganj Lucknow', regex: /aliganj\s*lucknow/i, pincode: '226024' },

  // --- JAIPUR ---
  { name: 'MI Road / C-Scheme', regex: /mi\s*road|c[\s-]*scheme|statue\s*circle/i, pincode: '302001' },
  { name: 'Malviya Nagar Jaipur / WTP', regex: /malviya\s*nagar\s*jaipur|world\s*trade\s*park|\bwtp\b|gaurav\s*tower/i, pincode: '302017' },
  { name: 'Mansarovar Jaipur', regex: /mansarovar\s*jaipur/i, pincode: '302020' },
  { name: 'Vaishali Nagar Jaipur', regex: /vaishali\s*nagar\s*jaipur/i, pincode: '302021' },

  // --- CHANDIGARH ---
  { name: 'Sector 17 Chandigarh', regex: /sector\s*17\s*ch/i, pincode: '160017' },
  { name: 'IT Park Chandigarh', regex: /it\s*park\s*chandigarh/i, pincode: '160101' },

  // --- VARANASI ---
  { name: 'Varanasi Cantt / Mall Road', regex: /cantt|varanasi\s*cantt/i, pincode: '221002' },
  { name: 'Godowlia / Dashashwamedh', regex: /godowlia|dashashwamedh/i, pincode: '221001' },
  { name: 'BHU / Lanka Varanasi', regex: /\bbhu\b|lanka\s*varanasi/i, pincode: '221005' },

  // --- INDORE ---
  { name: 'Vijay Nagar / AB Road Indore', regex: /vijay\s*nagar\s*indore|ab\s*road\s*indore/i, pincode: '452010' },
  { name: 'Palasia Indore', regex: /palasia/i, pincode: '452001' },

  // --- BHOPAL ---
  { name: 'MP Nagar Bhopal', regex: /mp\s*nagar|m\.p\.\s*nagar/i, pincode: '462011' },
  { name: 'Arera Colony Bhopal', regex: /arera\s*colony/i, pincode: '462016' },

  // --- PATNA ---
  { name: 'Boring Road / Fraser Road Patna', regex: /boring\s*road|fraser\s*road/i, pincode: '800001' },
  { name: 'Bailey Road Patna', regex: /bailey\s*road/i, pincode: '800014' },
];

export interface PostalCodeDerivationResult {
  pincode: string;
  source: 'address_pin' | 'landmark_pin' | 'landmark_match' | 'address_match' | 'city_default';
  matchedTerm?: string;
  message: string;
}

/**
 * Gets default 6-digit postal pincode for a city
 */
export function getDefaultPincodeForCity(city: string, state?: string): string {
  if (!city) return '400001';
  const q = city.trim().toLowerCase();
  if (CITY_DEFAULT_PINCODES[q]) return CITY_DEFAULT_PINCODES[q];

  for (const [key, pin] of Object.entries(CITY_DEFAULT_PINCODES)) {
    if (q.includes(key) || key.includes(q)) return pin;
  }

  // State-based fallback
  const st = (state || '').toLowerCase();
  if (st.includes('delhi')) return '110001';
  if (st.includes('maharashtra')) return '400001';
  if (st.includes('karnataka')) return '560001';
  if (st.includes('tamil')) return '600001';
  if (st.includes('telangana')) return '500001';
  if (st.includes('andhra')) return '530002';
  if (st.includes('west bengal')) return '700001';
  if (st.includes('gujarat')) return '380001';
  if (st.includes('uttar pradesh')) return '226001';
  if (st.includes('rajasthan')) return '302001';
  if (st.includes('haryana')) return '122001';

  return '400001';
}

/**
 * Derives 6-digit postal code intelligently from Street Address and Corridor Landmark.
 *
 * Evaluation hierarchy:
 * 1. Explicit 6-digit PIN written in Landmark (e.g. "Near Toll Plaza 400050")
 * 2. Explicit 6-digit PIN written in Street Address (e.g. "Bandra West, 400 050")
 * 3. Corridor Landmark matched against High-Density Advertising Knowledge Base
 * 4. Street Address matched against High-Density Advertising Knowledge Base
 * 5. City centroid fallback if neither has an exact match
 */
export function derivePostalCode(
  address?: string,
  landmark?: string,
  city?: string,
  state?: string
): PostalCodeDerivationResult {
  const cleanAddr = (address || '').trim();
  const cleanLandmark = (landmark || '').trim();

  // 1. Explicit 6-digit number in Landmark
  const pinInLandmark = cleanLandmark.match(/\b([1-9][0-9]{2})\s*([0-9]{3})\b/);
  if (pinInLandmark) {
    const pin = `${pinInLandmark[1]}${pinInLandmark[2]}`;
    return {
      pincode: pin,
      source: 'landmark_pin',
      matchedTerm: pin,
      message: `Explicit PIN ${pin} detected in landmark`,
    };
  }

  // 2. Explicit 6-digit number in Street Address
  const pinInAddress = cleanAddr.match(/\b([1-9][0-9]{2})\s*([0-9]{3})\b/);
  if (pinInAddress) {
    const pin = `${pinInAddress[1]}${pinInAddress[2]}`;
    return {
      pincode: pin,
      source: 'address_pin',
      matchedTerm: pin,
      message: `Explicit PIN ${pin} detected in street address`,
    };
  }

  // 3. Match Corridor Landmark against Knowledge Base
  if (cleanLandmark) {
    for (const item of LOCALITY_PINCODE_MAP) {
      if (item.regex.test(cleanLandmark)) {
        return {
          pincode: item.pincode,
          source: 'landmark_match',
          matchedTerm: item.name,
          message: `Derived from landmark: "${item.name}" → ${item.pincode}`,
        };
      }
    }
  }

  // 4. Match Street Address against Knowledge Base
  if (cleanAddr) {
    for (const item of LOCALITY_PINCODE_MAP) {
      if (item.regex.test(cleanAddr)) {
        return {
          pincode: item.pincode,
          source: 'address_match',
          matchedTerm: item.name,
          message: `Derived from street address: "${item.name}" → ${item.pincode}`,
        };
      }
    }
  }

  // 5. Default City fallback
  const defaultPin = getDefaultPincodeForCity(city || '', state);
  return {
    pincode: defaultPin,
    source: 'city_default',
    matchedTerm: city || 'Centroid',
    message: city ? `City postal centroid for ${city}` : 'Default postal code',
  };
}

/**
 * Backward compatible helper extracting 6-digit Pincode from street address or landmark
 */
export function extractPincode(address?: string, landmark?: string, city?: string, state?: string): string | null {
  const result = derivePostalCode(address, landmark, city, state);
  if (result.source !== 'city_default') {
    return result.pincode;
  }
  return null;
}

/**
 * Converts Illumination Type to single-letter code:
 * - Light (Front-lit / Light): 'L'
 * - Non Light (Non-lit): 'N'
 * - Back Light (Back-lit): 'B'
 * - Digital (Digital LED / DOOH): 'D'
 */
export function getIlluminationCode(illumination: string): string {
  if (!illumination) return 'L';
  const norm = illumination.toLowerCase().trim();
  if (norm.includes('digital') || norm.includes('led')) return 'D';
  if (norm.includes('back')) return 'B';
  if (norm.includes('non')) return 'N';
  return 'L';
}

export interface HoardingUidParams {
  state: string;
  city: string;
  pincode?: string;
  serialNo?: number | string;
  illumination: string;
  width: number;
  height: number;
  trafficType?: string;
}

export interface HoardingUidBreakdown {
  statePart: string;
  cityPart: string;
  pincodePart: string;
  serialPart: string;
  illuminationPart: string;
  sizePart: string;
  trafficPart: string;
  fullUid: string;
}

/**
 * Dynamically generates site UID according to the official outdoor advertising nomenclature:
 * 1. First 3 alphabets of State Name
 * 2. First 4 alphabets of City Name
 * 3. Last 4 Digits of Pincode
 * 4. Serial No of hoarding in the particular Pincode Jurisdiction (2 digits)
 * 5. First alphabet of Light/Non Light/Back Light/Digital (L / N / B / D)
 * 6. Size: width in feet X Height in Feet (e.g. 40X20)
 * 7. First alphabet of Morning Traffic / Evening Traffic (M / E)
 */
export function generateHoardingUid(params: HoardingUidParams): string {
  return breakdownHoardingUid(params).fullUid;
}

export function breakdownHoardingUid(params: HoardingUidParams): HoardingUidBreakdown {
  // 1. State: First 3 alphabets
  const rawState = (params.state || 'Maharashtra').replace(/[^a-zA-Z]/g, '');
  const statePart = (rawState.slice(0, 3) || 'MAH').toUpperCase().padEnd(3, 'X');

  // 2. City: First 4 alphabets
  const rawCity = (params.city || 'Mumbai').replace(/[^a-zA-Z]/g, '');
  const cityPart = (rawCity.slice(0, 4) || 'MUMB').toUpperCase().padEnd(4, 'X');

  // 3. Pincode: Last 4 digits
  const rawPin = (params.pincode || '400001').replace(/\D/g, '');
  const pincodePart = rawPin.length >= 4 ? rawPin.slice(-4) : rawPin.padStart(4, '0');

  // 4. Serial No in Pincode Jurisdiction: 2-digit padded
  const num = typeof params.serialNo === 'number' ? params.serialNo : parseInt(String(params.serialNo || '1'), 10) || 1;
  const serialPart = String(Math.max(1, num)).padStart(2, '0');

  // 5. Illumination: L, N, B, or D
  const illuminationPart = getIlluminationCode(params.illumination);

  // 6. Size: width X height in feet
  const w = Math.round(Number(params.width) || 40);
  const h = Math.round(Number(params.height) || 20);
  const sizePart = `${w}X${h}`;

  // 7. Traffic: First alphabet of Morning / Evening Traffic
  const trafficWord = (params.trafficType || 'Morning Traffic').trim().split(/\s+/)[0];
  const trafficPart = (trafficWord[0] || 'M').toUpperCase();

  const fullUid = `${statePart}-${cityPart}-${pincodePart}-${serialPart}-${illuminationPart}-${sizePart}-${trafficPart}`;

  return {
    statePart,
    cityPart,
    pincodePart,
    serialPart,
    illuminationPart,
    sizePart,
    trafficPart,
    fullUid,
  };
}
