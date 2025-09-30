import { store } from "../store/redux/store";

export type IRootState = ReturnType<typeof store.getState>