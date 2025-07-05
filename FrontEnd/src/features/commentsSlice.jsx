import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../API/axios";

// Fetch comments for a specific product
export const fetchComments = createAsyncThunk(
    "comments/fetchComments",
    async (produitId, { rejectWithValue }) => {
        try {
            await axiosInstance.get('/sanctum/csrf-cookie');
            const response = await axiosInstance.get("/api/commentaires", {
                params: { produitId: produitId },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch comments" });
        }
    }
);

// Submit a new comment
export const submitComment = createAsyncThunk(
    "comments/submitComment",
    async ({ produitId, content, rating }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/api/commentaires", {
                produitId: produitId,
                content,
                rating,
            },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`, // Add the token here
                    },
                });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to submit comment" });
        }
    }
);

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        comments: [],
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComments.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments = action.payload;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            .addCase(submitComment.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(submitComment.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.comments.push(action.payload);
            })
            .addCase(submitComment.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default commentsSlice.reducer;
