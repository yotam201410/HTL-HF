import React, { useEffect, useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { Address, ChangeAddress } from "../types/user";
import AddressCard from "../components/AddressCard";
import { useSelector } from "react-redux";
import { AppState } from "../store/rootReducer";
import { createAddress, getAddresses } from "../utils/axiosInstance";
import AddressModel from "../components/AddressModel";
import { useNavigate } from "react-router-dom";

const AddressesView = () => {
    const [openAddModal, setOpenAddModal] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const user = useSelector((state: AppState) => state.user);
    const navigator = useNavigate();

    useEffect(() => {
        if (!user) {
            navigator("/login");
        }
        
        const fetchAddressesAndSetSelected = async () => {
            if (user) {
                const addresses = await fetchUserAddresses(user.id);
                setAddresses(addresses);
            }
        };

        fetchAddressesAndSetSelected();
    }, []);

    const fetchUserAddresses = async (userId: string): Promise<Address[]> => {
        const addresses = await getAddresses(userId);
        if (!addresses) {
            return [];
        }

        return addresses;
    };

    const addAddressHandler = (address: ChangeAddress) => {
        const addAddress = async () => {
            if (user) {
                const newAddress = await createAddress(address, user.id);
                if (newAddress) {
                    setAddresses(addresses.concat(newAddress));
                }
            }
        };

        addAddress();
    };

    return (
        <div>
            <Container sx={{ mt: 5 }}>
                <Typography variant="h3" gutterBottom>
                    Your Addresses
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenAddModal(true)}
                    sx={{ mb: 3 }}
                >
                    Add Address
                </Button>
                {addresses.length === 0 ? (
                    <Typography>You have no addresses.</Typography>
                ) : (
                    <Box>
                        {addresses.map((address) => (
                            <AddressCard
                                key={address.id}
                                address={address}
                                editAddressInArray={(editedAddress) => {
                                    const newAddresses = { ...addresses };
                                    newAddresses[
                                        newAddresses.findIndex(
                                            (address) =>
                                                address.id === editedAddress.id
                                        )
                                    ] = editedAddress;
                                    setAddresses(newAddresses);
                                }}
                                removeAddressFromList={(addressId) => {
                                    setAddresses(
                                        addresses.filter(
                                            (address) =>
                                                address.id !== addressId
                                        )
                                    );
                                }}
                            />
                        ))}
                    </Box>
                )}
            </Container>
            {openAddModal && (
                <AddressModel
                    isEditing={false}
                    closeModal={() => setOpenAddModal(false)}
                    saveAddress={(address) => addAddressHandler(address)}
                />
            )}
        </div>
    );
};

export default AddressesView;
