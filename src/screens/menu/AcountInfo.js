import 'intl-pluralrules';
import { View, Text, Alert, Pressable } from 'react-native';
import { handlerLogOut } from '../../hooks/HandleLogout';
import DefaultHeader from '../common/DefaultHeader';
import { deleteAccount } from '../../apis/MemberAPICalls';
import { useSelector } from 'react-redux'; // useDispatch 가져오기
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MenuAccountInfo = ({ navigation }) => {
    const { t } = useTranslation();
    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    const handlerAccountDeletion = () => {
        Alert.alert(
            t("accountInfo.deleteConfirmTitle"),
            t("accountInfo.deleteConfirmMessage"),
            [
                { text: t("accountInfo.cancel"), style: "cancel" },
                {
                    text: t("accountInfo.confirmDelete"),
                    onPress: async () => {
                        try {
                            await deleteAccount(memberId);


                            handlerLogOut(navigation);
                            
                        } catch (error) {
                            Alert.alert(
                                t("accountInfo.errorTitle"),
                                t("accountInfo.errorMessage"),
                                [{ text: t("accountInfo.confirm") }]
                            );
                        }
                    },
                },
            ]
        );        
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#1A1C22' }}>
            <DefaultHeader title={t("accountInfo.title")} navigation={navigation} />

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                
                <Text style={{color:'white', fontSize: 25, textAlign:'center', marginTop:30}}>
                    {t("accountInfo.logoutAndDelete")}
                </Text>
                
                <Text style={{color:'white', marginTop: 25, textAlign:'center', fontSize: 30, fontWeight:'bold'}}>
                    {t("accountInfo.wait")}
                </Text>
                <Text style={{color:'white', marginTop: 10, textAlign:'center', fontSize: 15, marginBottom:7}}>
                    {t("accountInfo.checkInfoBeforeLeaving")}
                </Text>

                <View style={{ flexGrow: 1 }}></View>

                <View style={{marginBottom: 40}}>

                    {/* <View style={{backgroundColor:'#3A3D44', padding: 15, borderRadius: 10, marginBottom: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>
                            {t("accountInfo.subscriptionNotice")}
                        </Text>
                    </View> */}

                    <View style={{backgroundColor:'#3A3D44', padding: 15, borderRadius: 10, marginBottom: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>
                            {t("accountInfo.dataDeletionNotice")}
                        </Text>
                    </View>
                    
                    <View style={{backgroundColor:'#3A3D44', padding: 15, borderRadius: 10, marginBottom: 40 }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            {t("accountInfo.deleteSpecificData")}
                        </Text>
                    </View>
                    
                    <Pressable
                        onPress={() => handlerLogOut(navigation)}
                        style={({ pressed }) => [{
                            backgroundColor: pressed ? '#333' : '#444',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                            marginBottom: 10,
                            marginTop: 30
                        }]}
                    >
                        <Text style={{ color: 'white', fontSize: 18, textAlign:'center' }}>
                            {t("accountInfo.logout")}
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={handlerAccountDeletion}
                        style={({ pressed }) => [{
                            backgroundColor: pressed ? '#822' : '#A33',
                            paddingVertical: 12,
                            paddingHorizontal: 20,
                            borderRadius: 8,
                        }]}
                    >
                        <Text style={{ color: 'white', fontSize: 18, textAlign:'center'}}>
                            {t("accountInfo.deleteAccount")}
                        </Text>
                    </Pressable>

                </View>
                
            </ScrollView>
        </View>
    );
};


export default MenuAccountInfo;
