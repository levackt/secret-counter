use cosmwasm_std::{
    Api, Binary, Env, Extern, HandleResponse, InitResponse, Querier, StdError,
    StdResult, Storage, generic_err,
};

use crate::msg::{IncrementResponse, HandleMsg, InitMsg, QueryMsg};
use crate::state::{config, State};

pub fn init<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    msg: InitMsg,
) -> StdResult<InitResponse> {
    let state = State {
        count: msg.count,
        owner: env.message.sender,
    };

    config(&mut deps.storage).save(&state)?;

    Ok(InitResponse::default())
}

pub fn handle<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    msg: HandleMsg,
) -> StdResult<HandleResponse> {
    let result: HandleResponse = match msg {
        HandleMsg::Increment {} => {
            let count = try_increment(deps, env);
            IncrementResponse {
                count
            }.into()
        },
        HandleMsg::Reset { count } => {
            try_reset(deps, env, count);
            HandleResponse::default()
        }
    };
    Ok(result)
}

pub fn try_increment<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    _env: Env,
) -> i32 {
    let mut count: i32 = 0;
    config(&mut deps.storage).update(|mut state| {
        state.count += 1;
        count = state.count;
        Ok(state)
    });

    return count;
}

pub fn try_reset<S: Storage, A: Api, Q: Querier>(
    deps: &mut Extern<S, A, Q>,
    env: Env,
    count: i32,
) {
    config(&mut deps.storage).update(|mut state| {
        if env.message.sender != state.owner {
            return Err(StdError::Unauthorized { backtrace: None });
        }
        state.count = count;
        Ok(state)
    });
}

pub fn query<S: Storage, A: Api, Q: Querier>(
    _deps: &Extern<S, A, Q>,
    _msg: QueryMsg,
) -> StdResult<Binary> {
    Err(generic_err("Queries are not supported"))
}
