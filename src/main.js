const { WalletSDK } = require('@roninnetwork/wallet-sdk');
const Web3 = require('./libs/web3/dist/web3.min.js');

document.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connectButton");
  const transferButton = document.getElementById("transferButton");
  const walletAddressDiv = document.getElementById("walletAddress");
  const amountInput = document.getElementById("amount");
  let sdk;
  let accounts;
  let web3;
  let receipt = null;
  function checkRoninInstalled() {
    if ('ronin' in window) {
      return true;
    }
    window.open('https://wallet.roninchain.com', '_blank');
    return false;
  }

  async function checkBalance(account) {
    const balance = await web3.eth.getBalance(account);
    console.log(`Balance of ${account}:`, web3.utils.fromWei(balance, 'ether'), 'ETH');
  }

  async function connectRoninWallet() {
    if (!checkRoninInstalled()) {
      console.error("Ronin Wallet not installed");
      return;
    }

    try {
      sdk = new WalletSDK({
        dappMetadata: {
          url: window.location.origin,
          name: 'Example dApp',
          description: 'This is a test dApp',
          icon: 'https://example-dapp/assets/logo.png'
        },
        mobileOptions: {
          walletConnectProjectId: 'd2ef97836db7eb390bcb2c1e9847ecdc',
          useDeeplink: false
        }
      });

      await sdk.connectInjected();

      accounts = await sdk.requestAccounts();
      console.log("Accounts:", accounts);
      if (accounts && accounts.length > 0) {
        walletAddressDiv.innerText = `🎉 Ronin Wallet is connected, current address: ${accounts[0]}`;

        web3 = new Web3(new Web3.providers.HttpProvider('https://saigon-testnet.roninchain.com/rpc'));
        console.log("Web3 initialized:", web3);

        await checkBalance(accounts[0]);
      } else {
        walletAddressDiv.innerText = `No accounts found.`;
        console.error("No accounts found");
      }
    } catch (error) {
      console.error("Error connecting to Ronin Wallet:", error);
      walletAddressDiv.innerText = `Error connecting to Ronin Wallet.`;
    }
  }

  connectButton.addEventListener("click", async () => {
    console.log("Connect button clicked");
    await connectRoninWallet();
  });

  transferButton.addEventListener("click", async () => {
    console.log("Transfer button clicked");
    const amount = amountInput.value;
    const slpContractAddress = '0x82f5483623d636bc3deba8ae67e1751b6cf2bad2'; // Dirección correcta del contrato SLP en Saigon
    const recipientAddress = '0x7e127c63295efae29b2230bda0bbbd55ef12bd8f'; // Reemplaza con la dirección del destinatario

    if (!amount || !web3 || !accounts) {
      console.error("Missing amount, web3 instance, or accounts");
      return;
    }

    try {
      console.log("Preparing transaction");

      const fromAddress = accounts[0];
      const contract = new web3.eth.Contract([
        {
          "constant": false,
          "inputs": [
            {
              "name": "_to",
              "type": "address"
            },
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "type": "function"
        }
      ], slpContractAddress);
      
      const data = contract.methods.transfer(recipientAddress, amount).encodeABI();

      const transactionParameters = {
        to: slpContractAddress,
        from: accounts[0],
        data: data
      };

      console.log("Sending transaction", transactionParameters);

      const txHash = await window.ronin.provider.request({
        method: "eth_sendTransaction",
        params: [transactionParameters]
      });

      console.log("Transaction sent successfully. TxHash:", txHash);

      let receipt = null;
      console.log(receipt)
      receipt = await waitForTransactionReceipt(txHash);
      console.log(receipt)
      while (receipt === null) {
        receipt = await web3.eth.getTransactionReceipt(txHash);
        console.log(receipt)
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (receipt && receipt.status) {
        console.log("Transaction confirmed. TxHash:", txHash);
        alert(`Transaction confirmed. TxHash: ${txHash}`);
      } else {
        console.error("Transaction failed or is not yet confirmed");
      }
    } catch (error) {
      console.error("Error during the transaction:", error);
    }
  });
});