import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../API/axios.js";

// Async thunks for backend operations
export const fetchCart = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("api/panier");
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch cart"
            );
        }
    }
);

export const addToCart = createAsyncThunk(
    "cart/addToCart",
    async (item, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("api/panier", {
                produitId: item.id,
                quantite: item.quantity || 1,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to add to cart"
            );
        }
    }
);

export const updateQuantity = createAsyncThunk(
    "cart/updateQuantity",
    async ({ panierId, quantity }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `api/panier/${panierId}`,
                {
                    quantite: quantity,
                }
            );
            return response.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update quantity"
            );
        }
    }
);

export const removeFromCart = createAsyncThunk(
    "cart/removeFromCart",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`api/panier/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to remove from cart"
            );
        }
    }
);

export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("api/panier");
            const cartItems = response.data;
            await Promise.all(
                cartItems.map((item) =>
                    axiosInstance.delete(`api/panier/${item.id}`)
                )
            );
            return [];
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to clear cart"
            );
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState: {
        items: [],
        status: "idle",
        error: null,
    },
    reducers: {
        resetCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch cart
        builder
            .addCase(fetchCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });

        // Add to cart
        builder
            .addCase(addToCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                const newItem = action.payload;
                const existingItem = state.items.find(
                    (i) => i.produitId === newItem.produitId
                );
                if (existingItem) {
                    existingItem.quantite = newItem.quantite;
                } else {
                    state.items.push(newItem);
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });

        // Update quantity
        builder
            .addCase(updateQuantity.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateQuantity.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedItem = action.payload;
                const item = state.items.find((i) => i.id === updatedItem.id);
                if (item) {
                    if (updatedItem.quantite <= 0) {
                        state.items = state.items.filter(
                            (i) => i.id !== updatedItem.id
                        );
                    } else {
                        item.quantite = updatedItem.quantite;
                    }
                }
            })
            .addCase(updateQuantity.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });

        // Remove from cart
        builder
            .addCase(removeFromCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = state.items.filter(
                    (item) => item.id !== action.payload
                );
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });

        // Clear cart
        builder
            .addCase(clearCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.status = "succeeded";
                state.items = [];
            })
            .addCase(clearCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { resetCartError } = cartSlice.actions;
export default cartSlice.reducer;
