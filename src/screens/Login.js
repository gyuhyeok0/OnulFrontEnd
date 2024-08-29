// 로그인 페이지

import React from 'react';
import { View, Button } from 'react-native';

function LoginScreen({ navigation }) {
  
  const handlePress = () => {
    navigation.navigate('Exercise');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Go to Signup"
        onPress={handlePress}
      />
    </View>
  );
}

export default LoginScreen;
