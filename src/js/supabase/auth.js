import { supabase } from "./client.js";
export async function signUp(email, password) {
    return await supabase.auth.signUp({
        email,
        password
    });
}
export async function signIn(email, password) {
    return await supabase.auth.signInWithPassword({
        email,
        password
    });
}
export async function signOut() {
    return await supabase.auth.signOut();
}
export async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
export async function isUserLoggedIn() {
    const user = await getUser();
    return !!user;
}
