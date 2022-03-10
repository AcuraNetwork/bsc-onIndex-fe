// import { useEffect, useState } from 'react'
// import {  utils  } from 'ethers'
// import { useActiveWeb3React } from 'hooks'
// import { autonomyHistory } from 'apollo/client'
// import { TRANSACTION_HISTORY, CANCELLATION_HISTORY } from 'apollo/queries'
// import { useRegistryContract } from 'hooks/useContracts'
// import { MIDROUTER_CONTRACT_ADDRESS } from '../constants/autonomy'

// export default function useTransactionHistory() {

//   const [transactions, setTransactions] = useState<any>([{}]);
//   const [orders, setOrders] = useState<Array<any>>([]);
//   const [cancels, setCancels] = useState<Array<any>>([]);


// 	const { account } = useActiveWeb3React()
// 	const registryContract = useRegistryContract()

// 	useEffect(() => {
// 		async function init() {
// 			const data = await getTransactionHistory(account)
// 			setOrders(parseOrders(data))
// 		}
// 		init()
// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [account, setOrders]) 

// 	useEffect(() => {
//     const interval = setInterval(async () => {
// 		const data = await getTransactionHistory(account)
// 		console.log('ant : transactionHistory => ', data);
// 			setOrders(parseOrders(data))
//     }, 10000)

//     return () => clearInterval(interval)
// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [account, setOrders])
// // Cancellations calls
// 	useEffect(() => {
// 		async function init() {
// 			const data = await getCancellationHistory(account)
// 			setCancels(data)
// 		}
// 		init()
// 	}, [account, setOrders, setCancels]) 

// 	useEffect(() => {
// 	const interval = setInterval(async () => {
// 		const data = await getCancellationHistory(account)
// 		console.log('ant : cancelledTransaction => ', data);
// 			setCancels(data)
// 	}, 10000)

// 	return () => clearInterval(interval)
// 	}, [account, setOrders, setCancels])

//   // Two hooks that fetch data on if the request is already executed or not,
// 	// Separate from usePastOrders because its async
// 	useEffect(() => {
// 		async function init() {
// 			const data = await aggregateHash()
// 			setTransactions(data)	
// 		}
// 		init()
// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [orders, setTransactions]) 

// 	useEffect(() => {
// 		const interval = setInterval(async () => {
// 			const data = await aggregateHash()
// 			setTransactions(data)
// 		}, 10000)

// 		return () => clearInterval(interval)
// 	// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [orders, setTransactions])

// 	// const midrouter_parser = new ethers.utils.Interface(MIDROUTER_CONTRACT_ABI)

// 	// This calls getTransaction history which pulls the data from the graph, it has two useEffects to keep polling and update on account state
// 	// The data from thegraph is immediatly parsed here with parseOrders
// 	// The internal state will be returned
// 	// Call the graph with no-cache

// 	// eslint-disable-next-line @typescript-eslint/no-shadow
// 	async function getTransactionHistory(account: string | null | undefined) {
// 		if (!account) return []

// 		const result = await autonomyHistory.query({
// 			query: TRANSACTION_HISTORY,
// 			variables: {
// 				account,
// 				contract: MIDROUTER_CONTRACT_ADDRESS
// 			},
// 			fetchPolicy: 'no-cache',
// 		})
// 		return result.data.newRequests
//   }

// 	// eslint-disable-next-line @typescript-eslint/no-shadow
// 	async function getCancellationHistory(account: string | null | undefined) {
// 		if (!account) return []

// 		const result = await autonomyHistory.query({
// 			query: CANCELLATION_HISTORY,
// 			variables: {
// 				account,
// 				contract: MIDROUTER_CONTRACT_ADDRESS
// 			},
// 			fetchPolicy: 'no-cache',
// 		})

// 		return result.data.cancelledRequests;
// 	}


// 	// Returns a copy of orders but it adds the hashed parameter 
// 	async function aggregateHash() {
// 		const values = await getHashed()

// 		return JSON.parse(JSON.stringify(orders)).map((order: any ,index: any) => {
// 			// eslint-disable-next-line no-param-reassign
// 			order.status = canCancel(values[index], order.id)
// 			return order
// 		});
//   } 
// 	// Checks if its already executed or not
// 	function canCancel(hash: any, orderId: any) {
// 		const cancelArr: any = []

// 		// eslint-disable-next-line array-callback-return
// 		cancels.map((cancel: any ) => {
// 			if(!cancel.wasExecuted){
// 				cancelArr.push(cancel.id)
// 			}
// 		});

