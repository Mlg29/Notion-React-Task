import React, { useState, useEffect  } from 'react'
import { View, Text, TextInput, StyleSheet, Image, ScrollView } from 'react-native'
import { gql } from '@apollo/client';
import { client } from './App';
import { Menu, MenuItem } from 'react-native-material-menu';


const Todo = () => {
    const [text, setText] = useState("");
    const [todos, setTodos] = useState([]);
    const [uniqD, setUniqD] = useState([])
    const [objType, setObjType] = useState([])
    const [objStatus, setObjStatus] = useState([])
    const [filtered, setFiltered] = useState("")
    const [visibleType, setVisibleType] = useState(false);
    const [visibleStatus, setVisibleStatus] = useState(false);



    const handleSelection = (data: string, setStatus: any) => {
        setFiltered(data)
        setStatus(false)
    }



    useEffect(() => {
        client
            .query({
                query: gql`
                    query allTodos {
                        allTodos {
                        id
                        type
                        createdAt
                        action
                        status
                        img
                        }
                    }
                    `,
            })
            .then(result => {
                const filterD = filtered?.length < 1 ? result?.data?.allTodos : result?.data?.allTodos?.filter((data: any) => data?.status.toLowerCase().includes(filtered.toLowerCase()) || data?.type.toLowerCase().includes(filtered.toLowerCase()) || data?.createdAt.toLowerCase().includes(filtered.toLowerCase()) || data?.action.toLowerCase().includes(filtered.toLowerCase()))
                const uniqueDate: any = Array.from(new Set(filterD.map((a: any) => a.createdAt)))
                const uniqueType: any = Array.from(new Set(result?.data?.allTodos.map((a: any) => a.type)))
                const uniqueStatus: any = Array.from(new Set(result?.data?.allTodos.map((a: any) => a.status)))
                setUniqD(uniqueDate)
                setObjStatus(uniqueStatus)
                setObjType(uniqueType)
                setTodos(filterD)
            });
    }, [filtered])

    const onChangeText = (e: any) => {
        setText(e)
        setFiltered(e)
    }




    const renderDateList = () => {
        return (
            <ScrollView>
            <View style={styles.contain}>
                {
                    uniqD?.map((data) => {
                        return <View key={data} style={styles.body}>
                            <Text style={styles.date}>{data}</Text>
                            {
                                todos?.map((item: any) => {

                                    return item.createdAt === data ? <View key={item.id} style={styles.dataBody}>
                                        <View>
                                            <Image style={styles.img} source={{ uri: item.img }} />
                                        </View>
                                        <View style={styles.div}>
                                            <Text style={styles.actionText}>{item.action}</Text>
                                            <View style={styles.row}>
                                                <Text style={styles.typeText}>Type: </Text>
                                                <Text style={styles.typeText}>{item.type}</Text>
                                            </View>
                                            <View style={styles.row}>
                                                <Text style={styles.statusText}>Status: </Text>
                                                <Text style={
                                                    item?.status === 'done' ? styles.statusTextSuccess : item?.status === 'inprogress' ? styles.statusTextProgress : styles.statusTextPending
                                                }>{item.status}</Text>
                                            </View>
                                        </View>

                                    </View> : null
                                })
                            }
                        </View>
                    })
                }

            </View>
            </ScrollView>
        )
    }

    return (
        <View>
            <TextInput
                style={styles.input}
                onChangeText={(e) => onChangeText(e)}
                value={text}
                placeholder="Search"
            />

            <Text style={styles.text}>Filter</Text>
            <View style={styles.rowStart}>
                <View>
                    <Menu
                        visible={visibleType}
                        anchor={<Text onPress={() => setVisibleType(true)}>By Type</Text>}
                        onRequestClose={() => setVisibleType(false)}
                    >
                        <MenuItem onPress={() => handleSelection("", setVisibleType)}>All</MenuItem>
                        {
                            objType?.map(data => {
                                return <MenuItem key={data} onPress={() => handleSelection(data, setVisibleType)}>
                                    <Text style={styles.menu}>{data}</Text>
                                </MenuItem>
                            })
                        }
                    </Menu>
                </View>
                <View>
                    <Menu
                        visible={visibleStatus}
                        anchor={<Text onPress={() => setVisibleStatus(true)}>By Status</Text>}
                        onRequestClose={() => setVisibleStatus(false)}
                    >
                        <MenuItem onPress={() => handleSelection("", setVisibleStatus)}>All</MenuItem>
                        {
                            objStatus?.map(data => {
                                return <MenuItem key={data} onPress={() => handleSelection(data, setVisibleStatus)}>
                                    <Text style={styles.menu}>{data}</Text>
                                </MenuItem>
                            })
                        }
                    </Menu>
                </View>
                <View></View>
            </View>

            {renderDateList()}


        </View>
    )
}

export default Todo

const styles = StyleSheet.create({
    contain: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    rowStart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    text: {
        paddingHorizontal: 10
    },
    date: {
        borderColor: 'red',
        borderWidth: 1,
        padding: 5,
        width: 90,
        minWidth: 100,
        borderRadius: 5
    },
    body: {
        paddingVertical: 10
    },
    img: {
        width: 50,
        height: 50,
        borderRadius: 10
    },
    dataBody: {
        flexDirection: 'row',
        marginTop: 10
    },
    div: {
        marginLeft: 10,
    },
    actionText: {
        color: '#F80595'
    },
    statusText: {
        fontSize: 12
    },
    statusTextSuccess: {
        fontSize: 12,
        backgroundColor: 'green',
        color: 'white',
        paddingHorizontal: 2,
        borderRadius: 5
    },
    statusTextPending: {
        fontSize: 12,
        backgroundColor: 'blue',
        color: 'white',
        paddingHorizontal: 2,
        borderRadius: 5
    },
    statusTextProgress: {
        fontSize: 12,
        backgroundColor: '#F80595',
        color: 'white',
        paddingHorizontal: 2,
        borderRadius: 5
    },
    typeText: {
        fontSize: 10
    },
    row: {
        flexDirection: 'row'
    },
    menu: {
        textTransform: 'capitalize'
    }
});
