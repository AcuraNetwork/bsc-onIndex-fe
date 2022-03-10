
const API_KEY = process.env.REACT_APP_API_KEY;

const fetchTransactions = async () => {
  
  try {
    const result = await fetch(`https://api.bscscan.com/api?module=account&action=tokentx&address=0xf1842C074DcAD6091ac029056A5af4F6007f0F52&startblock=0&endblock=25000000&sort=asc&apikey=${API_KEY}`)
    .then(response => response.json())
    .then(data => {
      return data.result;
    });
    return result;
  } catch (error) {
    return [];
  }
}; 

export default fetchTransactions;