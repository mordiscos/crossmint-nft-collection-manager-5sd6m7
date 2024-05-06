import axios from 'axios';

const API_KEY = 'your_crossmint_api_key';
const BASE_URL = 'https://www.crossmint.com/api/2022-06-09';

const headers = {
    'Content-Type': 'application/json',
    'X-API-KEY': API_KEY
};

async function createCollection() {
    const body = {
        chain: "polygon",
        metadata: {
            name: "Sample NFT Collection",
            imageUrl: "https://www.crossmint.com/assets/crossmint/logo.png",
            description: "This is a sample NFT collection"
        },
        fungibility: "non-fungible"
    };

    try {
        const response = await axios.post(`${BASE_URL}/collections/`, body, { headers });
        return response.data;
    } catch (error) {
        console.error('Error creating collection:', error);
        throw error;
    }
}

async function getActionStatus(actionId: string) {
    try {
        const response = await axios.get(`${BASE_URL}/actions/${actionId}`, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching action status:', error);
        throw error;
    }
}

async function mintNFT(collectionId: string) {
    const body = {
        recipient: "email:test@example.com:polygon",
        metadata: {
            name: "Crossmint Example NFT",
            image: "https://www.crossmint.com/assets/crossmint/logo.png",
            description: "My NFT created via the mint API!"
        }
    };

    try {
        const response = await axios.post(`${BASE_URL}/collections/${collectionId}/nfts`, body, { headers });
        return response.data;
    } catch (error) {
        console.error('Error minting NFT:', error);
        throw error;
    }
}

async function main() {
    console.log('Creating collection...');
    const collection = await createCollection();
    console.log('Collection created:', collection);

    console.log('Checking deployment status...');
    const deployStatus = await getActionStatus(collection.actionId);
    console.log('Deployment status:', deployStatus);

    if (deployStatus.status === 'success') {
        console.log('Minting NFT...');
        const nft = await mintNFT(collection.id);
        console.log('NFT minted:', nft);

        console.log('Checking minting status...');
        const mintStatus = await getActionStatus(nft.actionId);
        console.log('Minting status:', mintStatus);
    } else {
        console.error('Collection deployment failed:', deployStatus);
    }
}

main().catch(console.error);
