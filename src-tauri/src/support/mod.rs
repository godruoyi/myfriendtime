mod files;

pub mod storage {
    pub use super::files::{delete_friend, get_friends, insert_friend};
}
