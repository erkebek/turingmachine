import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TextInput,
    FlatList
} from 'react-native';
import { MAIN_BLUE, CELL_SIZE, CELL_TRIANLGE_WIDTH, CELLS_AMOUNT } from '../constants';
import Button from '../common/Button';

const Cell = ({ title, current }) => {
    return (
        <View style={styles.cell}>
            <Text style={styles.cellTitle}>{title}</Text>
            {
                current ?
                    <View style={styles.triangle} />
                    : null
            }
            {/* <View style={styles.triangle}/> */}
        </View>
    )
}

export default class Machine extends React.Component {

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.resetMachine = this.resetMachine.bind(this);
        this.play = this.play.bind(this);
        this.compileSourceCode = this.compileSourceCode.bind(this);
        this.onSourceCodeChange = this.onSourceCodeChange.bind(this);
    }

    state = {
        // code: {
        //     start: 'a',
        //     stop: 'z',
        //     states: {
        //         a: [
        //             {
        //                 accept: '0',
        //                 write: '1',
        //                 move: 'R',
        //                 next: 'b'
        //             }
        //         ],
        //         b: [
        //             {
        //                 accept: ' ',
        //                 write: '2',
        //                 move: 'R',
        //                 next: 'c'
        //             }
        //         ],
        //         c: [
        //             {
        //                 accept: ' ',
        //                 write: '3',
        //                 move: 'R',
        //                 next: 'd'
        //             }
        //         ],
        //         d: [
        //             {
        //                 accept: ' ',
        //                 write: '4',
        //                 move: 'R',
        //                 next: 'e'
        //             },
        //             {
        //                 accept: '5',
        //                 write: '9',
        //                 move: 'L',
        //                 next: 'z'
        //             }
        //         ],
        //         e: [
        //             {
        //                 accept: ' ',
        //                 write: '5',
        //                 move: 'R',
        //                 next: 'f'

        //             }
        //         ],
        //         f: [
        //             {
        //                 accept: ' ',
        //                 write: '3',
        //                 move: 'L',
        //                 next: 'd'
        //             }
        //         ],
        //         z: [
        //             {
        //                 accept: ' ',
        //                 write: ' ',
        //                 move: '',
        //                 next: 'z'
        //             }
        //         ]
        //     }
        // },
        code: {},

        currentStateName: null,
        steps: 0,
        play: false,
        tapeIndex: 25,

        tapes: [],
        sourceCode: `start a
stop d
a=0,1,r,b
b= ,2,r,c
c= ,3,r,d
d=,,,`
    }

    /*
    start a
    stop z
    a=0,1,r,b
    b= ,2,r,c
    */
    compile(srcCode){
        let lines = srcCode.split(/\r\n|\r|\n|\n\r/);
        console.log(lines);
        let code = {
            states:{}
        }
        let errors = false;
        lines.forEach(line => {
            if(line.includes('start')){
                let items = line.split(' ');
                if(!items[1]){
                    errors = true;
                    return;
                } 
                code = {
                    ...code,
                    start: items[1]
                }
            }
            if(line.includes('stop')){
                let items = line.split(' ');
                if(!items[1]){
                    errors = true;
                    return;
                }
                code = {
                    ...code,
                    stop: items[1]
                }
            }
            if(line.includes('=')){
                let parts = line.split('=');
                let name = parts[0];
                let items = parts[1].split(',');
                if(items.length != 4){
                    errors = true;
                    return;
                }
                let state = {
                    accept: items[0],
                    write: items[1],
                    move: items[2],
                    next: items[3]
                }

                if(!(name in code.states)){
                    code.states[name] = [];
                }
                code.states[name].push(state);
            }
        });
        let res = {
            code,
            errors
        }
        console.log(res);
        return res;
    }


    loadMachine(value) {
        let { start } = this.state.code;
        this.setState({ currentStateName: start, steps: 0 });

        let newTapes = value.split('');
        let tapes = new Array(CELLS_AMOUNT);
        tapes.fill(' ');
        for (let i = 0; i < newTapes.length; i++)
            tapes[i + CELLS_AMOUNT/2] = newTapes[i];
        this.setState({ tapes }, () => {
            setTimeout(() => {
                this.flatListRef.scrollToOffset({ offset: CELLS_AMOUNT/2*39.1 });
            }, 500)
        });
    }

    play() {
        const { code, tapes, currentStateName } = this.state;
        const { states } = code;
        // this.flatListRef.scrollToIndex({index: 15, viewOffset: 15, viewPosition: 0.5});
        // this.flatListRef.scrollToOffset({ animated: true, offset: 15});

        let i = CELLS_AMOUNT/2;
        console.log('machine...................')
        console.log(tapes[i]);

        let newCurrentStateName = currentStateName;
        const iteration = (thisFunc) => {
            try{
                if (this.state.play && i < tapes.length) {
                    if (newCurrentStateName == code.stop) this.setState({ play: false });
    
                    let currentState = states[newCurrentStateName];
    
                    currentState.forEach(value => {
                        if (tapes[i] === value.accept) {
                            tapes[i] = value.write;
                            if (value.move === 'r') i++;
                            else if (value.move === 'l') i--;
                            newCurrentStateName = value.next;
                            this.setState({ currentStateName: newCurrentStateName });
                            this.setState({ tapeIndex: i });
                        }
                    })
                    let { steps } = this.state;
                    steps++;
                    this.setState({ steps });
                    this.flatListRef.scrollToOffset({offset: i*39.1 });
                } else {
                    clearInterval(thisFunc);
                }
            }catch(e){
                alert('Произошла ошибка в работе машины');
                clearInterval(thisFunc);
                this.resetMachine();
            }
        }

        this.setState({ play: true }, () => {
            started = setInterval(() => iteration(started), 1000);
        });
    }

    onSubmit(event) {
        const value = event.nativeEvent.text;
        let re = /^[0-9]+$/;
        if (re.test(String(value))) {
            this.loadMachine(value);
        } else {
            alert('Введите только номера(0-9)')
        }
    }

    resetMachine() {
        this.setState({
            currentStateName: null,
            steps: 0,
            play: false,
            tapeIndex: CELLS_AMOUNT/2,
        });
        this.loadMachine('0');
    }

    componentDidMount() {
        this.compileSourceCode();
    }

    onSourceCodeChange(value){
        this.setState({sourceCode:value});
    }

    compileSourceCode(){
        this.resetMachine();
        let res = this.compile(this.state.sourceCode);
        if(res.errors){
            alert('Есть ошибка в вашем коде');
        }else{
            this.setState({code: res.code}, () => {
                this.loadMachine('0');
            });
        }
    }


    render() {
        const { style } = this.props;
        const { tapes, tapeIndex, steps, currentStateName } = this.state;
        const renderCell = ({item, index}) => {
            return <Cell current={tapeIndex == index} title={item || ''} />
        }
        return (
            <View style={[styles.container, style]}>
                <View style={styles.detailsCont}>
                    <Text style={styles.detailText}>State: {currentStateName}</Text>
                    <Text style={styles.detailText}>Step: {steps}</Text>
                </View>
                <FlatList 
                    horizontal
                    ref={ref => this.flatListRef = ref}
                    data={tapes}
                    getItemLayout={(d,i) => ({length: CELLS_AMOUNT, offset: CELLS_AMOUNT*i, index:i})}
                    keyExtractor={(v,i) => i.toString()}
                    renderItem={renderCell}
                    style={styles.cellsCont} 
                    />
                <View style={styles.btnsCont}>
                    <Button onPress={this.play} type='success' style={styles.btn} title="Начать"/>
                    <Button onPress={this.resetMachine} type='danger' style={styles.btn} title="Сбросить"/>

                </View>
                <View style={styles.inputsCont}>
                    <View style={styles.inputCont}>
                        <Text>Входные данные:</Text>
                        <TextInput maxLength={10} keyboardType="numeric" onSubmitEditing={this.onSubmit} style={styles.input} />
                    </View>
                    <View style={styles.srcCodeCont}>
                        <Text>Исходный код:</Text>
                        <TextInput autoCapitalize='none' multiline numberOfLines={10} value={this.state.sourceCode} onChangeText={this.onSourceCodeChange} style={styles.input} />
                    </View>
                </View>
                <View style={styles.btnsCont}>
                    <Button onPress={this.compileSourceCode} style={styles.btn} title="Скомпилировать"/>
                </View>
            </View>
        )
    }
}

