import React from 'react';
import {
    TouchableOpacity,
    Text
} from 'react-native';
import { MAIN_BLUE } from '../constants';


export default Button = ({onPress, style,title,type}) => {
    let color = '#007bff';
    if(type == 'danger') color = '#dc3545'; 
    if(type == 'success') color = '#28a745'; 
    const bgColor = {
        backgroundColor: color
    }
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, bgColor, style]}>
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = {
    container: {
        height: 60,
        width: 100,
        backgroundColor: MAIN_BLUE,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    title: {
        color: '#fff',

    }
}
