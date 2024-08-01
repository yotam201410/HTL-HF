import { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
} from "@mui/material";
import { Address, ChangeAddress } from "../types/user";
const AddressModel = ({
    isEditing,
    address,
    saveAddress,
    closeModal,
}: {
    isEditing: boolean;
    closeModal: () => void;
    address?: Address;
    saveAddress: (address: ChangeAddress) => void;
}) => {
    const [fullAddress, setFullAddress] = useState(
        address ? address.full_address : ""
    );
    const [country, setCountry] = useState(address ? address.country : "");
    const [postalCode, setPostalCode] = useState(
        address ? address.postal_code : 0
    );

    return (
        <div>
            <Dialog open={true} onClose={() => closeModal()}>
                <DialogTitle>
                    {isEditing ? "Edit Address" : "Add Address"}
                </DialogTitle>
                <DialogContent>
                    <form
                        onSubmit={(event) =>{
                            event.preventDefault();
                            saveAddress({
                                full_address: fullAddress,
                                country,
                                postal_code: postalCode,
                            })
                            closeModal();

                        }
                        }
                        
                    >
                        <TextField
                            margin="dense"
                            id="full_address"
                            label="Full Address"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={fullAddress}
                            onChange={(event) =>
                                setFullAddress(event.target.value)
                            }
                            required
                        />
                        <TextField
                            margin="dense"
                            id="country"
                            label="Country"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={country}
                            onChange={(event) => setCountry(event.target.value)}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="postal_code"
                            label="Postal Code"
                            type="number"
                            fullWidth
                            variant="outlined"
                            value={postalCode}
                            onChange={(event) =>
                                setPostalCode(Number(event.target.value))
                            }
                            required
                        />
                        <DialogActions>
                            <Button onClick={closeModal} color="secondary">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                {isEditing ? "Save Changes" : "Add Address"}
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddressModel;
