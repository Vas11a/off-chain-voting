## Sūrya's Description Report

### Files Description Table


|  File Name  |  SHA-1 Hash  |
|-------------|--------------|
| .\contracts\interfaces\IVotes.sol | e6b97d720aa77ec8e4379d36ffac7c384c9e8864 |
| .\contracts\interfaces\ITradable.sol | 169b88e4a71f44a93320fb6c74c6be394a5c464d |
| .\contracts\ERC20\ERC20.sol | 0b52fbe6626e7a07da72bcde18b9f1c49dbbe424 |
| .\contracts\ERC20\ERC20_Tradable.sol | cc9314dbd8c4a0cb93611b87b9fcbb1ce9342533 |
| .\contracts\ERC20\ERC20_Tradable_Vote.sol | bdc437730cdecfb7c8300237f5484a4468167ad5 |


### Contracts Description Table


|  Contract  |         Type        |       Bases      |                  |                 |
|:----------:|:-------------------:|:----------------:|:----------------:|:---------------:|
|     └      |  **Function Name**  |  **Visibility**  |  **Mutability**  |  **Modifiers**  |
||||||
| **IVotes** | Interface |  |||
| └ | startVoting | External ❗️ | 🛑  |NO❗️ |
| └ | vote | External ❗️ | 🛑  |NO❗️ |
| └ | endVoting | External ❗️ | 🛑  |NO❗️ |
||||||
| **ITradable** | Interface |  |||
| └ | buyTokens | External ❗️ |  💵 |NO❗️ |
| └ | sellTokens | External ❗️ | 🛑  |NO❗️ |
| └ | burnAccumulatedFees | External ❗️ | 🛑  |NO❗️ |
||||||
| **ERC20** | Implementation |  |||
| └ | <Constructor> | Public ❗️ | 🛑  |NO❗️ |
| └ | getPrice | Public ❗️ |   |NO❗️ |
| └ | getName | Public ❗️ |   |NO❗️ |
| └ | getSymbol | Public ❗️ |   |NO❗️ |
| └ | changeAdmin | Public ❗️ | 🛑  | onlyAdmin |
| └ | getVotingId | Public ❗️ |   |NO❗️ |
| └ | getVotingStartTime | Public ❗️ |   |NO❗️ |
| └ | totalSupply | Public ❗️ |   |NO❗️ |
| └ | balanceOf | Public ❗️ |   |NO❗️ |
| └ | transfer | Public ❗️ | 🛑  | checkVoting |
| └ | approve | Public ❗️ | 🛑  |NO❗️ |
| └ | allowance | Public ❗️ |   |NO❗️ |
| └ | transferFrom | Public ❗️ | 🛑  | checkVoting |
||||||
| **ERC20_Tradable** | Implementation | ITradable, ERC20 |||
| └ | <Constructor> | Public ❗️ | 🛑  | ERC20 |
| └ | buyTokens | External ❗️ |  💵 | checkVoting |
| └ | sellTokens | External ❗️ | 🛑  | checkVoting |
| └ | burnAccumulatedFees | External ❗️ | 🛑  | onlyAdmin |
||||||
| **ERC20_Tradable_Vote** | Implementation | IVotes, ERC20_Tradable |||
| └ | <Constructor> | Public ❗️ | 🛑  | ERC20_Tradable |
| └ | startVoting | External ❗️ | 🛑  |NO❗️ |
| └ | vote | External ❗️ | 🛑  |NO❗️ |
| └ | endVoting | External ❗️ | 🛑  |NO❗️ |


### Legend

|  Symbol  |  Meaning  |
|:--------:|-----------|
|    🛑    | Function can modify state |
|    💵    | Function is payable |