const styles = {
    container: {
        flex: 1,
    },
    detailsCont: {
        flex: 0.5,
        paddingBottom: 3,
        flexDirection: 'row'
    },
    detailText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '500',
        flex: 1
        // marginBottom: 5
    },
    instructionsCont: {
        flex: 1
    },
    cellsCont: {
        flex: 1
    },
    inputsCont: {
        flex: 3
    },
    inputCont: {
        flex: 1,
        marginTop: 10
    },
    srcCodeCont: {
        flex: 3
    },
    btnsCont: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn: {
        flex: 1,
        margin: 5
    },
    cells: {
        flex: 1,
        flexDirection: 'row'
    },
    cell: {
        backgroundColor: MAIN_BLUE,
        // flex: 1,
        height: CELL_SIZE,
        width: CELL_SIZE,
        marginRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellTitle: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500'
    },
    triangle: {
        width: CELL_TRIANLGE_WIDTH,
        height: CELL_TRIANLGE_WIDTH,
        position: 'absolute',
        bottom: 1,
        top: null,
        left: CELL_SIZE / 2 - CELL_TRIANLGE_WIDTH / 2,
        right: CELL_SIZE / 2 - CELL_TRIANLGE_WIDTH / 2,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderTopWidth: 0,
        borderRightWidth: CELL_TRIANLGE_WIDTH / 2,
        borderBottomWidth: CELL_TRIANLGE_WIDTH,
        borderLeftWidth: CELL_TRIANLGE_WIDTH / 2,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#fff',
        borderLeftColor: 'transparent',

    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: MAIN_BLUE,
    },
}