// 		if(cancelArr.includes(orderId)){
// 			return 'cancelled'
// 		} if(hash === "0x0000000000000000000000000000000000000000000000000000000000000000"){
// 			return 'executed'
// 		} 
//     return 'open'
 
//   }
// 	// Gets all the promises to return
// 	async function getHashed() {
// 		// eslint-disable-next-line no-return-await
// 		return await Promise.all(orders.map(request => canExecute(request.id)))
//   }
// 	// Calls the registry contract to check if the order is executed or not
// 	async function canExecute(id:any ){
// 		// eslint-disable-next-line no-return-await
// 		return await registryContract!.getHashedReq(id)  
//   }

	
// 	// Builds this new object with the graph data
// 	function parseOrders(allOrders: any[]) {
// 		return allOrders.map((order: any) => ({
// 			method: methodSelector(order.callData),
// 			callData: order.callData,
// 			time: timeConverter(order.timeStamp),
// 			id: order.id,
// 			inputToken: findInputToken(order.callData),
// 			outputToken: findOutPutToken(order.callData),
// 			inputAmount: findInputAmount(order.callData, order.ethForCall),
// 			outputAmount: findOutputAmount(order.callData),
// 			requester: order.requester,
// 			target: order.target,
// 			referer: order.referer,
// 			initEthSent: order.initEthSent,
// 			ethForCall: order.ethForCall,
// 			verifySender: order.verifySender,
// 			payWithAuto: order.payWithAuto,
// 			typeof: typeSelector(order.callData),
// 		}))
//   }

// 	function methodSelector(orderData: any){
// 		const sliced = orderData.slice(0, 10)
// 		if (sliced === "0xfa089c19") {
// 			return "Limit -> Tokens for Matic"
// 		// eslint-disable-next-line no-else-return
// 		} else if (sliced === "0xbc63cf67") {
// 			return "Limit -> Matic for Tokens"
// 		} else if (sliced === "0x9078cf66") {
// 			return "Limit -> Tokens for Tokens"
// 		} else if (sliced === "0x503bd854") {
// 			return "Stop -> Tokens for Tokens"
// 		} else if (sliced === "0xe2c691a8") {
// 			return "Stop -> Matic for Tokens"
// 		} else if (sliced === "0x4632bf0d") {
// 			return "Stop -> Tokens for Matic"
// 		} else {
// 			return "Undefined Method"
// 		}
// 	}

// 	function typeSelector(orderData: any) {
// 		const sliced = orderData.slice(0, 10)
// 		if (sliced === "0xfa089c19") {
// 			return "Limit"
// 		// eslint-disable-next-line no-else-return
// 		} else if (sliced === "0xbc63cf67") {
// 			return "Limit"
// 		} else if (sliced === "0x9078cf66") {
// 			return "Limit"
// 		} else if (sliced === "0x503bd854") {
// 			return "Stop"
// 		} else if (sliced === "0xe2c691a8") {
// 			return "Stop"
// 		} else if (sliced === "0x4632bf0d") {
// 			return "Stop"
// 		} else {
// 			return "Undefined"
// 		}
// 	}	

// 	function findOutputAmount(callData: any) {
// 		const sliced = callData.slice(0, 10)
// 		const actualData = `0x${  callData.slice(10, callData.length + 1)}`
// 		if (sliced === "0xbc63cf67"){
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address[]' ,' address','uint256'], actualData)
// 			return decoded[1].toString()
// 		// eslint-disable-next-line no-else-return
// 		} else if (sliced === "0xfa089c19") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','address[]', 'address', 'uint256'], actualData) 
// 			return decoded[3].toString(); 
// 		} else if (sliced === "0x9078cf66") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','address[]', 'address', 'uint256'], actualData) 
// 			return decoded[3].toString();
// 		} else if (sliced === "0x503bd854") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[4].toString();
// 		} else if (sliced === "0xe2c691a8") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[2].toString();
// 		} else if (sliced === "0x4632bf0d") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256', 'uint256', 'uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[4].toString();
// 		}

//     return ''
//   }

