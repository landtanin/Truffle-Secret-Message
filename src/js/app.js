App = {
    web3Provider: null,
    contracts: {},
  
    init: async function() {  
      return await App.initWeb3();
    },
  
    initWeb3: async function() {
      // An example where your browser has web3 injected is Chrome with Metamask
      // Metamask is the web3 provider which defines the network and wallet address
  
      // Modern dapp browsers...
      if (window.ethereum) {
          console.log("network 1");
        App.web3Provider = window.ethereum;
        try {
          // Request account access
          await window.ethereum.enable();
        } catch (error) {
          // User denied account access...
          console.error("User denied account access");
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        console.log("network 2");
        App.web3Provider = window.web3.currentProvider;
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        console.log("network 3");
        App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      }
      web3 = new Web3(App.web3Provider);
  
      return App.initContract();
    },
  
    // Init our smart contract so web3 knows where it is and how it works
    initContract: function() {
  
      // Message.json is generated and stored in build/contracts
      $.getJSON('Message.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        // @truffle/contract is a library to help you sync your contracts and updating them with migrations
        let MessageArtifact = data;
        App.contracts.Message = TruffleContract(MessageArtifact);
  
        // Set the provider for our contract
        App.contracts.Message.setProvider(App.web3Provider);
        // Use our contract to retrieve and mark the adopted pets
        // return App.markAdopted();
      });
  
      return App.bindEvents();
    },
  
    bindEvents: function() {
      $(document).on('click', '#setMessageButton', App.handleAdopt);
    },
  
    handleAdopt: function(event) {
      event.preventDefault();
    
      let messageInstance;
      
      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }
  
        let account = accounts[0];
        console.log('account: ' + account);
  
        // App.contracts.Message.setMessage($("#userInput").val(), {from: account})
        // .send((err, res) => {
        //     if (!err) {
        //         console.log(res);
        //     } else {
        //         console.log(err);
        //     }
        // });

        App.contracts.Message.deployed().then(function(instance) {
          messageInstance = instance;
          console.log("Got here");
          // Execute adopt as a transaction by sending account
          // In contrast to calling `call()`, this one executes a transaction and will include gas fees
          return messageInstance.setMessage($("#userInput").val(), {from: account});
        }).then(function(result) {
          // Sync the UI (disable adopt buttons for adopted pets)
          console.log(result);
        }).catch(function(err) {
            console.log("error here");
          console.log(err.message);
        });
      });
    }
  
  };
  
  $(function() {
    $(window).load(function() {
      App.init();
    });
  });
  
// App = {
//     init: async function() {
//         // Connect a the web3 provider
//         // Metamask is the web3 provider. If you have it installed, then it's defined and will go to the else block.
//         if (typeof web3 !== 'undefined') {
//             console.log('default web3');
//             web3 = new Web3(web3.currentProvider);
//         } else {
//             // Just like how we would set the web3 provider endpoint on the Remix environment field
//             console.log('my web3');
//             web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/6e51863fffa84e40a35843166395dbd2"));
//         }

//         web3.eth.getAccounts().then(array => {
            
//             // Set a default account
//             // This default address is used as the default "from" property, if no "from" property is specified in for the following methods:
//             // web3.eth.sendTransaction()
//             // web3.eth.call()
//             // new web3.eth.Contract() -> myContract.methods.myMethod().call()
//             // new web3.eth.Contract() -> myContract.methods.myMethod().send()
//             let accountAddress = array[0]; 
//             // These don't work
//             // web3.eth.defaultAccount = accountAddress;
//             // web3.eth.Conttract.defaultAccount = accountAddress;

//             let messageContract = TruffleContract(
//                 // contract abi
//                 [
//                 {
//                     "inputs": [],
//                     "name": "getMessage",
//                     "outputs": [
//                         {
//                             "internalType": "string",
//                             "name": "",
//                             "type": "string"
//                         }
//                     ],
//                     "stateMutability": "view",
//                     "type": "function"
//                 },
//                 {
//                     "inputs": [],
//                     "name": "myMessage",
//                     "outputs": [
//                         {
//                             "internalType": "string",
//                             "name": "",
//                             "type": "string"
//                         }
//                     ],
//                     "stateMutability": "view",
//                     "type": "function"
//                 },
//                 {
//                     "inputs": [
//                         {
//                             "internalType": "string",
//                             "name": "x",
//                             "type": "string"
//                         }
//                     ],
//                     "name": "setMessage",
//                     "outputs": [],
//                     "stateMutability": "nonpayable",
//                     "type": "function"
//                 }
//             ]
//             );
//             messageContract.setProvider(web3.currentProvider);
    
//             messageContract.deployed().then(function(instance) {
                
//                 console.log(instance);
    
//                 $("#setMessageButton").click(function () {
//                     console.log($("#userInput").val())
        
//                     instance.setMessage($("#userInput").val())
//                     .send((err, res) => {
//                         if (!err) {
//                             console.log(res);
//                         } else {
//                             console.log(err);
//                         }
//                     });
//                 });

//             });

//         });
//     }
// }

// $(function() {
//     $(window).load(function() {
//       App.init();
//     });
//   });
  