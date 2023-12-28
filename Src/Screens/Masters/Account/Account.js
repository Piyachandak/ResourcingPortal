import React, { useState, useEffect } from "react";
import {
    View,
    SafeAreaView,
    StyleSheet,
    Alert,
    Text,
    FlatList
} from "react-native";
import { GLOBALSTYLE } from "../../../Constants/Styles";
import SearchBox from "../../../Components/SearchBox";
import { useSelector, useDispatch } from "react-redux";
import { COLORS } from "../../../Constants/Theme";
import SmallButton from "../../../Components/SmallButton";
import { getAccount, deleteAccount } from "../../../Redux/Actions/AccountAction";

const Account = ({ navigation }) => {
    const dispatch = useDispatch();
    const reducerData = useSelector(state => state.AccountReducer)

    const [account, setAccount] = useState([]);
    const [filterAccount, setFilterAccount] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const unSubscribe = navigation.addListener('focus', () => {
            dispatch(getAccount())
        });
        return unSubscribe;
    }, [navigation]);

    useEffect(() => {
        getAccountFilter();
    }, [search])

    useEffect(() => {
        // console.log("-------------------", reducerData.accountData)
        setAccount(reducerData.accountData)
        setFilterAccount(reducerData.accountData)
    }, [reducerData.accountData])

    const setSearchValue = value => {
        setSearch(value);
    };
    const getAccountFilter = () => {
        const filterValue = account?.filter(data => {
            if (search.length === 0) {
                return data;
            } else if (
                data.name.toLowerCase().includes(search.toLowerCase()) ||
                data.phone.toLowerCase().includes(search.toLowerCase()) ||
                data.email.toLowerCase().includes(search.toLowerCase())
            ) {
                console.log(data);
                return data;
            }
        });
        setFilterAccount(filterValue);

    };
    const deleteOk = (id) => {
        dispatch(deleteAccount(id))
        setSearch('');
        const remaningData = account.filter(t => t.id !== id);
        setFilterAccount([...remaningData]);
    }
    const editAccount = (item) => {
        navigation.navigate('EditAccount', { newData: item })
    }
    const deleteaccount = (id) => {
        Alert.alert(
            'Are you sure want to Delete?',
            'You wont be able to revert this.',
            [
                {
                    text: 'Yes, Delete it',
                    onPress: () => deleteOk(id),
                },
                {
                    type: 'cancel',
                    text: 'Cancel',
                    onPress: () => console.log("Cancel Pressed"),
                },
            ],
        );
    }
    return (
        <SafeAreaView style={GLOBALSTYLE.safeAreaViewStyle}>
            <SearchBox
                setSearchValue={setSearchValue}
            />
            <View>
                <FlatList
                    data={filterAccount}
                    renderItem={({ item }) => (
                        <View style={GLOBALSTYLE.cardView}>
                            <View style={GLOBALSTYLE.rowView}>
                                <View style={GLOBALSTYLE.columnView}>
                                    <Text style={GLOBALSTYLE.label}>Name</Text>
                                    <Text style={GLOBALSTYLE.text}>{item.name === null ? '-' : item.name}</Text>
                                </View>
                                <View style={GLOBALSTYLE.columnView}>
                                    <Text style={GLOBALSTYLE.label}>Mobile</Text>
                                    <Text style={GLOBALSTYLE.text}>{item.phone === null ? '-' : item.phone}</Text>
                                </View>
                            </View>
                            <View style={GLOBALSTYLE.columnView}>
                                <Text style={GLOBALSTYLE.label}>Email Id</Text>
                                <Text style={GLOBALSTYLE.text}>{item.email === null ? '-' : item.email}</Text>
                            </View>
                            <View style={GLOBALSTYLE.rowView}>
                                <SmallButton
                                    color={COLORS.lightBlue}
                                    title={"Edit"}
                                    onPressFunction={() => {
                                        editAccount(item)
                                    }}
                                />
                                <SmallButton
                                    color={COLORS.red}
                                    title={"Delete"}
                                    onPressFunction={() => {
                                        deleteaccount(item.id)
                                    }}
                                />
                            </View>
                        </View>
                    )}
                />
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

})

export default Account