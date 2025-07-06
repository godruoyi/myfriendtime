mod files;

pub mod storage {
    pub use super::files::{get_friends, insert_friend, update_friend, delete_friend};
}
