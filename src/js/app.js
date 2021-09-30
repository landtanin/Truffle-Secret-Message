App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        return await App.initWeb3();
    },

    initWeb3: async function () {
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
    initContract: function () {

        // Message.json is generated and stored in build/contracts
        $.getJSON('Message.json', function (data) {
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

    bindEvents: function () {
        $(document).on('click', '#setMessageButton', App.handleAdopt);
    },

    handleAdopt: function (event) {
        event.preventDefault();

        let messageInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            let account = accounts[0];

            App.contracts.Message.deployed().then(function (instance) {
                messageInstance = instance;
                // Execute adopt as a transaction by sending account
                // In contrast to calling `call()`, this one executes a transaction and will include gas fees
                return messageInstance.setMessage($("#userInput").val(), {
                    from: account
                });
            }).then(function (result) {
                // Sync the UI (disable adopt buttons for adopted pets)
                console.log(result);
            }).catch(function (err) {
                console.log(err.message);
            });
        });
    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});