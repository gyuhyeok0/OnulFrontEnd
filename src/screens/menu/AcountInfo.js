import 'intl-pluralrules';
import React, { useEffect } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { handlerLogOut } from '../../hooks/HandleLogout';
import DefaultHeader from '../common/DefaultHeader';
import { deleteAccount } from '../../apis/MemberAPICalls';
import { useDispatch, useSelector } from 'react-redux'; // useDispatch 가져오기

const MenuAccountInfo = ({ navigation }) => {

    const memberId = useSelector((state) => state.member?.userInfo?.memberId);

    useEffect(() => {
        console.log("=====================계정 정보 ========================");
    }, []);

    const handlerAccountDeletion = () => {
        Alert.alert(
            "정말 탈퇴하시겠습니까?",
            "회원 탈퇴 후, 해당 계정과 관련된 모든 데이터가 삭제되며, 복구가 불가능합니다. 정말 탈퇴하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "탈퇴하기",
                    onPress: async () => {
                        try {
                            // 탈퇴 처리 (비동기 처리)
                            await deleteAccount(memberId);
                            // 로그아웃 처리
                            handlerLogOut(navigation);
                        } catch (error) {
                            // 오류가 발생하면 알림을 띄워서 서버 문제 안내
                            Alert.alert(
                                "오류 발생",
                                "죄송합니다 현재 서버에 문제가 발생했습니다. 번거로우시겠지만, 문의 부탁드립니다.",
                                [{ text: "확인" }]
                            );
                        }
                    },
                },
            ]
        );        
        
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#1A1C22' }}>
            <DefaultHeader title="계정 정보" navigation={navigation} />

            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                
                <Text style={{color:'white', fontSize: 30, textAlign:'center', marginTop:30}}>로그아웃 및 회원탈퇴</Text>
                
                <Text style={{color:'white', marginTop: 40, textAlign:'center', fontSize: 35, fontWeight:'bold'}}>잠깐!</Text>
                <Text style={{color:'white', marginTop: 10, textAlign:'center', fontSize: 18}}>탈퇴하시기 전에 아래의 정보를 확인해주세요</Text>

                <View style={{ flexGrow: 1 }}></View>

                <View style={{marginBottom: 40}}>

                    <View style={{backgroundColor:'#3A3D44', padding: 15, borderRadius: 10, marginBottom: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>
                        Onul을 탈퇴해도 구독 서비스는 자동으로 해지되지 않습니다. 구독 해지는 별도로 처리해야 합니다.                        </Text>
                    </View>

                    <View style={{backgroundColor:'#3A3D44', padding: 15, borderRadius: 10, marginBottom: 10 }}>
                        <Text style={{ color: 'white', fontSize: 16, marginBottom: 10 }}>
                            회원 탈퇴 시, 회원 관련 모든 데이터는 삭제됩니다.
                            단, 법적 요구 사항에 따라 일정 기간 보관이 필요한 데이터는 삭제되지 않으며, 해당 데이터는 법적 의무를 다한 후에 삭제됩니다.
                        </Text>
                    </View>
                    
                    <View style={{backgroundColor:'#3A3D44', padding: 15, borderRadius: 10, marginBottom: 40 }}>
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            회원 탈퇴와 관계없이 특정 데이터만 삭제하고 싶으신 경우, 문의하기 기능을 통해 요청해 주세요.
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
                        <Text style={{ color: 'white', fontSize: 18, textAlign:'center' }}>로그아웃</Text>
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
                        <Text style={{ color: 'white', fontSize: 18, textAlign:'center'}}>회원탈퇴</Text>
                    </Pressable>

                </View>
                
            </View>
        </View>
    );
};

export default MenuAccountInfo;