// 	function findInputAmount(callData: any, ethForCall: any) {
// 		const sliced = callData.slice(0, 10)
// 		const actualData = `0x${  callData.slice(10, callData.length + 1)}`
// 		if (sliced === "0xbc63cf67") {
// 			return ethForCall
// 		// eslint-disable-next-line no-else-return
// 		} else if (sliced === "0xfa089c19") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','address[]', 'address', 'uint256'], actualData) 
// 			return decoded[2].toString()
// 		} else if (sliced === "0x9078cf66") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','address[]', 'address', 'uint256'], actualData) 
// 			return decoded[2].toString()
// 			// STOP LOSS TOKEN TO TOKEN
// 		} else if (sliced === "0x503bd854") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[2].toString()
// 		} else if (sliced === "0xe2c691a8") {
// 			return ethForCall
// 		} else if (sliced === "0x4632bf0d") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256', 'uint256', 'uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[2].toString()
// 		}
//     return ''
//   }

// 	function findOutPutToken(callData: any) {
// 		const sliced = callData.slice(0, 10)
// 		const actualData = `0x${  callData.slice(10, callData.length+1)}`
// 		if (sliced === "0xbc63cf67") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address[]' ,' address','uint256'], actualData)
// 			return decoded[2][decoded[2].length - 1]
// 		// eslint-disable-next-line no-else-return
// 		} else if (sliced === "0xfa089c19") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','address[]', 'address', 'uint256'], actualData) 
// 			return decoded[4][decoded[4].length - 1]
// 		} else if (sliced === "0x9078cf66") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','address[]', 'address', 'uint256'], actualData) 
// 			return decoded[4][decoded[4].length - 1]
// 		} else if (sliced === "0x503bd854") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[5][decoded[5].length - 1]
// 		} else if (sliced === "0xe2c691a8") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[3][decoded[3].length  - 1]
// 		} else if (sliced === "0x4632bf0d") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256', 'uint256', 'uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[5][decoded[5].length - 1]
// 		}
//     return ''
// 	}

// 	function findInputToken(callData: any) {
// 		const sliced = callData.slice(0, 10)
// 		const actualData = `0x${  callData.slice(10, callData.length + 1)}`
// 		if (sliced === "0xbc63cf67") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address[]' ,' address','uint256'], actualData)
// 			return decoded[2][0]
// 		// eslint-disable-next-line no-else-return
// 		} else if (sliced === "0xfa089c19"){
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','address[]', 'address', 'uint256'], actualData) 
// 			return decoded[4][0]
// 		} else if (sliced === "0x9078cf66"){
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','address[]', 'address', 'uint256'], actualData) 
// 			return decoded[4][0]
// 		}	else if (sliced === "0x503bd854") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[5][0];
// 		} else if (sliced === "0xe2c691a8") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[3][0];
// 		} else if (sliced === "0x4632bf0d") {
// 			const decoded = utils.defaultAbiCoder.decode(['address', 'address' ,'uint256', 'uint256', 'uint256', 'address[]', 'address', 'uint256'], actualData) 
// 			return decoded[5][0];
// 		}
//     return ''
//   } 

// 	// eslint-disable-next-line camelcase
// 	function timeConverter(UNIX_timestamp: any) {
// 		// eslint-disable-next-line camelcase
// 		const a = new Date(UNIX_timestamp * 1000);
// 		const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// 		const year = a.getFullYear();
// 		const month = months[a.getMonth()];
// 		const date = a.getDate();
// 		const hour = a.getHours();
// 		const min = a.getMinutes();
// 		const sec = a.getSeconds();
// 		const time = `${date  } ${  month  } ${  year  } ${  hour  }:${  min  }:${  sec}` ;
// 		return time
//   }
//   return [transactions, orders]
// }

import Moralis from 'moralis';

import { useCallback, useEffect, useState } from 'react'
import { utils } from 'ethers'
import { useActiveWeb3React } from 'hooks';
import { ROUTER_ADDRESS } from '../constants'

Moralis.initialize('BLHKY0nn6mL9HtcCnfXDjnfY3xOay6KEAXbKGY9u')
Moralis.serverURL = 'https://tc2cagkjxavv.bigmoralis.com:2053/server'

