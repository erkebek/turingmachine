import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Dimensions
} from 'react-native';
import Machine from './components/Machine';

const {height} = Dimensions.get('window');

class App extends React.Component{

    constructor(props){
        super(props);
    }

    render(){
        
        return (
            <ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps='always' style={{height}} contentContainerStyle={styles.container}>
                <View style={styles.sectionTitle}>
                    <Text style={styles.title}>Машина Тьюринга</Text>
                </View>
                <View style={styles.sectionMain}>
                    <Machine style={styles.cellsCont}/>
                    <View style={styles.bottomCont}>
                        <View style={styles.creditsCont}>
                            <Text style={styles.crTitle}>Выполнили:</Text>
                            <Text style={styles.crSubtitle}>Абдрахман уулу Эркебек, Сагындык уулу Сыймык</Text>
                            <Text style={styles.crTitle}>Проверила:</Text>
                            <Text style={styles.crSubtitle}>Алымбаева Жазгүль</Text>
                            <Text style={styles.crUniName}>INAI.KG 2019</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const styles = {
    container: {
        height: height,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
    },
    sectionTitle: {
        flex: 1
    },
    sectionMain: {
        flex: 10,
    },
    cellsCont: {
        flex: 4.8,
    },
    bottomCont: {
        flex: 1
    },
    title: {
        fontWeight: '700',
        fontSize: 25,
        color: '#000'
    },

    crTitle: {
        fontWeight: '700',
    },
    crSubtitle: {
        textDecorationLine: 'underline',
        fontStyle: 'italic'
    },
    crUniName: {
        marginTop: 10,
        textAlign: 'center'
    }
}

export default App;