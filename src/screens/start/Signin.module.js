import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#191D22',
    },

    BackgroundCircle: {
        position: 'absolute',
        right: -110,
        width: 320,
        height: 320,
        backgroundColor: 'black',
        borderRadius: 400,
    },

    logoContainer: {
        width: 290,
        height: 170,
        marginBottom: 50,
    },

    wellcome: {
        color: 'white',
        fontSize: 35,
        paddingBottom: 32,
        fontWeight: 'bold'
    },
    
    logoText: {
        color: 'white',
        fontSize: 22,
        paddingBottom: 8,
        fontWeight: '200'
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        marginBottom: 20,
        width: 290,
    },

    icon: {
        padding: 10,
    },
    
    input: {
        flex: 1,
        height: 40,
        color: 'white',
        paddingHorizontal: 10,
    },

    loginButton: {
        backgroundColor: '#5E56C3', 
        paddingVertical: 13,
        width: 290,
        borderRadius: 30,
        marginTop: 40,
        marginBottom: 13,
    },

    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    registerButton: {
        backgroundColor: 'white',
        width: 290,
        paddingVertical: 13,
        borderRadius: 30,
        marginBottom: 20,
    },
    
    registerButtonText: {
        color: '#1c1c1e',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    forgotText: {
        color: 'gray',
        // textDecorationLine: 'underline',
    },
});

export default styles;
