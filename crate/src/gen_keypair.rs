use ed25519_dalek::Keypair;
use rand::rngs::OsRng;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn gen_keypair(target: &str, js_batch_size: JsValue) -> String {
    let batch_size: i32 = serde_wasm_bindgen::from_value(js_batch_size).unwrap();

    let mut remain = batch_size;
    let mut keypair = Keypair::generate(&mut OsRng::default());
    let mut pubkey = "".to_string();
    while remain > 0 {
        keypair = Keypair::generate(&mut OsRng::default());
        pubkey = bs58::encode(&keypair.public.to_bytes()).into_string();

        if pubkey.starts_with(target) {
            break;
        }

        remain = remain - 1;
    }

    let secret = bs58::encode(&keypair.to_bytes()).into_string();

    if pubkey.starts_with(target) {
        format!("{{\"pubkey\":{:?},\"secret\":{:?}}}", pubkey, secret)
    } else {
        "{}".to_string()
    }
}

// use wasm_bindgen::prelude::*;

// #[wasm_bindgen]
// pub fn gen_keypair(target: &str) -> String {
//     //Result<JsValue, JsValue> {
//     use ed25519_dalek::Keypair;
//     use rand::rngs::OsRng;

//     let mut batch_size = 1;

//     let mut keypair = Keypair::generate(&mut OsRng::default());
//     let mut pubkey = bs58::encode(&keypair.public.to_bytes()).into_string();
//     let mut secret = bs58::encode(&keypair.to_bytes()).into_string();

//     // while batch_size > 0 {
//     //&& !pubkey.starts_with(target) {
//     keypair = Keypair::generate(&mut OsRng::default());
//     pubkey = bs58::encode(&keypair.public.to_bytes()).into_string();
//     secret = bs58::encode(&keypair.to_bytes()).into_string();

//     batch_size -= 1;
//     // }

//     let pubkey_secret = format!("{{\"pubkey\":{:?},\"secret\":{:?}}}", pubkey, secret);
//     // serde_wasm_bindgen::to_value(&pubkey_secret).map_err(|err| err.into())
//     pubkey_secret
// }
