mod utils;

use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(s: &str) {
    let greet_text = format!("Hello, {}! world", s);
    alert(&greet_text);
}

#[wasm_bindgen]
pub async fn fetch(target: String) -> String {
    let body =
        reqwest::get(target)
            .await
            .unwrap()
            .text()
            .await
            .unwrap();

    body
}
