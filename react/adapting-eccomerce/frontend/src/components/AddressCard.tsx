import React, { useState } from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Address, ChangeAddress } from "../types/user";
import {
    deleteAddress,
    patchAddress,
    updateDefaultAddress,
} from "../utils/axiosInstance";
import { useSelector } from "react-redux";
import { AppState } from "../store/rootReducer";
import AddressModel from "./AddressModel";

const AddressCard = ({
    address,
    removeAddressFromList,
    editAddressInArray,
}: {
    address: Address;
    removeAddressFromList: (addressId: string) => void;
    editAddressInArray: (address: Address) => void;
}) => {
    const user = useSelector((state: AppState) => state.user);
    const [modalOpen, updateModalUpdate] = useState(false);
    const removeAddressHandler = () => {
        const removeAddress = async () => {
            await deleteAddress(address.id);
            removeAddressFromList(address.id);
        };

        removeAddress();
    };
    const setDefaultAddressHandler = () => {
        const setDefaultAddress = async () => {
            if (user) {
                await updateDefaultAddress(user.id, address.id);
                user.default_address = address;
            }
        };

        setDefaultAddress();
    };
    const updateAddressHandler = (updatedAddress: ChangeAddress) => {
        const updateAddress = async () => {
            if (user) {
                const newAddress = await patchAddress({
                    ...updatedAddress,
                    id: address.id,
                    user_id: address.user_id,
                });
                if (newAddress) editAddressInArray(newAddress);
            }
        };
        updateAddress();
        updateModalUpdate(false);
    };
    return (
        <div>
            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                    <Typography>
                        {address.full_address}, {address.country} (Postal Code:{" "}
                        {address.postal_code})
                    </Typography>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={removeAddressHandler}
                        sx={{ mr: 1 }}
                    >
                        Remove
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        onClick={() => updateModalUpdate(true)}
                        sx={{ mr: 1 }}
                    >
                        Edit
                    </Button>
                    {user &&
                        (!user.default_address ||
                            user.default_address.id !== address.id) && (
                            <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={setDefaultAddressHandler}
                            >
                                Make Default
                            </Button>
                        )}
                </CardContent>
            </Card>
            {modalOpen && (
                <AddressModel
                    isEditing={true}
                    closeModal={() => updateModalUpdate(false)}
                    address={address}
                    saveAddress={updateAddressHandler}
                />
            )}
        </div>
    );
};

export default AddressCard;