export default function useTransactionHistory() {

	const [orders, setOrders] = useState<Array<any>>([]);
	const [cancels, setCancels] = useState<Array<any>>([]);
	const [executes, setExecuted] = useState<Array<any>>([]);
	const { account } = useActiveWeb3React();

	const canCancel = useCallback((orderId: any) => {
		const cancelArr = cancels.map((cancel: any) => cancel.get('uid'));
		if(cancelArr.includes(orderId)){
			return true
		}
		return false
	}, [cancels])

	const wasExecuted = useCallback((orderId: any) => {
		const executedArr = executes.map((execute: any) => execute.get('uid'));
		if(executedArr.includes(orderId)){
			return true
		}
		return false
	}, [executes])


	const parseOrders = useCallback((allOrders: any[]) => {
		return allOrders.map((order: any) => ({
			method: methodSelector(order.get('callData')),
			callData: order.get('callData'),
			time: order.get('block_timestamp').toUTCString(),
			id: order.get('uid'),
			inputToken: findInputToken(order.get('callData')),
			outputToken: findOutPutToken(order.get('callData')),
			inputAmount: findInputAmount(order.get('callData'), order.get('ethForCall')),
			outputAmount: findOutputAmount(order.get('callData')),
			requester: order.get('user'),
			target: order.get('target'),
			referer: order.get('referer'),
			initEthSent: order.get('initEthSent'),
			ethForCall: order.get('ethForCall'),
			verifySender: order.get('verifyUser'),
			payWithAuto: order.get('payWithAUTO'),
			typeof: typeSelector(order.get('callData')),
			insertFeeAmount: order.get('insertFeeAmount'),
			// eslint-disable-next-line no-nested-ternary
			status: canCancel(order.get('uid')) ? 'cancelled' : wasExecuted(order.get('uid')) ? 'executed' : 'open',
			// execution: wasExecuted(order.get('uid'))
		})).filter((order: any) => order.callData.includes(ROUTER_ADDRESS.toLowerCase().substr(2)))
	}, [canCancel, wasExecuted])

	function methodSelector(orderData: any){
		const sliced = orderData.slice(0, 10)
		if (sliced === "0x873cf9f3" || sliced === "0x673f7821") return "Limit -> BNB for Tokens"
		if (sliced === "0x0bee688d" || sliced === "0x9c9abb71") return "Limit -> Tokens for BNB"
		if (sliced === "0x6dbbd34b" || sliced === "0xa111d966") return "Limit -> Tokens for Tokens"
		if (sliced === "0x259c2463") return "Stop -> BNB for Tokens"
		if (sliced === "0x04d76c43") return "Stop -> Tokens for BNB"
		if (sliced === "0x2fa1b93a") return "Stop -> Tokens for Tokens"
		return "Undefined Method"
	}
	
	function typeSelector(orderData: any) {
		const sliced = orderData.slice(0, 10)
		if (sliced === "0x873cf9f3" || sliced === "0x673f7821") return "Limit"
		if (sliced === "0x0bee688d" || sliced === "0x9c9abb71") return "Limit"
		if (sliced === "0x6dbbd34b" || sliced === "0xa111d966") return "Limit"
		if (sliced === "0x259c2463") return "Stop"
		if (sliced === "0x04d76c43") return "Stop"
		if (sliced === "0x2fa1b93a") return "Stop"
		return "Undefined"
	}	
	
	function findOutputAmount(callData: any) {
		const sliced = callData.slice(0, 10)
		const actualData = `0x${callData.slice(10, callData.length + 1)}`
		let decoded: any
		let ret = ''
		// Limits
		// BNB for Tokens
		if (sliced === "0x873cf9f3") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256','uint256','address',' uint256','address[]', 'uint256'], actualData)
			ret = decoded[4].toString()
			// BNB for Tokens prepay
		} else if (sliced === "0x673f7821") {
			decoded = utils.defaultAbiCoder.decode(['uint256', 'address','uint256','address[]',' address','uint256'], actualData)
			ret = decoded[2].toString()
			// Tokens for BNB
		} else if (sliced === "0x0bee688d") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256' ,'address','uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[5].toString()
			// Tokens for BNB prepay
		} else if (sliced === "0x9c9abb71") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
			ret = decoded[4].toString()
			// Tokens for Tokens
		} else if (sliced === "0x6dbbd34b") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256' ,'address','uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[5].toString()
			// Tokens for Tokens prepay
		} else if (sliced === "0xa111d966") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
			ret = decoded[4].toString()
		}
			// Stops
			// Tokens for Tokens
		else if (sliced === "0x2fa1b93a") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[6].toString();
			// BNB for Tokens 
		} else if (sliced === "0x259c2463") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[5].toString();
			// Tokens for BNB
		} else if (sliced === "0x04d76c43") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[6].toString();
		}
		return ret
	}
	// Limits
	function findInputAmount(callData: any, ethForCall: any) {
		const sliced = callData.slice(0, 10)
		const actualData = `0x${callData.slice(10, callData.length + 1)}`
		let decoded: any
		let ret = ''
		if (sliced === "0x873cf9f3") {
			ret = ethForCall
			// BNB for Tokens prepay
		} else if (sliced === "0x673f7821") {
			decoded = utils.defaultAbiCoder.decode(['uint256', 'address','uint256','address[]',' address','uint256'], actualData)
			ret = ethForCall
			// Tokens for BNB
		}  else if (sliced === "0x0bee688d") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256' ,'address','uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[4].toString()
			// Tokens for BNB prepay
		} else if (sliced === "0x9c9abb71") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
			ret = decoded[3].toString()
			// Tokens for Tokens
		} else if (sliced === "0x6dbbd34b") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256' ,'address','uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[4].toString()
			// Tokens for Tokens prepay
		} else if (sliced === "0xa111d966") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
			ret = decoded[3].toString()
		}
			// STOP LOSS TOKEN TO TOKEN
			// TODO
		else if (sliced === "0x2fa1b93a") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[4].toString()
		} else if (sliced === "0x259c2463") {
			ret = ethForCall
		} else if (sliced === "0x04d76c43") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[4].toString()
		}
		return ret
	}
	
	function findOutPutToken(callData: any) {
		const sliced = callData.slice(0, 10)
		const actualData = `0x${callData.slice(10, callData.length+1)}`
		let decoded: any
		let ret = ''
		if (sliced === "0x873cf9f3") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256','uint256','address',' uint256','address[]', 'uint256'], actualData)
			ret = decoded[5][decoded[5].length - 1]
		} else if (sliced === "0x673f7821") {
			decoded = utils.defaultAbiCoder.decode(['uint256', 'address','uint256','address[]',' address','uint256'], actualData)
			ret = decoded[3][decoded[3].length - 1]
		} else if (sliced === "0x0bee688d") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256' ,'address','uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[6][decoded[6].length - 1]
		} else if (sliced === "0x9c9abb71") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
			ret = decoded[5][decoded[5].length - 1]
		} else if (sliced === "0x6dbbd34b") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256' ,'address','uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[6][decoded[6].length - 1]
		} else if (sliced === "0xa111d966") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
			ret = decoded[5][decoded[5].length - 1]
		} else if (sliced === "0x2fa1b93a") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[7][decoded[7].length - 1]
		} else if (sliced === "0x259c2463") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[6][decoded[6].length  - 1]
		} else if (sliced === "0x04d76c43") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[7][decoded[7].length - 1]
		}
		return ret
	}
	
	function findInputToken(callData: any) {
		const sliced = callData.slice(0, 10)
		const actualData = `0x${callData.slice(10, callData.length + 1)}`
		let decoded: any
		let ret = ''
		if (sliced === "0x873cf9f3") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256','uint256','address',' uint256','address[]', 'uint256'], actualData)
			ret = decoded[5][0];
		} else if (sliced === "0x673f7821") {
			decoded = utils.defaultAbiCoder.decode(['uint256', 'address','uint256','address[]',' address','uint256'], actualData)
			ret = decoded[3][0];
		} else if (sliced === "0x0bee688d"){
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256' ,'address','uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[6][0];
		} else if (sliced === "0x9c9abb71") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
			ret = decoded[5][0];
		} else if (sliced === "0x6dbbd34b"){
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256' ,'address','uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[6][0];
		} else if (sliced === "0xa111d966") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'address' ,'uint256','uint256', 'address[]', 'address', 'uint256'], actualData) 
			ret = decoded[5][0];
		} else if (sliced === "0x2fa1b93a") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[7][0];
		} else if (sliced === "0x259c2463") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[6][0];
		} else if (sliced === "0x04d76c43") {
			decoded = utils.defaultAbiCoder.decode(['address', 'uint256' ,'uint256', 'address', 'uint256', 'uint256', 'uint256', 'address[]', 'uint256'], actualData) 
			ret = decoded[7][0];
		}
		return ret
	} 

	useEffect(() => {
		async function init() {
			const queryRequests = new Moralis.Query("RegistryRequestsnew");
			const queryCancels = new Moralis.Query("RegistryCancelRequestsnew");
			const queryExecutes = new Moralis.Query("RegistryExecutedRequestsnew")
			queryRequests.equalTo("user", account?.toLocaleLowerCase());
			const registryRequests = await queryRequests.find();
			const registryCancelRequests = await queryCancels.find();
			const registryExecutedRequests = await queryExecutes.find();
			setOrders(registryRequests)
			setCancels(registryCancelRequests)
			setExecuted(registryExecutedRequests)
		}

		const interval = setInterval(init, 4000)
		return () => clearInterval(interval)
	}, [setOrders, setCancels, account]) 

	return [parseOrders(orders)]

}