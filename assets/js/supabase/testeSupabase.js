import * as Auth from "./auth.js";
async function teste1() {
    const email = "thifre09@gmail.com";
    const senha = "senha123456";
    console.log(email);
    const { data, error } = await Auth.signUp(email, senha);
    console.log("data:", data);
    console.log("error:", error);
}
async function teste2() {
    const user = await Auth.getUser();
    console.log("usuário:", user);
}
async function teste3() {
    const resposta = await Auth.signOut();
    console.log(resposta);
}
async function teste4() {
    const resposta = await Auth.signIn("thifre09@gmail.com", "senha123456");
    console.log(resposta);
}
