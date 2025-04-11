import { StyleSheet } from 'react-native';

const FooterStyles = StyleSheet.create({
    footer: {
        height: 75,
        backgroundColor: '#1A1C22',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    safeArea: {
        backgroundColor: '#000000',
    },
    
    button: {
        padding: 12,
        // backgroundColor: '#000000',
        borderRadius: 5,
        alignItems: 'center',
    },
    iconAndTextContainer: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    buttonText1: {
        fontSize: 11,
        marginTop: 8,  
    },

    scheduleButton: {
        marginTop: 3
    },

    buttonText2: {
        fontSize: 11,
        marginTop: 10,  
    },

    managementButton: {
        marginTop: 3
    },

    buttonText3: {
        fontSize: 11,
        marginTop: 9,  
    },

    recordButton: {
        marginTop: 2
    },

    buttonText4: {
        fontSize: 11,
        marginTop: 5,  
    },

    analysisButton: {
        marginTop: -2
    },

    analysisText5: {
        fontSize: 11,
        marginTop: 6,  
    },
});


export default FooterStyles;
