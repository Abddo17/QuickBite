import { createSelector } from "reselect";

// Input selectors
export const getAuthState = (state) => state.auth;
const getCartState = (state) => state.cart;

const getFavoritesState = (state) => state.favorites;

// Auth selectors
export const selectIsAuthenticated = createSelector(
    [getAuthState],
    (auth) => auth.isAuthenticated
);

export const selectUser = createSelector([getAuthState], (auth) => auth.user);

export const selectFetchStatus = createSelector(
    [getAuthState],
    (auth) => auth.fetchStatus
);

export const selectAuthStatus = createSelector(
    [getAuthState],
    (auth) => auth.authStatus
);

export const selectAuthError = createSelector(
    [getAuthState],
    (auth) => auth.error
);

// Cart selectors
export const selectCartItems = createSelector(
    [getCartState],
    (cart) => cart?.items || []
);
export const selectCartItemCount = createSelector(
    [selectCartItems],
    (items) => items.length
);

// favorites selectors
export const selectFavoritesCount = createSelector(
    [getFavoritesState],
    (favorite) => favorite.items.length
);

// users Selectors
export const getUsers = (state) => state.users;

export const selectUsers = createSelector([getUsers], (user) => user.users);

export const selectStatus = createSelector([getUsers], (user) => user.status);

export const selectError = createSelector([getUsers], (user) => user.error);
