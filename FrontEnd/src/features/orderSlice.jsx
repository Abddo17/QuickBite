import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../api/axios";

export const fetchOrders = createAsyncThunk(
    "commandes/fetchCommandes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/api/commandes");
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to fetch commandes" }
            );
        }
    }
);

export const fetchCommandeById = createAsyncThunk(
    "commandes/fetchCommandeById",
    async (commandeId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(
                `/api/commandes/${commandeId}`
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch commande details",
                }
            );
        }
    }
);

export const updateCommandeStatus = createAsyncThunk(
    "commandes/updateCommandeStatus",
    async ({ commandeId, stat }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(
                `/api/commandes/${commandeId}`,
                { stat }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to update commande status",
                }
            );
        }
    }
);

const commandeSlice = createSlice({
    name: "commandes",
    initialState: {
        commandes: [],
        currentCommande: null,
        status: "idle",
        error: null,
    },
    reducers: {
        clearCurrentCommande: (state) => {
            state.currentCommande = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all commandes
            .addCase(fetchOrders.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.commandes = action.payload;
                state.error = null;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload?.message || "Failed to fetch commandes";
            })
            // Fetch single commande
            .addCase(fetchCommandeById.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCommandeById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentCommande = action.payload;
                state.error = null;
            })
            .addCase(fetchCommandeById.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload?.message ||
                    "Failed to fetch commande details";
            })
            // Update commande status
            .addCase(updateCommandeStatus.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateCommandeStatus.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.error = null;
                // Update the commande in the commandes array
                const index = state.commandes.findIndex(
                    (cmd) => cmd.commandeId === action.payload.commandeId
                );
                if (index !== -1) {
                    state.commandes[index] = action.payload;
                }
                // Update currentCommande if it matches
                if (
                    state.currentCommande?.commandeId ===
                    action.payload.commandeId
                ) {
                    state.currentCommande = action.payload;
                }
            })
            .addCase(updateCommandeStatus.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.payload?.message ||
                    "Failed to update commande status";
            });
    },
});

export const { clearCurrentCommande } = commandeSlice.actions;
export default commandeSlice.reducer;
