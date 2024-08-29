// footer 스타일

import { StyleSheet } from 'react-native';

const FooterStyles = StyleSheet.create({
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#fff',
        backgroundColor: '#000000'
    },
    // 필요한 다른 스타일도 이곳에 추가할 수 있습니다.
});

export default FooterStyles;
