import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, Button, Pressable } from 'react-native';
import axios from 'axios';
import InputSpinner from 'react-native-input-spinner';

const ipAddress = "Your ip address";
export default function HomeScreen() {
    const[items, setItems] = useState([]);
    const[loading, setLoading] = useState(true);
    const[insertName, setInsertName] = useState('');
    const[insertQuantity, setInsertQuantity] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try{
            const response = await axios.get('${ipAddress}:5000/fridge');
            setItems(response.data);
        }
        catch (error){
            console.log("Error fetching data:", error);
        }
        finally{
            setLoading(false);
        }
    }

    const deleteItem = async (id) => {
        console.log(id); 
        try {
            await axios.delete(`${ipAddress}:5000/fridge/${id}`); 
            setItems((validItems) => validItems.filter(item => item.id !== id)); 
        } catch (error) {
            console.log("Error deleting item:", error); 
        }
    };

    const addItem = async() => {
        if(!insertName){
            return;
        }

        try{
            const response = await axios.post(`${ipAddress}:5000/fridge`, {
                name: insertName
            });

            setItems([...items, response.data]);
            setInsertName('');
            setInsertQuantity('');
        }   
        catch (error){
            console.log("An error occurred while attempting to add your new item!", error);
        }
    }

    // Item Row
    const displayItems = ({ item }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.name}</Text>
            <View style={styles.spinnerContainer}>
                <InputSpinner
                    max={100}
                    min={1}
                    step={1}
                    colorMax={"#f04048"}
                    colorMin={"#40c5f4"}
                    value={item.quantity}
                    onChange={async (num) => {
                        setItems((prevItems) =>
                            prevItems.map((i) =>
                                i.id === item.id ? { ...i, quantity: num } : i
                            )
                        );

                        try {
                            await axios.put(`${ipAddress}/fridge/${item.id}`, {
                                quantity: num,
                            });
                            console.log("Quantity updated in the database");
                        } catch (error) {
                            console.error("Error updating quantity in the database:", error);
                        }
                    }}
                    style={styles.quantityChanger}
                    buttonStyle={styles.quantityButtonChanger}
                    buttonTextStyle={styles.quantityButtonText}
                />
            </View>
            <TouchableOpacity onPress={() => deleteItem(item.id)} style={styles.itemButton}>
                <Text style={styles.deleteButtonText}>X</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        //Header
        <SafeAreaView style={styles.container}>
            <Text style={styles.largeText}>What's In My Fridge?</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Item Name"
                    placeholderTextColor="#999"
                    value={insertName}
                    onChangeText={setInsertName}
                />
                <Pressable title="Add Item" onPress={addItem} style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
            </View>


            <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Item</Text>
                <Text style={styles.headerCell}>Quantity</Text>
                <Text style={styles.headerCell}></Text>
            </View>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={items}
                    renderItem={displayItems}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    largeText: {
        fontWeight: 'bold',
        fontSize: 30,
        fontFamily: 'sans-serif',
        marginBottom: 20,
        marginTop: 20,
    },

    container: {
        marginTop: 50,
        marginLeft: 10,
        marginRight: 10,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginRight: 10,
        paddingHorizontal: 8,
        borderRadius: 4,
    },

    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f4f4f4',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
    },

    headerCell: {
        flex: 1,
        fontWeight: 'bold',
        color: 'black',
        fontSize: 20,
    },

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },

    cell: {
        flex: 1,
        color: 'black',
        fontSize: 18,
        fontFamily: 'sans-serif',
    },

    itemButton: {
        backgroundColor: '#2471a3',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 10,
    },

    deleteButtonText: {
        color: '#fff',
    },

    addButton: {
        borderRadius: 4,
        borderColor: 'black',
        padding: 10,
        backgroundColor: '#2471a3',
    },

    addButtonText: {
        color: 'white',
    },

    spinnerContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flex: 2,
    },
    quantityChanger : {
        width: 150,
        height: 50,
    },
    quantityButtonChanger: {
        backgroundColor: "#2471a3",
    },
    quantityButtonText : {
        fontSize: 20,
    }
});