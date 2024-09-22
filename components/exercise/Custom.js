import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';


const Custom = () => {

    const userId = useSelector((state) => state.member.userInfo.memberId);
    const accessToken = useSelector((state) => state.member.userInfo.accessToken);


    return (
        <View style={{width: '100%', height: 200, backgroundColor: 'red' }}>

        </View>
    );
};

export default Custom;
