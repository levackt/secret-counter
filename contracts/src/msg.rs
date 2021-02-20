use cosmwasm_std::{log, HandleResponse, Never};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct InitMsg {
    pub count: i32,
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum HandleMsg {
    Increment {},
    Reset { count: i32 },
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    // Current value is private
}

#[derive(Clone)]
pub struct IncrementResponse {
    pub count: i32,
}

impl Into<HandleResponse> for IncrementResponse {
    fn into(self) -> HandleResponse<Never> {
        HandleResponse {
            messages: vec![],
            log: vec![log("count", self.count)],
            data: None,
        }
    }
}

impl Returnable for IncrementResponse {}

trait Returnable
where
    Self: Into<HandleResponse>,
{
}
